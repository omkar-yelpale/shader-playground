import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  isLoading: boolean
  progress?: number
  message?: string
}

export function LoadingScreen({ isLoading, progress = 0, message = 'Loading...' }: LoadingScreenProps) {
  const [show, setShow] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      setShow(true)
    } else {
      // Delay hiding to allow for fade out animation
      const timeout = setTimeout(() => setShow(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isLoading])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black transition-opacity duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center space-y-6">
        {/* Animated logo/spinner */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-2 border-apple-gray-200 dark:border-apple-gray-800 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-2 border-2 border-transparent border-t-apple-teal rounded-full animate-spin animation-delay-150" />
          <div className="absolute inset-4 border-2 border-transparent border-t-apple-purple rounded-full animate-spin animation-delay-300" />
        </div>

        {/* Loading text */}
        <div className="space-y-3">
          <p className="text-apple-gray-900 dark:text-apple-gray-100 text-lg font-semibold">{message}</p>
          
          {/* Progress bar */}
          {progress > 0 && (
            <div className="w-64 h-1 bg-apple-gray-200 dark:bg-apple-gray-800 rounded-full overflow-hidden mx-auto">
              <div
                className="h-full bg-gradient-to-r from-primary to-apple-teal transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Loading tips */}
        <div className="text-apple-gray-500 dark:text-apple-gray-400 text-sm max-w-md mx-auto">
          <p>Tip: Upload audio files or use your microphone for reactive visuals</p>
        </div>
      </div>
    </div>
  )
}