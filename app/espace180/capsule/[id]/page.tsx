'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Espace180Page from '@/components/pages/espace180/Espace180Page'
import Link from 'next/link'

export default function CapsulePage() {
  const params = useParams()
  const router = useRouter()
  const capsuleId = params.id as string

  // Validate that the ID is a number
  useEffect(() => {
    if (isNaN(Number(capsuleId))) {
      router.push('/espace180')
    }
  }, [capsuleId, router])

  return (
    <div>
      <div className="container mx-auto px-4 py-4">
        <Link 
          href="/espace180" 
          className="inline-flex items-center text-white bg-primary-dark/30 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-primary-dark/50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
          </svg>
          Retour à toutes les capsules
        </Link>
      </div>
      <Espace180Page />
    </div>
  )
}
