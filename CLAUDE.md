# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive shader playground with audio reactivity, built with React + TypeScript + Vite. Users can upload audio files or use microphone input to create stunning visual effects that respond to music in real-time.

## Development Commands

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Run linting
yarn lint
```

## Architecture

The project structure is organized for scalability and maintainability:

### Core Directories
- **src/components/**: React components organized by feature
  - **Scene/**: Three.js scene setup and camera controls
  - **AudioReactive/**: Audio-reactive visualization components
  - **UI/**: User interface components (controls, file upload, etc.)
  - **Layout/**: Layout and structural components
- **src/shaders/**: GLSL shader files
  - **audioReactive/**: Vertex and fragment shaders for visualizations
  - **materials/**: Custom Three.js materials
- **src/hooks/**: Custom React hooks for audio, controls, etc.
- **src/utils/**: Utility functions and classes
  - **audioAnalyzer.ts**: Core audio analysis engine
- **src/types/**: TypeScript type definitions
- **src/stores/**: State management (Zustand)

### Key Technologies
- **Three.js** & **React Three Fiber**: 3D graphics and WebGL
- **Leva**: Real-time parameter controls
- **Tailwind CSS**: Styling with dark theme
- **Web Audio API**: Audio analysis and processing

## TypeScript Configuration

The project uses a composite TypeScript setup:
- **tsconfig.json**: Root configuration
- **tsconfig.app.json**: Application-specific settings
- **tsconfig.node.json**: Node.js tooling configuration

## Code Standards

- ESLint is configured with TypeScript and React rules
- The project uses ES modules (`"type": "module"`)
- React 19.1.0 with TypeScript strict mode enabled
- GLSL shaders are imported as modules via vite-plugin-glsl

## Development Best Practices

- Always check TypeScript and Prettier errors after adding or changing a significant amount of code and report the errors

## Audio Analyzer

The `AudioAnalyzer` class in `src/utils/audioAnalyzer.ts` is the core audio processing engine:

### Key Features:
- **FFT Size**: 2048 for detailed frequency analysis
- **8-band frequency decomposition**: Splits audio spectrum into 8 bands
- **Smoothing algorithms**: Different attack/decay rates for visual stability
- **Beat detection**: Spectral flux method with adaptive threshold
- **Volume normalization**: Automatic gain control
- **Input support**: Both audio files and microphone input

### Usage Example:
```typescript
const analyzer = new AudioAnalyzer({
  fftSize: 2048,
  smoothingTimeConstant: 0.8
})

// Connect audio element
analyzer.connectAudioElement(audioElement)

// Get frequency data in render loop
const bands = analyzer.getFrequencyBands(8) // Returns Float32Array[8] with values 0-1
const audioBands = analyzer.getAudioBands() // Returns detailed bass, mid, treble values
const beatDetected = analyzer.detectBeat() // Returns boolean
```

### Audio Bands Mapping:
- **Bass**: 0-250 Hz (bands 0-1)
- **Low Mid**: 250-500 Hz (band 2)
- **Mid**: 500-2000 Hz (bands 3-4)
- **High Mid**: 2000-4000 Hz (band 5)
- **Treble**: 4000-8000 Hz (band 6)
- **Presence**: 8000-16000 Hz (band 7)

The analyzer provides smoothed, normalized values perfect for driving shader uniforms and creating fluid visual effects.