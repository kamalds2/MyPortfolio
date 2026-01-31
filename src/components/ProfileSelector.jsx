import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfiles } from '../services/api';

export default function ProfileSelector() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true);
        setError(null);
        const response = await getProfiles();
        console.log('Profiles response:', response);
        
        if (response.data && Array.isArray(response.data)) {
          setProfiles(response.data);
        } else {
          console.warn('No profiles data or not an array:', response);
          setProfiles([]);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again.');
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProfiles();
  }, []);

  const handleProfileClick = (profileId) => {
    navigate(`/portfolio/${profileId}`);
  };

  const getImagePath = (imagePath) => {
    if (!imagePath) return null;
    
    // Serve images through your backend API at localhost:8080
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:8080${imagePath}`;
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Default fallback - serve through backend
    return `http://localhost:8080/uploads/images/${imagePath}`;
  };



  if (loading) {
    return (
      <div className="profile-selector">
        <div className="profile-selector__hero">
          <h1 className="profile-selector__title">Loading Portfolios...</h1>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid var(--border-primary)',
            borderTop: '3px solid var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '2rem auto'
          }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-selector">
        <div className="profile-selector__hero">
          <h1 className="profile-selector__title">Error</h1>
          <p className="profile-selector__subtitle" style={{ color: 'var(--accent-danger)' }}>
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{ marginTop: '2rem' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-selector">
      <div className="profile-selector__hero">
        <h1 className="profile-selector__title">
          Choose a Portfolio
        </h1>
        <p className="profile-selector__subtitle">
          Explore different professional profiles and discover their work.
        </p>
      </div>

      {profiles.length === 0 ? (
        <div className="profile-selector__empty">
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.2rem',
            textAlign: 'center',
            margin: '2rem 0'
          }}>
            No profiles available at the moment.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-secondary"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="profile-selector__grid">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="profile-card fade-in"
              onClick={() => handleProfileClick(profile.id)}
              style={{ animationDelay: `${profiles.indexOf(profile) * 0.1}s` }}
            >
              <div className="profile-card__image">
                {profile.profileImage ? (
                  <img 
                    src={getImagePath(profile.profileImage)} 
                    alt={profile.fullName}
                    onError={(e) => {
                      console.log('Image failed to load:', e.target.src);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="profile-card__avatar"
                  style={{ display: profile.profileImage ? 'none' : 'flex' }}
                >
                  {profile.fullName?.charAt(0) || '?'}
                </div>
              </div>
              
              <h3 className="profile-card__name">
                {profile.fullName || ''}
              </h3>
              
              {profile.title && (
                <p className="profile-card__role">{profile.title}</p>
              )}
              
              {profile.bio && (
                <p className="profile-card__bio">
                  {profile.bio.length > 120 
                    ? `${profile.bio.substring(0, 120)}...` 
                    : profile.bio
                  }
                </p>
              )}
              
              <div className="profile-card__action">
                <span 
                  className="profile-card__cta"
                  style={{
                    color: 'var(--accent-primary)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginTop: '1rem',
                    display: 'block',
                    textAlign: 'center'
                  }}
                >
                  View Portfolio →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}