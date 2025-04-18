'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface StatItemProps {
  value: string
  label: string
}

export function StatItem({ value, label }: StatItemProps) {
  const [displayValue, setDisplayValue] = useState('0')
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const numericValue = parseInt(value.replace(/\D/g, ''))
  const nonNumericPart = value.replace(/[0-9]/g, '')

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  const startAnimation = useCallback(() => {
    if (hasAnimated) return

    let startTime: number | null = null
    const duration = 1500 // 1.5 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easedProgress = easeInOutCubic(progress)
      const current = Math.round(easedProgress * numericValue)

      setDisplayValue(`${current}${nonNumericPart}`)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setHasAnimated(true)
      }
    }

    requestAnimationFrame(animate)
  }, [hasAnimated, numericValue, nonNumericPart])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          startAnimation()
        }
      },
      { threshold: 0.1 },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated, startAnimation])

  return (
    <div
      ref={elementRef}
      className="text-center p-6 rounded-[24px]" style={{ backgroundColor: 'rgba(42, 58, 58, 0.3)' }}
      role="listitem"
    >
      <p
        className="text-primary-coral text-5xl font-black mb-2"
        aria-hidden="true"
      >
        {displayValue}
      </p>
      <p
        className="text-primary-cream/80 text-sm md:text-base"
        aria-label={`${value} ${label}`}
      >
        {label}
      </p>
    </div>
  )
}
