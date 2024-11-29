import { groq } from 'next-sanity'

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id,
    title,
    overview,
    statistics[] {
      _key,
      number,
      label
    },
    hero {
      image {
        asset,
        alt,
        hotspot,
        crop,
      },
      badge {
        text,
        ariaLabel,
      },
      title,
      subtitle,
      ctaButton {
        text,
        ariaLabel,
        link,
      },
    }
  }
`

export const pagesBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    body,
    overview,
    title,
    "slug": slug.current,
  }
`

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    _id,
    notificationMessage,
    footer,
    logo {
      asset->,
      alt,
      hotspot,
      crop
    },
    menuItems[] {
      _type,
      title,
      style,
      linkType,
      reference->{
        _type,
        "slug": slug.current,
        title
      },
      anchor
    },
    ogImage,
    newsletter {
      title,
      description,
      buttonText,
      placeholder
    }
  }
`
