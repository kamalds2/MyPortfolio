import React, { useEffect, useState } from 'react';

export default function Skills({ skills }) {
	const [animatedSkills, setAnimatedSkills] = useState([]);

	// Convert skill level strings to percentages
	const getLevelPercentage = (level) => {
		if (typeof level === 'number') return level;
		
		const levelMap = {
			'BEGINNER': 30,
			'INTERMEDIATE': 60,
			'ADVANCED': 85,
			'EXPERT': 95
		};
		
		return levelMap[level?.toUpperCase()] || 70;
	};

	useEffect(() => {
		if (skills && skills.length > 0) {
			// Animate skills on mount
			const timer = setTimeout(() => {
				setAnimatedSkills(skills.map(skill => ({
					...skill,
					animated: true
				})));
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [skills]);

	if (!skills || skills.length === 0) {
		return (
			<section className="section skills-section fade-in">
				<h2 className="section__title">Skills</h2>
				<p className="empty-message">No skills provided.</p>
			</section>
		);
	}

	return (
		<section className="section skills-section fade-in">
			<h2 className="section__title">Skills & Technologies</h2>
			<div className="skills-grid">
				{skills.map((skill, idx) => {
					const skillName = skill.name ?? skill;
					const skillLevel = getLevelPercentage(skill.level ?? skill.proficiency);
					const animatedSkill = animatedSkills.find(s => (s.name ?? s) === skillName);
					
					return (
						<div key={skill.id ?? idx} className="skill-card">
							<div className="skill-card__header">
								<div className="skill-card__name">{skillName}</div>
								{skill.level && (
									<span className="skill-card__badge">{skill.level}</span>
								)}
							</div>
							<div className="skill-card__level">
								<div 
									className="skill-card__progress"
									style={{
										width: animatedSkill?.animated ? `${skillLevel}%` : '0%'
									}}
								/>
							</div>
							<div className="skill-card__percentage">{skillLevel}%</div>
							{skill.description && (
								<div className="skill-card__description">{skill.description}</div>
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
}

