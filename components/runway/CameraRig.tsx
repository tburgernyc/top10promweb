'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useReducedMotion } from 'motion/react'

const DOLLY_DURATION = 12 // seconds
const START_Z = 5
const END_Z = -5

/**
 * Dollies the camera from z=5 to z=-5 over 12 seconds with a subtle vertical bob.
 * After the dolly completes, OrbitControls are enabled with constrained azimuth (±45°)
 * and polar range (60-90°). Zoom is disabled.
 *
 * Respects prefers-reduced-motion: skips animation and starts at z=-2.
 */
export function CameraRig() {
  const { camera } = useThree()
  const reduceMotion = useReducedMotion()
  const elapsed = useRef(0)
  const controlsEnabled = useRef(false)
  const orbitRef = useRef<React.ComponentRef<typeof OrbitControls>>(null)

  useEffect(() => {
    if (reduceMotion) {
      camera.position.set(0, 1.6, -2)
      controlsEnabled.current = true
    } else {
      camera.position.set(0, 1.6, START_Z)
    }
  }, [camera, reduceMotion])

  useFrame((_, delta) => {
    if (reduceMotion || controlsEnabled.current) return

    elapsed.current += delta
    const t = Math.min(elapsed.current / DOLLY_DURATION, 1)

    // Lerp z from START_Z to END_Z
    const z = START_Z + (END_Z - START_Z) * t
    // Subtle sine vertical bob: amplitude 0.02, freq 0.5 Hz
    const yBob = Math.sin(elapsed.current * Math.PI) * 0.02
    camera.position.set(0, 1.6 + yBob, z)

    if (t >= 1) {
      controlsEnabled.current = true
      if (orbitRef.current) {
        orbitRef.current.enabled = true
      }
    }
  })

  return (
    <OrbitControls
      ref={orbitRef}
      enabled={reduceMotion ?? false}
      enableZoom={false}
      minAzimuthAngle={-Math.PI / 4}  // -45°
      maxAzimuthAngle={Math.PI / 4}   // +45°
      minPolarAngle={Math.PI / 3}     // 60°
      maxPolarAngle={Math.PI / 2}     // 90°
      target={[0, 1, -4]}
    />
  )
}
