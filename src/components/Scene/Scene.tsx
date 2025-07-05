import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, Stats } from '@react-three/drei'
import { Lights } from './Lights'
import { CameraControls } from './CameraControls'
import { AudioReactiveMesh } from '../AudioReactive/AudioReactiveMesh'
import type { AudioAnalyzer } from '../../utils/audioAnalyzer'
import type { ShaderEffect } from '../../types/shaders'

interface SceneProps {
  analyzer: AudioAnalyzer | null
  effect: ShaderEffect
  wireframe?: boolean
  particleCount?: number
  autoRotate?: boolean
  showStats?: boolean
}

export function Scene({ 
  analyzer, 
  effect, 
  wireframe = false,
  particleCount = 10000,
  autoRotate = false,
  showStats = false
}: SceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ 
          position: [0, 0, 20], 
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
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 30, 100]} />
        
        <Suspense fallback={null}>
          <Lights />
          <CameraControls autoRotate={autoRotate} />
          
          <AudioReactiveMesh
            analyzer={analyzer}
            effect={effect}
            wireframe={wireframe}
            particleCount={particleCount}
          />
          
          <Preload all />
        </Suspense>
        
        {showStats && <Stats />}
      </Canvas>
    </div>
  )
}