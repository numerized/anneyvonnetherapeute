'use server'

import { WebinarPage } from '@/components/pages/webinar/WebinarPage'
import { client } from '@/sanity/lib/client'

async function getSettings() {
  try {
    return await client.fetch(`*[_type == "settings"][0]`, {}, {
      cache: 'force-cache',
      next: { revalidate: 3600 } // revalidate every hour
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

export default async function WebinarRoute() {
  const settings = await getSettings()

  const pageData = {
    hero: {
      title: 'Webinar',
      subtitle: 'Découvrez notre webinar exclusif sur les relations conscientes'
    }
  }

  if (!settings) {
    console.log('Settings not loaded')
    return <div className="min-h-screen bg-primary-forest" />
  }

  return <WebinarPage data={pageData} settings={settings} />
}
