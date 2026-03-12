'use client'

import { useRef } from 'react'
import * as THREE from 'three'

/**
 * The physical runway surface: a dark reflective plane with two gold rails.
 * Dimensions: 3 units wide × 20 units long.
 */
export function RunwayPlatform() {
  const platformRef = useRef<THREE.Mesh>(null)

  return (
    <group>
      {/* Main runway surface */}
      <mesh ref={platformRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -7]}>
        <planeGeometry args={[3, 20]} />
        <meshPhysicalMaterial
          color="#1A1A1A"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Gold rail — left */}
      <mesh position={[-1.5, 0.01, -7]}>
        <boxGeometry args={[0.02, 0.02, 20]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Gold rail — right */}
      <mesh position={[1.5, 0.01, -7]}>
        <boxGeometry args={[0.02, 0.02, 20]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}
