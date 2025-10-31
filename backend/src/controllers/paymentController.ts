import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import Settings from '../models/Settings';
import Order from '../models/Order';

/**
 * PayTR ödeme token'ı oluştur
 */
export const createPayTRToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;

    // Siparişi bul
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ success: false, message: 'Sipariş bulunamadı' });
      return;
    }

    // PayTR ayarlarını al
    const settings = await Settings.findOne();
    if (!settings || !settings.paytr || !settings.paytr.isActive) {
      res.status(400).json({ success: false, message: 'PayTR ödeme sistemi aktif değil' });
      return;
    }

    const { merchantId, merchantKey, merchantSalt, testMode } = settings.paytr;

    if (!merchantId || !merchantKey || !merchantSalt) {
      res.status(400).json({ success: false, message: 'PayTR ayarları eksik' });
      return;
    }

    // Ödeme bilgilerini hazırla
    const merchant_oid = orderId;
    const email = req.body.email || 'customer@example.com';
    const payment_amount = Math.round(order.totalAmount * 100); // Kuruş cinsinden
    const user_basket = Buffer.from(JSON.stringify(order.items.map(item => [
      item.name,
      item.price.toFixed(2),
      item.quantity
    ]))).toString('base64');

    const user_ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const no_installment = '0'; // Taksit yok
    const max_installment = '0';
    const currency = 'TL';
    const test_mode = testMode ? '1' : '0';
    const timeout_limit = '30'; // Dakika
    const debug_on = '1'; // Hata detayları
    const lang = 'tr';

    // Başarılı ve başarısız URL'ler
    const merchant_ok_url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-confirmation?orderId=${orderId}`;
    const merchant_fail_url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?error=payment_failed`;

    // PayTR hash oluştur
    const hashSTR = `${merchantId}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    const paytr_token = hashSTR + merchantSalt;
    const token = crypto.createHmac('sha256', merchantKey).update(paytr_token).digest('base64');

    // PayTR'ye gönderilecek data
    const paytrData = {
      merchant_id: merchantId,
      user_ip: user_ip,
      merchant_oid: merchant_oid,
      email: email,
      payment_amount: payment_amount.toString(),
      paytr_token: token,
      user_basket: user_basket,
      debug_on: debug_on,
      no_installment: no_installment,
      max_installment: max_installment,
      user_name: order.shippingAddress.fullName,
      user_address: `${order.shippingAddress.street}, ${order.shippingAddress.city}`,
      user_phone: order.shippingAddress.phone,
      merchant_ok_url: merchant_ok_url,
      merchant_fail_url: merchant_fail_url,
      timeout_limit: timeout_limit,
      currency: currency,
      test_mode: test_mode,
      lang: lang,
    };

    // PayTR API'ye istek gönder
    const response = await axios.post(
      'https://www.paytr.com/odeme/api/get-token',
      new URLSearchParams(paytrData as any).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const result: any = response.data;

    if (result.status === 'success') {
      // Token'ı siparişe kaydet
      order.paymentToken = result.token;
      order.paymentProvider = 'paytr';
      await order.save();

      res.status(200).json({
        success: true,
        token: result.token,
        iframeUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.reason || 'PayTR token oluşturulamadı',
      });
    }
  } catch (error: any) {
    console.error('PayTR token oluşturma hatası:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PayTR callback endpoint - Ödeme sonucu burada alınır
 */
export const paytrCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      merchant_oid,
      status,
      total_amount,
      hash,
    } = req.body;

    // PayTR ayarlarını al
    const settings = await Settings.findOne();
    if (!settings || !settings.paytr) {
      res.status(400).send('PAYTR notification failed: Settings not found');
      return;
    }

    const { merchantKey, merchantSalt } = settings.paytr;

    // Hash kontrolü
    const hashSTR = merchant_oid + merchantSalt + status + total_amount;
    const calculatedHash = crypto.createHmac('sha256', merchantKey).update(hashSTR).digest('base64');

    if (calculatedHash !== hash) {
      res.status(400).send('PAYTR notification failed: Hash mismatch');
      return;
    }

    // Siparişi güncelle
    const order = await Order.findById(merchant_oid);
    if (!order) {
      res.status(404).send('PAYTR notification failed: Order not found');
      return;
    }

    if (status === 'success') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.paymentTransactionId = req.body.payment_tx_id || merchant_oid;
    } else {
      order.paymentStatus = 'failed';
    }

    await order.save();

    // PayTR'ye OK cevabı gönder
    res.status(200).send('OK');
  } catch (error: any) {
    console.error('PayTR callback hatası:', error);
    res.status(500).send('PAYTR notification failed: ' + error.message);
  }
};

/**
 * Sipariş ödeme durumunu kontrol et
 */
export const checkPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ success: false, message: 'Sipariş bulunamadı' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
        paymentProvider: order.paymentProvider,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
