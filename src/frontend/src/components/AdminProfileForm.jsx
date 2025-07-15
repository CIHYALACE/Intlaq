import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAdmin } from '../db/api';

export default function AdminProfileForm({ adminData }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    user: {
      first_name: '',
      last_name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (adminData) {
      setFormData({
        user: {
          first_name: adminData.user?.first_name || '',
          last_name: adminData.user?.last_name || '',
          email: adminData.user?.email || '',
        },
      });
    }
  }, [adminData]);

  const mutation = useMutation({
    mutationFn: (updatedData) => updateAdmin(adminData.user.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', adminData.user.id]);
      alert('Profile updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, user: { ...prev.user, [name]: value } }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ user: formData.user });
  };

  return (
    <form onSubmit={handleSubmit}>
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
