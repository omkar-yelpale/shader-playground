import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, Stats } from '@react-three/drei'
import { Lights } from './Lights'
import { CameraControls } from './CameraControls'
import { AudioReactiveMesh } from '../AudioReactive/AudioReactiveMesh'
import type { AudioAnalyzer } from '../../utils/audioAnalyzer'
import type { ShaderEffect } from '../../types/shaders'
import type { ColorScheme } from '../../utils/colorSchemes'

interface SceneProps {
  analyzer: AudioAnalyzer | null
  effect: ShaderEffect
  wireframe?: boolean
  particleCount?: number
  autoRotate?: boolean
  autoRotateSpeed?: number
  showStats?: boolean
  colorScheme?: ColorScheme
  brightness?: number
  contrast?: number
  sensitivity?: number
  bassBoost?: number
  midBoost?: number
  trebleBoost?: number
  speed?: number
  waveAmplitude?: number
  waveFrequency?: number
  particleSize?: number
  particleSpeed?: number
  fractalComplexity?: number
  fractalIterations?: number
  frameSkip?: number
  isFullscreen?: boolean
}

export function Scene({ 
  analyzer, 
  effect, 
  wireframe = false,
  particleCount = 10000,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  showStats = false,
  colorScheme = 'spectrum',
  brightness = 1,
  contrast = 1,
  sensitivity = 1,
  bassBoost = 1,
  midBoost = 1,
  trebleBoost = 1,
  speed = 1,
  waveAmplitude = 0.5,
  waveFrequency = 10,
  particleSize = 3,
  particleSpeed = 1,
  fractalComplexity = 3,
  fractalIterations = 15,
  frameSkip = 2,
  isFullscreen = false
}: SceneProps) {
  // Adjust camera position slightly down when not in fullscreen to compensate for audio controls
  const cameraY = isFullscreen ? 0 : -2
  
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ 
          position: [0, cameraY, 20], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 30, 100]} />
        
        <Suspense fallback={null}>
          <Lights />
          <CameraControls 
            autoRotate={autoRotate} 
            autoRotateSpeed={autoRotateSpeed}
          />
          
          <AudioReactiveMesh
            analyzer={analyzer}
            effect={effect}
            wireframe={wireframe}
            particleCount={particleCount}
            colorScheme={colorScheme}
            brightness={brightness}
            contrast={contrast}
            sensitivity={sensitivity}
            bassBoost={bassBoost}
            midBoost={midBoost}
            trebleBoost={trebleBoost}
            speed={speed}
            waveAmplitude={waveAmplitude}
            waveFrequency={waveFrequency}
            particleSize={particleSize}
            particleSpeed={particleSpeed}
            fractalComplexity={fractalComplexity}
            fractalIterations={fractalIterations}
            frameSkip={frameSkip}
          />
          
          <Preload all />
        </Suspense>
        
        {showStats && <Stats />}
      </Canvas>
    </div>
  )
}