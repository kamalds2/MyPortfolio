import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileDetails } from '../services/api';
import TechSkills from '../components/TechSkills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Footer from '../components/Footer';
import tullyIcon from '../assets/icons/tully-riverrun.png';

export default function Portfolio() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { scrollProgress, activeSection, mapRef } = use3DMapAnimations();

  // Initialize 3D map interactions and project markers
  useEffect(() => {
    if (!profile) return;

    // Initialize mouse effects for 3D map
    const cleanupMouseEffects = addMapMouseEffects();
    
    // Initialize navigation dots
    setTimeout(() => {
      initializeMapNavigation();
    }, 500);
    
    // Create project markers on the map
    if (profile.projects && profile.projects.length > 0) {
      setTimeout(() => {
        createProjectMarkers(profile.projects);
      }, 1000);
    }

    return () => {
      if (cleanupMouseEffects) cleanupMouseEffects();
    };
  }, [profile]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching profile for ID:', id);
        const response = await getProfileDetails(id);
        console.log('Profile data received:', response.data);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load portfolio. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="portfolio-3d-container">
        <div className="map-3d-background">
          <div className="map-layer layer-1"></div>
          <div className="map-layer layer-2"></div>
          <div className="map-layer layer-3"></div>
        </div>
        
        <div className="got-loading-screen">
          <div className="loading-sigil">
            <div className="sigil-ring">
              <div className="sigil-inner"></div>
            </div>
          </div>
          <h2 className="loading-text">Loading Your Journey...</h2>
          <div className="loading-runes">
            <span>🗺️</span>
            <span>📍</span>
            <span>🚀</span>
            <span>⭐</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-3d-container">
        <div className="content-card" style={{ margin: '20vh auto', maxWidth: '500px' }}>
          <h2>⚠️ Something went wrong</h2>
          <p>{error}</p>
          <button 
            style={{
              background: 'var(--primary-blue)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="portfolio-3d-container">
        <div className="content-card" style={{ margin: '20vh auto', maxWidth: '500px' }}>
          <h2>🔍 Portfolio not found</h2>
          <p>The requested portfolio could not be found.</p>
          <button 
            style={{
              background: 'var(--primary-blue)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
            onClick={() => navigate('/')}
          >
            ← Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-3d-container">
      {/* Scroll Progress */}
      <div className="scroll-progress">
        <div className="progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* 3D Animated Map Background */}
      <div className="map-3d-background" ref={mapRef}>
        <div className="map-layer layer-1"></div>
        <div className="map-layer layer-2"></div>
        <div className="map-layer layer-3"></div>
      </div>

      {/* Interactive Map Markers */}
      <div className="map-markers-container">
        <div className="map-marker marker-about" title="About Me">
          <img src={starkIcon} alt="About" style={{ width: '40px', height: '40px' }} />
        </div>
        <div className="map-marker marker-skills" title="Skills">
          <img src={arrynIcon} alt="Skills" style={{ width: '40px', height: '40px' }} />
        </div>
        <div className="map-marker marker-projects" title="Projects">
          <img src={dragonIcon} alt="Projects" style={{ width: '40px', height: '40px' }} />
        </div>
        <div className="map-marker marker-experience" title="Experience">
          <img src={baratheonIcon} alt="Experience" style={{ width: '40px', height: '40px' }} />
        </div>
        <div className="map-marker marker-education" title="Education">
          <img src={tullyIcon} alt="Education" style={{ width: '40px', height: '40px' }} />
        </div>
      </div>

      {/* Map Navigation */}
      <div className="map-navigation">
        {/* Navigation dots will be added by JavaScript */}
      </div>

      {/* Hero Section */}
      <section className="hero-section scroll-section">
        <div className="hero-content">
          <div className="hero-avatar">
            {profile.profileImage && profile.profileImage.trim() ? (
              <img 
                src={profile.profileImage} 
                alt={profile.fullName}
              />
            ) : (
              <div className="avatar-placeholder">
                {(profile.fullName || '').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <h1 className="hero-name">{profile.fullName}</h1>
          
          {profile.title && (
            <p className="hero-title">{profile.title}</p>
          )}
          
          {profile.bio && (
            <p className="hero-bio">{profile.bio}</p>
          )}
          
          {/* Debug Info - Remove this later */}
          <div style={{ 
            marginTop: '20px', 
            fontSize: '0.8rem', 
            color: 'var(--text-secondary)',
            textAlign: 'left',
            background: 'rgba(0,0,0,0.1)',
            padding: '10px',
            borderRadius: '8px'
          }}>
            <p>Debug Info:</p>
            <p>Projects: {profile.projects?.length || 0}</p>
            <p>Skills: {profile.skills?.length || 0}</p>
            <p>Experience: {profile.experiences?.length || 0}</p>
            <p>Education: {profile.educationList?.length || 0}</p>
            <p>About: {profile.aboutSections?.length || 0}</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      {profile.aboutSections && profile.aboutSections.length > 0 && (
        <section className="scroll-section">
          <div className="content-card">
            <h2 className="section-title">🗺️ My Journey</h2>
            <div className="about-sections">
              {profile.aboutSections.map((section, index) => (
                <div key={section.id || index} className="about-section">
                  {section.title && <h3 style={{ color: 'var(--primary-blue)', marginBottom: '15px' }}>{section.title}</h3>}
                  <p style={{ color: 'var(--text-primary)', lineHeight: '1.8' }}>{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {profile.skills && profile.skills.length > 0 && (
        <section className="scroll-section">
          <div className="content-card">
            <h2 className="section-title">⚡ Skills Arsenal</h2>
            <TechSkills skills={profile.skills} />
          </div>
        </section>
      )}

      {/* Projects Section */}
      {profile.projects && profile.projects.length > 0 && (
        <section className="scroll-section">
          <div className="content-card">
            <h2 className="section-title">🚀 Epic Quests</h2>
            <Projects 
              projects={profile.projects} 
              onOpenProject={(projectId) => navigate(`/portfolio/${profile.id}/project/${projectId}`)} 
            />
          </div>
        </section>
      )}

      {/* Experience Section */}
      {profile.experiences && profile.experiences.length > 0 && (
        <section className="scroll-section">
          <div className="content-card">
            <h2 className="section-title">💼 Battle History</h2>
            <Experience 
              experience={profile.experiences} 
              onOpenExperience={(expId) => navigate(`/portfolio/${profile.id}/jobs/${expId}`)} 
            />
          </div>
        </section>
      )}

      {/* Education Section */}
      {profile.educationList && profile.educationList.length > 0 && (
        <section className="scroll-section">
          <div className="content-card">
            <h2 className="section-title">🎓 Academy of Learning</h2>
            <Education 
              education={profile.educationList} 
              onOpenEducation={(eduId) => navigate(`/portfolio/${profile.id}/education/${eduId}`)} 
            />
          </div>
        </section>
      )}

      {/* Empty State */}
      {(!profile.skills || profile.skills.length === 0) && 
       (!profile.projects || profile.projects.length === 0) && 
       (!profile.experiences || profile.experiences.length === 0) && 
       (!profile.educationList || profile.educationList.length === 0) && 
       (!profile.aboutSections || profile.aboutSections.length === 0) && (
        <section className="scroll-section">
          <div className="content-card">
            <h3>🌟 Portfolio Coming Soon</h3>
            <p>This portfolio is being crafted with care. Check back soon for amazing content!</p>
          </div>
        </section>
      )}

      {/* Enhanced Footer */}
      <footer className="scroll-section">
        <div className="content-card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--primary-blue)', marginBottom: '30px' }}>Let's Connect & Build Something Amazing!</h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', flexWrap: 'wrap' }}>
            {profile.email && (
              <a 
                href={`mailto:${profile.email}`}
                style={{ 
                  color: 'var(--primary-blue)', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'var(--light-blue)',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease'
                }}
              >
                📧 Email
              </a>
            )}
            
            {profile.phone && (
              <a 
                href={`tel:${profile.phone}`}
                style={{ 
                  color: 'var(--primary-blue)', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'var(--light-blue)',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease'
                }}
              >
                📱 Phone
              </a>
            )}
            
            {profile.location && (
              <span style={{ 
                color: 'var(--text-secondary)', 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'var(--bg-secondary)',
                borderRadius: '25px'
              }}>
                📍 {profile.location}
              </span>
            )}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>
              <img src="/src/assets/icons/github.svg" alt="GitHub" style={{ width: '30px', height: '30px' }} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>
              <img src="/src/assets/icons/linkedin.svg" alt="LinkedIn" style={{ width: '30px', height: '30px' }} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>
              <img src="/src/assets/icons/twitter.svg" alt="Twitter" style={{ width: '30px', height: '30px' }} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>
              <img src="/src/assets/icons/instagram.svg" alt="Instagram" style={{ width: '30px', height: '30px' }} />
            </a>
          </div>

          <div style={{ 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '20px', 
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }}>
            <p>© 2025 {profile.fullName}. Crafted with passion & code ⚡</p>
            <p style={{ marginTop: '10px' }}>Built with React • Animated with CSS • Powered by Dreams 🚀</p>
          </div>
        </div>
      </footer>
    </div>
  );
}