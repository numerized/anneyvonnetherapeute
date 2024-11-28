import Link from 'next/link'
import { resolveHref } from '@/sanity/lib/utils'

interface NavLinksProps {
  menuItems: any[]
  setIsMenuOpen: (value: boolean) => void
  setShowAppointmentModal: (value: boolean) => void
}

export function NavLinks({ menuItems, setIsMenuOpen, setShowAppointmentModal }: NavLinksProps) {
  return (
    <>
      {menuItems?.map((menuItem, key) => {
        if (menuItem.linkType === 'reference' && menuItem.reference) {
          const href = resolveHref(menuItem.reference._type, menuItem.reference.slug)
          if (!href) {
            return null
          }
          return (
            <Link
              key={key}
              className={`text-lg hover:text-primary-teal transition-colors ${
                menuItem.reference._type === 'home'
                  ? 'font-extrabold'
                  : ''
              }`}
              href={href}
              onClick={() => setIsMenuOpen(false)}
            >
              {menuItem.title}
            </Link>
          )
        } else if (menuItem.linkType === 'anchor' && menuItem.anchor) {
          return (
            <a
              key={key}
              className="text-lg hover:text-primary-teal transition-colors"
              href={`#${menuItem.anchor}`}
              onClick={(e) => {
                e.preventDefault()
                setIsMenuOpen(false)
                document.getElementById(menuItem.anchor!)?.scrollIntoView({
                  behavior: 'smooth'
                })
              }}
            >
              {menuItem.title}
            </a>
          )
        }
        return null
      })}
      <button
        onClick={() => {
          setIsMenuOpen(false)
          setShowAppointmentModal(true)
        }}
        className="bg-primary-coral hover:bg-primary-rust transition-colors px-6 py-2 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-primary-teal"
      >
        Prendre rendez-vous
      </button>
    </>
  )
}
