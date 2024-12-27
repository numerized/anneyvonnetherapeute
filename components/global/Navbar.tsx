'use client'

import { urlFor } from '@/sanity/lib/image'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { loadSettings } from '@/sanity/loader/loadQuery'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await loadSettings()
      setSettings(data)
    }
    fetchSettings()
  }, [])

  const logoAsset = settings?.logo?.asset
  const logoUrl = logoAsset?.path ? `https://cdn.sanity.io/${logoAsset.path}` : null

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary-dark/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          {logoUrl && (
            <Link href="/" className="flex-shrink-0">
              <Image
                src={logoUrl}
                alt={settings.logo?.alt?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() || "Logo"}
                className="h-20 w-auto"
                width={300}
                height={300}
                priority
              />
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {settings?.menuItems?.map((item: any, index: number) => {
              const isLast = index === settings.menuItems.length - 1
              return (
                <Link
                  key={index}
                  href={item.reference?.slug?.current ? `/${item.reference.slug.current}` : '#'}
                  className={`${
                    isLast
                      ? 'px-3 py-1 text-sm rounded-full transition-all duration-200 bg-primary-coral text-white font-bold hover:bg-primary-coral/90 hover:scale-105'
                      : 'text-primary-cream hover:text-primary-coral transition-colors'
                  }`}
                >
                  {item.title}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-primary-cream"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </nav>
  )
}
