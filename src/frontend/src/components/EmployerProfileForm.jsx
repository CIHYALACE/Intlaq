import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployer } from '../db/api';

export default function EmployerProfileForm({ employerData }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    company_name: '',
    user: {
      first_name: '',
      last_name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (employerData) {
      setFormData({
        company_name: employerData.company_name || '',
        user: {
          first_name: employerData.user?.first_name || '',
          last_name: employerData.user?.last_name || '',
          email: employerData.user?.email || '',
        },
      });
    }
  }, [employerData]);

  const mutation = useMutation({
    mutationFn: (updatedData) => updateEmployer(employerData.user.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['employer', employerData.user.id]);
      alert('Profile updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.user) {
      setFormData((prev) => ({ ...prev, user: { ...prev.user, [name]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
        <div>
            <label>Company Name:</label>
            <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} />
        </div>
        <div>
            <label>First Name:</label>
            <input type="text" name="first_name" value={formData.user.first_name} onChange={handleChange} />
        </div>
        <div>
            <label>Last Name:</label>
            <input type="text" name="last_name" value={formData.user.last_name} onChange={handleChange} />
        </div>
        <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.user.email} onChange={handleChange} />
        </div>
        <button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Updating...' : 'Update Profile'}
        </button>
    </form>
  );
}
