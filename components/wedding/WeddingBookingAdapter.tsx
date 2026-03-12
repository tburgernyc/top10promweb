'use client'

import { useShopStore } from '@/lib/store/shopStore'
import { useEffect } from 'react'

/**
 * WeddingBookingAdapter
 * Sets the event type to 'wedding' in the store and adjusts booking
 * expectations for the wedding context (90-min appointments, bride name
 * instead of school name).
 *
 * Drop this into any wedding booking flow wrapper.
 */
export function WeddingBookingAdapter({ children }: { children: React.ReactNode }) {
  const setEventType = useShopStore((s) => s.setEventType)

  useEffect(() => {
    setEventType('wedding')
    return () => {
      // Do not reset on unmount — keep context until user explicitly changes
    }
  }, [setEventType])

  return <>{children}</>
}
