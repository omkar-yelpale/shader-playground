import type { AudioAnalyzerConfig, AudioBands } from '../types/audio'

export class AudioAnalyzer {
  private audioContext: AudioContext
  private analyser: AnalyserNode
  private source: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null = null
  private dataArray: Uint8Array
  private smoothedBands: Float32Array
  private previousBands: Float32Array
  private beatThreshold = 1.3
  private beatDecay = 0.98
  private beatDetected = false
  private averageVolume = 0
  private peakDetectionHistory: number[] = []
  private readonly historySize = 43 // ~1 second at 60fps
  
  constructor(config: AudioAnalyzerConfig = {}) {
    // Initialize audio context with vendor prefix support
    this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    
    // Create and configure analyser node
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = config.fftSize || 2048
    this.analyser.smoothingTimeConstant = config.smoothingTimeConstant || 0.8
    this.analyser.minDecibels = config.minDecibels || -90
    this.analyser.maxDecibels = config.maxDecibels || -10
    
    // Pre-allocate arrays for performance
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.smoothedBands = new Float32Array(8)
    this.previousBands = new Float32Array(8)
  }
  
  /**
   * Connect an audio element (HTMLAudioElement) to the analyzer
   */
  connectAudioElement(audioElement: HTMLAudioElement): void {
    // Disconnect previous source if exists
    this.disconnectSource()
    
    // Create source from audio element
    this.source = this.audioContext.createMediaElementSource(audioElement)
    this.source.connect(this.analyser)
    this.analyser.connect(this.audioContext.destination)
    
    // Resume context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }
  
  /**
   * Connect a media stream (microphone) to the analyzer
   */
  connectMediaStream(stream: MediaStream): void {
    // Disconnect previous source if exists
    this.disconnectSource()
    
    // Create source from media stream
    this.source = this.audioContext.createMediaStreamSource(stream)
    this.source.connect(this.analyser)
    // Don't connect to destination for microphone to avoid feedback
    
    // Resume context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }
  
  /**
   * Disconnect current audio source
   */
  disconnectSource(): void {
    if (this.source) {
      this.source.disconnect()
      this.source = null
    }
  }
  
  /**
   * Get frequency bands with smoothing
   * Returns 8 bands normalized to 0-1 range
   */
  getFrequencyBands(numBands = 8): Float32Array {
    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray)
    
    const bandsSize = Math.floor(this.dataArray.length / numBands)
    
    for (let i = 0; i < numBands; i++) {
      let sum = 0
      const start = i * bandsSize
      const end = start + bandsSize
      
      // Calculate average for this band
      for (let j = start; j < end; j++) {
        sum += this.dataArray[j]
      }
      
      // Normalize to 0-1 range
      const target = sum / bandsSize / 255
      
      // Apply smoothing with different attack/decay rates
      const current = this.smoothedBands[i]
      const smoothing = target > current ? 0.15 : 0.25 // Faster attack, slower decay
      this.smoothedBands[i] += (target - current) * smoothing
    }
    
    return this.smoothedBands
  }
  
  /**
   * Get detailed audio bands (bass, mid, treble, etc.)
   */
  getAudioBands(): AudioBands {
    const bands = this.getFrequencyBands(8)
    
    // Map frequency bands to audio ranges
    return {
      bass: (bands[0] + bands[1]) / 2,           // 0-250 Hz
      lowMid: bands[2],                          // 250-500 Hz
      mid: (bands[3] + bands[4]) / 2,           // 500-2000 Hz
      highMid: bands[5],                         // 2000-4000 Hz
      treble: bands[6],                          // 4000-8000 Hz
      presence: bands[7],                        // 8000-16000 Hz
      brilliance: bands[7] * 0.8,                // 16000+ Hz (estimated)
      volume: this.getVolume()
    }
  }
  
  /**
   * Get overall volume level
   */
  getVolume(): number {
    const bands = this.smoothedBands
    let sum = 0
    
    for (let i = 0; i < bands.length; i++) {
      sum += bands[i]
    }
    
    const volume = sum / bands.length
    
    // Smooth volume changes
    this.averageVolume += (volume - this.averageVolume) * 0.1
    
    return this.averageVolume
  }
  
  /**
   * Detect beats using spectral flux method
   */
  detectBeat(): boolean {
    const bands = this.getFrequencyBands()
    
    // Calculate spectral flux (positive differences)
    let flux = 0
    for (let i = 0; i < bands.length; i++) {
      const diff = bands[i] - this.previousBands[i]
      if (diff > 0) {
        flux += diff
      }
      this.previousBands[i] = bands[i]
    }
    
    // Update history
    this.peakDetectionHistory.push(flux)
    if (this.peakDetectionHistory.length > this.historySize) {
      this.peakDetectionHistory.shift()
    }
    
    // Calculate average flux
    const avgFlux = this.peakDetectionHistory.reduce((a, b) => a + b, 0) / this.peakDetectionHistory.length
    
    // Detect beat if flux exceeds threshold
    const beat = flux > avgFlux * this.beatThreshold && !this.beatDetected
    
    if (beat) {
      this.beatDetected = true
    } else {
      // Decay beat detection
      this.beatThreshold *= this.beatDecay
      this.beatThreshold = Math.max(this.beatThreshold, 1.15) // Minimum threshold
      this.beatDetected = false
    }
    
    return beat
  }
  
  /**
   * Get raw frequency data for visualization
   */
  getFrequencyData(): Uint8Array {
    this.analyser.getByteFrequencyData(this.dataArray)
    return this.dataArray
  }
  
  /**
   * Get time domain data (waveform)
   */
  getWaveformData(): Uint8Array {
    const waveformArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteTimeDomainData(waveformArray)
    return waveformArray
  }
  
  /**
   * Get normalized frequency data for specific range
   */
  getFrequencyRange(minHz: number, maxHz: number): number {
    const nyquist = this.audioContext.sampleRate / 2
    const minIndex = Math.floor((minHz / nyquist) * this.dataArray.length)
    const maxIndex = Math.ceil((maxHz / nyquist) * this.dataArray.length)
    
    this.analyser.getByteFrequencyData(this.dataArray)
    
    let sum = 0
    let count = 0
    
    for (let i = minIndex; i <= maxIndex && i < this.dataArray.length; i++) {
      sum += this.dataArray[i]
      count++
    }
    
    return count > 0 ? sum / count / 255 : 0
  }
  
  /**
   * Update analyzer smoothing time constant
   */
  setSmoothing(smoothing: number): void {
    this.analyser.smoothingTimeConstant = Math.max(0, Math.min(0.95, smoothing))
  }
  
  /**
   * Resume audio context if suspended
   */
  async resume(): Promise<void> {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }
  
  /**
   * Cleanup resources
   */
  dispose(): void {
    this.disconnectSource()
    this.analyser.disconnect()
    this.audioContext.close()
  }
}