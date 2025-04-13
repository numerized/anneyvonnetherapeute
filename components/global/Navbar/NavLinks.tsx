import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { scrollToSection } from '@/utils/scroll'

interface NavLinksProps {
  setIsMenuOpen: (isOpen: boolean) => void
  setShowAppointmentModal: (show: boolean) => void
  isLoggedIn?: boolean | undefined
  appointmentScheduled?: boolean
  appointmentDate?: string
}

export function NavLinks({
  setIsMenuOpen,
  setShowAppointmentModal,
  isLoggedIn,
  appointmentScheduled,
  appointmentDate,
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

  return (
    <>
      <Link
        href="/therapies"
        className="text-white hover:text-white/80 transition-colors duration-200"
        onClick={() => setIsMenuOpen(false)}
      >
        Therapies
      </Link>

      <Link
        href="/coaching"
        className="text-white hover:text-white/80 transition-colors duration-200"
        onClick={() => setIsMenuOpen(false)}
      >
        Coachings
      </Link>

      {isHomePage ? (
        <a
          href="#about"
          className="text-white hover:text-white/80 transition-colors duration-200"
          onClick={(e) => handleAnchorClick(e, 'about')}
        >
          A Propos
        </a>
      ) : (
        <Link
          href="/accueil#about"
          className="text-white hover:text-white/80 transition-colors duration-200"
          onClick={() => setIsMenuOpen(false)}
        >
          A Propos
        </Link>
      )}

      {/* Appointment section - hidden only on medium screens (md) */}
      <div className="block md:hidden lg:block">
        {appointmentScheduled ? (
          <div className="bg-primary-teal/30 px-4 py-2 rounded-full text-primary-cream text-sm">
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
            className="px-4 py-2 bg-primary-coral text-white rounded-full hover:bg-primary-rust transition-all duration-200 font-bold"
          >
            Prendre Rendez-Vous
          </button>
        )}
      </div>

      <Link
        href={isLoggedIn ? '/dashboard' : '/login'}
        className="px-4 py-2 rounded-full border-2 border-white text-white hover:bg-white/10 transition-colors duration-200"
        onClick={() => setIsMenuOpen(false)}
      >
        {isLoggedIn ? 'Espace Privé' : 'Se loguer'}
      </Link>
    </>
  )
}
