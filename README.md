# Shader Playground 🎨🎵

An interactive audio-reactive shader visualization platform built with React, Three.js, and Web Audio API. Create stunning visual effects that respond to music in real-time!

[![React](https://img.shields.io/badge/React-19.1-blue)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-green)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple)](https://vitejs.dev/)

[Live Demo](https://shader-playground.vercel.app) | [Documentation](./CLAUDE.md) | [Issues](https://github.com/omkar-yelpale/shader-playground/issues)

## ✨ Features

### 🎵 Audio Input
- **File Upload**: Drag-and-drop support for MP3, WAV, OGG, and M4A files
- **Sample Library**: Pre-loaded audio samples for quick testing
- **Microphone Input**: Real-time audio capture from your microphone
- **Advanced Audio Analysis**: 
  - 8-band frequency decomposition
  - Real-time beat detection with spectral flux algorithm
  - Automatic gain normalization
  - Smoothing algorithms for fluid animations

### 🎨 Visual Effects
- **Waveform Visualizer**: 
  - Audio-driven vertex displacement
  - Smooth wave animations with configurable amplitude
  - Multiple wave patterns and color modes
- **Particle System**: 
  - 10,000+ particles responding to frequency bands
  - Dynamic size and color based on audio energy
  - Orbital motion with bass-driven turbulence
- **Fractal Noise**: 
  - Real-time fractal generation
  - Audio-modulated complexity and movement
  - Multiple noise octaves for rich visuals

### 🎛️ Real-time Controls
- **Visual Settings**: 
  - Effect selection with smooth transitions
  - Multiple color schemes (Spectrum, Monochrome, Gradient, Custom)
  - Brightness, contrast, and saturation controls
- **Audio Processing**: 
  - Adjustable sensitivity and smoothing
  - Individual frequency band boosts (Bass, Mid, Treble)
  - Beat detection threshold
- **Animation**: 
  - Variable speed control
  - Auto-rotation with configurable axis
  - Wireframe and solid rendering modes
- **Effect-specific Parameters**: 
  - Wave amplitude and frequency
  - Particle size and spread
  - Fractal complexity and scale
- **Presets**: Quick-access configurations
  - Default: Balanced settings
  - Energetic: High sensitivity, fast animations
  - Ambient: Smooth, flowing visuals
  - Intense: Maximum reactivity

### 📸 Additional Features
- **Screenshot Capture**: Export visualizations as high-quality PNG images
- **Fullscreen Mode**: Immersive, distraction-free experience
- **Performance Monitoring**: Real-time FPS display and stats
- **Responsive Design**: Optimized for all screen sizes
- **Loading States**: Smooth transitions and loading indicators
- **Keyboard Shortcuts**: Quick access to common actions

## Tech Stack

- **React 19.1** with TypeScript
- **Three.js** & React Three Fiber for 3D graphics
- **Vite** for fast development and building
- **Tailwind CSS** for modern UI styling
- **Leva** for real-time parameter controls
- **Web Audio API** for audio processing
- **Zustand** for state management
- **GLSL** shaders for visual effects

## Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/omkar-yelpale/shader-playground.git
cd shader-playground

# Install dependencies
yarn install

# Start development server
yarn dev
```

The app will be available at http://localhost:3000

### Build for Production

```bash
# Build the project
yarn build

# Preview production build
yarn preview
```

## 🚀 Quick Start

### Using the App

1. **Choose Audio Source**:
   - **Upload**: Drag and drop an audio file or click to browse
   - **Sample Library**: Select from pre-loaded audio samples
   - **Microphone**: Click "Use Microphone" for live input

2. **Select Visualization**:
   - **Waveform**: Flowing 3D waves that dance with the music
   - **Particles**: Swirling particle cloud responding to frequencies
   - **Fractal**: Evolving fractal patterns driven by audio

3. **Customize Your Experience**:
   - Open the control panel (gear icon)
   - Adjust visual effects, colors, and sensitivity
   - Try different presets for instant transformations

4. **Capture & Share**:
   - Take screenshots with the camera button
   - Toggle fullscreen for immersive viewing
   - Share your creations on social media

## 📁 Project Structure

```
shader-playground/
├── public/
│   └── audio-samples/    # Pre-loaded audio files
├── src/
│   ├── components/
│   │   ├── Scene/        # Three.js scene setup
│   │   ├── AudioReactive/# Visualization components
│   │   ├── UI/          # Interface components
│   │   └── Layout/      # App structure
│   ├── shaders/
│   │   ├── audioReactive/# GLSL shader files
│   │   └── materials/   # Custom materials
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utilities & helpers
│   ├── types/           # TypeScript types
│   └── stores/          # State management
├── CLAUDE.md            # AI assistant guide
└── README.md            # This file
```

## Controls Reference

### Visual Controls
- **Effect**: Choose between Waveform, Particles, or Fractal
- **Color Scheme**: Spectrum (colorful), Monochrome (grayscale), or Gradient
- **Brightness/Contrast**: Adjust visual intensity

### Audio Controls  
- **Sensitivity**: How reactive the visuals are to audio
- **Smoothing**: Smooth out rapid changes in audio
- **Bass/Mid/Treble Boost**: Emphasize specific frequency ranges

### Animation Controls
- **Speed**: Animation playback speed
- **Rotation**: Enable auto-rotation
- **Wireframe**: Show mesh wireframes

## 🛠️ Development

### Commands

```bash
# Development
yarn dev        # Start dev server (http://localhost:3000)
yarn lint       # Run ESLint checks
yarn build      # Build for production
yarn preview    # Preview production build
```

### Adding New Visualizations

1. **Create Shader Files**:
   ```glsl
   // src/shaders/audioReactive/myEffect.vert
   // src/shaders/audioReactive/myEffect.frag
   ```

2. **Create Material**:
   ```typescript
   // src/shaders/materials/MyEffectMaterial.ts
   export class MyEffectMaterial extends ShaderMaterial {
     // Implementation
   }
   ```

3. **Add TypeScript Declaration**:
   ```typescript
   // src/types/materials.d.ts
   declare module '@/shaders/materials/MyEffectMaterial'
   ```

4. **Update Visualization Component**:
   - Add to `AudioReactiveMesh` component
   - Update effect selection logic

## ⚡ Performance Optimization

### Tips for Smooth Performance
- **Frame Skip**: Enable for lower-end devices
- **Particle Count**: Reduce for better FPS
- **Quality Settings**: Adjust based on hardware
- **Browser**: Use Chrome for best WebGL performance
- **GPU**: Dedicated graphics recommended

### Troubleshooting
- **Low FPS**: Try reducing particle count or enabling frame skip
- **Audio Lag**: Check browser permissions for microphone
- **Visual Artifacts**: Update graphics drivers
- **Loading Issues**: Clear browser cache

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Recommended |
| Firefox | 88+     | ✅ Supported |
| Safari  | 14+     | ✅ Supported |
| Edge    | 90+     | ✅ Supported |

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure ESLint passes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - React renderer for Three.js
- [Leva](https://github.com/pmndrs/leva) - GUI controls for React
- [Vite](https://vitejs.dev/) - Build tool
- Audio samples from [Freesound](https://freesound.org/)

## 📞 Contact

- **Author**: Omkar Yelpale
- **GitHub**: [@omkar-yelpale](https://github.com/omkar-yelpale)
- **Issues**: [Report a bug](https://github.com/omkar-yelpale/shader-playground/issues)

---

Made with ❤️ by [Omkar Yelpale](https://github.com/omkar-yelpale)