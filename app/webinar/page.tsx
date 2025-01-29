'use client'

import { WebinarPage } from '@/components/pages/webinar/WebinarPage'
import { client } from '@/sanity/lib/client'
import { useEffect, useState } from 'react'

export default function WebinarRoute() {
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    async function fetchSettings() {
      const settings = await client.fetch(`*[_type == "settings"][0]`)
      setSettings(settings)
    }
    fetchSettings()
  }, [])

  console.log('WebinarRoute rendering:', { settings })

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
