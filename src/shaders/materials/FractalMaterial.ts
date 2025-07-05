import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ThreeElement } from '@react-three/fiber'
import fractalVert from '../audioReactive/fractal.vert'
import fractalFrag from '../audioReactive/fractal.frag'

const FractalMaterial = shaderMaterial(
  {
    // Time uniform
    u_time: 0,
    
    // Audio data
    u_audioData: new Float32Array(8),
    u_bass: 0,
    u_mid: 0,
    u_treble: 0,
    
    // Fractal controls
    u_resolution: new THREE.Vector2(1, 1),
    u_complexity: 3.0,
    u_fractalIterations: 15.0,
    
    // Colors
    u_fractalColorA: new THREE.Color(0x1e293b), // Slate
    u_fractalColorB: new THREE.Color(0x7c3aed), // Violet
    u_fractalColorC: new THREE.Color(0xfbbf24), // Amber
  },
  fractalVert,
  fractalFrag
)

// Extend the material
extend({ FractalMaterial })

// Add TypeScript support
declare module '@react-three/fiber' {
  interface ThreeElements {
    fractalMaterial: ThreeElement<typeof THREE.ShaderMaterial> & {
      u_time?: number
      u_audioData?: Float32Array
      u_bass?: number
      u_mid?: number
      u_treble?: number
      u_resolution?: THREE.Vector2
      u_complexity?: number
      u_fractalIterations?: number
      u_fractalColorA?: THREE.Color | string | number
      u_fractalColorB?: THREE.Color | string | number
      u_fractalColorC?: THREE.Color | string | number
    }
  }
}

export { FractalMaterial }