import React, { useEffect, useState } from 'react';

export default function TechSkills({ skills = [] }) {
  const [animatedSkills, setAnimatedSkills] = useState([]);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimatedSkills(skills);
    }, 100);

    return () => clearTimeout(timer);
  }, [skills]);

  const getSkillIcon = (skillName) => {
    const skill = skillName.toLowerCase();
    const iconMap = {
      'javascript': '/src/assets/icons/tech/javascript.svg',
      'react': '/src/assets/icons/tech/react.svg',
      'python': '/src/assets/icons/tech/python.svg',
      'java': '/src/assets/icons/tech/java.svg',
      'git': '/src/assets/icons/tech/git.svg',
      '.net': '/src/assets/icons/tech/dotnet.svg',
      'spring': '/src/assets/icons/tech/spring.svg',
      'node.js': '/src/assets/icons/tech/nodejs.svg',
      'typescript': '/src/assets/icons/tech/typescript.svg',
      'angular': '/src/assets/icons/tech/angular.svg',
      'vue': '/src/assets/icons/tech/vue.svg',
      'docker': '/src/assets/icons/tech/docker.svg',
      'aws': '/src/assets/icons/tech/aws.svg',
      'mongodb': '/src/assets/icons/tech/mongodb.svg',
      'postgresql': '/src/assets/icons/tech/postgresql.svg',
      'mysql': '/src/assets/icons/tech/mysql.svg'
    };

    return iconMap[skill] || null;
  };

  const getSkillLevel = (skill) => {
    // Convert different level formats to percentage
    if (typeof skill.level === 'number') {
      return Math.min(skill.level, 100);
    }
    
    if (typeof skill.level === 'string') {
      const level = skill.level.toLowerCase();
      switch (level) {
        case 'beginner': return 25;
        case 'intermediate': return 50;
        case 'advanced': return 75;
        case 'expert': return 90;
        default:
          // Try to parse percentage or number
          const match = level.match(/(\d+)/);
          return match ? parseInt(match[1]) : 70;
      }
    }
    
    return 70; // Default level
  };

  const formatSkillLevel = (skill) => {
    const percentage = getSkillLevel(skill);
    if (percentage >= 90) return 'Expert';
    if (percentage >= 75) return 'Advanced';
    if (percentage >= 50) return 'Intermediate';
    if (percentage >= 25) return 'Beginner';
    return 'Learning';
  };

  if (!skills || skills.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem',
        color: 'var(--text-secondary)' 
      }}>
        <p>No skills data available.</p>
      </div>
    );
  }

  return (
    <div className="skills-grid">
      {skills.map((skill, index) => {
        const iconSrc = getSkillIcon(skill.name);
        const percentage = getSkillLevel(skill);
        const levelText = formatSkillLevel(skill);
        
        return (
          <div
            key={skill.id || index}
            className="skill-card slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="skill-card__content">
              {/* Skill Icon */}
              <div className="skill-card__icon">
                {iconSrc ? (
                  <img 
                    src={iconSrc} 
                    alt={skill.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  style={{ 
                    display: iconSrc ? 'none' : 'flex',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  {skill.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              </div>
              
              {/* Skill Name */}
              <h3 className="skill-card__name">{skill.name}</h3>
              
              {/* Skill Level */}
              <p className="skill-card__level">{levelText}</p>
              
              {/* Progress Bar */}
              <div className="skill-progress">
                <div 
                  className="skill-progress__fill"
                  style={{ 
                    width: animatedSkills.includes(skill) ? `${percentage}%` : '0%',
                    '--target-width': `${percentage}%`
                  }}
                />
              </div>
              
              {/* Percentage */}
              <div className="skill-percentage">{percentage}%</div>
              
              {/* Description (if available) */}
              {skill.description && (
                <p className="skill-card__description" style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  marginTop: 'var(--space-3)',
                  lineHeight: '1.5'
                }}>
                  {skill.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
      
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .slide-up {
          animation: slideUp 0.8s ease-out both;
        }
        
        .skill-progress__fill {
          transition: width 1.5s ease-out 0.5s;
        }
        
        .skill-card__icon img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          filter: brightness(1.1);
        }
        
        .skill-card__description {
          text-align: left;
          font-size: 0.85rem;
          line-height: 1.4;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-primary);
        }
      `}</style>
    </div>
  );
}