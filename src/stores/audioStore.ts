import { create } from 'zustand'
import type { AudioAnalyzer } from '../utils/audioAnalyzer'

interface AudioState {
  analyzer: AudioAnalyzer | null
  isPlaying: boolean
  currentTime: number
  duration: number
  source: 'file' | 'microphone' | null
  fileName?: string
  volume: number
  
  // Actions
  setAnalyzer: (analyzer: AudioAnalyzer | null) => void
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setSource: (source: 'file' | 'microphone' | null) => void
  setFileName: (fileName?: string) => void
  setVolume: (volume: number) => void
  reset: () => void
}

const initialState = {
  analyzer: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  source: null,
  fileName: undefined,
  volume: 1,
}

export const useAudioStore = create<AudioState>((set) => ({
  ...initialState,
  
  setAnalyzer: (analyzer) => set({ analyzer }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setSource: (source) => set({ source }),
  setFileName: (fileName) => set({ fileName }),
  setVolume: (volume) => set({ volume }),
  
  reset: () => set(initialState),
}))