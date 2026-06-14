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
    background: '#050505'
  },

  graphics: {
    gridSize: 64,              // 32 for mobile performance, 64 for crisp desktop look
    spatialBounds: 2.0,        // Boundary window of the quantum math
    maxSteps: 100,             // Number of raymarching iterations
    stepSize: 0.02,            // Distance of each ray step
    edgeMaskStart: 0.98,       // Fades cube edges out. Pushing closer to 1.0 makes orbital larger
    edgeMaskEnd: 0.75,         // Where the edge fade begins its falloff
    densityMultiplier: 10.0,   // Controls visual brightness / opacity glow
  },

  animation: {
    rotationSpeedY: 0.25,
    rotationSpeedZ: 0.05,
  },

  // Define your scroll timeline steps here
  timeline: [
    { startScroll: 0.0, endScroll: 1.0, fromOrbital: OrbitalType.State1s,  toOrbital: OrbitalType.State2pz },
  ] as MorphStep[]
};