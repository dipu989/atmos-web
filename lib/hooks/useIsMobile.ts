'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true when the viewport is narrower than the given breakpoint (px).
 * Default breakpoint: 1024px (Tailwind `lg`).
 *
 * Initialises synchronously from window.innerWidth to avoid a layout flash.
 */
export function useIsMobile(breakpoint = 1024): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  })

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])

  return isMobile
}
