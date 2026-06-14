// src/components/OrbitalCloud.tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ORBITAL_CONFIG } from '../config/orbitalTimeline';
import { generateOrbitalTexture } from '../math/textureGenerator';
import { OrbitalType } from '../math/orbitals';

const vertexShader = `
  varying vec3 vLocalPosition;
  varying vec3 vRayDirection;
  void main() {
    vLocalPosition = position;
    vRayDirection = position - vec3(inverse(modelMatrix) * vec4(cameraPosition, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
uniform sampler3D uTextureA;
uniform sampler3D uTextureB;
uniform float uMix;
uniform vec3 uColorPos;
uniform vec3 uColorNeg;

// Config-controlled uniforms passed from React
uniform float uEdgeMaskStart;
uniform float uEdgeMaskEnd;
uniform float uDensityMultiplier;

varying vec3 vLocalPosition;
varying vec3 vRayDirection;

const int MAX_STEPS = 100;
const float STEP_SIZE = 0.02;

void main() {
    vec3 rayPos = vLocalPosition;
    vec3 rayDir = normalize(vRayDirection);
    
    vec4 accumulatedColor = vec4(0.0);
    
    for (int i = 0; i < MAX_STEPS; i++) {
        if (any(greaterThan(abs(rayPos), vec3(1.0)))) break;
        
        vec3 texCoord = rayPos * 0.5 + 0.5;
        
        float valA = texture(uTextureA, texCoord).r;
        float valB = texture(uTextureB, texCoord).r;
        
        float mixedVal = mix(valA, valB, uMix);
        
        // Dynamically configured edge-fading boundary mask
        float edgeMask = smoothstep(uEdgeMaskStart, uEdgeMaskEnd, length(rayPos));
        float density = (mixedVal * mixedVal) * edgeMask;
        
        if (density > 0.005) {
            vec3 sampleColor = (mixedVal > 0.0) ? uColorPos : uColorNeg;
            
            // Scaled dynamically by our multiplier uniform
            float alpha = density * STEP_SIZE * uDensityMultiplier; 
            vec4 colorSample = vec4(sampleColor * alpha, alpha);
            accumulatedColor += colorSample * (1.0 - accumulatedColor.a);
            
            if (accumulatedColor.a >= 0.95) break;
        }
        rayPos += rayDir * STEP_SIZE;
    }
    
    gl_FragColor = accumulatedColor;
}
`;

export default function OrbitalCloud() {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const textures = useMemo(() => {
    return {
      [OrbitalType.State1s]: generateOrbitalTexture(OrbitalType.State1s),
      [OrbitalType.State2pz]: generateOrbitalTexture(OrbitalType.State2pz),
    };
  }, []);

  const colorPos = useMemo(() => new THREE.Color(ORBITAL_CONFIG.colors.positive), []);
  const colorNeg = useMemo(() => new THREE.Color(ORBITAL_CONFIG.colors.negative), []);

  useFrame((state) => {
    if (!shaderRef.current || !meshRef.current) return;

    // 1. Core Animations driven directly from the Config file
    const time = performance.now() * 0.001;
    meshRef.current.rotation.y = time * ORBITAL_CONFIG.animation.rotationSpeedY;
    meshRef.current.rotation.z = time * ORBITAL_CONFIG.animation.rotationSpeedZ;

    // 2. Automated Mobile Safe Scale Optimization
    // If the 3D scene viewport width narrows, scale down the box to prevent side clipping
    const baseScale = 1.0;
    if (state.viewport.width < 2.6) {
      const responsiveFactor = state.viewport.width / 2.6;
      meshRef.current.scale.setScalar(responsiveFactor);
    } else {
      meshRef.current.scale.setScalar(baseScale);
    }

    // 3. Scroll calculations
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const globalScroll = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

    const currentStep = ORBITAL_CONFIG.timeline.find(
      (step) => globalScroll >= step.startScroll && globalScroll <= step.endScroll
    ) || ORBITAL_CONFIG.timeline[0];

    const stepRange = currentStep.endScroll - currentStep.startScroll;
    const rawMix = (globalScroll - currentStep.startScroll) / stepRange;
    const localMix = Math.max(0.0, Math.min(1.0, rawMix));

    // 4. Update standard uniforms
    shaderRef.current.uniforms.uTextureA.value = textures[currentStep.fromOrbital];
    shaderRef.current.uniforms.uTextureB.value = textures[currentStep.toOrbital];
    shaderRef.current.uniforms.uMix.value = localMix;

    // 5. Update graphics configuration uniforms instantly on frame loop
    shaderRef.current.uniforms.uEdgeMaskStart.value = ORBITAL_CONFIG.graphics.edgeMaskStart;
    shaderRef.current.uniforms.uEdgeMaskEnd.value = ORBITAL_CONFIG.graphics.edgeMaskEnd;
    shaderRef.current.uniforms.uDensityMultiplier.value = ORBITAL_CONFIG.graphics.densityMultiplier;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
        uniforms={{
          uTextureA: { value: textures[OrbitalType.State1s] },
          uTextureB: { value: textures[OrbitalType.State2pz] },
          uMix: { value: 0.0 },
          uColorPos: { value: colorPos },
          uColorNeg: { value: colorNeg },
          uEdgeMaskStart: { value: ORBITAL_CONFIG.graphics.edgeMaskStart },
          uEdgeMaskEnd: { value: ORBITAL_CONFIG.graphics.edgeMaskEnd },
          uDensityMultiplier: { value: ORBITAL_CONFIG.graphics.densityMultiplier },
        }}
      />
    </mesh>
  );
}