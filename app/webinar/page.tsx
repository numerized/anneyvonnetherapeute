'use server'

import { WebinarPage } from '@/components/pages/webinar/WebinarPage'
import { client } from '@/sanity/lib/client'
import { draftMode } from 'next/headers'

const DEFAULT_SETTINGS = {
  title: 'Anne Yvonne',
  description: 'Thérapeute Holistique',
  _type: 'settings'
}

async function getSettings() {
  try {
    // Query that matches the schema structure
    const query = `*[_type == "settings"][0]{
      title,
      description,
      "logo": logo{
        "url": asset->url,
        "alt": alt
      },
      notificationMessage,
      menuItems[]{
        title,
        style,
        linkType,
        reference->{
          "slug": slug.current,
          title
        },
        anchor
      }
    }`
    
    const settings = await client.fetch(query, {}, {
      cache: process.env.NODE_ENV === 'development' ? 'no-store' : 'force-cache',
      next: process.env.NODE_ENV === 'production' ? { revalidate: 3600 } : undefined
    })

    if (!settings && process.env.NODE_ENV === 'development') {
      console.warn('No settings document found in Sanity. Please create one in your Sanity Studio.')
    }

    // Return settings if found, otherwise return default settings
    return settings || DEFAULT_SETTINGS
  } catch (error) {
    console.error('Error fetching settings:', error)
    return DEFAULT_SETTINGS
  }
}

export default async function WebinarRoute() {
  const isDraftMode = draftMode().isEnabled

  try {
    const settings = await getSettings()

    const pageData = {
      hero: {
        title: 'Webinar',
        subtitle: 'Découvrez notre webinar exclusif sur les relations conscientes'
      }
    }

    return <WebinarPage data={pageData} settings={settings} />
  } catch (error) {
    console.error('Error in WebinarRoute:', error)
    
    // In development, show the error details
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="min-h-screen bg-primary-forest p-8">
          <h1 className="text-white text-2xl mb-4">Error loading webinar page</h1>
          <pre className="text-white whitespace-pre-wrap">
            {JSON.stringify(error, null, 2)}
          </pre>
          <div className="mt-4 p-4 bg-yellow-500/20 rounded-lg">
            <h2 className="text-white text-xl mb-2">Troubleshooting Steps:</h2>
            <ol className="text-white list-decimal list-inside space-y-2">
              <li>Verify that a settings document exists in your Sanity Studio</li>
              <li>Check that your environment variables are set correctly</li>
              <li>Ensure your Sanity token has read permissions</li>
            </ol>
          </div>
        </div>
      )
    }

    // In production, show a user-friendly error
    return (
      <div className="min-h-screen bg-primary-forest flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h1 className="text-3xl mb-4">Page temporairement indisponible</h1>
          <p>Nous travaillons à résoudre le problème. Merci de réessayer plus tard.</p>
        </div>
      </div>
    )
  }
}
