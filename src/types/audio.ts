export interface AudioBands {
  bass: number
  lowMid: number
  mid: number
  highMid: number
  treble: number
  presence: number
  brilliance: number
  volume: number
}

export interface AudioAnalyzerConfig {
  fftSize?: number
  smoothingTimeConstant?: number
  minDecibels?: number
  maxDecibels?: number
}

export interface AudioVisualizerSettings {
  sensitivity: number
  smoothing: number
  bassBoost: number
  midBoost: number
  trebleBoost: number
  frequencyRange: [number, number]
}

export type AudioSource = 'file' | 'microphone' | 'stream'

export interface AudioState {
  isPlaying: boolean
  currentTime: number
  duration: number
  source: AudioSource | null
  fileName?: string
}