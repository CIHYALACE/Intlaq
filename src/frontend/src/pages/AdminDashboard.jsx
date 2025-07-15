import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getEmployees, getEmployers, getJobs } from '../db/api';

export default function AdminDashboard() {
  const results = useQueries({
    queries: [
      { queryKey: ['employees'], queryFn: getEmployees },
      { queryKey: ['employers'], queryFn: getEmployers },
      { queryKey: ['jobs'], queryFn: getJobs },
    ],
  });

  const isLoading = results.some((query) => query.isLoading);
  const isError = results.some((query) => query.isError);

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error fetching data.</span>;

  const [employees, employers, jobs] = results.map((query) => query.data?.data || []);

  return (
    <div>
            <h1>Admin Dashboard</h1>

      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin/users"><button style={{ marginRight: '10px' }}>Manage Users</button></Link>
        <Link to="/admin/jobs"><button>Manage Jobs</button></Link>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h2>Total Employees</h2>
          <p>{employees.length}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h2>Total Employers</h2>
          <p>{employers.length}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h2>Total Jobs</h2>
          <p>{jobs.length}</p>
        </div>
      </div>

      <div>
        <h2>All Users</h2>
        <ul>
          {employees.map(user => <li key={`emp-${user.id}`}>{user.full_name} (Employee)</li>)}
          {employers.map(user => <li key={`empr-${user.id}`}>{user.full_name} (Employer)</li>)}
        </ul>
      </div>

      <div>
        <h2>All Jobs</h2>
        <ul>
          {jobs.map(job => <li key={job.id}>{job.title}</li>)}
        </ul>
      </div>
    </div>
  );
}
