import { useState, useEffect, Suspense } from 'react'
import { Leva } from 'leva'
import { Layout } from './components/Layout'
import { Scene } from './components/Scene'
import { AudioControls } from './components/UI'
import { LoadingScreen } from './components/UI'
import { useShaderControls } from './hooks'
import { useAudioStore } from './stores/audioStore'
import type { AudioAnalyzer } from './utils/audioAnalyzer'
import type { ColorScheme } from './utils/colorSchemes'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showHeader, setShowHeader] = useState(true)
  const { analyzer, setAnalyzer } = useAudioStore()
  
  // Get all controls from Leva
  const controls = useShaderControls()

  // Handle analyzer initialization
  const handleAnalyzerReady = (newAnalyzer: AudioAnalyzer) => {
    setAnalyzer(newAnalyzer)
    // Apply initial smoothing
    if (controls.smoothing) {
      newAnalyzer.setSmoothing(controls.smoothing)
    }
  }

  // Update smoothing when it changes
  useEffect(() => {
    if (analyzer && controls.smoothing) {
      analyzer.setSmoothing(controls.smoothing)
    }
  }, [analyzer, controls.smoothing])

  // Handle fullscreen
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setShowHeader(false)
    } else {
      document.exitFullscreen()
      setShowHeader(true)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setShowHeader(!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Simulate loading
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      <LoadingScreen isLoading={isLoading} message="Initializing Shader Playground..." />
      
      <Layout showHeader={showHeader} onFullscreen={handleFullscreen}>
        <div className={`relative w-full ${showHeader ? 'h-[calc(100vh-4rem)]' : 'h-screen'} overflow-hidden`}>
          {/* Three.js Scene */}
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <Scene
                analyzer={analyzer}
                effect={controls.effect}
                wireframe={controls.wireframe}
                particleCount={controls.particleCount}
                autoRotate={controls.rotation}
                autoRotateSpeed={controls.autoRotateSpeed}
                showStats={controls.showStats}
                colorScheme={controls.colorScheme as ColorScheme}
                brightness={controls.brightness}
                contrast={controls.contrast}
                sensitivity={controls.sensitivity}
                bassBoost={controls.bassBoost}
                midBoost={controls.midBoost}
                trebleBoost={controls.trebleBoost}
                speed={controls.speed}
                waveAmplitude={controls.waveAmplitude}
                waveFrequency={controls.waveFrequency}
                particleSize={controls.particleSize}
                particleSpeed={controls.particleSpeed}
                fractalComplexity={controls.fractalComplexity}
                fractalIterations={controls.fractalIterations}
                frameSkip={controls.frameSkip}
                isFullscreen={!showHeader}
              />
            </Suspense>
          </div>

          {/* Audio Controls */}
          <AudioControls 
            analyzer={analyzer} 
            onAnalyzerReady={handleAnalyzerReady}
          />

          {/* Leva Controls Panel */}
          <div className="absolute top-4 right-4">
            <Leva
              collapsed={true}
              oneLineLabels={false}
              flat={true}
              theme={{
                sizes: {
                  rootWidth: '320px',
                  controlWidth: '160px',
                },
                space: {
                  sm: '6px',
                },
              }}
            />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default App
