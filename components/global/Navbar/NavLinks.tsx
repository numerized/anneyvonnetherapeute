import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { scrollToSection } from '@/utils/scroll'

interface NavLinksProps {
  setIsMenuOpen: (isOpen: boolean) => void
  setShowAppointmentModal: (show: boolean) => void
  isLoggedIn?: boolean | undefined
  appointmentScheduled?: boolean
  appointmentDate?: string
  mobileModal?: boolean
}

export function NavLinks({
  setIsMenuOpen,
  setShowAppointmentModal,
  isLoggedIn,
  appointmentScheduled,
  appointmentDate,
  mobileModal = false,
}: NavLinksProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/' || pathname === '/accueil'

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    anchor: string,
  ) => {
    e.preventDefault()
    setIsMenuOpen(false)

    setTimeout(() => {
      scrollToSection(anchor)
    }, 100)
  }

  const linkClass = mobileModal
    ? 'text-2xl md:text-3xl text-white hover:text-white/80 transition-colors duration-200'
    : 'text-white hover:text-white/80 transition-colors duration-200'
  const btnClass = mobileModal
    ? 'px-4 py-2 bg-primary-coral text-lg md:text-xl text-white rounded-full hover:bg-primary-rust transition-all duration-200 font-bold'
    : 'px-4 py-2 bg-primary-coral text-base md:text-lg text-white rounded-full hover:bg-primary-rust transition-all duration-200 font-bold'
  const capsuleClass = mobileModal
    ? 'bg-primary-teal/30 px-4 py-2 rounded-full text-lg md:text-xl text-primary-cream'
    : 'bg-primary-teal/30 px-4 py-2 rounded-full text-base md:text-lg text-primary-cream'
  const espaceClass = mobileModal
    ? 'px-4 py-2 rounded-full border-2 border-white text-lg md:text-xl text-white hover:bg-white/10 transition-colors duration-200'
    : 'px-4 py-2 rounded-full border-2 border-white text-base md:text-lg text-white hover:bg-white/10 transition-colors duration-200'

  return (
    <>
      <Link
        href="/therapies"
        className={linkClass}
        onClick={() => setIsMenuOpen(false)}
      >
        Thérapies
      </Link>

      <Link
        href="/coaching"
        className={linkClass}
        onClick={() => setIsMenuOpen(false)}
      >
        Coachings
      </Link>

      {/* "A Propos" link removed as requested */}

      {/* Appointment section - hidden only on medium screens (md) */}
      <div className="block md:hidden lg:block">
        {appointmentScheduled ? (
          <div className={capsuleClass}>
            <div className="flex items-center">
              <span className="text-primary-coral mr-2">✓</span>
              <span>Rendez-vous: {appointmentDate}</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsMenuOpen(false)
              setShowAppointmentModal(true)
            }}
            className={btnClass}
          >
            Prendre Rendez-Vous
          </button>
        )}
      </div>

      <Link
        href={isLoggedIn ? '/dashboard' : '/login'}
        className={espaceClass}
        onClick={() => setIsMenuOpen(false)}
      >
        {isLoggedIn ? 'Espace Privé' : 'Espace Privé'}
      </Link>
    </>
  )
}
