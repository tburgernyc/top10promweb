'use client'

import { useEffect, useRef, useCallback } from 'react'
import Script from 'next/script'

interface Store {
  name: string
  address: string
  city: string
  state: string
  zip: string
  lat: number
  lng: number
}

interface StoreMapProps {
  stores: Store[]
  selectedKey: string | null
  onSelect: (key: string) => void
}

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0d0d0d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#888888' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#050505' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#222222' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2a2520' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#3a3020' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#060a10' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
]

function markerSvg(selected: boolean) {
  const color = selected ? '#D4AF37' : '#7a6020'
  const strokeColor = selected ? '#050505' : '#050505'
  const dotColor = selected ? '#050505' : '#0d0d0d'
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="34" viewBox="0 0 24 34">
      <path fill="${color}" stroke="${strokeColor}" stroke-width="1.5"
        d="M12 0C5.37 0 0 5.37 0 12c0 8 12 22 12 22S24 20 24 12C24 5.37 18.63 0 12 0z"/>
      <circle cx="12" cy="12" r="4" fill="${dotColor}" opacity="0.6"/>
    </svg>`
  )}`
}

function storeKey(store: Store) {
  return `${store.name}-${store.city}`
}

export function StoreMap({ stores, selectedKey, onSelect }: StoreMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const infoWindowRef = useRef<any>(null)

  const rebuildMarkers = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const google = (window as any).google
    if (!mapInstanceRef.current || !google) return

    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current.clear()

    stores.forEach((store) => {
      const key = storeKey(store)
      const isSelected = key === selectedKey
      const marker = new google.maps.Marker({
        position: { lat: store.lat, lng: store.lng },
        map: mapInstanceRef.current,
        title: store.name,
        icon: {
          url: markerSvg(isSelected),
          scaledSize: new google.maps.Size(24, 34),
          anchor: new google.maps.Point(12, 34),
        },
        zIndex: isSelected ? 999 : 1,
      })

      marker.addListener('click', () => {
        onSelect(key)
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(
            `<div style="background:#111;color:#F5F5F5;padding:8px 10px;border-radius:8px;font-family:sans-serif;min-width:160px;">
              <div style="font-weight:600;font-size:13px;margin-bottom:3px;color:#D4AF37;">${store.name}</div>
              <div style="font-size:11px;color:#aaa;">${store.address}</div>
              <div style="font-size:11px;color:#aaa;">${store.city}, ${store.state} ${store.zip}</div>
            </div>`
          )
          infoWindowRef.current.open({ anchor: marker, map: mapInstanceRef.current })
        }
      })

      markersRef.current.set(key, marker)
    })
  }, [stores, selectedKey, onSelect])

  const initMap = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const google = (window as any).google
    if (!mapRef.current || !google) return
    if (mapInstanceRef.current) return // already initialized

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 37.5, lng: -93 },
      zoom: 4,
      styles: MAP_STYLES,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons: false,
    })

    mapInstanceRef.current = map
    infoWindowRef.current = new google.maps.InfoWindow({
      maxWidth: 220,
    })

    rebuildMarkers()
  }, [rebuildMarkers])

  // Re-build markers when stores or selection changes
  useEffect(() => {
    rebuildMarkers()
  }, [rebuildMarkers])

  // Pan/zoom to selected store
  useEffect(() => {
    if (!selectedKey || !mapInstanceRef.current) return
    const marker = markersRef.current.get(selectedKey)
    if (!marker) return
    mapInstanceRef.current.panTo(marker.getPosition())
    mapInstanceRef.current.setZoom(13)
  }, [selectedKey])

  // Handle hot-reload case where script already loaded
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).google?.maps) {
      initMap()
    }
  }, [initMap])

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center glass-light rounded-2xl border border-white/10">
        <p className="text-platinum/40 text-xs text-center px-4">
          Map unavailable —<br />set <code className="text-gold/60">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
        </p>
      </div>
    )
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`}
        strategy="afterInteractive"
        onLoad={initMap}
      />
      <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden" />
    </>
  )
}
