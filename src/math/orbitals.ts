// src/math/orbitals.ts

// Calculates (r, theta) from (x, y, z)
export const getSphericalCoords = (x: number, y: number, z: number) => {
  const r = Math.sqrt(x * x + y * y + z * z);
  
  const theta = r === 0 ? 0 : Math.acos(z / r);
  
  return { r, theta };
};



export enum OrbitalType {
  State1s,
  State2pz
};

export const calculateWavefunction = (r: number, theta: number, type: OrbitalType): number => {

  switch (type) {
    case OrbitalType.State1s:
      return Math.exp(-(r * 3));

    case OrbitalType.State2pz:
      return (r * 5) * Math.exp(-(r * 5) / 2) * Math.cos(theta);

    default:
      return 0;
  }
};