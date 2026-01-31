import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileDetails } from '../services/api';
import Footer from '../components/Footer';
import robotAiIcon from '../assets/icons/robot-ai.svg';
import aiBrainIcon from '../assets/icons/ai-brain.svg';
import aiChipIcon from '../assets/icons/ai-chip.svg';
import './ProjectDetail.scss';

export default function ProjectDetail() {
  const { profileId, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        setError(null);
        // Get the full profile data and find the specific project
        const res = await getProfileDetails(profileId);
        const profile = res.data;
        if (profile && profile.projects && profile.projects.length > 0) {
          const foundProject = profile.projects.find(p => String(p.id) === String(projectId));
          if (foundProject) {
            setProject(foundProject);
          } else {
            setError('Project not found in this profile.');
          }
        } else {
          setError('No projects found for this profile.');
        }
      } catch (err) {
        console.error('Failed to load project', err);
        setError('Failed to load project. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [profileId, projectId]);

  // Auto-slide images every 3 seconds
  useEffect(() => {
    if (!project) return;
    
    const images = getProjectImages(project);
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [project]);

  const getImagePath = (imagePath, type = 'images') => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:8080${imagePath}`;
    }
    
    return `http://localhost:8080/uploads/${type}/${imagePath}`;
  };

  const getProjectImages = (project) => {
    let imageData = project.imageUrlsList || project.imageUrls || project.images || '';
    
    if (!imageData) return [];
    
    if (Array.isArray(imageData)) {
      return imageData.map(imagePath => getImagePath(imagePath, 'projects'));
    }
    
    const imageNames = imageData.split(',').map(img => img.trim()).filter(img => img);
    return imageNames.map(imageName => getImagePath(imageName, 'projects'));
  };

  if (loading) {
    return (
      <div className="project-detail-page">
        <div className="floating-background">
          <div className="float-icon" style={{ top: '10%', left: '15%', animationDelay: '0s' }}>🤖</div>
          <div className="float-icon" style={{ top: '60%', right: '15%', animationDelay: '1.5s' }}>⚡</div>
          <div className="float-icon" style={{ top: '30%', right: '30%', animationDelay: '2.5s' }}>💡</div>
          <img src={robotAiIcon} alt="" className="float-svg" style={{ top: '25%', left: '5%', animationDelay: '0.3s' }} />
          <img src={aiBrainIcon} alt="" className="float-svg" style={{ top: '55%', right: '8%', animationDelay: '1.8s' }} />
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-page">
        <div className="floating-background">
          <div className="float-icon" style={{ top: '10%', left: '15%', animationDelay: '0s' }}>🤖</div>
          <img src={robotAiIcon} alt="" className="float-svg" style={{ top: '25%', left: '5%', animationDelay: '0.3s' }} />
        </div>
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => navigate(`/portfolio/${profileId}`)}>Back to Portfolio</button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <div className="floating-background">
          <div className="float-icon" style={{ top: '10%', left: '15%', animationDelay: '0s' }}>🤖</div>
          <img src={robotAiIcon} alt="" className="float-svg" style={{ top: '25%', left: '5%', animationDelay: '0.3s' }} />
        </div>
        <div className="error-container">
          <h2>Project not found</h2>
          <p>The requested project could not be found.</p>
          <button className="btn-primary" onClick={() => navigate(`/portfolio/${profileId}`)}>Back to Portfolio</button>
        </div>
      </div>
    );
  }

  const images = getProjectImages(project);
  const techStack = project.techStack ? (Array.isArray(project.techStack) ? project.techStack : project.techStack.split(',').map(t => t.trim())) : [];

  // Get technology icon based on name
  const getTechIcon = (techName) => {
    const tech = techName.toLowerCase().trim();
    const iconMap = {
      'javascript': '/src/assets/icons/tech/javascript.svg',
      'js': '/src/assets/icons/tech/javascript.svg',
      'react': '/src/assets/icons/tech/react.svg',
      'reactjs': '/src/assets/icons/tech/react.svg',
      'python': '/src/assets/icons/tech/python.svg',
      'java': '/src/assets/icons/tech/java.svg',
      'git': '/src/assets/icons/tech/git.svg',
      'github': '/src/assets/icons/tech/git.svg',
      '.net': '/src/assets/icons/tech/dotnet.svg',
      'dotnet': '/src/assets/icons/tech/dotnet.svg',
      'spring': '/src/assets/icons/tech/spring.svg',
      'spring boot': '/src/assets/icons/tech/spring.svg',
      'springboot': '/src/assets/icons/tech/spring.svg',
      'node.js': '/src/assets/icons/tech/nodejs.svg',
      'nodejs': '/src/assets/icons/tech/nodejs.svg',
      'node': '/src/assets/icons/tech/nodejs.svg',
      'typescript': '/src/assets/icons/tech/typescript.svg',
      'ts': '/src/assets/icons/tech/typescript.svg',
      'angular': '/src/assets/icons/tech/angular.svg',
      'vue': '/src/assets/icons/tech/vue.svg',
      'vuejs': '/src/assets/icons/tech/vue.svg',
      'docker': '/src/assets/icons/tech/docker.svg',
      'aws': '/src/assets/icons/tech/aws.svg',
      'mongodb': '/src/assets/icons/tech/mongodb.svg',
      'mongo': '/src/assets/icons/tech/mongodb.svg',
      'postgresql': '/src/assets/icons/tech/postgresql.svg',
      'postgres': '/src/assets/icons/tech/postgresql.svg',
      'mysql': '/src/assets/icons/tech/mysql.svg',
      'html': '/src/assets/icons/tech/html.svg',
      'html5': '/src/assets/icons/tech/html.svg',
      'css': '/src/assets/icons/tech/css.svg',
      'css3': '/src/assets/icons/tech/css.svg',
      'sass': '/src/assets/icons/tech/sass.svg',
      'scss': '/src/assets/icons/tech/sass.svg',
      'bootstrap': '/src/assets/icons/tech/bootstrap.svg',
      'tailwind': '/src/assets/icons/tech/tailwind.svg',
      'tailwindcss': '/src/assets/icons/tech/tailwind.svg',
      'redux': '/src/assets/icons/tech/redux.svg',
      'graphql': '/src/assets/icons/tech/graphql.svg',
      'express': '/src/assets/icons/tech/express.svg',
      'expressjs': '/src/assets/icons/tech/express.svg',
      'nestjs': '/src/assets/icons/tech/nestjs.svg',
      'nest': '/src/assets/icons/tech/nestjs.svg',
      'nextjs': '/src/assets/icons/tech/nextjs.svg',
      'next.js': '/src/assets/icons/tech/nextjs.svg',
      'next': '/src/assets/icons/tech/nextjs.svg',
      'firebase': '/src/assets/icons/tech/firebase.svg',
      'kubernetes': '/src/assets/icons/tech/kubernetes.svg',
      'k8s': '/src/assets/icons/tech/kubernetes.svg',
      'jenkins': '/src/assets/icons/tech/jenkins.svg',
      'gitlab': '/src/assets/icons/tech/gitlab.svg',
      'vscode': '/src/assets/icons/tech/vscode.svg',
      'vs code': '/src/assets/icons/tech/vscode.svg',
      'visual studio code': '/src/assets/icons/tech/vscode.svg',
      'intellij': '/src/assets/icons/tech/intellij.svg',
      'intellij idea': '/src/assets/icons/tech/intellij.svg',
      'figma': '/src/assets/icons/tech/figma.svg',
      'photoshop': '/src/assets/icons/tech/photoshop.svg',
      'illustrator': '/src/assets/icons/tech/illustrator.svg',
      'xd': '/src/assets/icons/tech/xd.svg',
      'adobe xd': '/src/assets/icons/tech/xd.svg'
    };

    return iconMap[tech] || null;
  };

  return (
    <div className="project-detail-page">
      {/* Animated Floating AI Background */}
      <div className="floating-background">
        <div className="float-icon" style={{ top: '10%', left: '15%', animationDelay: '0s' }}>🤖</div>
        <div className="float-icon" style={{ top: '20%', right: '20%', animationDelay: '0.5s' }}>🧠</div>
        <div className="float-icon" style={{ top: '40%', left: '10%', animationDelay: '1s' }}>💻</div>
        <div className="float-icon" style={{ top: '60%', right: '15%', animationDelay: '1.5s' }}>⚡</div>
        <div className="float-icon" style={{ top: '80%', left: '25%', animationDelay: '2s' }}>🎯</div>
        <div className="float-icon" style={{ top: '30%', right: '30%', animationDelay: '2.5s' }}>💡</div>
        <div className="float-icon" style={{ top: '50%', left: '40%', animationDelay: '3s' }}>🚀</div>
        
        <img src={robotAiIcon} alt="" className="float-svg" style={{ top: '25%', left: '5%', animationDelay: '0.3s' }} />
        <img src={aiBrainIcon} alt="" className="float-svg" style={{ top: '55%', right: '8%', animationDelay: '1.8s' }} />
        <img src={aiChipIcon} alt="" className="float-svg" style={{ top: '75%', left: '50%', animationDelay: '2.8s' }} />
      </div>
      
      {/* Navigation */}
      <nav className="nav-header">
        <div className="nav-container">
          <button  onClick={() => navigate(`/portfolio/${profileId}`)} className="nav-logo">
            ← Back to Portfolio
          </button>
        </div>
      </nav>

      {/* Project Content */}
      <div className="project-content">
        <div className="project-container">
          
          {/* Section 1: First Image (Left) + Big Title (Right) */}
          {images.length > 0 && (
            <div className="content-row">
              <div className="image-column">
                <div className="image-wrapper">
                  <img 
                    src={images[0]} 
                    alt={project.title || project.name}
                    className="project-image"
                  />
                </div>
              </div>
              <div className="text-column title-column">
                <h1 className="big-project-title">{project.title || project.name}</h1>
              </div>
            </div>
          )}

          {/* Section 2: Second Image (Left) + Description (Right) */}
          {images.length > 1 && (
            <div className="content-row">
              <div className="image-column">
                <div className="image-wrapper">
                  <img 
                    src={images[1]} 
                    alt={`${project.title || project.name} - Preview`}
                    className="project-image"
                  />
                </div>
              </div>
              <div className="text-column description-column">
                <div className="description-content">
                  <h2 className="section-heading">About This Project</h2>
                  {project.description && (
                    <p className="main-description">{project.description}</p>
                  )}
                  
                  {/* Additional description paragraphs if available */}
                  {project.longDescription && (
                    <p className="additional-para">{project.longDescription}</p>
                  )}
                  
                  {/* Project URLs at end of description */}
                  {(project.demoUrl || project.githubUrl || project.liveUrl || project.projectUrl) && (
                    <div className="project-url-section">
                      <h3 className="url-heading">Project Links</h3>
                      <div className="project-links">
                        {(project.demoUrl || project.liveUrl) && (
                          <a
                            href={project.demoUrl || project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-url-link"
                          >
                            🚀 Live Demo
                          </a>
                        )}
                        {(project.githubUrl || project.projectUrl) && (
                          <a
                            href={project.githubUrl || project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-url-link secondary"
                          >
                            💻 View Code
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* If only 1 image, show description below title */}
          {images.length === 1 && (
            <div className="single-description-section">
              <h2 className="section-heading">About This Project</h2>
              {project.description && (
                <p className="main-description">{project.description}</p>
              )}
              
              {project.longDescription && (
                <p className="additional-para">{project.longDescription}</p>
              )}
              
              {/* Project URLs */}
              {(project.demoUrl || project.githubUrl || project.liveUrl || project.projectUrl) && (
                <div className="project-url-section">
                  <h3 className="url-heading">Project Links</h3>
                  <div className="project-links">
                    {(project.demoUrl || project.liveUrl) && (
                      <a
                        href={project.demoUrl || project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-url-link"
                      >
                        🚀 Live Demo
                      </a>
                    )}
                    {(project.githubUrl || project.projectUrl) && (
                      <a
                        href={project.githubUrl || project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-url-link secondary"
                      >
                        💻 View Code
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Technologies Section - Floating Animated Icons (like Skills) */}
          {techStack.length > 0 && (
            <div className="technologies-section">
              <h2 className="section-heading">Technologies Used</h2>
              <div className="tech-floating-grid">
                {techStack.map((tech, idx) => {
                  const iconSrc = getTechIcon(tech);
                  return (
                    <div 
                      key={idx}
                      className="tech-floating-item"
                      style={{
                        animationDelay: `${idx * 0.15}s`
                      }}
                    >
                      <div className="tech-icon-circle">
                        {iconSrc ? (
                          <img 
                            src={iconSrc} 
                            alt={tech}
                            className="tech-icon-img"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="tech-fallback-icon"
                          style={{ 
                            display: iconSrc ? 'none' : 'flex',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#0f172a'
                          }}
                        >
                          {tech?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      </div>
                      <p className="tech-name">{tech}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Small Auto-Sliding Images Gallery (if more than 2 images) */}
          {images.length > 2 && (
            <div className="small-gallery-section">
              <h2 className="section-heading">Project Gallery</h2>
              <div className="small-images-slider">
                {images.slice(2).map((image, index) => (
                  <div 
                    key={index}
                    className="small-image-card"
                    style={{
                      animationDelay: `${index * 0.15}s`
                    }}
                  >
                    <img src={image} alt={`Gallery ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Section (if exists) */}
          {project.features && project.features.length > 0 && (
            <div className="features-section">
              <h2 className="section-heading">Key Features</h2>
              <div className="features-list-grid">
                {project.features.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="feature-item"
                    style={{
                      animationDelay: `${idx * 0.1}s`
                    }}
                  >
                    <span className="feature-bullet">✨</span>
                    <p className="feature-text">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}