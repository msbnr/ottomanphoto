'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Inbox } from 'lucide-react'

interface Message {
  _id: string
  subject: string
  content: string
  sender: {
    name: string
    email: string
  }
  isRead: boolean
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  // Şu an için mesaj sistemi yok, boş array
  useEffect(() => {
    // Future: API'den mesajları çek
    setMessages([])
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="card-ottoman">
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Başlık */}
      <div className="card-ottoman">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">
          Mesajlarım
        </h1>
        <p className="text-ottoman-cream/70">
          Size gönderilen mesajları görüntüleyin
        </p>
      </div>

      {/* Mesajlar veya Boş Durum */}
      {messages.length === 0 ? (
        <div className="card-ottoman">
          <div className="text-center py-12">
            <Inbox className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-ottoman-cream mb-2">
              Görüntülenecek veri yok
            </h3>
            <p className="text-ottoman-cream/60">
              Henüz mesajınız bulunmamaktadır.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`card-ottoman cursor-pointer hover:border-white/50 transition-colors ${
                !message.isRead ? 'border-l-4 border-l-ottoman-gold' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ottoman-cream">
                      {message.sender.name}
                    </h3>
                    <p className="text-sm text-ottoman-cream/60">
                      {message.sender.email}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-ottoman-cream/50">
                  {formatDate(message.createdAt)}
                </span>
              </div>
              <h4 className="font-medium text-white mb-2">
                {message.subject}
              </h4>
              <p className="text-ottoman-cream/70 text-sm line-clamp-2">
                {message.content}
              </p>
              {!message.isRead && (
                <div className="mt-3">
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded">
                    Yeni
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
