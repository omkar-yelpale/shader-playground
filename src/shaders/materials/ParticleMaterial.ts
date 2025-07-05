import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ThreeElement } from '@react-three/fiber'
import particlesVert from '../audioReactive/particles.vert'
import particlesFrag from '../audioReactive/particles.frag'

const ParticleMaterial = shaderMaterial(
  {
    // Time uniform
    u_time: 0,
    
    // Audio data
    u_audioData: new Float32Array(8),
    u_bass: 0,
    u_mid: 0,
    u_treble: 0,
    
    // Particle controls
    u_pointSize: 3.0,
    u_particleSpeed: 1.0,
    
    // Colors
    u_particleColorA: new THREE.Color(0xff006e), // Pink
    u_particleColorB: new THREE.Color(0x06ffa5), // Green
    u_particleColorC: new THREE.Color(0x00d9ff), // Blue
  },
  particlesVert,
  particlesFrag
)

// Extend the material
extend({ ParticleMaterial })

// Add TypeScript support
declare module '@react-three/fiber' {
  interface ThreeElements {
    particleMaterial: ThreeElement<typeof THREE.ShaderMaterial> & {
      u_time?: number
      u_audioData?: Float32Array
      u_bass?: number
      u_mid?: number
      u_treble?: number
      u_pointSize?: number
      u_particleSpeed?: number
      u_particleColorA?: THREE.Color | string | number
      u_particleColorB?: THREE.Color | string | number
      u_particleColorC?: THREE.Color | string | number
    }
  }
}

export { ParticleMaterial }