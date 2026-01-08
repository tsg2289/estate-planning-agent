'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTED_QUESTIONS = [
  "What documents do I need for estate planning?",
  "What's the difference between a will and a trust?",
  "How do I choose an executor?",
  "What is a power of attorney?",
  "When should I update my estate plan?"
]

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your Estate Planning Assistant. I can help answer questions about wills, trusts, powers of attorney, and more. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content,
          history: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "I apologize, but I couldn't process your request. Please try again.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      
      // Fallback response when API is unavailable
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm currently unable to connect to the AI service. Here are some general tips:\n\n• **Wills** distribute your assets after death\n• **Trusts** can help avoid probate\n• **POA** authorizes someone to act on your behalf\n• **AHCD** documents your healthcare wishes\n\nPlease try again later or continue using the document forms.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <GlassCard className="overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <SparklesIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Assistant</h3>
                      <p className="text-xs text-white/80">Estate Planning Help</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    }`}>
                      {message.role === 'user' ? (
                        <UserIcon className="w-4 h-4" />
                      ) : (
                        <SparklesIcon className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`max-w-[75%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                      <SparklesIcon className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="p-3 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="text-xs px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about estate planning..."
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
