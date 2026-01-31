import React from 'react';

export default function Experience({ experience, onOpenExperience }) {
	if (!experience || experience.length === 0) {
		return (
			<section className="section experience-section fade-in">
				<h2 className="section__title">Experience</h2>
				<p className="empty-message">No experience listed.</p>
			</section>
		);
	}

	return (
		<section className="section experience-section fade-in">
			<h2 className="section__title">Professional Experience</h2>
			<div className="card-grid">
				{experience.map((exp, idx) => (
					<article
						key={exp.id ?? idx}
						className="info-card experience-card"
						role={onOpenExperience ? 'button' : undefined}
						tabIndex={onOpenExperience ? 0 : undefined}
						onClick={() => onOpenExperience && onOpenExperience(exp.id)}
						onKeyDown={(ev) => { if (onOpenExperience && (ev.key === 'Enter' || ev.key === ' ')) onOpenExperience(exp.id); }}
					>
						<div className="experience-card__header">
							<h3 className="info-card__title experience-card__position">
								{exp.position ?? exp.title}
							</h3>
							<p className="info-card__subtitle experience-card__company">
								{exp.company}
							</p>
						</div>
						
						<div className="experience-card__duration">
							<span className="info-card__date">
								{exp.startDate} - {exp.endDate ?? 'Present'}
							</span>
						</div>

						{exp.description && (
							<p className="info-card__description experience-card__description">
								{(exp.description || '').slice(0, 200)}
								{exp.description && exp.description.length > 200 ? '…' : ''}
							</p>
						)}

						{exp.achievements && exp.achievements.length > 0 && (
							<div className="experience-card__achievements">
								<strong>Key Achievements:</strong>
								<ul>
									{exp.achievements.slice(0, 2).map((achievement, achIdx) => (
										<li key={achIdx}>{achievement}</li>
									))}
									{exp.achievements.length > 2 && (
										<li>+{exp.achievements.length - 2} more achievements</li>
									)}
								</ul>
							</div>
						)}

						{exp.technologies && exp.technologies.length > 0 && (
							<div className="experience-card__technologies">
								<strong>Technologies:</strong>
								<div className="experience-card__tech-tags">
									{exp.technologies.slice(0, 4).map((tech, techIdx) => (
										<span key={techIdx} className="experience-card__tech-tag">
											{tech}
										</span>
									))}
									{exp.technologies.length > 4 && (
										<span className="experience-card__tech-tag">
											+{exp.technologies.length - 4}
										</span>
									)}
								</div>
							</div>
						)}
					</article>
				))}
			</div>
		</section>
	);
}

