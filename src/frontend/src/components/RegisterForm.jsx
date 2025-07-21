import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../db/api';
import { getCities } from '../db/api';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
    // role: 'employee',
    // Employee specific fields
    national_id: '',
    city: '',
    // Employer specific field
    company_name: ''
  });
  
  // Fetch cities from the backend
  const { data: cities = [], isLoading: isLoadingCities, error: citiesError } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
    initialData: [],
    retry: 1,
    refetchOnWindowFocus: false
  });
  
  console.log('Cities data:', { cities, citiesError });
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
      if (error.response?.data?.error?.includes('already exists')) {
        setApiError('This email is already registered. Please use a different email or log in.');
      } else if (error.response?.data?.error) {
        setApiError(error.response.data.error);
      } else {
        setApiError('Registration failed. Please try again.');
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Role-specific validations
    if (formData.role === 'employee') {
      if (!formData.national_id) newErrors.national_id = 'National ID is required';
      if (!formData.city) newErrors.city = 'City is required';
    } else if (formData.role === 'employer') {
      if (!formData.company_name) newErrors.company_name = 'Company name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare the data to submit based on role
    const commonData = {
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      password: formData.password,
      role: formData.role
    };

    let roleSpecificData = {};
    if (formData.role === 'employee') {
      roleSpecificData = {
        national_id: formData.national_id,
        city: formData.city
      };
    } else if (formData.role === 'employer') {
      roleSpecificData = {
        company_name: formData.company_name,
      };
    }

    const dataToSubmit = { ...commonData, ...roleSpecificData };
    
    console.log('Submitting registration data:', {
      role: formData.role,
      payload: dataToSubmit,
      hasCompanyName: !!dataToSubmit.company_name,
      hasCity: !!dataToSubmit.city,
      hasNationalId: !!dataToSubmit.national_id
    });
    
    mutation.mutate(dataToSubmit, {
      onError: (error) => {
        console.error('Registration error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }
    });
  };

  return (
    <div className="h-100 w-100 d-flex flex-column justify-content-start" style={{ overflowY: 'auto' }}>
      <div className="container-fluid p-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="mb-2 text-center sticky-top bg-white pt-2 pb-1" style={{ top: 0, zIndex: 1, left: 0, right: 0, padding: '0 1rem' }}>
          <h2 className="fs-5 fw-bold mb-0">Create an Account</h2>
          <p className="small text-muted mb-1">Join our community today</p>
        </div>

        {/* Error Messages */}
        {apiError && (
          <div className="alert alert-danger mb-3" role="alert">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

      <div className="form-floating mb-3">
        <select 
          className={`form-select ${errors.role ? 'is-invalid' : ''}`} 
          id="role"
          name="role" 
          value={formData.role} 
          onChange={handleChange}
        >
          <option value="">Select a role</option>
          <option value="employee">Employee</option>
          <option value="employer">Employer</option>
        </select>
        <label htmlFor="role">I am a(n)</label>
        {errors.role && <div className="invalid-feedback">{errors.role}</div>}
      </div>

      <div className="row g-2 mb-2">
        <div className="col-md-6">
          <div className="form-floating" style={{ marginBottom: '0.5rem' }}>
            <input 
              className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} 
              id="firstName"
              name="first_name" 
              type="text" 
              placeholder="First Name"
              value={formData.first_name} 
              onChange={handleChange}
            />
            <label htmlFor="firstName">First Name</label>
            {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating" style={{ marginBottom: '0.5rem' }}>
            <input 
              className={`form-control ${errors.last_name ? 'is-invalid' : ''}`} 
              id="lastName"
              name="last_name" 
              type="text" 
              placeholder="Last Name"
              value={formData.last_name} 
              onChange={handleChange}
            />
            <label htmlFor="lastName">Last Name</label>
            {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
          </div>
        </div>
      </div>

      {/* Employee Specific Fields */}
      {formData.role === 'employee' && (
        <>
          <div className="form-floating mb-2">
            <input 
              className={`form-control ${errors.national_id ? 'is-invalid' : ''}`} 
              id="nationalId"
              name="national_id" 
              type="text" 
              placeholder="National ID"
              value={formData.national_id} 
              onChange={handleChange}
            />
            <label htmlFor="nationalId">National ID</label>
            {errors.national_id && <div className="invalid-feedback">{errors.national_id}</div>}
          </div>
          
          <div className="form-floating mb-2">
            <select
              className={`form-select ${errors.city ? 'is-invalid' : ''}`}
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={isLoadingCities || citiesError}
            >
              <option value="">Select a city</option>
              {cities?.map(city => (
                <option key={city?.id} value={city?.id}>
                  {city?.name || 'Unknown City'}
                </option>
              ))}
            </select>
            <label htmlFor="city">City</label>
            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
            {citiesError && (
              <div className="text-danger small mt-1">Failed to load cities. Please try again later.</div>
            )}
            {isLoadingCities && (
              <div className="form-text">Loading cities...</div>
            )}
          </div>
        </>
      )}

      {/* Employer Specific Fields */}
      {formData.role === 'employer' && (
        <div className="form-floating mb-2">
          <input 
            className={`form-control ${errors.company_name ? 'is-invalid' : ''}`} 
            id="companyName"
            name="company_name"
            type="text"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={handleChange}
          />
          <label htmlFor="companyName">Company Name</label>
          {errors.company_name && <div className="invalid-feedback">{errors.company_name}</div>}
        </div>
      )}

      <div className="form-floating mb-2">
        <input 
          className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
          id="email"
          name="email" 
          type="email" 
          placeholder="name@example.com"
          value={formData.email} 
          onChange={handleChange}
        />
        <label htmlFor="email">Email address</label>
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="row g-2 mb-2">
        <div className="col-md-6">
          <div className="form-floating" style={{ marginBottom: '0.5rem' }}>
            <input 
              className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
              id="password"
              name="password" 
              type="password" 
              placeholder="Password"
              value={formData.password} 
              onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
            {errors.password && (
              <div className="invalid-feedback">
                {errors.password}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating" style={{ marginBottom: '0.5rem' }}>
            <input 
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} 
              id="confirmPassword"
              name="confirmPassword" 
              type="password" 
              placeholder="Confirm Password"
              value={formData.confirmPassword} 
              onChange={handleChange}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            {errors.confirmPassword && (
              <div className="invalid-feedback">
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="sticky-bottom bg-white pt-2 pb-1" style={{ bottom: 0, zIndex: 1, left: 0, right: 0, padding: '0 1rem' }}>
        <button 
          type="submit" 
          className="btn btn-dark w-100 py-2"
          disabled={mutation.isPending}
          style={{ fontSize: '0.9rem' }}
        >
        {mutation.isPending ? 'Creating Account...' : 'Create Account'}
      </button>
      <p className="text-center mt-2 mb-0 small">
        Already have an account? <Link to="/login" className="text-dark fw-bold">Sign In</Link>
      </p>
    </div>
        </form>
      </div>
    </div>
  );
}