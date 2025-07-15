import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployee } from '../../db/api';

export default function EmployeeProfileForm({ employeeData, onUpdate }) {
  const [formData, setFormData] = useState({ full_name: '', email: '' });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (employeeData) {
      setFormData({
        full_name: employeeData.full_name || '',
        email: employeeData.email || '',
      });
    }
  }, [employeeData]);

  const mutation = useMutation({
    mutationFn: (updatedData) => updateEmployee(employeeData.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', employeeData.id] });
      alert('Profile updated successfully!');
      if (onUpdate) onUpdate();
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Full Name</label>
        <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}
