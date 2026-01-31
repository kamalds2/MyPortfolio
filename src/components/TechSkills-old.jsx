import React from 'react';
import javascriptIcon from '../assets/icons/tech/javascript.svg';
import reactIcon from '../assets/icons/tech/react.svg';
import pythonIcon from '../assets/icons/tech/python.svg';
import javaIcon from '../assets/icons/tech/java.svg';
import gitIcon from '../assets/icons/tech/git.svg';
import dotnetIcon from '../assets/icons/tech/dotnet.svg';
import springIcon from '../assets/icons/tech/spring.svg';

const techIcons = {
  javascript: javascriptIcon,
  react: reactIcon,
  python: pythonIcon,
  java: javaIcon,
  git: gitIcon,
  dotnet: dotnetIcon,
  '.net': dotnetIcon,
  spring: springIcon,
  'spring boot': springIcon,
};

export default function TechSkills({ skills }) {
  if (!skills || skills.length === 0) {
    return (
      <section className="section skills-section fade-in">
        <h2 className="section__title">Skills & Technologies</h2>
        <p className="empty-message">No skills to show.</p>
      </section>
    );
  }

  const getSkillIcon = (skillName) => {
    const name = skillName?.toLowerCase() || '';
    return techIcons[name] || null;
  };

  const getSkillLevel = (level) => {
    if (typeof level === 'number') return level;
    
    const levelMap = {
      'BEGINNER': 30,
      'INTERMEDIATE': 60,
      'ADVANCED': 85,
      'EXPERT': 95
    };
    
    return levelMap[level?.toUpperCase()] || 70;
  };

  return (
    <section className="section skills-section fade-in">
      <h2 className="section__title">Skills & Technologies</h2>
      <div className="skills-grid">
        {skills.map((skill, idx) => {
          const icon = getSkillIcon(skill.name);
          const level = getSkillLevel(skill.level);
          
          return (
            <div
              key={skill.id ?? idx}
              className="skill-card fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="skill-card__icon">
                {icon ? (
                  <img src={icon} alt={skill.name} className="tech-icon" />
                ) : (
                  <div className="skill-placeholder">
                    {skill.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="skill-card__content">
                <h3 className="skill-card__name">{skill.name}</h3>
                <div className="skill-card__level">
                  <div className="skill-progress">
                    <div 
                      className="skill-progress__fill" 
                      style={{ 
                        width: `${level}%`,
                        animationDelay: `${idx * 0.1 + 0.3}s`
                      }}
                    />
                  </div>
                  <span className="skill-level-text">{skill.level || `${level}%`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}