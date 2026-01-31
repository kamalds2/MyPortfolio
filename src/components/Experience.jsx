import React from 'react';

export default function Experience({ experiences = [] }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const formatPeriod = (startDate, endDate) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    return `${start} - ${end}`;
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      let duration = `${years} year${years !== 1 ? 's' : ''}`;
      if (remainingMonths > 0) {
        duration += ` ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
      }
      return duration;
    }
  };

  const formatSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    return skills.split(',').map(skill => skill.trim()).filter(skill => skill);
  };

  if (!experiences || experiences.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem',
        color: 'var(--text-secondary)' 
      }}>
        <p>No work experience data available.</p>
      </div>
    );
  }

  return (
    <div className="experience-timeline">
      {experiences.map((experience, index) => {
        const skills = formatSkills(experience.skills);
        const duration = calculateDuration(experience.startDate, experience.endDate);
        
        return (
          <div
            key={experience.id || index}
            className="experience-item"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="experience-card">
              <div className="experience-card__header">
                <h3 className="experience-card__title">
                  {experience.role || experience.jobTitle || experience.title || 'Position'}
                </h3>
                <p className="experience-card__company">
                  {experience.companyName || experience.company || 'Company'}
                </p>
                <div className="experience-card__period">
                  <span className="experience-card__dates">
                    {formatPeriod(experience.startDate, experience.endDate)}
                  </span>
                  {duration && (
                    <span className="experience-card__duration">
                      • {duration}
                    </span>
                  )}
                </div>
                {experience.location && (
                  <p className="experience-card__location">
                    📍 {experience.location}
                  </p>
                )}
              </div>
              
              {experience.description && (
                <div className="experience-card__description">
                  {experience.description.split('\n').map((paragraph, pIndex) => (
                    <p key={pIndex} style={{ marginBottom: '0.75rem' }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              
              {/* Key Achievements */}
              {experience.achievements && (
                <div className="experience-card__achievements">
                  <h4 style={{ 
                    color: 'var(--accent-primary)', 
                    fontSize: '1rem',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    Key Achievements:
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {experience.achievements.split('\n').map((achievement, aIndex) => (
                      <li key={aIndex} style={{
                        marginBottom: '0.5rem',
                        paddingLeft: '1.5rem',
                        position: 'relative',
                        color: 'var(--text-secondary)'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: '0',
                          color: 'var(--accent-primary)'
                        }}>
                          ✓
                        </span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Skills/Technologies Used */}
              {skills.length > 0 && (
                <div className="experience-card__skills">
                  <h4 style={{ 
                    color: 'var(--text-primary)', 
                    fontSize: '0.9rem',
                    marginBottom: '0.75rem',
                    fontWeight: '600'
                  }}>
                    Technologies Used:
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--space-2)'
                  }}>
                    {skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        style={{
                          background: 'var(--border-secondary)',
                          color: 'var(--accent-primary)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          border: '1px solid var(--accent-primary)'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .experience-item {
          animation: slideInLeft 0.6s ease-out both;
        }
        
        .experience-item:nth-child(even) {
          animation: slideInRight 0.6s ease-out both;
        }
        
        .experience-card__header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-primary);
        }
        
        .experience-card__period {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .experience-card__duration {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        
        .experience-card__location {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin: 0;
        }
        
        .experience-card__description {
          margin-bottom: 1.5rem;
        }
        
        .experience-card__achievements {
          margin-bottom: 1.5rem;
        }
        
        .experience-card__skills {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-primary);
        }
      `}</style>
    </div>
  );
}