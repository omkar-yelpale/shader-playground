import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ThreeElement } from '@react-three/fiber'
import waveformVert from '../audioReactive/waveform.vert'
import waveformFrag from '../audioReactive/waveform.frag'

const AudioReactiveMaterial = shaderMaterial(
  {
    // Time uniform
    u_time: 0,
    
    // Audio data
    u_audioData: new Float32Array(8),
    u_bass: 0,
    u_mid: 0,
    u_treble: 0,
    
    // Wave controls
    u_waveAmplitude: 0.5,
    u_waveFrequency: 10,
    
    // Colors
    u_colorA: new THREE.Color(0x6366f1), // Indigo
    u_colorB: new THREE.Color(0xa855f7), // Purple
    u_colorC: new THREE.Color(0x22d3ee), // Cyan
    
    // Visual controls
    u_brightness: 1.0,
    u_contrast: 1.0,
  },
  waveformVert,
  waveformFrag
)

// Extend the material
extend({ AudioReactiveMaterial })

// Add TypeScript support
declare module '@react-three/fiber' {
  interface ThreeElements {
    audioReactiveMaterial: ThreeElement<typeof THREE.ShaderMaterial> & {
      u_time?: number
      u_audioData?: Float32Array
      u_bass?: number
      u_mid?: number
      u_treble?: number
      u_waveAmplitude?: number
      u_waveFrequency?: number
      u_colorA?: THREE.Color | string | number
      u_colorB?: THREE.Color | string | number
      u_colorC?: THREE.Color | string | number
      u_brightness?: number
      u_contrast?: number
    }
  }
}

export { AudioReactiveMaterial }