import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

class EmailService {
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    this.fromName = process.env.EMAIL_FROM_NAME || 'Ottoman Platform';
  }

  /**
   * Send email using Resend
   */
  async sendEmail({ to, subject, html, from }: EmailOptions): Promise<boolean> {
    try {
      const fromAddress = from || `${this.fromName} <${this.fromEmail}>`;

      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });

      if (error) {
        console.error('Resend error:', error);
        return false;
      }

      console.log('Email sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(to: string, userName: string, userType: 'customer' | 'dealer'): Promise<boolean> {
    const subject = 'Ottoman Platform\'a Hoş Geldiniz!';
    const html = this.getWelcomeEmailTemplate(userName, userType);
    return this.sendEmail({ to, subject, html });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, userName: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Şifre Sıfırlama Talebi';
    const html = this.getPasswordResetTemplate(userName, resetUrl);
    return this.sendEmail({ to, subject, html });
  }

  /**
   * Send contact form reply
   */
  async sendContactReply(to: string, customerName: string, replyMessage: string): Promise<boolean> {
    const subject = 'İletişim Mesajınıza Yanıt';
    const html = this.getContactReplyTemplate(customerName, replyMessage);
    return this.sendEmail({ to, subject, html });
  }

  /**
   * Send franchise application reply
   */
  async sendFranchiseReply(to: string, applicantName: string, replyMessage: string, status: 'approved' | 'rejected'): Promise<boolean> {
    const subject = status === 'approved'
      ? 'Bayilik Başvurunuz Onaylandı!'
      : 'Bayilik Başvurunuz Hakkında';
    const html = this.getFranchiseReplyTemplate(applicantName, replyMessage, status);
    return this.sendEmail({ to, subject, html });
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(to: string, customerName: string, orderNumber: string, orderTotal: number): Promise<boolean> {
    const subject = `Sipariş Onayı - #${orderNumber}`;
    const html = this.getOrderConfirmationTemplate(customerName, orderNumber, orderTotal);
    return this.sendEmail({ to, subject, html });
  }

  /**
   * Send order status update email
   */
  async sendOrderStatusUpdate(to: string, customerName: string, orderNumber: string, status: string): Promise<boolean> {
    const subject = `Sipariş Durumu Güncellendi - #${orderNumber}`;
    const html = this.getOrderStatusUpdateTemplate(customerName, orderNumber, status);
    return this.sendEmail({ to, subject, html });
  }

  // ============================================
  // EMAIL TEMPLATES
  // ============================================

  private getWelcomeEmailTemplate(userName: string, userType: 'customer' | 'dealer'): string {
    const userTypeText = userType === 'dealer' ? 'Bayimiz' : 'Müşterimiz';
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #f5f1e8; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); color: #f5f1e8 !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .highlight { color: #d4af37; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏛️ Ottoman Platform</h1>
            <p>Tarihi Ürünler ve Franchise</p>
          </div>
          <div class="content">
            <h2>Hoş Geldiniz, ${userName}!</h2>
            <p>Ottoman Platform ailesine katıldığınız için çok mutluyuz.</p>
            <p>${userTypeText} olarak hesabınız başarıyla oluşturuldu. Artık platformumuzun tüm özelliklerinden yararlanabilirsiniz.</p>

            ${userType === 'dealer' ? `
              <h3>Bayiler İçin Özel Avantajlar:</h3>
              <ul>
                <li>Özel bayi fiyatlandırması</li>
                <li>Toplu sipariş kolaylığı</li>
                <li>Öncelikli müşteri desteği</li>
                <li>Özel kampanya ve fırsatlar</li>
              </ul>
            ` : `
              <h3>Neler Yapabilirsiniz:</h3>
              <ul>
                <li>Binlerce tarihi ürün arasından alışveriş yapın</li>
                <li>Özel kampanya ve indirimlerden yararlanın</li>
                <li>Siparişlerinizi takip edin</li>
                <li>Favori ürünlerinizi kaydedin</li>
              </ul>
            `}

            <center>
              <a href="${process.env.FRONTEND_URL}/products" class="button">Ürünleri İncele</a>
            </center>

            <p>Sorularınız için bizimle iletişime geçmekten çekinmeyin.</p>
            <p>İyi alışverişler dileriz!</p>
          </div>
          <div class="footer">
            <p>© 2024 Ottoman Platform. Tüm hakları saklıdır.</p>
            <p>Bu e-posta size gönderilmiştir.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPasswordResetTemplate(userName: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #f5f1e8; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%); color: #1a1a1a !important; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Şifre Sıfırlama</h1>
          </div>
          <div class="content">
            <h2>Merhaba ${userName},</h2>
            <p>Hesabınız için bir şifre sıfırlama talebi aldık.</p>
            <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>

            <center>
              <a href="${resetUrl}" class="button">Şifremi Sıfırla</a>
            </center>

            <div class="warning">
              ⚠️ <strong>Önemli:</strong> Bu bağlantı güvenlik nedeniyle <strong>1 saat</strong> içinde geçerliliğini yitirecektir.
            </div>

            <p><strong>Buton çalışmıyorsa</strong> aşağıdaki linki tarayıcınıza kopyalayın:</p>
            <p style="word-break: break-all; color: #666; font-size: 12px;">${resetUrl}</p>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">

            <p style="color: #999; font-size: 13px;">
              <strong>Bu talebi siz yapmadıysanız</strong> bu e-postayı güvenle görmezden gelebilirsiniz. Şifreniz değiştirilmeyecektir.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Ottoman Platform. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getContactReplyTemplate(customerName: string, replyMessage: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #f5f1e8; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
          .message-box { background: #f8f9fa; border-left: 4px solid #d4af37; padding: 20px; margin: 20px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Ottoman Platform</h1>
            <p>Müşteri Hizmetleri</p>
          </div>
          <div class="content">
            <h2>Merhaba ${customerName},</h2>
            <p>İletişim mesajınıza yanıt veriyoruz:</p>

            <div class="message-box">
              ${replyMessage}
            </div>

            <p>Başka sorularınız varsa bizimle iletişime geçmekten çekinmeyin.</p>
            <p>Size yardımcı olmaktan mutluluk duyarız!</p>

            <p style="margin-top: 30px;">
              <strong>Ottoman Platform Müşteri Hizmetleri</strong>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Ottoman Platform. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getFranchiseReplyTemplate(applicantName: string, replyMessage: string, status: 'approved' | 'rejected'): string {
    const statusColor = status === 'approved' ? '#28a745' : '#dc3545';
    const statusText = status === 'approved' ? '✅ Başvurunuz Onaylandı!' : '📋 Başvurunuz Hakkında';
    const statusIcon = status === 'approved' ? '🎉' : '📨';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #f5f1e8; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
          .status-badge { display: inline-block; padding: 10px 20px; background: ${statusColor}; color: white; border-radius: 25px; margin: 20px 0; font-weight: bold; }
          .message-box { background: #f8f9fa; border-left: 4px solid ${statusColor}; padding: 20px; margin: 20px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusIcon} Ottoman Platform</h1>
            <p>Franchise & Bayilik</p>
          </div>
          <div class="content">
            <h2>Sayın ${applicantName},</h2>

            <center>
              <div class="status-badge">${statusText}</div>
            </center>

            <p>Bayilik başvurunuz değerlendirildi:</p>

            <div class="message-box">
              ${replyMessage}
            </div>

            ${status === 'approved' ? `
              <p><strong>Sonraki Adımlar:</strong></p>
              <ul>
                <li>Franchise ekibimiz en kısa sürede sizinle iletişime geçecektir</li>
                <li>Sözleşme detayları ve süreç bilgileri paylaşılacaktır</li>
                <li>İşbirliği için gerekli dokümantasyon hazırlanacaktır</li>
              </ul>
            ` : `
              <p>Farklı fırsatlar için takipte kalmaya devam edebilirsiniz. Ottoman Platform ailesi olarak size başarılar dileriz.</p>
            `}

            <p>Sorularınız için bizimle iletişime geçebilirsiniz.</p>

            <p style="margin-top: 30px;">
              <strong>Ottoman Platform Franchise Ekibi</strong>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Ottoman Platform. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getOrderConfirmationTemplate(customerName: string, orderNumber: string, orderTotal: number): string {
    const formattedTotal = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(orderTotal);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #f5f1e8; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
          .order-box { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px; border: 2px solid #d4af37; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); color: #f5f1e8 !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Siparişiniz Alındı!</h1>
          </div>
          <div class="content">
            <h2>Merhaba ${customerName},</h2>
            <p>Siparişiniz başarıyla alındı ve işleme konuldu.</p>

            <div class="order-box">
              <h3 style="margin-top: 0; color: #d4af37;">Sipariş Detayları</h3>
              <p><strong>Sipariş Numarası:</strong> #${orderNumber}</p>
              <p><strong>Toplam Tutar:</strong> ${formattedTotal}</p>
              <p><strong>Durum:</strong> <span style="color: #28a745;">✓ Onaylandı</span></p>
            </div>

            <p>Siparişiniz hazırlanıyor ve en kısa sürede kargoya verilecektir.</p>

            <center>
              <a href="${process.env.FRONTEND_URL}/profile?tab=orders" class="button">Siparişimi Takip Et</a>
            </center>

            <p>Bizi tercih ettiğiniz için teşekkür ederiz!</p>
          </div>
          <div class="footer">
            <p>© 2024 Ottoman Platform. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getOrderStatusUpdateTemplate(customerName: string, orderNumber: string, status: string): string {
    const statusTranslations: { [key: string]: string } = {
      'pending': 'Beklemede',
      'processing': 'İşleniyor',
      'shipped': 'Kargoya Verildi',
      'delivered': 'Teslim Edildi',
      'cancelled': 'İptal Edildi',
    };

    const statusText = statusTranslations[status] || status;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #f5f1e8; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
          .status-box { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); color: #f5f1e8 !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Sipariş Durumu Güncellendi</h1>
          </div>
          <div class="content">
            <h2>Merhaba ${customerName},</h2>
            <p>Sipariş numarası <strong>#${orderNumber}</strong> olan siparişinizin durumu güncellendi:</p>

            <div class="status-box">
              <h3 style="color: #d4af37; margin: 0;">${statusText}</h3>
            </div>

            <center>
              <a href="${process.env.FRONTEND_URL}/profile?tab=orders" class="button">Siparişimi Görüntüle</a>
            </center>

            <p>Sorularınız için müşteri hizmetlerimizle iletişime geçebilirsiniz.</p>
          </div>
          <div class="footer">
            <p>© 2024 Ottoman Platform. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();
