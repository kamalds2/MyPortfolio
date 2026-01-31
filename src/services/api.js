import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Get list of active profiles (returns SimpleProfile objects with id, fullName, profileImage)
export const getProfiles = () => api.get('/portfolio/profiles');

// Fetch a single profile by ID (returns full Profile object with all details)
export const getProfileDetails = (id) => api.get(`/portfolio/profiles/${id}`);

// Utility function to get proper image paths from admin uploads
export const getImagePath = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Serve images through your backend API at localhost:8080
  if (imagePath.startsWith('/uploads')) {
    return `http://localhost:8080${imagePath}`;
  }
  
  // If it starts with /, serve through backend
  if (imagePath.startsWith('/')) {
    return `http://localhost:8080${imagePath}`;
  }
  
  // Default fallback - serve through backend
  return `http://localhost:8080/uploads/${imagePath}`;
};

// Helper function to parse comma-separated images
export const parseImages = (imageString) => {
  if (!imageString) return [];
  
  if (Array.isArray(imageString)) {
    return imageString.map(img => getImagePath(img)).filter(Boolean);
  }
  
  return imageString
    .split(',')
    .map(img => img.trim())
    .filter(img => img)
    .map(img => getImagePath(img));
};

export default api;