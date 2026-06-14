import { Canvas } from '@react-three/fiber';
import OrbitalCloud from './components/OrbitalCloud';

export default function App() {
  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white">
      
      {/* 1. THE BACKGROUND CANVAS 
        Fixed to the viewport, pushed behind the UI, with DPR clamped for mobile performance.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas 
          camera={{ position: [0, 0, 4], fov: 45 }} 
          dpr={[1, 2]} // Performance guardrail: max 2x pixel ratio
          gl={{ antialias: false }} // Raymarching doesn't need standard geometry antialiasing
        >
          <OrbitalCloud />
        </Canvas>
      </div>

      {/* 2. THE FOREGROUND UI 
        This is where your Figma team will build the actual site components.
        We've made it 300vh tall so you have plenty of room to scroll and trigger the morph!
      */}
      <div className="relative z-10 w-full">
        
        {/* Section 1: 1s Orbital State */}
        <section className="h-screen flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            Quantum Design
          </h1>
          <p className="text-xl text-gray-400">
            Scroll down to morph the probability field.
          </p>
        </section>

        {/* Section 2: Mid-morph / 2pz Orbital State */}
        <section className="h-screen flex flex-col items-center justify-center pointer-events-none">
          <h2 className="text-4xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-500">
            Phase Transition
          </h2>
        </section>

        {/* Section 3: Final State */}
        <section className="h-screen flex flex-col items-center justify-center pointer-events-none">
          <h2 className="text-4xl font-semibold text-white">
            End of Timeline
          </h2>
        </section>

      </div>
    </div>
  );
}