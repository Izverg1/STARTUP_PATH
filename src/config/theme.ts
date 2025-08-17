export const theme = {
  name: 'SOL:GEN for startups™',
  company: 'Karlson LLC',
  colors: {
    // Clean Light Theme
    light: {
      background: '#ffffff',
      surface: '#f9fafb',
      muted: '#e5e7eb',
      text: '#111827',
      textDim: '#6b7280',
      accent: '#0066FF', // Blue for agents
      ring: '#7c7c7c',
      border: '#e5e7eb',
    },
  },
  layout: {
    agentDock: 96, // px
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