import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfiles } from '../services/api';
import placeholderProfile from '../assets/images/placeholder-profile.svg';


function ProfileSelector() {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const response = await getProfiles();
        console.log('Fetched profiles:', response.data);
        setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    }
    fetchProfiles();
  }, []);

  const handleSelect = (id) => {
    localStorage.setItem('selectedProfileId', id); // Persist profile ID
    navigate(`/portfolio/${id}`); // Navigate to profile-specific route
  };

  return (
    <div className="profile-selector">
      <h1 className="profile-selector__title fade-in-up">Choose Your Developer</h1>

      <div className="profile-selector__grid fade-in-up">
        {profiles.length > 0 ? (
          profiles.map(profile => (
            <div
              key={profile.id}
              className="profile-selector__card fade-in-up"
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(profile.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(profile.id); }}
            >
              <div className="profile-selector__image-wrapper">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.fullName}
                    className="profile-selector__image"
                  />
                ) : (
                  <img src={placeholderProfile} alt="placeholder" className="profile-selector__image" />
                )}
              </div>
              <div className="profile-selector__content">
                <h3 className="profile-selector__name">{profile.fullName}</h3>
                <p className="profile-selector__bio">{profile.headline ?? profile.title ?? ''}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="profile-selector__empty">No profiles available.</p>
        )}
      </div>
    </div>
  );
}

export default ProfileSelector;