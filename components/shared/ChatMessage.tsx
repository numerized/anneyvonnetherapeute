interface ChatMessageProps {
  isAI: boolean
  message: string
  initials: string
}

export function ChatMessage({ isAI, message, initials }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 ${isAI ? '' : 'justify-end'}`}>
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-primary-teal/20 flex-shrink-0 grid place-items-center">
          <span className="text-primary-teal text-sm">{initials}</span>
        </div>
      )}
      <div
        className={`max-w-[80%] group relative ${isAI ? 'bg-primary-forest/40' : 'bg-[#6BA5A5]'} rounded-[18px] p-4 shadow-md`}
      >
        <p className="text-primary-cream text-sm">{message}</p>
        <span className="text-[10px] text-primary-cream/60 absolute bottom-1 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-primary-coral/20 flex-shrink-0 grid place-items-center">
          <span className="text-primary-coral text-sm">{initials}</span>
        </div>
      )}
    </div>
  )
}
