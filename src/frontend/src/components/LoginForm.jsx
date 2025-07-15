import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { loginUser } from '../db/api';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const { access, refresh } = data.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      window.dispatchEvent(new Event('storage'));

      const decodedToken = jwtDecode(access);
      const userType = decodedToken.user_type;

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
          navigate('/');
          break;
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    mutation.mutate({ 
      email: formData.email, 
      password: formData.password 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="h-custom w-100 d-flex flex-column justify-content-center px-4 gap-3 pt-5">
      {mutation.isError && (
        <div className="alert alert-danger" role="alert">
          Login failed. Please check your credentials.
        </div>
      )}
      <div>
        <p>Welcome Back</p>
        <p className="fs-3 fw-bold mb-3">Login To Your Account</p>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-md-12">
          <div className="form-floating">
            <input 
              type="email" 
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email address</label>
            {errors.email && (
              <div className="invalid-feedback">
                {errors.email}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="row g-3 mb-3">
        <div>
          <div className="form-floating">
            <input 
              type="password" 
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
            {errors.password && (
              <div className="invalid-feedback">
                {errors.password}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="form-check d-flex justify-content-between">
        <div>
          <input 
            className="form-check-input" 
            type="checkbox" 
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label className="form-check-label fs-7" htmlFor="flexCheckDefault">
            Remember Me
          </label>
        </div>
        <label className="form-check-label fs-7" htmlFor="flexCheckDefault">
          <a href="#" className="text-dark">Forgot Password?</a>
        </label>
      </div>
      <button 
        type="submit" 
        className="btn btn-dark w-100 py-2" 
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Logging in...' : 'Login'}
      </button>
      <p className="fs-7 align-self-center">
        New User? <a href="/register" className="text-dark fw-bold">SignUp Here</a>
      </p>
    </form>
  );
}