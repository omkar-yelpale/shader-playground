export type ShaderEffect = 'waveform' | 'particles' | 'fractal'

export interface ShaderControls {
  // Visual controls
  effect: ShaderEffect
  colorScheme: 'spectrum' | 'monochrome' | 'gradient'
  brightness: number
  contrast: number
  saturation: number
  
  // Animation controls
  speed: number
  rotation: boolean
  wireframe: boolean
  particleCount: number
  
  // Wave specific
  waveAmplitude: number
  waveFrequency: number
  
  // Fractal specific
  fractalComplexity: number
  fractalIterations: number
}

export interface ShaderPreset {
  name: string
  controls: Partial<ShaderControls>
  description?: string
}