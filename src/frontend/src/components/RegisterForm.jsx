import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../db/api';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    user_type: 'employee', // default to employee
    company_name: '',
  });
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataToSubmit = { ...formData };
    if (dataToSubmit.user_type !== 'employer') {
      delete dataToSubmit.company_name;
    }
    mutation.mutate(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit}>
      {mutation.isError && (
        <div style={{ color: 'red' }}>
          Registration failed: {mutation.error.response?.data?.detail || 'Please try again.'}
        </div>
      )}

      <div>
        <label>Register as:</label>
        <select name="user_type" value={formData.user_type} onChange={handleChange}>
          <option value="employee">Employee</option>
          <option value="employer">Employer</option>
        </select>
      </div>

      <div>
        <label>Full Name</label>
        <input name="full_name" type="text" value={formData.full_name} onChange={handleChange} required />
      </div>

      <div>
        <label>Email</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div>
        <label>Password</label>
        <input name="password" type="password" value={formData.password} onChange={handleChange} required />
      </div>

      {formData.user_type === 'employer' && (
        <div>
          <label>Company Name</label>
          <input name="company_name" type="text" value={formData.company_name} onChange={handleChange} required />
        </div>
      )}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}