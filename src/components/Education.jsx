import React from 'react';

export default function Education({ education = [] }) {
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

  const formatGrade = (grade, gradeType) => {
    if (!grade) return '';
    if (gradeType) {
      return `${grade} ${gradeType}`;
    }
    return grade;
  };

  const formatSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    return skills.split(',').map(skill => skill.trim()).filter(skill => skill);
  };

  if (!education || education.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem',
        color: 'var(--text-secondary)' 
      }}>
        <p>No education data available.</p>
      </div>
    );
  }

  return (
    <div className="education-grid">
      {education.map((edu, index) => {
        const skills = formatSkills(edu.skills || edu.subjects);
        const grade = formatGrade(edu.grade || edu.gpa, edu.gradeType);
        
        return (
          <div
            key={edu.id || index}
            className="education-card"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="education-card__header">
              <div className="education-card__icon">
                🎓
              </div>
              <div className="education-card__title-section">
                <h3 className="education-card__degree">
                  {edu.degree || edu.qualification || 'Degree'}
                </h3>
                <p className="education-card__institution">
                  {edu.institution || edu.school || 'Institution'}
                </p>
                <div className="education-card__period">
                  {edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : formatPeriod(edu.startDate, edu.endDate)}
                </div>
              </div>
            </div>
            
            <div className="education-card__content">
              {/* Field of Study */}
              {edu.fieldOfStudy && (
                <div className="education-card__field">
                  <strong>Field of Study:</strong> {edu.fieldOfStudy}
                </div>
              )}
              
              {/* Grade */}
              {grade && (
                <div className="education-card__grade">
                  <strong>Grade:</strong> 
                  <span className="grade-value">{grade}</span>
                </div>
              )}
              
              {/* Location */}
              {edu.location && (
                <div className="education-card__location">
                  📍 {edu.location}
                </div>
              )}
              
              {/* Description */}
              {edu.description && (
                <div className="education-card__description">
                  {edu.description.split('\n').map((paragraph, pIndex) => (
                    <p key={pIndex} style={{ marginBottom: '0.75rem' }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              
              {/* Achievements */}
              {edu.achievements && (
                <div className="education-card__achievements">
                  <h4 style={{ 
                    color: 'var(--accent-primary)', 
                    fontSize: '1rem',
                    marginBottom: '0.5rem',
                    fontWeight: '600'
                  }}>
                    Achievements:
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {edu.achievements.split('\n').map((achievement, aIndex) => (
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
                          ⭐
                        </span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Relevant Coursework/Skills */}
              {skills.length > 0 && (
                <div className="education-card__skills">
                  <h4 style={{ 
                    color: 'var(--text-primary)', 
                    fontSize: '0.9rem',
                    marginBottom: '0.75rem',
                    fontWeight: '600'
                  }}>
                    Relevant Coursework:
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
                          background: 'var(--surface-secondary)',
                          color: 'var(--text-primary)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          border: '1px solid var(--border-primary)'
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .education-card {
          animation: fadeInUp 0.6s ease-out both;
        }
        
        .education-card__header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-primary);
        }
        
        .education-card__icon {
          font-size: 2rem;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        
        .education-card__title-section {
          flex: 1;
          color: #000000;
        }
        
        .education-card__period {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }
        
        .education-card__content > div {
          margin-bottom: 1rem;
        }
        
        .education-card__field,
        .education-card__grade,
        .education-card__location {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .grade-value {
          color: var(--accent-primary);
          font-weight: 600;
          margin-left: 0.5rem;
        }
        
        .education-card__description {
          margin-bottom: 1.5rem;
        }
        
        .education-card__achievements {
          margin-bottom: 1.5rem;
        }
        
        .education-card__skills {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-primary);
        }
      `}</style>
    </div>
  );
}