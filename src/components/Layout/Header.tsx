import { useState } from 'react'

interface HeaderProps {
  onFullscreen?: () => void
}

export function Header({ onFullscreen }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-12 bg-apple-gray-50/95 dark:bg-apple-gray-900/95 backdrop-blur-apple border-b border-apple-gray-200/50 dark:border-apple-gray-800/50">
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo/Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-br from-apple-blue to-apple-teal rounded-lg flex items-center justify-center shadow-apple">
                <span className="text-white font-semibold text-xs">SP</span>
              </div>
              <h1 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100">Shader Playground</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <button 
              className="px-3 py-1.5 text-sm text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-900 dark:hover:text-apple-gray-100 transition-colors rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800"
              onClick={() => window.open('https://github.com/omkar-yelpale/shader-playground', '_blank')}
            >
              GitHub
            </button>
            <button 
              className="px-3 py-1.5 text-sm text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-900 dark:hover:text-apple-gray-100 transition-colors rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800"
              onClick={onFullscreen}
            >
              Fullscreen
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-apple-gray-600 dark:text-apple-gray-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-2 pb-2 space-y-1">
            <button 
              className="block w-full text-left text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-900 dark:hover:text-apple-gray-100 transition-colors py-2 px-3 rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800"
              onClick={() => window.open('https://github.com/omkar-yelpale/shader-playground', '_blank')}
            >
              GitHub
            </button>
            <button 
              className="block w-full text-left text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-900 dark:hover:text-apple-gray-100 transition-colors py-2 px-3 rounded-lg hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800"
              onClick={onFullscreen}
            >
              Fullscreen
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}