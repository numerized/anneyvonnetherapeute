import Link from 'next/link'
import { resolveHref } from '@/sanity/lib/utils'
import { scrollToSection } from '@/utils/scroll'

interface NavLinksProps {
  menuItems: any[]
  setIsMenuOpen: (isOpen: boolean) => void
  setShowAppointmentModal: (show: boolean) => void
}

export function NavLinks({ menuItems, setIsMenuOpen, setShowAppointmentModal }: NavLinksProps) {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    scrollToSection(anchor);
  };

  return (
    <>
      {menuItems?.map((menuItem, key) => {
        if (menuItem.linkType === 'reference' && menuItem.reference) {
          const href = resolveHref(menuItem.reference._type, menuItem.reference.slug?.current)
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
              onClick={(e) => handleAnchorClick(e, menuItem.anchor!)}
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
