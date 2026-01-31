import React, { useState, useEffect } from 'react';

export default function Projects({ projects = [], onProjectClick, getImagePath, mouseX = 0, interactive = false }) {
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // Auto-slide images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      projects.forEach(project => {
        const images = getProjectImages(project);
        if (images.length > 1) {
          setCurrentImageIndex(prev => ({
            ...prev,
            [project.id]: ((prev[project.id] || 0) + 1) % images.length
          }));
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [projects]);

  // Mouse-controlled project navigation in interactive mode
  useEffect(() => {
    if (interactive && projects.length > 0) {
      const windowWidth = window.innerWidth;
      const projectIndex = Math.floor((mouseX / windowWidth) * projects.length);
      setActiveProjectIndex(Math.min(projectIndex, projects.length - 1));
    }
  }, [mouseX, interactive, projects.length]);

  const getProjectImages = (project) => {
    // Check for imageUrlsList first, then imageUrls, then fallback to images
    let imageData = project.imageUrlsList || project.imageUrls || project.images || '';
    
    if (!imageData) return [];
    
    // If it's already an array, use it
    if (Array.isArray(imageData)) {
      return imageData.map(imagePath => getImagePath ? getImagePath(imagePath, 'projects') : imagePath);
    }
    
    // Handle comma-separated images
    const imageNames = imageData.split(',').map(img => img.trim()).filter(img => img);
    return imageNames.map(imageName => getImagePath ? getImagePath(imageName, 'projects') : imageName);
  };

  const handleImageNavigation = (projectId, direction) => {
    const project = projects.find(p => p.id === projectId);
    const images = getProjectImages(project);
    const currentIndex = currentImageIndex[projectId] || 0;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex + 1 >= images.length ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
    }
    
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: newIndex
    }));
  };

  const setActiveImage = (projectId, index) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: index
    }));
  };

  const formatTechStack = (techStack) => {
    if (!techStack) return [];
    if (Array.isArray(techStack)) return techStack;
    return techStack.split(',').map(tech => tech.trim()).filter(tech => tech);
  };

  if (!projects || projects.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem',
        color: 'var(--text-secondary)' 
      }}>
        <p>No projects available.</p>
      </div>
    );
  }

  return (
    <div className={`projects-grid ${interactive ? 'projects-grid--interactive' : ''}`}>
      {projects.map((project, index) => {
        const images = getProjectImages(project);
        const currentIndex = currentImageIndex[project.id] || 0;
        const techStack = formatTechStack(project.techStack);
        const isActive = interactive ? index === activeProjectIndex : true;
        
        return (
          <div
            key={project.id}
            className={`project-card scale-in ${isActive ? 'project-card--active' : 'project-card--inactive'}`}
            onClick={() => onProjectClick && onProjectClick(project.id)}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              opacity: isActive ? 1 : 0.7,
              transform: isActive ? 'scale(1)' : 'scale(0.95)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.15)'
            }}
          >
            {/* Project Image Gallery */}
            <div className="project-card__gallery">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentIndex]}
                    alt={project.title}
                    className="project-card__image"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjMUExQTFBIi8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDIyNVYxNTBIMTc1VjEwMFoiIGZpbGw9IiM0Qjc2ODgiLz4KPHBhdGggZD0iTTE1MCA3NUgyNTBWMTc1SDE1MFY3NVoiIHN0cm9rZT0iIzRCNzY4OCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNzE3MTdBIiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPlByb2plY3QgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
                    }}
                  />
                  
                  {/* Image Navigation Dots */}
                  {images.length > 1 && (
                    <div className="project-card__nav">
                      {images.map((_, imgIndex) => (
                        <button
                          key={imgIndex}
                          className={`project-nav-dot ${imgIndex === currentIndex ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImage(project.id, imgIndex);
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Image Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        className="project-nav-arrow project-nav-arrow--prev"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageNavigation(project.id, 'prev');
                        }}
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: '0',
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        ←
                      </button>
                      <button
                        className="project-nav-arrow project-nav-arrow--next"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageNavigation(project.id, 'next');
                        }}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: '0',
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        →
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                  fontSize: '3rem'
                }}>
                  📁
                </div>
              )}
            </div>

            {/* Project Content */}
            <div className="project-card__content" style={{ padding: '1.5rem' }}>
              <h3 className="project-card__title" style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.5rem', marginBottom: '0.75rem' }}>{project.title}</h3>
              
              {project.description && (
                <p className="project-card__description" style={{ color: '#334155', fontWeight: '500', lineHeight: '1.6', marginBottom: '1rem' }}>{project.description}</p>
              )}
              
              {/* Tech Stack */}
              {techStack.length > 0 && (
                <div className="project-card__tech" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {techStack.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag" style={{ 
                      padding: '0.375rem 0.75rem',
                      background: 'rgba(15, 23, 42, 0.1)',
                      border: '1px solid rgba(15, 23, 42, 0.2)',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#0f172a'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Project Actions - Only external links, no View Details button */}
              {(project.demoUrl || project.githubUrl) && (
                <div className="project-card__actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link project-link--primary"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: '0.625rem 1.25rem',
                        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link project-link--secondary"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: '0.625rem 1.25rem',
                        background: 'transparent',
                        color: '#0f172a',
                        border: '2px solid #0f172a',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      View Code
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      <style jsx>{`
        .project-card:hover .project-nav-arrow {
          opacity: 1;
        }
        
        .project-nav-arrow:hover {
          background: rgba(0, 0, 0, 0.9) !important;
          transform: translateY(-50%) scale(1.1);
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .scale-in {
          animation: scaleIn 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}