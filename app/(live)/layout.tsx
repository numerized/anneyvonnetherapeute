export default function LiveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-primary-dark text-primary-cream">
      <div className="flex-grow">
        {children}
      </div>
    </div>
  )
}
