import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

interface CameraControlsProps {
  autoRotate?: boolean
  autoRotateSpeed?: number
  enableDamping?: boolean
}

export function CameraControls({ 
  autoRotate = false, 
  autoRotateSpeed = 0.5,
  enableDamping = true 
}: CameraControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })
  
  return (
    <OrbitControls
      ref={controlsRef}
      camera={camera}
      target={[0, 0, 0]}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      enableDamping={enableDamping}
      dampingFactor={0.05}
      minDistance={5}
      maxDistance={50}
      maxPolarAngle={Math.PI * 0.85}
      minPolarAngle={Math.PI * 0.15}
    />
  )
}