'use client'

interface WherebyEmbedProps {
  className?: string
}

export function WherebyEmbed({ className }: WherebyEmbedProps) {
  return (
    <div className="relative w-full pb-[56.25%]">
      <iframe
        src="https://whereby.com/coeur-a-corps?minimal=1"
        allow="camera; microphone; fullscreen; speaker; display-capture"
        className={`absolute top-0 left-0 w-full h-full rounded-2xl shadow-xl ${className}`}
      />
    </div>
  )
}
