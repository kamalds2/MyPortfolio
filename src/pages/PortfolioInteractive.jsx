import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileDetails } from '../services/api';
import TechSkills from '../components/TechSkills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Footer from '../components/Footer';
import './PortfolioInteractive.scss';

export default function PortfolioInteractive() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState('enter');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [sectionProgress, setSectionProgress] = useState(0);
  


  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getProfileDetails(id);
        
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Determine section based on mouse position
      const windowHeight = window.innerHeight;
      const scrollPercentage = (e.clientY / windowHeight) * 100;
      
      if (scrollPercentage < 20) {
        if (currentSection !== 'about') setCurrentSection('about');
      } else if (scrollPercentage < 35) {
        if (currentSection !== 'skills') setCurrentSection('skills');
      } else if (scrollPercentage < 55) {
        if (currentSection !== 'projects') setCurrentSection('projects');
      } else if (scrollPercentage < 75) {
        if (currentSection !== 'experience') setCurrentSection('experience');
      } else {
        if (currentSection !== 'education') setCurrentSection('education');
      }
      
      setSectionProgress(scrollPercentage);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentSection]);

  const transitionToSection = (section) => {
    setCurrentSection(section);
  };

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
      <div className="tech-loading">
        <div className="tech-loading__content">
          <div className="tech-spinner"></div>
          <p>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tech-error">
        <h2>System Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Restart
        </button>
      </div>
    );
  }

  if (!profile) {
    return <div className="tech-error"><p>Profile not found.</p></div>;
  }

  return (
    <div className="tech-portfolio">
      {/* Progress Bar */}
      <div className="section-progress">
        <div 
          className="section-progress__fill"
          style={{ height: `${sectionProgress}%` }}
        ></div>
      </div>

      {/* About Section - Profile Reveal */}
      <section 
        className={`tech-section tech-section--about ${currentSection === 'about' ? 'active' : ''}`}
        style={{
          opacity: currentSection === 'about' ? 1 : 0.3,
          transform: `scale(${currentSection === 'about' ? 1 : 0.95})`
        }}
      >
        <div className="tech-section__content">
          <div className="profile-reveal">
            <div className="profile-reveal__image">
              {profile.profileImage ? (
                <img 
                  src={getImagePath(profile.profileImage)} 
                  alt={profile.fullName}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="profile-reveal__avatar"
                style={{ display: profile.profileImage ? 'none' : 'flex' }}
              >
                {profile.fullName?.charAt(0) || '?'}
              </div>
            </div>

            <div className="profile-reveal__info">
              <h1 className="profile-reveal__name">{profile.fullName || ''}</h1>
              {profile.title && <p className="profile-reveal__title">{profile.title}</p>}
              {profile.bio && <p className="profile-reveal__bio">{profile.bio}</p>}

              <div className="profile-reveal__actions">
                {profile.resumeUrl && (
                  <button onClick={downloadResume} className="tech-btn tech-btn--download">
                    <span className="tech-btn__icon">📥</span>
                    <span className="tech-btn__text">Download Resume</span>
                  </button>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="tech-btn tech-btn--contact">
                    <span className="tech-btn__icon">✉️</span>
                    <span className="tech-btn__text">Contact Me</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="tech-btn tech-btn--linkedin">
                    <span className="tech-btn__icon">💼</span>
                    <span className="tech-btn__text">LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="section-door section-door--exit">
          <div className="section-door__handle">▼</div>
          <p>Move down to explore Skills</p>
        </div>
      </section>

      {/* Skills Section - Icons Flying Out */}
      <section 
        className={`tech-section tech-section--skills ${currentSection === 'skills' ? 'active' : ''}`}
        style={{
          opacity: currentSection === 'skills' ? 1 : 0.3,
          transform: `translateY(${currentSection === 'skills' ? 0 : 100}px)`
        }}
      >
        <div className="tech-section__header">
          <h2>Technical Arsenal</h2>
          <p>Skills emerging from the code matrix</p>
        </div>

        <div className="skills-matrix">
          {profile.skills && profile.skills.map((skill, index) => (
            <div
              key={skill.id || index}
              className="skill-particle"
              style={{
                transitionDelay: `${index * 0.05}s`,
                opacity: currentSection === 'skills' ? 1 : 0
              }}
            >
              <div className="skill-particle__icon">
                {skill.icon || '⚡'}
              </div>
              <p className="skill-particle__name">{skill.name}</p>
              <div className="skill-particle__level">
                <div 
                  className="skill-particle__level-fill"
                  style={{
                    width: `${skill.level === 'EXPERT' ? '100%' : skill.level === 'ADVANCED' ? '75%' : skill.level === 'INTERMEDIATE' ? '50%' : '25%'}`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-door section-door--exit">
          <div className="section-door__handle">▼</div>
          <p>Scroll to view Projects</p>
        </div>
      </section>

      {/* Projects Section - Interactive Slider */}
      <section 
        className={`tech-section tech-section--projects ${currentSection === 'projects' ? 'active' : ''}`}
        style={{
          opacity: currentSection === 'projects' ? 1 : 0.3
        }}
      >
        <div className="tech-section__header">
          <h2>Project Showcase</h2>
          <p>Move your mouse to navigate through projects</p>
        </div>

        <div className="projects-slider">
          <Projects 
            projects={profile.projects || []} 
            onProjectClick={(id) => navigate(`/project/${id}`)}
            getImagePath={getImagePath}
            mouseX={mousePos.x}
            interactive={true}
          />
        </div>

        <div className="section-door section-door--exit">
          <div className="section-door__handle">▼</div>
          <p>Continue to Experience</p>
        </div>
      </section>

      {/* Experience Section - Animated Timeline */}
      <section 
        className={`tech-section tech-section--experience ${currentSection === 'experience' ? 'active' : ''}`}
        style={{
          opacity: currentSection === 'experience' ? 1 : 0.3,
          transform: `translateX(${currentSection === 'experience' ? 0 : -50}px)`
        }}
      >
        <div className="tech-section__header">
          <h2>Career Journey</h2>
          <p>Professional timeline with interactive elements</p>
        </div>

        <div className="experience-timeline-wrapper">
          <Experience experiences={profile.experiences || []} />
        </div>

        <div className="section-door section-door--exit">
          <div className="section-door__handle">▼</div>
          <p>Discover Education</p>
        </div>
      </section>

      {/* Education Section */}
      <section 
        className={`tech-section tech-section--education ${currentSection === 'education' ? 'active' : ''}`}
        style={{
          opacity: currentSection === 'education' ? 1 : 0.3,
          transform: `scale(${currentSection === 'education' ? 1 : 0.9})`
        }}
      >
        <div className="tech-section__header">
          <h2>Academic Foundation</h2>
          <p>Educational achievements and qualifications</p>
        </div>

        {profile.educationList && profile.educationList.length > 0 && (
          <div className="education-grid-wrapper">
            <Education education={profile.educationList} />
          </div>
        )}

        <div className="section-footer">
          <Footer profile={profile} />
        </div>
      </section>
    </div>
  );
}
