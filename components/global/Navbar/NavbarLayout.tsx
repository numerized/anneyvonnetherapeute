import Link from 'next/link'

import { resolveHref } from '@/sanity/lib/utils'
import type { MenuItem, SettingsPayload } from '@/types'

interface NavbarProps {
  data: SettingsPayload
}

export default function Navbar(props: NavbarProps) {
  const { data } = props
  const menuItems = data?.menuItems || []

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-x-5 bg-white/80 px-4 py-4 backdrop-blur md:px-16 md:py-5 lg:px-32">
      {menuItems?.map((menuItem, key) => {
        if (menuItem.linkType === 'reference' && menuItem.reference) {
          const href = resolveHref(menuItem.reference._type, menuItem.reference.slug)
          if (!href) {
            return null
          }
          return (
            <Link
              key={key}
              className={`text-lg hover:text-black md:text-xl ${
                menuItem.reference._type === 'home'
                  ? 'font-extrabold text-black'
                  : 'text-gray-600'
              }`}
              href={href}
            >
              {menuItem.title}
            </Link>
          )
        } else if (menuItem.linkType === 'anchor' && menuItem.anchor) {
          return (
            <a
              key={key}
              className="text-lg text-gray-600 hover:text-black md:text-xl"
              href={`#${menuItem.anchor}`}
              onClick={(e) => {
                e.preventDefault()
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
    </div>
  )
}
