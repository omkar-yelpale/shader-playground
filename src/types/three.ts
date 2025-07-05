import { ShaderMaterial } from 'three'

// For now, we'll just define the material interfaces
// The actual materials will be created with shaderMaterial from drei

export interface AudioReactiveMaterial extends ShaderMaterial {
  uniforms: {
    u_time: { value: number }
    u_audioData: { value: Float32Array }
    u_bass: { value: number }
    u_mid: { value: number }
    u_treble: { value: number }
    u_volume: { value: number }
  }
}

export interface ParticleMaterial extends ShaderMaterial {
  uniforms: {
    u_time: { value: number }
    u_bass: { value: number }
    u_pointSize: { value: number }
    u_color: { value: [number, number, number] }
  }
}

export interface FractalMaterial extends ShaderMaterial {
  uniforms: {
    u_time: { value: number }
    u_audioData: { value: Float32Array }
    u_resolution: { value: [number, number] }
    u_complexity: { value: number }
  }
}