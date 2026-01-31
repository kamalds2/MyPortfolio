// 3D Interactive Map Animation Controller
import { useEffect, useRef, useState } from 'react';

export const use3DMapAnimations = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const mapRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercent = Math.min((scrollY / (documentHeight - windowHeight)) * 100, 100);
      
      setScrollProgress(scrollPercent);

      // Update scroll progress bar
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }

      // Subtle 3D Map Transformations based on scroll
      const mapLayers = document.querySelectorAll('.map-layer');
      mapLayers.forEach((layer, index) => {
        const speed = (index + 1) * 0.1; // Reduced speed
        const rotationY = (scrollPercent / 100) * 5 - 2.5; // -2.5 to +2.5 degrees (reduced)
        const rotationX = Math.sin((scrollPercent / 100) * Math.PI) * 2; // Subtle tilt (reduced)
        const translateY = scrollY * 0.05 * (index + 1); // Reduced movement
        
        // Base transforms for each layer
        let baseTransform = '';
        if (layer.classList.contains('layer-1')) {
          baseTransform = `translateZ(-50px) scale(1.05)`;
        } else if (layer.classList.contains('layer-2')) {
          baseTransform = `translateZ(-25px) scale(1.025)`;
        } else if (layer.classList.contains('layer-3')) {
          baseTransform = `translateZ(0px) scale(1)`;
        }
        
        // Apply smooth scroll-based transform
        layer.style.transform = `
          ${baseTransform}
          rotateY(${rotationY}deg) 
          rotateX(${rotationX}deg)
          translateY(${translateY}px)
        `;
      });

      // Update map markers based on scroll position
      updateMapMarkers(scrollPercent);
      
      // Update active section
      updateActiveSection();
    };

    const updateMapMarkers = (scrollPercent) => {
      const markers = document.querySelectorAll('.map-marker');
      markers.forEach((marker, index) => {
        const delay = index * 0.2;
        const progress = Math.max(0, Math.min(1, (scrollPercent / 20) - delay));
        
        // Animate marker appearance
        if (progress > 0) {
          marker.style.opacity = Math.min(1, progress * 2);
          marker.style.transform = `
            translateY(${(1 - progress) * 50}px) 
            scale(${0.5 + progress * 0.5})
          `;
        }

        // Update marker positions based on scroll (parallax effect)
        const baseTransform = marker.style.transform;
        const parallaxOffset = scrollPercent * 0.5;
        marker.style.transform = `${baseTransform} translateX(${parallaxOffset}px)`;
      });
    };

    const updateActiveSection = () => {
      const sections = document.querySelectorAll('.scroll-section');
      const scrollPos = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const sectionBottom = sectionTop + rect.height;

        if (scrollPos >= sectionTop && scrollPos <= sectionBottom) {
          const sectionNames = ['hero', 'about', 'skills', 'projects', 'experience', 'education'];
          setActiveSection(sectionNames[index] || 'hero');
          
          // Update navigation dots
          const navDots = document.querySelectorAll('.nav-dot');
          navDots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === index);
          });

          // Update marker states
          const markers = document.querySelectorAll('.map-marker');
          markers.forEach((marker) => {
            marker.classList.remove('active');
          });
          
          const activeMarker = document.querySelector(`.marker-${sectionNames[index]}`);
          if (activeMarker) {
            activeMarker.classList.add('active');
          }
        }

        // Trigger section animations
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
          section.classList.add('in-view');
        }
      });
    };

    // Smooth scroll handling
    const throttledScroll = () => {
      if (animationFrameId) return;
      
      animationFrameId = requestAnimationFrame(() => {
        handleScroll();
        animationFrameId = null;
      });
    };

    // Handle window resize for map repositioning
    const handleResize = () => {
      const mapLayers = document.querySelectorAll('.map-layer');
      mapLayers.forEach((layer) => {
        // Reset transform on resize to prevent breaking
        if (layer.classList.contains('layer-1')) {
          layer.style.transform = 'translateZ(-50px) scale(1.05)';
        } else if (layer.classList.contains('layer-2')) {
          layer.style.transform = 'translateZ(-25px) scale(1.025)';
        } else if (layer.classList.contains('layer-3')) {
          layer.style.transform = 'translateZ(0px) scale(1)';
        }
      });
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return { scrollProgress, activeSection, mapRef };
};

// Mouse interaction effects for 3D map
export const addMapMouseEffects = () => {
  let mouseX = 0;
  let mouseY = 0;
  let animationId = null;

  const handleMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (animationId) return;

    animationId = requestAnimationFrame(() => {
      // Calculate mouse position as percentage with reduced sensitivity
      const mouseXPercent = (mouseX / window.innerWidth - 0.5) * 0.5; // -0.25 to 0.25
      const mouseYPercent = (mouseY / window.innerHeight - 0.5) * 0.5; // -0.25 to 0.25

      // Apply subtle parallax effect to map layers
      const mapLayers = document.querySelectorAll('.map-layer');
      mapLayers.forEach((layer, index) => {
        const intensity = (index + 1) * 0.01; // Reduced intensity
        const translateX = mouseXPercent * intensity * 20; // Reduced movement
        const translateY = mouseYPercent * intensity * 15; // Reduced movement
        
        // Get base transform values
        let baseTransform = '';
        if (layer.classList.contains('layer-1')) {
          baseTransform = 'translateZ(-50px) scale(1.05)';
        } else if (layer.classList.contains('layer-2')) {
          baseTransform = 'translateZ(-25px) scale(1.025)';
        } else if (layer.classList.contains('layer-3')) {
          baseTransform = 'translateZ(0px) scale(1)';
        }

        // Apply smooth transform with mouse offset
        layer.style.transform = `${baseTransform} translateX(${translateX}px) translateY(${translateY}px)`;
      });

      animationId = null;
    });

    // Interactive marker effects
    const markers = document.querySelectorAll('.map-marker, .project-marker');
    markers.forEach((marker) => {
      const rect = marker.getBoundingClientRect();
      const markerCenterX = rect.left + rect.width / 2;
      const markerCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(mouseX - markerCenterX, 2) + Math.pow(mouseY - markerCenterY, 2)
      );
      
      // Add hover glow effect
      if (distance < 100) {
        const intensity = 1 - (distance / 100);
        marker.style.boxShadow = `
          0 10px 30px rgba(37, 99, 235, ${0.15 + intensity * 0.3}),
          0 0 ${20 + intensity * 30}px rgba(37, 99, 235, ${0.3 + intensity * 0.4})
        `;
      } else {
        marker.style.boxShadow = `
          0 10px 30px rgba(37, 99, 235, 0.15),
          0 0 20px rgba(37, 99, 235, 0.3)
        `;
      }
    });
  };

  document.addEventListener('mousemove', handleMouseMove);
  
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };
};

// Project marker management
export const createProjectMarkers = (projects) => {
  const container = document.querySelector('.map-markers-container');
  if (!container || !projects) return;

  // Predefined positions for project markers
  const projectPositions = [
    { top: '25%', left: '30%' },
    { top: '40%', left: '60%' },
    { top: '65%', left: '20%' },
    { top: '50%', left: '75%' },
    { top: '80%', left: '50%' },
    { top: '30%', left: '80%' },
  ];

  projects.forEach((project, index) => {
    if (index >= projectPositions.length) return;

    const marker = document.createElement('div');
    marker.className = 'project-marker';
    marker.style.top = projectPositions[index].top;
    marker.style.left = projectPositions[index].left;
    marker.setAttribute('data-project-id', project.id);
    marker.setAttribute('title', project.title || project.name || 'Project');

    // Create marker content
    if (project.imageUrl && project.imageUrl.trim()) {
      const img = document.createElement('img');
      img.src = project.imageUrl;
      img.alt = project.title || project.name || 'Project';
      marker.appendChild(img);
    } else {
      // Use first letter of project title
      const projectTitle = project.title || project.name || 'P';
      marker.textContent = projectTitle.charAt(0).toUpperCase();
      marker.style.fontSize = '1.2rem';
      marker.style.fontWeight = 'bold';
      marker.style.color = 'var(--primary-blue)';
    }

    // Add click handler
    marker.addEventListener('click', () => {
      // Navigate to project or show details
      console.log('Project clicked:', project.title || project.name);
      // You can add navigation logic here
    });

    container.appendChild(marker);
  });
};

// Navigation controls
export const initializeMapNavigation = () => {
  const navContainer = document.querySelector('.map-navigation');
  if (!navContainer) return;

  const sections = ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Education'];
  
  sections.forEach((section, index) => {
    const dot = document.createElement('div');
    dot.className = 'nav-dot';
    dot.setAttribute('title', section);
    
    dot.addEventListener('click', () => {
      const targetSection = document.querySelectorAll('.scroll-section')[index];
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    navContainer.appendChild(dot);
  });
};

// Smooth section transitions with map animations
export const scrollToSection = (sectionName) => {
  const sections = document.querySelectorAll('.scroll-section');
  const sectionIndex = ['hero', 'about', 'skills', 'projects', 'experience', 'education'].indexOf(sectionName);
  
  if (sectionIndex >= 0 && sections[sectionIndex]) {
    sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
  }
};