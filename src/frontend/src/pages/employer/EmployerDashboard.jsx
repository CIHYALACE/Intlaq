import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getJobs } from '../../db/api';

export default function EmployerDashboard() {
  const { data: jobs, error, isLoading, isError } = useQuery({
    queryKey: ['jobs'], // A unique key for this query
    queryFn: getJobs,   // The function that fetches the data
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
            <h1>Employer Dashboard</h1>
      <Link to="/employer/jobs/post">
        <button>Post a New Job</button>
      </Link>
      <h2>My Job Postings</h2>
      {jobs && jobs.data.length > 0 ? (
        <ul>
          {jobs.data.map((job) => (
                        <li key={job.id} style={{ marginBottom: '15px' }}>
              <h3>{job.title}</h3>
              <p>{job.description.substring(0, 100)}...</p>
              <Link to={`/employer/jobs/${job.id}/applicants`}>
                <button>View Applicants</button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have not posted any jobs yet.</p>
      )}
    </div>
  );
}
