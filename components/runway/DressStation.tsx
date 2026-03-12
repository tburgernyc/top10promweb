'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { SpotLight } from '@react-three/drei'
import * as THREE from 'three'

interface DressStationProps {
  position: [number, number, number]
  /** Path to a Draco-compressed GLB model. If omitted, a placeholder mesh is shown. */
  modelUrl?: string
  spotlightColor?: string
}

/**
 * A single dress display station on the runway.
 * Rotates slowly on its y-axis and has a dedicated spotlight.
 *
 * Asset note: Pass `modelUrl` pointing to a Draco-compressed GLB (< 800 KB)
 * once 3D dress assets are sourced. The placeholder cylinder renders until then.
 */
export function DressStation({ position, spotlightColor = '#ffffff' }: DressStationProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Slow y-rotation: 0.003 rad/frame
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003
    }
  })

  return (
    <group position={position}>
      {/* Spotlight above the station */}
      <SpotLight
        position={[0, 4, 0]}
        target-position={[0, 0, 0]}
        color={spotlightColor}
        intensity={2}
        angle={0.3}
        penumbra={0.5}
        distance={8}
        castShadow
      />

      {/* Rotating dress form */}
      <group ref={groupRef}>
        {/*
          Placeholder geometry — replace with:
          <DressModel url={modelUrl} />
          once GLB assets (< 800 KB, Draco compressed) are sourced.
        */}

        {/* Mannequin torso placeholder */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 1.4, 16]} />
          <meshPhysicalMaterial
            color="#2a2a2a"
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>

        {/* Dress silhouette placeholder */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <coneGeometry args={[0.55, 1.2, 24]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            metalness={0.2}
            roughness={0.7}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Head placeholder */}
        <mesh position={[0, 1.95, 0]} castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshPhysicalMaterial color="#2a2a2a" metalness={0.3} roughness={0.7} />
        </mesh>
      </group>

      {/* Pedestal */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.1, 32]} />
        <meshPhysicalMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}
