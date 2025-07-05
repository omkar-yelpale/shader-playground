export function captureScreenshot(canvas: HTMLCanvasElement, filename?: string) {
  // Convert canvas to blob
  canvas.toBlob((blob) => {
    if (!blob) {
      console.error('Failed to capture screenshot')
      return
    }

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `shader-playground-${Date.now()}.png`
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
  }, 'image/png')
}

export function captureCanvas(): HTMLCanvasElement | null {
  // Find the Three.js canvas
  const canvas = document.querySelector('canvas')
  if (!canvas) {
    console.error('No canvas found')
    return null
  }
  
  return canvas
}