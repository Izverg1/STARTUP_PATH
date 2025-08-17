# Three.js Hero Landing Page Demo

## Components Created

### 1. HeroAnimation.tsx
- **Location**: `/src/components/three/HeroAnimation.tsx`
- **Features**:
  - Instanced points/lines orbiting "SOL:GEN for startups™" text
  - Performance optimized (5-8k points max, capped device pixel ratio)
  - Auto-pause on tab blur for battery saving
  - Smooth orbital animations with magenta accent colors
  - HTML overlay text for better performance vs 3D text

### 2. ChannelOrbitDiagram.tsx
- **Location**: `/src/components/three/ChannelOrbitDiagram.tsx`
- **Features**:
  - Radial "bullseye" visualization with mock channel data
  - Each dot represents a marketing channel
  - Sized by meetings per day (visual scaling)
  - Colored by payback efficiency bands (green=high, amber=medium, purple=low, red=negative)
  - Interactive hover tooltips showing channel details
  - Smooth transitions and animations

### 3. SVGFallback.tsx
- **Location**: `/src/components/three/SVGFallback.tsx`
- **Features**:
  - Pure SVG animations for when WebGL is unavailable
  - Maintains visual consistency with Three.js versions
  - Animated particles, orbital rings, and connecting lines
  - Responsive and accessible

### 4. WebGLCanvas.tsx
- **Location**: `/src/components/three/WebGLCanvas.tsx`
- **Features**:
  - WebGL detection and automatic fallback
  - Dynamic imports to avoid SSR issues
  - Error boundaries for Three.js failures
  - Loading states and graceful degradation

## Updated Files

### src/app/page.tsx
- Added Three.js hero animation as background
- Updated hero section with backdrop blur effects
- Added channel visualization demonstration section
- Maintained responsive design and accessibility

## Design Features

- **Magenta Accent**: Uses `#ff00aa` throughout for consistency
- **Performance**: Optimized for mobile devices and low-end hardware
- **Accessibility**: Supports reduced motion preferences
- **SSR Safe**: All components handle server-side rendering gracefully
- **Progressive Enhancement**: Falls back to SVG when WebGL unavailable

## Usage

```tsx
import { WebGLCanvas } from '@/components/three';

// Hero animation
<WebGLCanvas type="hero" className="w-full h-[500px]" />

// Channel diagram with custom data
<WebGLCanvas 
  type="channel-diagram" 
  className="w-full h-[400px]"
  data={channelData}
/>
```

## Demo Instructions

1. Run `npm run dev`
2. Visit the homepage to see the hero animation
3. Scroll down to see the channel orbit diagram
4. Try opening browser dev tools and disabling WebGL to see SVG fallbacks
5. Test on mobile devices for performance
6. Check tab switching for auto-pause behavior