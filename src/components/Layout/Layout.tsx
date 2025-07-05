import { ReactNode } from 'react'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
  showHeader?: boolean
  onFullscreen?: () => void
}

export function Layout({ children, showHeader = true, onFullscreen }: LayoutProps) {
  return (
    <div className="min-h-screen bg-apple-gray-50 dark:bg-black">
      {showHeader && <Header onFullscreen={onFullscreen} />}
      
      <main className={`${showHeader ? 'pt-12' : ''}`}>
        {children}
      </main>
    </div>
  )
}