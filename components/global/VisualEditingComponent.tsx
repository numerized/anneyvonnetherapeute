'use client'

import { VisualEditing } from '@sanity/visual-editing'
import { queryStore } from '@/sanity/loader'
import { useEffect, useState } from 'react'

export function VisualEditingComponent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <VisualEditing store={queryStore} />
}
