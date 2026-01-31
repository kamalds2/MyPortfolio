import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileDetails } from '../services/api';
import Footer from '../components/Footer';
import robotAiIcon from '../assets/icons/robot-ai.svg';
import aiBrainIcon from '../assets/icons/ai-brain.svg';
import aiChipIcon from '../assets/icons/ai-chip.svg';
import './AboutPage.scss';

export default function AboutPage() {
  const { profileId, id } = useParams();
  const actualId = id || profileId;
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [expandedSection, setExpandedSection] = useState(null);
  const profileImageRef = React.useRef(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const res = await getProfileDetails(actualId);
        console.log('Profile details response:', res);
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile', err);
        setError('Failed to load profile information. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [actualId]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!profileImageRef.current) return;
      
      const rect = profileImageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  const getAreaIcon = (areaName) => {
    const name = areaName.toLowerCase();
    if (name.includes('frontend') || name.includes('ui') || name.includes('design')) return '🎨';
    if (name.includes('backend') || name.includes('server') || name.includes('api')) return '⚙️';
    if (name.includes('ai') || name.includes('machine') || name.includes('ml') || name.includes('intelligence')) return '🤖';
    if (name.includes('cloud') || name.includes('devops') || name.includes('aws') || name.includes('azure')) return '☁️';
    if (name.includes('mobile') || name.includes('app')) return '📱';
    if (name.includes('data') || name.includes('database')) return '📊';
    if (name.includes('security') || name.includes('cyber')) return '🔒';
    if (name.includes('game') || name.includes('3d')) return '🎮';
    if (name.includes('blockchain') || name.includes('crypto')) return '⛓️';
    if (name.includes('iot') || name.includes('embedded')) return '🔌';
    return '💻'; // Default icon
  };

  // Use dynamic areas data from API response
  const techAreas = profile?.areas?.map(area => ({
    id: area.id.toString(),
    icon: getAreaIcon(area.name),
    title: area.name,
    description: area.description,
    skills: area.skillsList || []
  })) || [];

  if (loading) {
    return (
      <div className="about-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="about-page">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => navigate(`/portfolio/${actualId}`)}>
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="about-page">
        <div className="error-container">
          <h2>Profile not found</h2>
          <p>The requested profile could not be found.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Go Back Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="about-page">
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
        
        <img src={robotAiIcon} alt="" className="float-svg" style={{ top: '25%', left: '5%', animationDelay: '0.3s' }} />
        <img src={aiBrainIcon} alt="" className="float-svg" style={{ top: '55%', right: '8%', animationDelay: '1.8s' }} />
        <img src={aiChipIcon} alt="" className="float-svg" style={{ top: '75%', left: '50%', animationDelay: '2.8s' }} />
        <img src={robotAiIcon} alt="" className="float-svg" style={{ top: '45%', right: '25%', animationDelay: '3.8s' }} />
      </div>

      {/* Navigation */}
      <nav className="nav-header">
        <div className="nav-container">
           <button  style={{ color: "white" }}
onClick={() => navigate(`/portfolio/${actualId}`)} className="nav-logo">
            ← {profile.fullName?.split(' ')[0] || 'Back'}
          </button>
        </div>
      </nav>

      {/* Hero Section with Animated Profile */}
      <section className="about-hero">
        <div 
          className="profile-container"
          ref={profileImageRef}
        >
          <div 
            className="profile-image-wrapper"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x / 20}deg) rotateX(${-mousePos.y / 20}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {profile.profileImage ? (
              <img 
                src={getImagePath(profile.profileImage)}
                alt={profile.fullName}
                className="profile-image"
              />
            ) : (
              <div className="profile-avatar">
                {profile.fullName?.charAt(0) || '?'}
              </div>
            )}
            
            {/* Floating AI Robot Icons */}
            <div className="floating-icon icon-1">🤖</div>
            <div className="floating-icon icon-2">🎯</div>
            <div className="floating-icon icon-3">💡</div>
            <div className="floating-icon icon-4">⚡</div>
          </div>
          
          <div className="profile-info">
            <h1 
              className="profile-name"
              onClick={() => setExpandedSection(expandedSection === 'name' ? null : 'name')}
            >
              {profile.fullName}
            </h1>
            
            {expandedSection === 'name' && (
              <div className="expanded-content">
                <p className="expanded-text">
                  {profile.bio || 'A passionate developer dedicated to creating innovative solutions and pushing the boundaries of technology.'}
                </p>
                <div className="robot-icons">
                  <span className="robot-icon">🤖</span>
                  <span className="robot-icon">🚀</span>
                  <span className="robot-icon">💻</span>
                </div>
              </div>
            )}
            
            {profile.title && (
              <p className="profile-title">{profile.title}</p>
            )}
            
            <div 
              className="bio-section"
              onClick={() => setExpandedSection(expandedSection === 'bio' ? null : 'bio')}
            >
              <p className={`bio-text ${expandedSection === 'bio' ? 'expanded' : ''}`}>
                {profile?.aboutSections[0].content || 'Click to learn more about me...'}
              </p>
              
              {expandedSection === 'bio' && (
                <div className="bio-details">
                  <div className="detail-card">
                    <span className="detail-icon">📧</span>
                    <div>
                      <h4>Email</h4>
                      <p>{profile.email || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  {profile.phone && (
                    <div className="detail-card">
                      <span className="detail-icon">📱</span>
                      <div>
                        <h4>Phone</h4>
                        <p>{profile.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile.linkedin && (
                    <div className="detail-card">
                      <span className="detail-icon">💼</span>
                      <div>
                        <h4>LinkedIn</h4>
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                          Connect with me
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Areas Grid */}
      <section className="tech-areas">
        <h2 className="section-title">Areas of Expertise</h2>
        
        {techAreas.length > 0 ? (
          <div className="tech-grid">
            {techAreas.map((area, index) => (
              <div 
                key={area.id}
                className={`tech-card ${expandedSection === area.id ? 'expanded' : ''}`}
                onClick={() => setExpandedSection(expandedSection === area.id ? null : area.id)}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="card-header">
                  <span className="card-icon">{area.icon}</span>
                  <h3>{area.title}</h3>
                </div>
                
                <p className="card-description">{area.description}</p>
                
                {expandedSection === area.id && (
                  <div className="card-expanded">
                    <h4>Key Skills</h4>
                    <ul className="skills-list">
                      {area.skills.map((skill, idx) => (
                        <li key={idx}>
                          <span className="skill-bullet">🤖</span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="card-footer">
                  <span className="expand-hint">
                    {expandedSection === area.id ? 'Click to collapse' : 'Click to expand'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-areas">
            <p>No specific areas of expertise defined yet.</p>
          </div>
        )}
      </section>

      {/* Skills Showcase */}
      {profile.skills && profile.skills.length > 0 && (
        <section className="skills-showcase">
          <h2 className="section-title">Technical Skills</h2>
          
          <div className="skills-container">
            {profile.skills.map((skill, index) => (
              <div 
                key={index}
                className="skill-badge"
                style={{
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <span className="skill-robot">🤖</span>
                <span className="skill-name">{skill.name || skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}