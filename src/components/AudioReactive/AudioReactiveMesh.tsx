import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AudioAnalyzer } from '../../utils/audioAnalyzer'
import type { ShaderEffect } from '../../types/shaders'
import { getColorForScheme, applyBrightnessContrast } from '../../utils/colorSchemes'
import type { ColorScheme } from '../../utils/colorSchemes'
// Import and register materials with R3F
import { AudioReactiveMaterial } from '../../shaders/materials/AudioReactiveMaterial'
import { ParticleMaterial } from '../../shaders/materials/ParticleMaterial'
import { FractalMaterial } from '../../shaders/materials/FractalMaterial'

// Ensure materials are registered (TypeScript needs to see they're used)
void AudioReactiveMaterial
void ParticleMaterial
void FractalMaterial

interface AudioReactiveMeshProps {
  analyzer: AudioAnalyzer | null
  effect: ShaderEffect
  wireframe?: boolean
  particleCount?: number
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
}

export function AudioReactiveMesh({ 
  analyzer, 
  effect, 
  wireframe = false,
  particleCount = 10000,
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
  frameSkip = 2
}: AudioReactiveMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const frameCount = useRef(0)
  
  // Create geometry based on effect type
  const geometry = useMemo(() => {
    if (effect === 'particles') {
      // Create particle geometry
      const positions = new Float32Array(particleCount * 3)
      const randoms = new Float32Array(particleCount)
      const colors = new Float32Array(particleCount * 3)
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        
        // Random positions in a sphere
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radius = Math.random() * 3
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[i3 + 2] = radius * Math.cos(phi)
        
        // Random values for variation
        randoms[i] = Math.random()
        
        // Random colors
        colors[i3] = Math.random()
        colors[i3 + 1] = Math.random()
        colors[i3 + 2] = Math.random()
      }
      
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
      geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
      
      return geometry
    } else {
      // Plane geometry for waveform and fractal
      const geometry = new THREE.PlaneGeometry(10, 10, 128, 128)
      geometry.center() // Ensure geometry is centered
      return geometry
    }
  }, [effect, particleCount])
  
  useFrame((state) => {
    if (!analyzer || !materialRef.current) return
    
    // Update audio data based on frame skip setting
    frameCount.current++
    if (frameCount.current % frameSkip === 0) {
      const bands = analyzer.getFrequencyBands(8)
      const audioBands = analyzer.getAudioBands()
      
      // Apply boost values and sensitivity
      const boostedBass = audioBands.bass * bassBoost * sensitivity
      const boostedMid = audioBands.mid * midBoost * sensitivity
      const boostedTreble = audioBands.treble * trebleBoost * sensitivity
      
      // Update material uniforms
      materialRef.current.uniforms.u_audioData.value = bands.map(b => b * sensitivity)
      materialRef.current.uniforms.u_bass.value = boostedBass
      materialRef.current.uniforms.u_mid.value = boostedMid
      materialRef.current.uniforms.u_treble.value = boostedTreble
      
      // Update colors based on color scheme
      const colors = {
        primary: getColorForScheme(colorScheme, 'primary'),
        secondary: getColorForScheme(colorScheme, 'secondary'),
        tertiary: getColorForScheme(colorScheme, 'tertiary'),
      }
      
      // Apply brightness and contrast to colors
      Object.entries(colors).forEach(([key, color]) => {
        colors[key as keyof typeof colors] = applyBrightnessContrast(color, brightness, contrast)
      })
      
      // Update color uniforms based on effect type
      if (effect === 'waveform' && materialRef.current.uniforms.u_colorA) {
        materialRef.current.uniforms.u_colorA.value = colors.primary
        materialRef.current.uniforms.u_colorB.value = colors.secondary
        materialRef.current.uniforms.u_colorC.value = colors.tertiary
        materialRef.current.uniforms.u_waveAmplitude.value = waveAmplitude
        materialRef.current.uniforms.u_waveFrequency.value = waveFrequency
      } else if (effect === 'particles' && materialRef.current.uniforms.u_particleColorA) {
        materialRef.current.uniforms.u_particleColorA.value = colors.primary
        materialRef.current.uniforms.u_particleColorB.value = colors.secondary
        materialRef.current.uniforms.u_particleColorC.value = colors.tertiary
        materialRef.current.uniforms.u_pointSize.value = particleSize
        materialRef.current.uniforms.u_particleSpeed.value = particleSpeed
      } else if (effect === 'fractal' && materialRef.current.uniforms.u_fractalColorA) {
        materialRef.current.uniforms.u_fractalColorA.value = colors.primary
        materialRef.current.uniforms.u_fractalColorB.value = colors.secondary
        materialRef.current.uniforms.u_fractalColorC.value = colors.tertiary
        materialRef.current.uniforms.u_complexity.value = fractalComplexity
        materialRef.current.uniforms.u_fractalIterations.value = fractalIterations
      }
      
      // Detect beat for extra effects
      const beat = analyzer.detectBeat()
      if (beat && meshRef.current) {
        meshRef.current.scale.setScalar(1.1)
      }
    }
    
    // Always update time with speed multiplier
    materialRef.current.uniforms.u_time.value = state.clock.elapsedTime * speed
    
    // Update resolution for fractal
    if (effect === 'fractal' && materialRef.current.uniforms.u_resolution) {
      materialRef.current.uniforms.u_resolution.value.set(
        state.viewport.width,
        state.viewport.height
      )
    }
    
    // Smooth scale back to normal
    if (meshRef.current && meshRef.current.scale.x > 1) {
      meshRef.current.scale.multiplyScalar(0.98)
    }
    
    // Rotate particles
    if (effect === 'particles' && pointsRef.current) {
      pointsRef.current.rotation.y += 0.001 * speed
    }
  })
  
  // Render based on effect type
  if (effect === 'particles') {
    return (
      <points ref={pointsRef} geometry={geometry}>
        <particleMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    )
  }
  
  if (effect === 'waveform') {
    return (
      <mesh ref={meshRef} geometry={geometry}>
        <audioReactiveMaterial
          ref={materialRef}
          wireframe={wireframe}
          side={THREE.DoubleSide}
        />
      </mesh>
    )
  }
  
  // Fractal effect
  return (
    <mesh ref={meshRef} geometry={geometry}>
      <fractalMaterial
        ref={materialRef}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}