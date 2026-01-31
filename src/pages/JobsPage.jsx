import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileDetails } from '../services/api';

export default function JobsPage() {
  const { profileId, jobId } = useParams();
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchExperience() {
      try {
        setLoading(true);
        setError(null);
        const res = await getProfileDetails(profileId);
        const profile = res.data;
        if (profile && profile.experience) {
          setExperience(profile.experience);
        } else {
          setError('No experience found for this profile.');
        }
      } catch (err) {
        console.error('Failed to load experience', err);
        setError('Failed to load experience. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchExperience();
  }, [profileId]);

  if (loading) {
    return (
      <div className="portfolio-bg">
        <div className="portfolio-loading-card glass-card fade-in">
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
          <span>Loading experience...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-bg">
        <div className="portfolio-message-card glass-card fade-in-up">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => navigate(`/portfolio/${profileId}`)}>Back to Portfolio</button>
        </div>
      </div>
    );
  }

  if (!experience.length) {
    return (
      <div className="portfolio-bg">
        <div className="portfolio-message-card glass-card fade-in-up">
          <h2>No Experience Found</h2>
          <p>No work experience is available for this profile.</p>
          <button className="btn-primary" onClick={() => navigate(`/portfolio/${profileId}`)}>Back to Portfolio</button>
        </div>
      </div>
    );
  }

  if (jobId) {
    const job = experience.find(j => String(j.id) === String(jobId));
    if (!job) {
      return (
        <div className="portfolio-bg">
          <div className="portfolio-message-card glass-card fade-in-up">
            <h2>Experience not found</h2>
            <p>The requested work experience could not be found.</p>
            <button className="btn-primary" onClick={() => navigate(`/portfolio/${profileId}`)}>Back to Portfolio</button>
          </div>
        </div>
      );
    }

    return (
      <div className="portfolio-bg">
        <div className="experience-detail glass-card fade-in-up">
          <header className="experience-detail__header">
            <button 
              onClick={() => navigate(`/portfolio/${profileId}`)}
              className="back-button"
            >
              ← Back to Portfolio
            </button>
            <h1 className="experience-detail__title gradient-text">
              {job.position ?? job.title}
            </h1>
            <p className="experience-detail__company">{job.company}</p>
          </header>

          <div className="experience-detail__content">
            <div className="experience-detail__meta">
              <p className="experience-detail__duration">
                <strong>Duration:</strong> {job.startDate} - {job.endDate ?? 'Present'}
              </p>
              {job.location && (
                <p className="experience-detail__location">
                  <strong>Location:</strong> {job.location}
                </p>
              )}
            </div>

            <div className="experience-detail__description">
              <h2>Job Description</h2>
              <p>{job.description || 'No description available.'}</p>
            </div>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="experience-detail__responsibilities">
                <h3>Key Responsibilities</h3>
                <ul>
                  {job.responsibilities.map((responsibility, idx) => (
                    <li key={idx}>{responsibility}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.achievements && job.achievements.length > 0 && (
              <div className="experience-detail__achievements">
                <h3>Key Achievements</h3>
                <ul>
                  {job.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.technologies && job.technologies.length > 0 && (
              <div className="experience-detail__technologies">
                <h3>Technologies Used</h3>
                <div className="tech-tags">
                  {job.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-bg">
      <div className="experience-list glass-card fade-in-up">
        <header className="experience-list__header">
          <button 
            onClick={() => navigate(`/portfolio/${profileId}`)}
            className="back-button"
          >
            ← Back to Portfolio
          </button>
          <h1 className="experience-list__title gradient-text">Professional Experience</h1>
        </header>

        <div className="card-grid">
          {experience.map(job => (
            <article
              key={job.id}
              className="info-card experience-card"
              onClick={() => navigate(`/portfolio/${profileId}/jobs/${job.id}`)}
            >
              <h3 className="info-card__title">
                {job.position ?? job.title}
              </h3>
              <p className="info-card__subtitle">{job.company}</p>
              <p className="info-card__date">
                {job.startDate} - {job.endDate ?? 'Present'}
              </p>
              {job.description && (
                <p className="info-card__description">
                  {job.description.slice(0, 200)}
                  {job.description.length > 200 ? '...' : ''}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}