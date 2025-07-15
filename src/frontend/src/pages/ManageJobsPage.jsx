import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, deleteJob } from '../db/api';

export default function ManageJobsPage() {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
  });

  const deleteJobMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });

  if (isLoading) return <span>Loading jobs...</span>;

  return (
    <div>
      <h1>Manage Jobs</h1>
      <ul>
        {(jobs?.data || []).map(job => (
          <li key={job.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>{job.title}</span>
            <button onClick={() => deleteJobMutation.mutate(job.id)} disabled={deleteJobMutation.isPending && deleteJobMutation.variables === job.id}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
