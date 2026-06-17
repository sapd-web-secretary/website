// src/config/orbitalTimeline.ts
import { OrbitalType } from '../math/orbitals';

export interface MorphStep {
  startScroll: number; // 0.0 to 1.0
  endScroll: number;   // 0.0 to 1.0
  fromOrbital: OrbitalType;
  toOrbital: OrbitalType;
}

export const ORBITAL_CONFIG = {
  colors: {
    positive: '#00f2fe', // Glowing cyan
    negative: '#4facfe', // Deep blue
    background: {
      centerColor: '#050505',
      edgeColor: '#00001a',
      
      // 'centerStop' controls how far out the center color stays solid before fading.
      // 'edgeStop' controls where the edge color becomes completely solid.
      centerStop: '20%',  // e.g., '0%' = smooth fade immediately, '50%' = massive solid center
      edgeStop: '100%',   // e.g., '80%' = edge color creeps further into the screen
      
      // 'position' moves the origin of the gradient. 
      // '50% 50%' is dead center. '50% 30%' moves it slightly up.
      position: 'center', 
      
      // 'circle' forces a perfect sphere. 'ellipse' stretches it to the screen's aspect ratio.
      shape: 'circle',    

      // Toggle between 'fixed' (stays locked) or 'scroll' (moves with page)
      attachment: 'fixed',
    }
  },

  graphics: {
    gridSize: 64,              // 32 for mobile performance, 64 for crisp desktop look
    spatialBounds: 2.0,        // Boundary window of the quantum math
    maxSteps: 100,             // Number of raymarching iterations
    stepSize: 0.02,            // Distance of each ray step
    edgeMaskStart: 0.95,       // Fades cube edges out. Pushing closer to 1.0 makes orbital larger
    edgeMaskEnd: 0.75,         // Where the edge fade begins its falloff
    densityMultiplier: 10.0,   // Controls visual brightness / opacity glow

    desktopScale: 2.0,              // Makes the orbital larger on desktop
    mobileViewportThreshold: 3.0,   // The viewport width where it starts shrinking for mobile
  },

  animation: {
    rotationSpeedY: 0.55,
    rotationSpeedZ: 0.05,
  },

  // Define your scroll timeline steps here
  timeline: [
    { startScroll: 0.0, endScroll: 1.0, fromOrbital: OrbitalType.State1s,  toOrbital: OrbitalType.State2pz },
  ] as MorphStep[]
};