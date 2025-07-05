# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite web application named "shader-playground". Currently, it's a fresh Vite template that hasn't been customized for shader development yet.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Architecture

The project uses a standard Vite + React structure:

- **src/**: All source code
  - **main.tsx**: Application entry point that renders the React app
  - **App.tsx**: Main React component
  - **assets/**: Static assets used in components
- **public/**: Static files served directly
- **dist/**: Production build output (git-ignored)

## TypeScript Configuration

The project uses a composite TypeScript setup:
- **tsconfig.json**: Root configuration
- **tsconfig.app.json**: Application-specific settings
- **tsconfig.node.json**: Node.js tooling configuration

## Code Standards

- ESLint is configured with TypeScript and React rules
- The project uses ES modules (`"type": "module"`)
- React 19.1.0 with TypeScript strict mode enabled