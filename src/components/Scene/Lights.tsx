import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Lights() {
  const light1Ref = useRef<THREE.PointLight>(null)
  const light2Ref = useRef<THREE.PointLight>(null)
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    
    // Animate point lights in circular motion
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(time) * 5
      light1Ref.current.position.z = Math.cos(time) * 5
    }
    
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.sin(time + Math.PI) * 5
      light2Ref.current.position.z = Math.cos(time + Math.PI) * 5
    }
  })
  
  return (
    <>
      <ambientLight intensity={0.2} />
      
      <pointLight
        ref={light1Ref}
        position={[5, 5, 5]}
        intensity={0.5}
        color="#007AFF"
        distance={20}
        decay={2}
      />
      
      <pointLight
        ref={light2Ref}
        position={[-5, 5, -5]}
        intensity={0.5}
        color="#5AC8FA"
        distance={20}
        decay={2}
      />
      
      <directionalLight
        position={[0, 10, 0]}
        intensity={0.3}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  )
}