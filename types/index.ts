import type { PortableTextBlock } from 'next-sanity'

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
  image?: SanityImage
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

export interface SanityImageAsset {
  _id: string
  url: string
  metadata: {
    dimensions: {
      width: number
      height: number
    }
  }
}

export interface SanityImage {
  asset: SanityImageAsset
  alt?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  } | null
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  } | null
}

export interface HeroSection {
  image?: SanityImage
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

export interface ProjectPayload {
  client?: string
  coverImage?: SanityImage
  description?: PortableTextBlock[]
  duration?: {
    start?: string
    end?: string
  }
  overview?: PortableTextBlock[]
  site?: string
  slug: string
  tags?: string[]
  title?: string
}

export interface SettingsPayload {
  footer?: PortableTextBlock[]
  menuItems?: MenuItem[]
  ogImage?: SanityImage
}
