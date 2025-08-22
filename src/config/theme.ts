export const theme = {
  name: 'STARTUP_PATH for startups™',
  company: 'KARLSON LLC',
  website: 'https://iamkarlson.com',
  colors: {
    // Dark Theme (Primary)
    dark: {
      background: '#0a0a0a',
      surface: '#151515',
      muted: '#27272a',
      text: '#fafafa',
      textDim: '#a1a1aa',
      accent: '#ff00aa', // Magenta for agents
      ring: '#ff00aa',
      border: '#27272a',
    },
    // Clean Light Theme (Secondary)
    light: {
      background: '#ffffff',
      surface: '#f9fafb',
      muted: '#e5e7eb',
      text: '#111827',
      textDim: '#6b7280',
      accent: '#ff00aa', // Magenta for agents
      ring: '#ff00aa',
      border: '#e5e7eb',
    },
  },
  layout: {
    agentDock: 140, // px - increased for better agent display
    mainContentMin: 720, // px
    mainContentMax: 1280, // px
    artifactsSidebar: 320, // px
  },
  animation: {
    microInteraction: 90, // ms
    statusAnimation: 120, // ms
  },
  spacing: {
    grid: 8, // px base grid
  },
  accessibility: {
    contrastRatio: 4.5,
    focusRingWidth: 2,
    focusRingOffset: 2,
  },
} as const

export type Theme = typeof theme