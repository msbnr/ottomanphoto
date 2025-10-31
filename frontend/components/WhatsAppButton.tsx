'use client';

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch WhatsApp number from settings
    const fetchWhatsAppNumber = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/settings`);
        const data = await response.json();
        if (data.success && data.data.whatsappNumber) {
          setWhatsappNumber(data.data.whatsappNumber);
        } else {
          // Fallback to default number if no settings
          setWhatsappNumber('+905551234567');
        }
      } catch (error) {
        console.error('WhatsApp numarası alınamadı:', error);
        // Fallback to default number on error
        setWhatsappNumber('+905551234567');
      }
    };

    fetchWhatsAppNumber();

    // Show button after a short delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!whatsappNumber) return null;

  const handleClick = () => {
    // Format the number for WhatsApp (remove spaces and special characters)
    const formattedNumber = whatsappNumber.replace(/[^0-9+]/g, '');
    const whatsappUrl = `https://wa.me/${formattedNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      aria-label="WhatsApp ile iletişime geç"
    >
      <MessageCircle size={24} className="animate-pulse" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        Bize Yazın
      </span>
    </button>
  );
}
