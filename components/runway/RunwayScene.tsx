'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { RunwayPlatform } from './RunwayPlatform'
import { DressStation } from './DressStation'
import { CameraRig } from './CameraRig'
import { SplashOverlay } from '@/components/splash/SplashOverlay'
import { RunwayFallback } from './RunwayFallback'

// Spotlight accent colors for each station
const STATION_COLORS = ['#fff5e6', '#f0e8ff', '#e6fff0'] as const

interface RunwaySceneProps {
  /** True on mobile (< 768px): renders 1 station, no post-processing */
  isMobile?: boolean
}

/**
 * 3D runway splash scene built with @react-three/fiber v9.
 *
 * Scene spec:
 *  - Canvas: fov 45, camera [0, 1.6, 5], dpr [1, 2]
 *  - Environment preset: studio
 *  - Key light: directional, warm white, intensity 1.2
 *  - Rim lights: 2x point, lavender, intensity 0.6
 *  - Ambient: intensity 0.15
 *  - Fog: linear, #050505, near 15, far 30
 *  - Three DressStations at z=-2, z=-7, z=-12
 *  - Post: Bloom (0.3 intensity, 0.9 threshold) + Vignette (0.3, 0.7)
 *
 * On mobile: only one station rendered, post-processing disabled.
 */
export function RunwayScene({ isMobile = false }: RunwaySceneProps) {
  return (
    <div className="relative w-full h-dvh overflow-hidden bg-onyx">
      <Canvas
        camera={{ fov: 45, position: [0, 1.6, 5], near: 0.1, far: 100 }}
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, alpha: false }}
        onError={() => {
          // WebGL context lost — RunwayFallback handles this via error boundary
          console.warn('[RunwayScene] WebGL context error')
        }}
        aria-hidden="true"
      >
        {/* Lighting */}
        <ambientLight intensity={0.15} />

        {/* Key light: warm directional */}
        <directionalLight
          color="#FFF5E6"
          intensity={1.2}
          position={[5, 5, 5]}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Rim lights: behind-left + behind-right */}
        <pointLight color="#E8E0FF" intensity={0.6} position={[-4, 3, -14]} />
        <pointLight color="#E8E0FF" intensity={0.6} position={[4, 3, -14]} />

        {/* Environment */}
        <Suspense fallback={null}>
          <Environment preset="studio" />
        </Suspense>

        {/* Atmospheric fog — linear, near 15, far 30 */}
        <fog attach="fog" args={['#050505', 15, 30]} />

        {/* Runway platform */}
        <RunwayPlatform />

        {/* Dress stations */}
        <Suspense fallback={null}>
          <DressStation
            position={[0, 0, -2]}
            spotlightColor={STATION_COLORS[0]}
          />
          {!isMobile && (
            <>
              <DressStation
                position={[0, 0, -7]}
                spotlightColor={STATION_COLORS[1]}
              />
              <DressStation
                position={[0, 0, -12]}
                spotlightColor={STATION_COLORS[2]}
              />
            </>
          )}
        </Suspense>

        {/* Camera dolly + orbit controls */}
        <CameraRig />

        {/* Post-processing (desktop only) */}
        {!isMobile && (
          <EffectComposer>
            <Bloom
              intensity={0.3}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.025}
              blendFunction={BlendFunction.ADD}
            />
            <Vignette
              offset={0.3}
              darkness={0.7}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        )}
      </Canvas>

      {/* 2D overlay — logo, event selector, CTA */}
      <SplashOverlay />
    </div>
  )
}

/** WebGL2 detection — call once before mounting RunwayScene */
export function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

export { RunwayFallback }
