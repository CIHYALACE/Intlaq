import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../db/api';

export default function JobPostForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      // Invalidate and refetch the 'jobs' query to show the new job
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      // Redirect back to the dashboard
      navigate('/employer/dashboard');
    },
    onError: (error) => {
      console.error('Failed to create job:', error);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ title, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      {mutation.isError && (
        <div style={{ color: 'red' }}>Failed to post job. Please try again.</div>
      )}
      <div>
        <label>Job Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Job Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Posting...' : 'Post Job'}
      </button>
    </form>
  );
}
