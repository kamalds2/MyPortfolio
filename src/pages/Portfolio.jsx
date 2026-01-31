import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileDetails } from '../services/api';
import TechSkills from '../components/TechSkills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Footer from '../components/Footer';
import robotAiIcon from '../assets/icons/robot-ai.svg';
import aiBrainIcon from '../assets/icons/ai-brain.svg';
import aiChipIcon from '../assets/icons/ai-chip.svg';
import javaIcon from '../assets/icons/tech/java.svg';
import pythonIcon from '../assets/icons/tech/python.svg';
import jsIcon from '../assets/icons/tech/javascript.svg';
import reactIcon from '../assets/icons/tech/react.svg';
import nodeIcon from '../assets/icons/tech/nodejs.svg';
import htmlIcon from '../assets/icons/tech/html5.svg';
import cssIcon from '../assets/icons/tech/css3.svg';
import dockerIcon from '../assets/icons/tech/docker.svg';
import defaultIcon from '../assets/icons/tech/default.svg';

export default function Portfolio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [sparks, setSparks] = useState([]);
  const [currentGradient, setCurrentGradient] = useState(0);
  const profileImageRef = React.useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isHovering || !profileImageRef.current) return;
      
      const rect = profileImageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovering]);

  useEffect(() => {
    const gradientInterval = setInterval(() => {
      setCurrentGradient(prev => (prev + 1) % 5);
    }, 2500);
    return () => clearInterval(gradientInterval);
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getProfileDetails(id);
        console.log('Profile details response:', response.data);
        if (response.data) {
          setProfile(response.data);
        } else {
          throw new Error('No profile data received');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleProjectClick = (projectId) => {
    navigate(`/portfolio/${id}/project/${projectId}`);
  };

  const getImagePath = (imagePath, type = 'images') => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Serve images through your backend API at localhost:8080
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:8080${imagePath}`;
    }
    
    // Default fallback - serve through backend
    return `http://localhost:8080/uploads/${type}/${imagePath}`;
  };

  const getTechIcon = (skillName) => {
    const name = (skillName?.toLowerCase() || '').trim();
    const iconMap = {
      'java': javaIcon,
      'python': pythonIcon,
      'javascript': jsIcon,
      'js': jsIcon,
      'react': reactIcon,
      'reactjs': reactIcon,
      'react.js': reactIcon,
      'node': nodeIcon,
      'nodejs': nodeIcon,
      'node.js': nodeIcon,
      'html': htmlIcon,
      'html5': htmlIcon,
      'css': cssIcon,
      'css3': cssIcon,
      'docker': dockerIcon,
      'spring': defaultIcon,
      'springboot': defaultIcon,
      'spring boot': defaultIcon
    };
    return iconMap[name] || defaultIcon;
  };

  const AnimatedTitle = ({ children, delay = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);

    const letters = children.split('');

    return (
      <h2 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="animated-title-wrapper"
        style={{
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
          fontWeight: '800',
          textAlign: 'center'
        }}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            className={isHovered ? 'bouncing-letter' : ''}
            style={{
              display: 'inline-block',
              color: isHovered ? '#d97706 !important' : '#1e293b',
              fontWeight: '800',
              fontSize: 'inherit',
              transformOrigin: 'center bottom',
              transition: 'color 0.3s ease',
              animationDelay: `${index * 0.05}s`
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </h2>
    );
  };

  const handleProfileFlip = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setIsFlipping(true);
    
    // Generate random sparks during spin
    const sparkInterval = setInterval(() => {
      const newSparks = Array.from({ length: 8 }, (_, i) => ({
        id: Math.random(),
        angle: (360 / 8) * i + Math.random() * 45,
        distance: 80 + Math.random() * 40,
        size: 3 + Math.random() * 4,
        duration: 0.5 + Math.random() * 0.5
      }));
      setSparks(newSparks);
    }, 100);
    
    // Spin duration: 3.5 seconds (10-11 rotations)
    setTimeout(() => {
      clearInterval(sparkInterval);
      setSparks([]);
      
      // Randomly decide to show image or letter
      const showImage = Math.random() > 0.5;
      setIsFlipped(!showImage);
      
      setTimeout(() => {
        setIsSpinning(false);
        setIsFlipping(false);
      }, 500);
    }, 3500);
  };

  const downloadResume = () => {
    if (profile.resumeUrl) {
      const resumePath = getImagePath(profile.resumeUrl, 'resumes');
      const link = document.createElement('a');
      link.href = resumePath;
      link.download = profile.resumeUrl.split('/').pop();
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="portfolio-container">
        <div className="page-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '50vh',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid var(--border-primary)',
              borderTop: '3px solid var(--accent-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-container">
        <div className="page-container">
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: 'var(--accent-danger)'
          }}>
            <h2>Error Loading Portfolio</h2>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="portfolio-container">
        <div className="page-container">
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: 'var(--text-secondary)'
          }}>
            <p>Profile not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* Animated Floating AI Background */}
      <div className="floating-background">
        <div className="float-icon" style={{ top: '10%', left: '15%', animationDelay: '0s' }}>🤖</div>
        <div className="float-icon" style={{ top: '20%', right: '20%', animationDelay: '0.5s' }}>🧠</div>
        <div className="float-icon" style={{ top: '40%', left: '10%', animationDelay: '1s' }}>💻</div>
        <div className="float-icon" style={{ top: '60%', right: '15%', animationDelay: '1.5s' }}>⚡</div>
        <div className="float-icon" style={{ top: '80%', left: '25%', animationDelay: '2s' }}>🎯</div>
        <div className="float-icon" style={{ top: '30%', right: '30%', animationDelay: '2.5s' }}>💡</div>
        <div className="float-icon" style={{ top: '50%', left: '40%', animationDelay: '3s' }}>🚀</div>
        <div className="float-icon" style={{ top: '70%', right: '40%', animationDelay: '3.5s' }}>⚙️</div>
        <div className="float-icon" style={{ top: '15%', left: '70%', animationDelay: '4s' }}>🎨</div>
        <div className="float-icon" style={{ top: '85%', right: '10%', animationDelay: '4.5s' }}>☁️</div>
        
        <img src={robotAiIcon} alt="" className="float-svg" style={{ top: '25%', left: '5%', animationDelay: '0.3s' }} />
        <img src={aiBrainIcon} alt="" className="float-svg" style={{ top: '55%', right: '8%', animationDelay: '1.8s' }} />
        <img src={aiChipIcon} alt="" className="float-svg" style={{ top: '75%', left: '50%', animationDelay: '2.8s' }} />
        <img src={robotAiIcon} alt="" className="float-svg" style={{ top: '45%', right: '25%', animationDelay: '3.8s' }} />
      </div>

      {/* Navigation */}
      <nav className="nav-header">
        <div className="nav-container">
          <a href="#" className="nav-logo">
            {profile.fullName?.split(' ')[0] || 'Portfolio'}
          </a>
          <ul className="nav-menu">
            <li><a href="#about" className="nav-link" style={{ transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#d97706'} onMouseLeave={(e) => e.target.style.color = ''}>About</a></li>
            <li><a href="#skills" className="nav-link" style={{ transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#d97706'} onMouseLeave={(e) => e.target.style.color = ''}>Skills</a></li>
            <li><a href="#projects" className="nav-link" style={{ transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#d97706'} onMouseLeave={(e) => e.target.style.color = ''}>Projects</a></li>
            <li><a href="#experience" className="nav-link" style={{ transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#d97706'} onMouseLeave={(e) => e.target.style.color = ''}>Experience</a></li>
            <li><a href="#contact" className="nav-link" style={{ transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = '#d97706'} onMouseLeave={(e) => e.target.style.color = ''}>Contact</a></li>
          </ul>
        </div>
      </nav>

      <div className="page-container">
        {/* Hero Section */}
        <section id="about" className="hero-section">
          <div className="hero-content fade-in">
            <div 
              className={`hero-image ${isSpinning ? 'spinning-wheel' : ''} ${isFlipping ? 'flipping' : ''}`}
              ref={profileImageRef}
              onMouseEnter={() => !isSpinning && setIsHovering(true)}
              onMouseLeave={() => {
                setIsHovering(false);
                setMousePos({ x: 0, y: 0 });
              }}
              onClick={handleProfileFlip}
              style={{
                transform: isSpinning 
                  ? 'perspective(1000px) rotateY(0deg) scale(1.1)'
                  : (isHovering && !isFlipping
                    ? `perspective(1000px) rotateY(${mousePos.x / 10}deg) rotateX(${-mousePos.y / 10}deg)`
                    : isFlipped ? 'perspective(1000px) rotateY(180deg)' : 'perspective(1000px) rotateY(0deg)'),
                transition: isSpinning ? 'transform 0.3s ease' : (isFlipping ? 'transform 0.5s ease-out' : (isHovering ? 'none' : 'transform 0.3s ease-out')),
                cursor: isSpinning ? 'wait' : 'pointer',
                transformStyle: 'preserve-3d',
                position: 'relative',
                filter: isSpinning ? 'brightness(1.2) contrast(1.1)' : 'none'
              }}
            >
              {/* Spark particles */}
              {isSpinning && sparks.map(spark => (
                <div
                  key={spark.id}
                  className="spark-particle"
                  style={{
                    position: 'absolute',
                    width: `${spark.size}px`,
                    height: `${spark.size}px`,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, #fbbf24, #f59e0b, transparent)`,
                    boxShadow: `0 0 ${spark.size * 2}px #fbbf24, 0 0 ${spark.size * 4}px #f59e0b`,
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${spark.angle}deg) translateX(${spark.distance}px)`,
                    animation: `sparkFade ${spark.duration}s ease-out forwards`,
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                />
              ))}
              {profile.profileImage && (
                <img 
                  src={getImagePath(profile.profileImage)} 
                  alt={`${profile.fullName}`}
                  style={{ 
                    backfaceVisibility: 'hidden',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'rotateY(0deg)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div 
                className="hero-avatar"
                style={{ 
                  display: 'flex',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              >
                {profile.fullName?.charAt(0) || '?'}
              </div>
            </div>
            
            <h1 className="hero-name" onClick={() => setShowModal(true)} style={{ 
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '3rem',
              fontWeight: '800'
            }}>
            {profile.fullName || ''}
            </h1>
            
            {profile.title && (
              <p className="hero-role" onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>{profile.title}</p>
            )}
            
            {profile.bio && (
              <p className="hero-description" onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>{profile.bio}</p>
            )}
            
            <div className="hero-actions">
              {profile.resumeUrl && (
                <button onClick={downloadResume} className="btn btn-primary">
                  Download Resume
                </button>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="btn btn-secondary">
                  Get In Touch
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section">
          <div className="section-header">
            <AnimatedTitle delay={0}>My Skills</AnimatedTitle>
            <p className="section-subtitle" style={{
              fontSize: '1.2rem',
              color: '#2f425dff',
              fontWeight: '500'
            }}>
              Technologies and tools I work with to bring ideas to life.
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '2.5rem', 
            justifyContent: 'center',
            padding: '2rem 0',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedSkill(skill)}
                  style={{
                    cursor: 'pointer',
                    animation: `skillLogoFloat 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.15)';
                    e.currentTarget.style.filter = 'drop-shadow(0 12px 24px rgba(59, 130, 246, 0.3))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  <img 
                    src={getTechIcon(skill.name || skill)} 
                    alt={(skill.name || skill)}
                    style={{
                      width: '85px',
                      height: '85px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12))',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No skills added yet.</p>
            )}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section">
          <div className="section-header">
            <AnimatedTitle delay={0.5}>Featured Projects</AnimatedTitle>
            <p className="section-subtitle" style={{
              fontSize: '1.2rem',
              color: '#64748b',
              fontWeight: '500'
            }}>
              A showcase of my recent work and personal projects.
            </p>
          </div>
          <Projects 
            projects={profile.projects || []} 
            onProjectClick={handleProjectClick}
            getImagePath={getImagePath}
          />
        </section>

        {/* Experience Section */}
        <section id="experience" className="section">
          <div className="section-header">
            <AnimatedTitle delay={1}>Work Experience</AnimatedTitle>
            <p className="section-subtitle" style={{
              fontSize: '1.2rem',
              color: '#64748b',
              fontWeight: '500'
            }}>
              My professional journey and key achievements.
            </p>
          </div>
          <Experience experiences={profile.experiences || []} />
        </section>

        {/* Education Section */}
        {profile.educationList && profile.educationList.length > 0 && (
          <section id="education" className="section">
            <div className="section-header">
              <AnimatedTitle delay={1.5}>Education</AnimatedTitle>
              <p className="section-subtitle" style={{
                fontSize: '1.2rem',
                color: '#64748b',
                fontWeight: '500'
              }}>
                My academic background and qualifications.
              </p>
            </div>
            <Education education={profile.educationList} />
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="section">
          <div className="section-header">
            <AnimatedTitle delay={2}>Let's Connect</AnimatedTitle>
            <p className="section-subtitle" style={{
              fontSize: '1.2rem',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Ready to collaborate? Let's discuss your next project.
            </p>
          </div>
          
          <div className="contact-grid">
            {profile.email && (
              <div className="contact-card" style={{ animationDelay: '0.1s' }}>
                <div className="contact-card__icon-wrapper">
                  <div className="contact-card__icon">📧</div>
                </div>
                <h3 className="contact-card__title">Email</h3>
                <p className="contact-card__info">
                  <a href={`mailto:${profile.email}`} className="contact-card__link">
                    {profile.email}
                  </a>
                </p>
              </div>
            )}
            
            {profile.phone && (
              <div className="contact-card" style={{ animationDelay: '0.2s' }}>
                <div className="contact-card__icon-wrapper">
                  <div className="contact-card__icon">📱</div>
                </div>
                <h3 className="contact-card__title">Phone</h3>
                <p className="contact-card__info">
                  <a href={`tel:${profile.phone}`} className="contact-card__link">
                    {profile.phone}
                  </a>
                </p>
              </div>
            )}
            
            {profile.linkedin && (
              <div className="contact-card" style={{ animationDelay: '0.3s' }}>
                <div className="contact-card__icon-wrapper">
                  <div className="contact-card__icon">💼</div>
                </div>
                <h3 className="contact-card__title">LinkedIn</h3>
                <p className="contact-card__info">
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card__link">
                    Connect with me
                  </a>
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />

      {/* Animated Profile Modal */}
      {showModal && (
        <div 
          className="profile-modal"
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              animation: 'scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              position: 'relative'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', marginBottom: '1.5rem', display: 'inline-block' }}>
                {profile.profileImage ? (
                  <img 
                    src={getImagePath(profile.profileImage)}
                    alt={profile.fullName}
                    style={{
                      width: '180px',
                      height: '180px',
                      borderRadius: '20px',
                      border: '3px solid rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    fontWeight: '800',
                    color: '#fff',
                    border: '3px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                  }}>
                    {profile.fullName?.charAt(0) || '?'}
                  </div>
                )}
                
                {/* Close button on image */}
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '2px solid rgba(15, 23, 42, 0.1)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                    color: '#0f172a',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#0f172a';
                    e.target.style.color = '#fff';
                    e.target.style.transform = 'rotate(90deg) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                    e.target.style.color = '#0f172a';
                    e.target.style.transform = 'rotate(0deg) scale(1)';
                  }}
                >
                  ✕
                </button>
              </div>
              
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: '800' }}>
                {profile.fullName}
              </h2>
              {profile.title && (
                <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '1rem', fontWeight: '600' }}>
                  {profile.title}
                </p>
              )}
              {profile.bio && (
                <p style={{ 
                  fontSize: '0.95rem', 
                  color: '#64748b', 
                  marginBottom: '1.5rem',
                  lineHeight: '1.6',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textAlign: 'center'
                }}>
                  {profile.bio}
                </p>
              )}
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate(`/about/${id}`);
                }}
                style={{
                  background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(15, 23, 42, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.3)';
                }}
              >
                Read Full About →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Detail Modal - Small Popup */}
      {selectedSkill && (
        <div 
          className="skill-modal"
          onClick={() => setSelectedSkill(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            animation: 'fadeIn 0.2s ease-out',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div 
            className="skill-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(224, 242, 254, 0.98))',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '350px',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              animation: 'skillModalScale 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)',
              position: 'relative'
            }}
            >
            <button
              onClick={() => setSelectedSkill(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: '#64748b',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.color = '#1e293b';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.color = '#64748b';
              }}
            >
              ×
            </button>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px',
                border: '2px solid rgba(59, 130, 246, 0.2)',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)'
              }}>
                <img 
                  src={getTechIcon(selectedSkill.name || selectedSkill)} 
                  alt={selectedSkill.name || selectedSkill}
                  style={{ 
                    width: '90px', 
                    height: '90px', 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.2))'
                  }}
                />
              </div>
              
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '0.5rem', 
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '700'
              }}>
                {selectedSkill.name || selectedSkill}
              </h3>
              
              {selectedSkill.level && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    marginBottom: '0.5rem',
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    Version — {selectedSkill.level > 90 ? 'Expert' : selectedSkill.level > 70 ? 'Advanced' : selectedSkill.level > 50 ? 'Intermediate' : 'Learning'}
                  </p>
                </div>
              )}
              
              <p style={{
                fontSize: '0.85rem',
                color: '#64748b',
                marginTop: '1rem',
                lineHeight: '1.5'
              }}>
                Usage — AI, Web, Automation
              </p>
            </div>
          </div>
        </div>
      )}      <style jsx>{`
        .portfolio-container {
          position: relative;
          background: linear-gradient(135deg, #e0f2fe 0%, #ddd6fe 50%, #fce7f3 100%);
          min-height: 100vh;
          margin: 0;
          padding: 0;
          font-family: 'Inter', 'Segoe UI', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .floating-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .float-icon {
          position: absolute;
          font-size: 3rem;
          opacity: 0.3;
          animation: floatAround 20s infinite ease-in-out;
          filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
        }

        .float-svg {
          position: absolute;
          width: 60px;
          height: 60px;
          opacity: 0.2;
          animation: floatAround 25s infinite ease-in-out;
          filter: drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3));
        }

        .page-container {
          position: relative;
          z-index: 1;
        }

        .nav-header {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 2px solid rgba(59, 130, 246, 0.3);
        }

        .hero-section {
          position: relative;
          z-index: 1;
          padding-top: 2rem;
        }

        .hero-image {
          position: relative;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .hero-image.flipping {
          animation: coinFlip 1s ease-in-out;
        }

        .hero-image.spinning-wheel {
          animation: spinningWheel 3.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
          box-shadow: 0 0 40px rgba(251, 191, 36, 0.6), 0 0 80px rgba(245, 158, 11, 0.4);
        }

        .hero-image .hero-avatar,
        .hero-image img {
          backface-visibility: hidden;
        }

        .hero-image .hero-avatar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: rotateY(180deg);
        }

        @keyframes coinFlip {
          0% {
            transform: perspective(1000px) rotateY(0deg) scale(1);
          }
          25% {
            transform: perspective(1000px) rotateY(90deg) scale(1.05);
          }
          50% {
            transform: perspective(1000px) rotateY(180deg) scale(1);
          }
          75% {
            transform: perspective(1000px) rotateY(270deg) scale(1.05);
          }
          100% {
            transform: perspective(1000px) rotateY(360deg) scale(1);
          }
        }

        @keyframes spinningWheel {
          0% {
            transform: perspective(1000px) rotateY(0deg) scale(1);
          }
          10% {
            transform: perspective(1000px) rotateY(720deg) scale(1.15);
          }
          20% {
            transform: perspective(1000px) rotateY(1440deg) scale(1.1);
          }
          30% {
            transform: perspective(1000px) rotateY(2160deg) scale(1.15);
          }
          40% {
            transform: perspective(1000px) rotateY(2880deg) scale(1.1);
          }
          50% {
            transform: perspective(1000px) rotateY(3600deg) scale(1.15);
          }
          60% {
            transform: perspective(1000px) rotateY(4000deg) scale(1.1);
          }
          70% {
            transform: perspective(1000px) rotateY(4200deg) scale(1.08);
          }
          80% {
            transform: perspective(1000px) rotateY(4320deg) scale(1.05);
          }
          90% {
            transform: perspective(1000px) rotateY(4360deg) scale(1.02);
          }
          95% {
            transform: perspective(1000px) rotateY(4380deg) scale(1.01);
          }
          100% {
            transform: perspective(1000px) rotateY(4320deg) scale(1);
          }
        }

        @keyframes sparkFade {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(0);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance)) scale(1.5);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(calc(var(--distance) * 1.5)) scale(0.5);
          }
        }

        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes letterBubble {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.2);
          }
        }

        .animated-title-wrapper {
          display: inline-block;
          cursor: pointer;
        }

        .bouncing-letter {
          animation: letterBubble 0.6s ease-in-out infinite;
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 800;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: #334155;
          font-weight: 500;
          max-width: 600px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 800;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: #334155;
          font-weight: 500;
          max-width: 600px;
          margin: 0 auto;
        }

        .section {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(15px);
          border-radius: 24px;
          padding: 3rem 2rem;
          margin: 2rem auto;
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.6);
          opacity: 0;
          transform: translateY(50px);
          animation: sectionReveal 0.8s ease-out forwards;
        }

        .section:nth-child(1) { animation-delay: 0.1s; }
        .section:nth-child(2) { animation-delay: 0.2s; }
        .section:nth-child(3) { animation-delay: 0.3s; }
        .section:nth-child(4) { animation-delay: 0.4s; }
        .section:nth-child(5) { animation-delay: 0.5s; }

        @keyframes sectionReveal {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .skills-animated-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .skill-card-animated {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          animation: skillSlideUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .skill-card-animated:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.3);
          border-color: rgba(139, 92, 246, 0.6);
        }

        .skill-icon-wrapper {
          margin-bottom: 1rem;
          animation: skillIconBounce 2s infinite ease-in-out;
        }

        .skill-robot-icon {
          font-size: 3rem;
          display: inline-block;
        }

        .skill-name {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .skill-level {
          width: 100%;
          height: 8px;
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
          overflow: hidden;
          margin-top: 1rem;
        }

        .skill-level-bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
          animation: skillLevelGrow 1s ease-out forwards;
          width: 0;
        }

        .no-skills {
          text-align: center;
          color: #334155;
          font-size: 1.2rem;
          font-weight: 500;
        }

        .section-title {
          color: #1e293b;
          font-weight: 800;
        }

        .section-subtitle {
          color: #475569;
          font-weight: 500;
        }

        .hero-name {
          color: #0f172a;
          font-weight: 800;
        }

        .hero-role {
          color: #334155;
          font-weight: 600;
        }

        .hero-description {
          color: #475569;
          font-weight: 500;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .contact-card {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 2.5rem;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.6);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(40px);
          animation: contactCardReveal 0.8s ease-out forwards;
          position: relative;
          overflow: hidden;
        }

        .contact-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: rotate(45deg);
          transition: all 0.6s ease;
        }

        .contact-card:hover::before {
          left: 100%;
        }

        .contact-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.65);
        }

        .contact-card__icon-wrapper {
          margin-bottom: 1.5rem;
          display: inline-block;
        }

        .contact-card__icon {
          font-size: 3.5rem;
          display: inline-block;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          animation: contactIconFloat 3s ease-in-out infinite;
          transition: all 0.4s ease;
        }

        .contact-card:hover .contact-card__icon {
          transform: scale(1.15) rotate(10deg);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
        }

        .contact-card__title {
          color: #0f172a;
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          transition: color 0.3s ease;
        }

        .contact-card:hover .contact-card__title {
          color: #d97706;
        }

        .contact-card__info {
          color: #334155;
          font-weight: 500;
          font-size: 1.05rem;
        }

        .contact-card__link {
          color: #475569;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          display: inline-block;
        }

        .contact-card__link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #d97706, #f59e0b);
          transition: width 0.4s ease;
        }

        .contact-card__link:hover {
          color: #0f172a;
        }

        .contact-card__link:hover::after {
          width: 100%;
        }

        @keyframes contactCardReveal {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes contactIconFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-12px) rotate(5deg);
          }
          50% {
            transform: translateY(-8px) rotate(-3deg);
          }
          75% {
            transform: translateY(-15px) rotate(3deg);
          }
        }

        .skill-click-hint {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #3b82f6;
          opacity: 0.7;
          font-style: italic;
        }

        @keyframes skillModalScale {
          from {
            opacity: 0;
            transform: scale(0.5) rotate(-10deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes skillLogoFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }

        @keyframes skillShine {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) rotate(45deg);
          }
        }

        @keyframes skillSlideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes skillIconBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px) rotate(10deg);
          }
        }

        @keyframes skillLevelGrow {
          from {
            width: 0;
          }
        }

        @keyframes floatAround {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, -30px) rotate(90deg);
          }
          50% {
            transform: translate(-20px, 20px) rotate(180deg);
          }
          75% {
            transform: translate(40px, 10px) rotate(270deg);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}