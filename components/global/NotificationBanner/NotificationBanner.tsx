interface NotificationBannerProps {
  message: string
}

export default function NotificationBanner({
  message,
}: NotificationBannerProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="bg-primary-coral text-primary-cream px-4 py-3 text-center z-50"
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
