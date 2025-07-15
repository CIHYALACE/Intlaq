import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../db/api';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
    role: 'employee', // default to employee
    company_name: '',
    national_id: '',
    city: ''
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // On successful registration, redirect to the login page
      navigate('/login');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
      // You can display a more specific error message based on the response
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const dataToSubmit = { ...formData };
    
    // Clean up the data before sending
    delete dataToSubmit.confirmPassword;
    delete dataToSubmit.full_name;
    
    console.log('Submitting registration data:', dataToSubmit);
    mutation.mutate(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="h-100 w-100 d-flex flex-column justify-content-start" style={{ overflowY: 'auto' }}>
      <div className="container-fluid p-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="mb-2 text-center sticky-top bg-white pt-2 pb-1" style={{ top: 0, zIndex: 1, left: 0, right: 0, padding: '0 1rem' }}>
        <h2 className="fs-5 fw-bold mb-0">Create an Account</h2>
        <p className="small text-muted mb-1">Join our community today</p>
      </div>

      {mutation.isError && (
        <div className="alert alert-danger" role="alert">
          {mutation.error.response?.data?.detail || 'Registration failed. Please try again.'}
        </div>
      )}

      <div className="form-floating mb-2">
        <select 
          className="form-select" 
          id="role"
          name="role" 
          value={formData.role} 
          onChange={handleChange}
        >
          <option value="employee">Employee</option>
          <option value="employer">Employer</option>
        </select>
        <label htmlFor="role">I am a(n)</label>
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
              required 
            />
            <label htmlFor="firstName">First Name</label>
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
              required 
            />
            <label htmlFor="lastName">Last Name</label>
          </div>
        </div>
      </div>

      {formData.role === 'employee' && (
        <>
          <div className="form-floating mb-2">
            <input 
              className="form-control" 
              id="nationalId"
              name="national_id" 
              type="text" 
              placeholder="National ID"
              value={formData.national_id} 
              onChange={handleChange} 
              required={formData.role === 'employee'}
            />
            <label htmlFor="nationalId">National ID</label>
          </div>
          
          <div className="form-floating mb-2">
            <input 
              className="form-control" 
              id="city"
              name="city" 
              type="text" 
              placeholder="City"
              value={formData.city} 
              onChange={handleChange} 
              required={formData.role === 'employee'}
            />
            <label htmlFor="city">City</label>
          </div>
        </>
      )}

      <div className="form-floating mb-2">
        <input 
          className="form-control" 
          id="email"
          name="email" 
          type="email" 
          placeholder="name@example.com"
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <label htmlFor="email">Email address</label>
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
              required 
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

      {formData.role === 'employer' && (
        <div className="form-floating mb-2">
          <input 
            className="form-control" 
            id="companyName"
            name="company_name" 
            type="text" 
            placeholder="Company Name"
            value={formData.company_name} 
            onChange={handleChange} 
            required={formData.role === 'employer'}
          />
          <label htmlFor="companyName">Company Name</label>
        </div>
      )}

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
      </div>
    </form>
  );
}