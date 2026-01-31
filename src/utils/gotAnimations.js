// Game of Thrones Animation Controller
import { useEffect, useRef } from 'react';

export const useGOTAnimations = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    
    // Scroll-based animations
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Update scroll progress
      const scrollPercent = Math.min((scrollY / (documentHeight - windowHeight)) * 100, 100);
      const progressBar = document.querySelector('.got-scroll-progress > div');
      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }

      // Parallax effects for background layers
      const mountains = document.querySelector('.mountains-layer');
      const castles = document.querySelector('.castles-layer');  
      const dragons = document.querySelector('.dragons-layer');

      if (mountains) mountains.style.transform = `translateY(${scrollY * 0.3}px) translateZ(-3px) scale(4)`;
      if (castles) castles.style.transform = `translateY(${scrollY * 0.5}px) translateZ(-2px) scale(3)`;
      if (dragons) dragons.style.transform = `translateY(${scrollY * 0.2}px) translateZ(-1px) scale(2)`;

      // Trigger section animations
      const sections = document.querySelectorAll('.scroll-section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < windowHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible) {
          section.classList.add('in-view');
          
          // Add staggered animation delay for child elements
          const cards = section.querySelectorAll('.glass-card');
          cards.forEach((card, cardIndex) => {
            setTimeout(() => {
              card.classList.add('in-view');
            }, cardIndex * 200);
          });
        }
      });

      // Dynamic background color changes based on scroll
      const body = document.body;
      const scrollRatio = scrollY / (documentHeight - windowHeight);
      
      if (scrollRatio < 0.25) {
        // Night theme
        body.style.setProperty('--dynamic-bg', 'var(--got-midnight)');
      } else if (scrollRatio < 0.5) {
        // Dawn theme  
        body.style.setProperty('--dynamic-bg', 'var(--got-dark-blue)');
      } else if (scrollRatio < 0.75) {
        // Dusk theme
        body.style.setProperty('--dynamic-bg', '#2d3748');
      } else {
        // Fire theme
        body.style.setProperty('--dynamic-bg', '#1a1a2e');
      }
    };

    // Smooth scroll handling
    const throttledScroll = () => {
      if (animationFrameId) return;
      
      animationFrameId = requestAnimationFrame(() => {
        handleScroll();
        animationFrameId = null;
      });
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return animationRef;
};

// Particle system generator
export const createParticleSystem = () => {
  const container = document.querySelector('.particles-container');
  if (!container) return;

  // Clear existing particles
  container.innerHTML = '';

  // Create snow particles
  const createSnowParticles = () => {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'snow-particle';
      particle.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        animation-duration: ${Math.random() * 10 + 8}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: ${Math.random() * 0.8 + 0.2};
      `;
      container.appendChild(particle);
    }
  };

  // Create fire particles  
  const createFireParticles = () => {
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'fire-particle';
      particle.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: 0;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        animation-duration: ${Math.random() * 6 + 4}s;
        animation-delay: ${Math.random() * 4}s;
        opacity: ${Math.random() * 0.7 + 0.3};
      `;
      container.appendChild(particle);
    }
  };

  createSnowParticles();
  createFireParticles();

  // Recreate particles periodically
  setInterval(() => {
    createSnowParticles();
  }, 20000);

  setInterval(() => {
    createFireParticles();  
  }, 15000);
};

// Mouse interaction effects
export const addMouseEffects = () => {
  let mouseX = 0;
  let mouseY = 0;

  const handleMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Parallax mouse effects
    const sigils = document.querySelectorAll('.got-sigil');
    const swords = document.querySelectorAll('.floating-sword');

    sigils.forEach((sigil, index) => {
      const speed = (index + 1) * 0.05;
      const x = (mouseX - window.innerWidth / 2) * speed;
      const y = (mouseY - window.innerHeight / 2) * speed;
      sigil.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.1}deg)`;
    });

    swords.forEach((sword, index) => {
      const speed = (index + 1) * 0.03;
      const x = (mouseX - window.innerWidth / 2) * speed;
      const y = (mouseY - window.innerHeight / 2) * speed;
      sword.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.05}deg)`;
    });
  };

  document.addEventListener('mousemove', handleMouseMove);
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };
};

// Audio controller (optional)
export const initAudioController = () => {
  // You can add ambient sounds here
  // const ambientSound = new Audio('/assets/sounds/got-ambient.mp3');
  // ambientSound.loop = true;
  // ambientSound.volume = 0.1;
  
  // Return controls for play/pause
  return {
    play: () => {
      // ambientSound.play().catch(() => {});
    },
    pause: () => {
      // ambientSound.pause();
    }
  };
};