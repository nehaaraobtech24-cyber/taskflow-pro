import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

function ParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
          },
          links: {
            color: '#667eea',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 2,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 100,
          },
          opacity: {
            value: 0.7,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 2, max: 5 },
          },
        },
        detectRetina: true,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
}

export default ParticleBackground;