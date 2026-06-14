// src/math/textureGenerator.ts
import * as THREE from 'three';
import { calculateWavefunction, getSphericalCoords, OrbitalType } from './orbitals';
import { ORBITAL_CONFIG } from '../config/orbitalTimeline';

// 32x32x32 is the performance guardrail for mobile
const GRID_SIZE = ORBITAL_CONFIG.graphics.gridSize; 
// The physical size of the box for the math 
const SPATIAL_BOUNDS = ORBITAL_CONFIG.graphics.spatialBounds; 

export const generateOrbitalTexture = (type: OrbitalType): THREE.Data3DTexture => {
  const size = GRID_SIZE * GRID_SIZE * GRID_SIZE;
  const data = new Float32Array(size);

  let index = 0;

  for (let z = 0; z < GRID_SIZE; z++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        
        // Map grid indices (0 to 31) to physical coordinates (-2.0 to 2.0)
        const px = ((x / (GRID_SIZE - 1)) * 2 - 1) * SPATIAL_BOUNDS;
        const py = ((y / (GRID_SIZE - 1)) * 2 - 1) * SPATIAL_BOUNDS;
        const pz = ((z / (GRID_SIZE - 1)) * 2 - 1) * SPATIAL_BOUNDS;

        // Get spherical coords and calculate probability
        const { r, theta } = getSphericalCoords(px, py, pz);
        const wavefunctionValue = calculateWavefunction(r, theta, type);

        // Store in the flat array
        data[index] = wavefunctionValue;
        index++;
      }
    }
  }

  // Package the data into a Three.js 3D Texture
  const texture = new THREE.Data3DTexture(data, GRID_SIZE, GRID_SIZE, GRID_SIZE);
  
  // We only have one channel of data (probability), so we use RedFormat
  texture.format = THREE.RedFormat;
  texture.type = THREE.FloatType;
  
  // Linear filtering tells the GPU to smoothly interpolate between our 32x32x32 points
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  // Prevent edges from wrapping around to the other side
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.wrapR = THREE.ClampToEdgeWrapping;
  
  // Crucial: Must set needsUpdate so WebGL actually uploads it to the GPU
  texture.needsUpdate = true;

  return texture;
};