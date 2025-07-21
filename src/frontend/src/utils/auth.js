import { jwtDecode } from 'jwt-decode';

export const getCurrentUser = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return null;
  }
  try {
    const decodedToken = jwtDecode(token);
    return { 
      id: decodedToken.user_id, 
      email: decodedToken.email,
      isEmployer: decodedToken.is_employer || false
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};