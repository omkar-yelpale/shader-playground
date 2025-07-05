import { useState, useRef, useCallback, DragEvent } from 'react'
import { AudioAnalyzer } from '../../utils/audioAnalyzer'

interface AudioControlsProps {
  analyzer: AudioAnalyzer | null
  onAnalyzerReady: (analyzer: AudioAnalyzer) => void
}

export function AudioControls({ analyzer, onAnalyzerReady }: AudioControlsProps) {
  const [audioSource, setAudioSource] = useState<'none' | 'file' | 'microphone'>('none')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [fileName, setFileName] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const animationRef = useRef<number>()

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    setFileName(file.name)
    setAudioSource('file')
    
    if (audioRef.current) {
      audioRef.current.src = url
      audioRef.current.load()
      
      // Create new analyzer if needed
      if (!analyzer) {
        const newAnalyzer = new AudioAnalyzer()
        onAnalyzerReady(newAnalyzer)
        newAnalyzer.connectAudioElement(audioRef.current)
      } else {
        analyzer.connectAudioElement(audioRef.current)
      }
    }
  }, [analyzer, onAnalyzerReady])

  // Handle drag events
  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const audioFile = files.find(file => file.type.startsWith('audio/'))
    
    if (audioFile) {
      handleFileSelect(audioFile)
    }
  }, [handleFileSelect])

  // Handle microphone input
  const handleMicrophoneToggle = useCallback(async () => {
    if (audioSource === 'microphone') {
      // Stop microphone
      if (analyzer) {
        analyzer.disconnectSource()
      }
      setAudioSource('none')
      setIsPlaying(false)
    } else {
      try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          } 
        })
        
        // Create analyzer if needed
        if (!analyzer) {
          const newAnalyzer = new AudioAnalyzer()
          onAnalyzerReady(newAnalyzer)
          newAnalyzer.connectMediaStream(stream)
        } else {
          analyzer.connectMediaStream(stream)
        }
        
        setAudioSource('microphone')
        setIsPlaying(true)
        setFileName('')
        
        // Stop any playing audio
        if (audioRef.current) {
          audioRef.current.pause()
        }
      } catch (error) {
        console.error('Microphone access denied:', error)
        alert('Microphone access was denied. Please check your browser permissions.')
      }
    }
  }, [audioSource, analyzer, onAnalyzerReady])

  // Update progress
  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration || 0)
      
      if (!audioRef.current.paused) {
        animationRef.current = requestAnimationFrame(updateProgress)
      }
    }
  }, [])

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || audioSource !== 'file') return
    
    if (isPlaying) {
      audioRef.current.pause()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else {
      audioRef.current.play()
      updateProgress()
    }
    
    setIsPlaying(!isPlaying)
  }, [isPlaying, audioSource, updateProgress])

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }, [])

  // Handle seek
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [])

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Audio element */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={(e) => {
            const audio = e.currentTarget
            setDuration(audio.duration)
          }}
        />
        
        {/* File upload area */}
        <div
          className={`mb-4 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging 
              ? 'border-purple-500 bg-purple-500/10' 
              : 'border-slate-700 hover:border-slate-600'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileSelect(file)
            }}
            className="hidden"
          />
          
          <div className="space-y-2">
            <p className="text-slate-400">
              {fileName || 'Drag and drop an audio file here'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Choose File
              </button>
              <button
                onClick={handleMicrophoneToggle}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  audioSource === 'microphone'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {audioSource === 'microphone' ? 'Stop Microphone' : 'Use Microphone'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Audio controls */}
        {audioSource === 'file' && (
          <div className="space-y-3">
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm w-12">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="text-slate-400 text-sm w-12">
                {formatTime(duration)}
              </span>
            </div>
            
            {/* Playback controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              {/* Volume control */}
              <div className="flex items-center gap-2 flex-1">
                <span className="text-slate-400 text-sm">Volume</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-slate-400 text-sm w-12">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Microphone indicator */}
        {audioSource === 'microphone' && (
          <div className="flex items-center justify-center gap-2 text-red-500">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span>Microphone Active</span>
          </div>
        )}
      </div>
    </div>
  )
}