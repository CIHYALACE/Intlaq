import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import { loginUser } from '../db/api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const { access, refresh } = data.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Decode the token to get user info
      const decodedToken = jwtDecode(access);
      const userType = decodedToken.user_type; // Assuming the token has a 'user_type' field

      // Redirect based on user type
      switch (userType) {
        case 'employer':
          navigate('/employer/dashboard');
          break;
        case 'employee':
          navigate('/employee/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/'); // Fallback to home page
          break;
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {mutation.isError && (
        <div style={{ color: 'red' }}>Login failed. Please check your credentials.</div>
      )}
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}