import { jwtDecode } from 'jwt-decode';
import { getEmployers } from '../db/api';

// Caches the employer list into localStorage
export const fetchAndCacheEmployers = async function () {
  try {
    const response = await getEmployers();
    if (response && response.data) {
      localStorage.setItem("employers_cache", JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    console.error("Failed to fetch employers:", error);
  }
  return [];
};

// Returns current user from JWT and cached employerId (if available)
export const getCurrentUser = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    const user = {
      id: decodedToken.user_id,
      email: decodedToken.email,
      isEmployer: decodedToken.is_employer || false,
      employerId: null,
    };

    // Read cached employers (must already exist in localStorage)
    if (user.isEmployer) {
      const cached = localStorage.getItem("employers_cache");
      if (cached) {
        try {
          const employersList = JSON.parse(cached);
          const match = employersList.find((e) => e.user === user.id);
          if (match) {
            user.employerId = match.id;
          }
        } catch (err) {
          console.error("Failed to parse employers_cache:", err);
        }
      }
    }

    return user;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// Optional utilities to store a single employer object
export const setEmployerData = (employerData) => {
  if (employerData && employerData.user) {
    localStorage.setItem('employer_data', JSON.stringify(employerData));
  }
};

export const clearEmployerData = () => {
  localStorage.removeItem('employer_data');
};

// ⚠️ This must be called at the app's entry point (e.g. App.jsx or index.js)
fetchAndCacheEmployers();
