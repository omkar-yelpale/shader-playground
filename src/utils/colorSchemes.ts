import * as THREE from 'three'

export type ColorScheme = 'spectrum' | 'monochrome' | 'gradient'

export interface ColorPalette {
  primary: THREE.Color
  secondary: THREE.Color
  tertiary: THREE.Color
  background: THREE.Color
}

export const colorSchemes: Record<ColorScheme, ColorPalette> = {
  spectrum: {
    primary: new THREE.Color(0x007AFF),    // Apple Blue
    secondary: new THREE.Color(0x34C759),  // Apple Green
    tertiary: new THREE.Color(0x5AC8FA),   // Apple Teal
    background: new THREE.Color(0x000000), // Black
  },
  monochrome: {
    primary: new THREE.Color(0xF5F5F7),    // Apple Gray 100
    secondary: new THREE.Color(0x8E8E93),  // Apple Gray 500
    tertiary: new THREE.Color(0x48484A),   // Apple Gray 700
    background: new THREE.Color(0x000000), // Black
  },
  gradient: {
    primary: new THREE.Color(0x5856D6),    // Apple Indigo
    secondary: new THREE.Color(0xAF52DE),  // Apple Purple
    tertiary: new THREE.Color(0xFF2D55),   // Apple Pink
    background: new THREE.Color(0x000000), // Black
  },
}

export function getColorForScheme(scheme: ColorScheme, index: 'primary' | 'secondary' | 'tertiary'): THREE.Color {
  return colorSchemes[scheme][index].clone()
}

export function interpolateColors(color1: THREE.Color, color2: THREE.Color, factor: number): THREE.Color {
  return new THREE.Color().lerpColors(color1, color2, factor)
}

export function applyBrightnessContrast(color: THREE.Color, brightness: number, contrast: number): THREE.Color {
  const result = color.clone()
  
  // Apply contrast
  result.r = (result.r - 0.5) * contrast + 0.5
  result.g = (result.g - 0.5) * contrast + 0.5
  result.b = (result.b - 0.5) * contrast + 0.5
  
  // Apply brightness
  result.r *= brightness
  result.g *= brightness
  result.b *= brightness
  
  // Clamp values
  result.r = Math.max(0, Math.min(1, result.r))
  result.g = Math.max(0, Math.min(1, result.g))
  result.b = Math.max(0, Math.min(1, result.b))
  
  return result
}