// src/App.tsx
import { Canvas } from '@react-three/fiber';
import OrbitalCloud from './components/OrbitalCloud';
import { ORBITAL_CONFIG } from './config/orbitalTimeline'; // Import the config!

export default function App() {
  const bg = ORBITAL_CONFIG.colors.background;

  return (
    <div 
      className="relative w-full min-h-screen text-white"
      style={{
        background: `radial-gradient(${bg.shape} at ${bg.position}, ${bg.centerColor} ${bg.centerStop}, ${bg.edgeColor} ${bg.edgeStop})`,
        // This controls whether the background moves with the scroll or stays locked
        backgroundAttachment: bg.attachment as 'fixed' | 'scroll',
        // Ensure the background covers the whole area even if it's fixed
        backgroundSize: '100% 100%' 
      }}
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas 
          camera={{ position: [0, 0, 4], fov: 45 }} 
          dpr={[1, 2]} 
          gl={{ antialias: false }} 
        >
          <OrbitalCloud />
        </Canvas>
      </div>

      <div className="relative z-10 w-full">
        {/* ... Keep all your section HTML exactly the same ... */}
        <section className="h-screen flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            Quantum Design
          </h1>
          <p className="text-xl text-gray-400">
            Scroll down to morph the probability field.
          </p>
        </section>

        <section className="h-screen flex flex-col items-center justify-center pointer-events-none">
          <h2 className="text-4xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-500">
            Phase Transition
          </h2>
        </section>

        <section className="h-screen flex flex-col items-center justify-center pointer-events-none">
          <h2 className="text-4xl font-semibold text-white">
            End of Timeline
          </h2>
        </section>
      </div>
    </div>
  );
}