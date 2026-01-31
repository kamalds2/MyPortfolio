import React from 'react';

export default function Education({ education, onOpenEducation }) {
	if (!education || education.length === 0) {
		return (
			<section className="section education-section fade-in">
				<h2 className="section__title">Education</h2>
				<p className="empty-message">No education records.</p>
			</section>
		);
	}

	return (
		<section className="section education-section fade-in">
			<h2 className="section__title">Education</h2>
			<div className="card-grid">
				{education.map((edu, idx) => (
					<article
						key={edu.id ?? idx}
						className="info-card education-card"
						role={onOpenEducation ? 'button' : undefined}
						tabIndex={onOpenEducation ? 0 : undefined}
						onClick={() => onOpenEducation && onOpenEducation(edu.id)}
						onKeyDown={(ev) => { if (onOpenEducation && (ev.key === 'Enter' || ev.key === ' ')) onOpenEducation(edu.id); }}
					>
						<div className="education-card__header">
							<h3 className="info-card__title education-card__institution">
								{edu.institution}
							</h3>
							<p className="info-card__subtitle education-card__degree">
								{edu.degree}
								{edu.fieldOfStudy && (
									<span className="education-card__field"> — {edu.fieldOfStudy}</span>
								)}
							</p>
						</div>

						<div className="education-card__duration">
							<span className="info-card__date">
								{edu.startYear} - {edu.endYear ?? 'Present'}
							</span>
						</div>

						{edu.description && (
							<p className="info-card__description education-card__description">
								{edu.description}
							</p>
						)}

						{edu.gpa && (
							<div className="education-card__gpa">
								<strong>GPA:</strong> {edu.gpa}
							</div>
						)}

						{edu.honors && edu.honors.length > 0 && (
							<div className="education-card__honors">
								<strong>Honors & Awards:</strong>
								<ul>
									{edu.honors.map((honor, honorIdx) => (
										<li key={honorIdx}>{honor}</li>
									))}
								</ul>
							</div>
						)}

						{edu.relevantCourses && edu.relevantCourses.length > 0 && (
							<div className="education-card__courses">
								<strong>Relevant Courses:</strong>
								<div className="education-card__course-tags">
									{edu.relevantCourses.slice(0, 3).map((course, courseIdx) => (
										<span key={courseIdx} className="education-card__course-tag">
											{course}
										</span>
									))}
									{edu.relevantCourses.length > 3 && (
										<span className="education-card__course-tag">
											+{edu.relevantCourses.length - 3} more
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

