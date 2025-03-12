import { useState } from 'react'
import { motion } from 'framer-motion'

interface LiveChatProps {
  userEmail: string
}

export function LiveChat({ userEmail }: LiveChatProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement chat functionality
    setMessage('')
  }

  return (
    <div className="bg-primary-cream/10 rounded-lg p-4">
      <h3 className="text-xl font-semibold text-primary-coral mb-4">
        Chat en direct
      </h3>
      <div className="h-96 overflow-y-auto mb-4 bg-primary-cream/5 rounded p-4">
        {/* Chat messages will appear here */}
        <p className="text-primary-cream/60 text-center">
          Le chat sera disponible pendant le live
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Votre message..."
          className="flex-1 bg-primary-cream/5 border border-primary-cream/20 rounded px-4 py-2 text-primary-cream placeholder:text-primary-cream/40"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-primary-coral text-primary-cream rounded hover:bg-primary-rust transition-colors"
        >
          Envoyer
        </button>
      </form>
    </div>
  )
}
