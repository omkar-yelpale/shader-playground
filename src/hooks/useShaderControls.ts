import { useControls, folder, button } from 'leva'
import { useState, useCallback } from 'react'
import type { ShaderEffect } from '../types/shaders'
import { captureCanvas, captureScreenshot } from '../utils/screenshot'

// Preset configurations
type PresetConfig = {
  effect: ShaderEffect
  colorScheme: string
  brightness: number
  contrast: number
  saturation: number
  sensitivity: number
  smoothing: number
  bassBoost: number
  midBoost: number
  trebleBoost: number
  speed: number
  rotation: boolean
  wireframe: boolean
  particleCount?: number
  waveAmplitude?: number
  waveFrequency?: number
  fractalComplexity?: number
  fractalIterations?: number
  particleSize?: number
  particleSpeed?: number
}

const presets: Record<string, PresetConfig> = {
  default: {
    effect: 'waveform' as ShaderEffect,
    colorScheme: 'spectrum',
    brightness: 1,
    contrast: 1,
    saturation: 1,
    sensitivity: 1,
    smoothing: 0.8,
    bassBoost: 1,
    midBoost: 1,
    trebleBoost: 1,
    speed: 1,
    rotation: false,
    wireframe: false,
    particleCount: 10000,
    waveAmplitude: 0.5,
    waveFrequency: 10,
    fractalComplexity: 3,
    fractalIterations: 15,
    particleSize: 3,
    particleSpeed: 1,
  },
  energetic: {
    effect: 'particles' as ShaderEffect,
    colorScheme: 'gradient',
    brightness: 1.5,
    contrast: 1.3,
    saturation: 1.2,
    sensitivity: 2,
    smoothing: 0.6,
    bassBoost: 2,
    midBoost: 1.5,
    trebleBoost: 1.2,
    speed: 2,
    rotation: true,
    wireframe: false,
    particleCount: 15000,
    particleSize: 5,
    particleSpeed: 2,
  },
  ambient: {
    effect: 'fractal' as ShaderEffect,
    colorScheme: 'monochrome',
    brightness: 0.8,
    contrast: 0.9,
    saturation: 0.7,
    sensitivity: 0.5,
    smoothing: 0.9,
    bassBoost: 0.8,
    midBoost: 1,
    trebleBoost: 1.2,
    speed: 0.5,
    rotation: true,
    wireframe: false,
    fractalComplexity: 5,
    fractalIterations: 20,
  },
  intense: {
    effect: 'waveform' as ShaderEffect,
    colorScheme: 'spectrum',
    brightness: 1.8,
    contrast: 1.5,
    saturation: 1.5,
    sensitivity: 3,
    smoothing: 0.5,
    bassBoost: 2.5,
    midBoost: 2,
    trebleBoost: 1.5,
    speed: 3,
    rotation: false,
    wireframe: true,
    waveAmplitude: 1,
    waveFrequency: 20,
  },
}

export function useShaderControls() {
  const [currentPreset, setCurrentPreset] = useState<keyof typeof presets>('default')

  // Load preset function
  const loadPreset = useCallback((presetName: keyof typeof presets) => {
    const preset = presets[presetName]
    setCurrentPreset(presetName)
    // The values will be automatically updated through Leva's controlled components
    return preset
  }, [])

  const controls = useControls({
    // Preset selector at the top
    preset: {
      value: currentPreset,
      options: Object.keys(presets) as (keyof typeof presets)[],
      onChange: (value) => {
        loadPreset(value as keyof typeof presets)
      },
    },
    
    // Visual controls folder
    Visual: folder({
      effect: {
        value: presets[currentPreset].effect,
        options: ['waveform', 'particles', 'fractal'] as ShaderEffect[],
      },
      colorScheme: {
        value: presets[currentPreset].colorScheme || 'spectrum',
        options: ['spectrum', 'monochrome', 'gradient'],
      },
      brightness: {
        value: presets[currentPreset].brightness,
        min: 0,
        max: 2,
        step: 0.01,
      },
      contrast: {
        value: presets[currentPreset].contrast,
        min: 0,
        max: 2,
        step: 0.01,
      },
      saturation: {
        value: presets[currentPreset].saturation || 1,
        min: 0,
        max: 2,
        step: 0.01,
      },
    }),
    
    // Audio controls folder
    Audio: folder({
      sensitivity: {
        value: presets[currentPreset].sensitivity,
        min: 0.1,
        max: 5,
        step: 0.1,
      },
      smoothing: {
        value: presets[currentPreset].smoothing,
        min: 0,
        max: 0.95,
        step: 0.01,
      },
      bassBoost: {
        value: presets[currentPreset].bassBoost,
        min: 0.5,
        max: 3,
        step: 0.1,
      },
      midBoost: {
        value: presets[currentPreset].midBoost || 1,
        min: 0.5,
        max: 3,
        step: 0.1,
      },
      trebleBoost: {
        value: presets[currentPreset].trebleBoost,
        min: 0.5,
        max: 3,
        step: 0.1,
      },
      frequencyRange: {
        value: [20, 20000],
        min: 20,
        max: 20000,
        step: 10,
      },
    }),
    
    // Animation controls folder
    Animation: folder({
      speed: {
        value: presets[currentPreset].speed,
        min: 0,
        max: 5,
        step: 0.1,
      },
      rotation: {
        value: presets[currentPreset].rotation,
      },
      autoRotateSpeed: {
        value: 0.5,
        min: 0,
        max: 5,
        step: 0.1,
        render: (get) => get('Animation.rotation'),
      },
      wireframe: {
        value: presets[currentPreset].wireframe,
      },
    }),
    
    // Wave-specific controls
    'Wave Settings': folder({
      waveAmplitude: {
        value: presets[currentPreset].waveAmplitude ?? 0.5,
        min: 0,
        max: 2,
        step: 0.01,
        render: (get) => get('Visual.effect') === 'waveform',
      },
      waveFrequency: {
        value: presets[currentPreset].waveFrequency ?? 10,
        min: 1,
        max: 50,
        step: 1,
        render: (get) => get('Visual.effect') === 'waveform',
      },
      waveSegments: {
        value: 128,
        min: 32,
        max: 256,
        step: 16,
        render: (get) => get('Visual.effect') === 'waveform',
      },
    }),
    
    // Particle-specific controls
    'Particle Settings': folder({
      particleCount: {
        value: presets[currentPreset].particleCount ?? 10000,
        min: 100,
        max: 50000,
        step: 100,
        render: (get) => get('Visual.effect') === 'particles',
      },
      particleSize: {
        value: presets[currentPreset].particleSize ?? 3,
        min: 1,
        max: 10,
        step: 0.1,
        render: (get) => get('Visual.effect') === 'particles',
      },
      particleSpeed: {
        value: presets[currentPreset].particleSpeed ?? 1,
        min: 0,
        max: 5,
        step: 0.1,
        render: (get) => get('Visual.effect') === 'particles',
      },
      particleSpread: {
        value: 3,
        min: 1,
        max: 10,
        step: 0.1,
        render: (get) => get('Visual.effect') === 'particles',
      },
    }),
    
    // Fractal-specific controls
    'Fractal Settings': folder({
      fractalComplexity: {
        value: presets[currentPreset].fractalComplexity ?? 3,
        min: 1,
        max: 10,
        step: 0.1,
        render: (get) => get('Visual.effect') === 'fractal',
      },
      fractalIterations: {
        value: presets[currentPreset].fractalIterations ?? 15,
        min: 5,
        max: 30,
        step: 1,
        render: (get) => get('Visual.effect') === 'fractal',
      },
      fractalScale: {
        value: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
        render: (get) => get('Visual.effect') === 'fractal',
      },
      fractalOffset: {
        value: { x: 0, y: 0 },
        render: (get) => get('Visual.effect') === 'fractal',
      },
    }),
    
    // Performance settings
    Performance: folder({
      frameSkip: {
        value: 2,
        min: 1,
        max: 10,
        step: 1,
        label: 'Frame Skip',
      },
      quality: {
        value: 'high',
        options: ['low', 'medium', 'high', 'ultra'],
      },
      showStats: {
        value: false,
        label: 'Show FPS',
      },
    }),
    
    // Actions
    Actions: folder({
      screenshot: button(() => {
        const canvas = captureCanvas()
        if (canvas) {
          captureScreenshot(canvas)
          console.log('Screenshot captured')
        }
      }),
      fullscreen: button(() => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen()
        } else {
          document.exitFullscreen()
        }
      }),
      reset: button(() => {
        loadPreset('default')
      }),
    }),
  })

  return {
    ...controls,
    currentPreset,
    loadPreset,
  }
}