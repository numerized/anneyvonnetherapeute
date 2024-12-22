'use client'

import { enableVisualEditing } from '@sanity/visual-editing'
import { useEffect, useState } from 'react'

import { queryStore } from '@/sanity/loader'

export function VisualEditingComponent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (mounted) {
      enableVisualEditing()
    }
  }, [mounted])

  return null
}
