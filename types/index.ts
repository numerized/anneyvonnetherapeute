import type { PortableTextBlock } from 'next-sanity'
import type { Image } from 'sanity'

export interface MenuItem {
  _type: string
  slug?: string
  title?: string
}

export interface StatisticItem {
  _key: string
  number: string
  label: string
}

export interface MilestoneItem {
  description?: string
  duration?: {
    start?: string
    end?: string
  }
  image?: Image
  tags?: string[]
  title?: string
}

export interface HeroButton {
  text: string
  ariaLabel: string
  link: string
}

export interface HeroBadge {
  text: string
  ariaLabel: string
}

export interface HeroSection {
  image?: {
    asset: {
      _type: string
      _ref: string
    }
    alt: string
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
    crop?: {
      top: number
      bottom: number
      left: number
      right: number
    }
  }
  badge?: HeroBadge
  title?: string
  subtitle?: string
  ctaButton?: HeroButton
}

export interface HomePagePayload {
  footer?: PortableTextBlock[]
  overview?: PortableTextBlock[]
  hero?: HeroSection
  title?: string
  statistics?: StatisticItem[]
}

export interface PagePayload {
  body?: PortableTextBlock[]
  name?: string
  overview?: PortableTextBlock[]
  title?: string
  slug?: string
}

export interface SettingsPayload {
  footer?: PortableTextBlock[]
  menuItems?: MenuItem[]
  ogImage?: Image
}
