import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getApplicationsForJob } from '../db/api';
import ApplicantCard from '../components/ApplicantCard';

export default function JobApplicantsPage() {
  const { id: jobId } = useParams(); // Get job ID from the URL

  const { data: applications, error, isLoading, isError } = useQuery({
    queryKey: ['applicants', jobId], // Unique key for this job's applicants
    queryFn: () => getApplicationsForJob(jobId),
    enabled: !!jobId, // Only run the query if jobId is available
  });

  if (isLoading) return <span>Loading applicants...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return (
    <div>
      <h1>Applicants for Job</h1>
      {applications && applications.data.length > 0 ? (
        <div>
          {applications.data.map((app) => (
            <ApplicantCard key={app.id} application={app} />
          ))}
        </div>
      ) : (
        <p>No one has applied to this job yet.</p>
      )}
    </div>
  );
}
