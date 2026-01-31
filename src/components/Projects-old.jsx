import React from 'react';
import placeholderProject from '../assets/images/placeholder-project.svg';

export default function Projects({ projects, onOpenProject }) {
	if (!projects || projects.length === 0) {
		return (
			<section className="section projects-section fade-in">
				<h2 className="section__title">Projects</h2>
				<p className="empty-message">No projects to show.</p>
			</section>
		);
	}

	return (
		<section className="section projects-section fade-in">
			<h2 className="section__title">Featured Projects</h2>
			<div className="card-grid">
				{projects.map((project, idx) => (
					<article
						key={project.id ?? idx}
						className="info-card project-card"
						role={onOpenProject ? 'button' : undefined}
						tabIndex={onOpenProject ? 0 : undefined}
						onClick={() => onOpenProject && onOpenProject(project.id)}
						onKeyDown={(e) => { if (onOpenProject && (e.key === 'Enter' || e.key === ' ')) onOpenProject(project.id); }}
					>
						<div className="project-card__image">
							<img 
								src={project.imageUrl || placeholderProject} 
								alt={project.title} 
								className="project-card__thumbnail" 
							/>
							{project.status && (
								<span className="project-card__status">{project.status}</span>
							)}
							{project.category && (
								<span className="project-card__category">{project.category}</span>
							)}
						</div>
						<div className="project-card__content">
							<h3 className="info-card__title project-card__title">
								{project.title}
							</h3>
							{project.description && (
								<p className="info-card__description project-card__description">
									{(project.description || '').slice(0, 150)}
									{project.description && project.description.length > 150 ? '…' : ''}
								</p>
							)}
							{project.techStack && (
								<div className="project-card__technologies">
									{project.techStack.split(',').slice(0, 4).map((tech, techIdx) => (
										<span key={techIdx} className="project-card__tech-tag">
											{tech.trim()}
										</span>
									))}
									{project.techStack.split(',').length > 4 && (
										<span className="project-card__tech-tag">
											+{project.techStack.split(',').length - 4} more
										</span>
									)}
								</div>
							)}
							{project.projectUrl && (
								<div className="project-card__links">
									<a 
										href={project.projectUrl} 
										target="_blank" 
										rel="noopener noreferrer"
										onClick={(e) => e.stopPropagation()}
									>
										🔗 View Project
									</a>
								</div>
							)}
						</div>
					</article>
				))}
			</div>
		</section>
	);
}

