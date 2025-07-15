import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, createApplication } from '../db/api';
import { getCurrentUser } from '../utils/auth';

export default function EmployeeDashboard() {
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();

  const { data: jobs, error, isLoading, isError } = useQuery({
    queryKey: ['allJobs'],
    queryFn: getJobs,
  });

  const applyMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      alert('Application submitted successfully!');
      // Optionally, you could invalidate queries to refetch data, e.g., a user's applications list.
      // queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
    onError: (error) => {
      console.error('Application failed:', error);
      alert(`Application failed: ${error.response?.data?.detail || 'You may have already applied.'}`);
    },
  });

  const handleApply = (jobId) => {
    if (!currentUser) {
      alert('You must be logged in to apply.');
      return;
    }
    if (currentUser.role !== 'employee') {
      alert(`Only users with the 'employee' role can apply. Your current role is: '${currentUser.role}'.`);
      return;
    }
    applyMutation.mutate({
      job: jobId,
      employee: currentUser.id,
    });
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <h2>Available Jobs</h2>
      {jobs && jobs.data.length > 0 ? (
        <ul>
          {jobs.data.map((job) => (
                        <li key={job.id} style={{ marginBottom: '15px' }}>
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.employer_name || 'N/A'}</p>
              <p>{job.description.substring(0, 150)}...</p>
              <button
                onClick={() => handleApply(job.id)}
                disabled={applyMutation.isPending && applyMutation.variables?.job === job.id}
              >
                {applyMutation.isPending && applyMutation.variables?.job === job.id ? 'Applying...' : 'Apply'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs are available at the moment.</p>
      )}
    </div>
  );
}
