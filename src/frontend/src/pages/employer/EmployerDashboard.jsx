import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEmployerJobs, getEmployer } from '../../db/api';
import { getCurrentUser } from '../../utils/auth';

// Recent activities data
const recentActivities = [
  { id: 1, action: 'New application received', job: 'Senior Frontend Developer', time: '2 hours ago' },
  { id: 2, action: 'Interview scheduled', candidate: 'John Doe', time: '5 hours ago' },
  { id: 3, action: 'Position filled', job: 'UX/UI Designer', time: '1 day ago' },
];

// Format date to relative time
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString();
}

export default function EmployerDashboard() {  
  // Get employer ID from getCurrentUser
  const [currentUser, setCurrentUser] = useState(null);
  const employerId = currentUser?.employerId;


useEffect(() => {
  const fetchUser = async () => {
    const user = await getCurrentUser();
    console.log("User:", user);
    setCurrentUser(user);
  };
  fetchUser();
}, []);



  // Query for employer data with proper error handling
const { data: employer, isLoading: isLoadingEmployer } = useQuery({
  queryKey: ['employer', employerId],
  queryFn: () => getEmployer(employerId),
  enabled: !!employerId, // will wait until we have it
  onError: (error) => {
    console.error('Error fetching employer data:', error);
  }
});

const { data: jobsData, isLoading: isLoadingJobs, isError, error, refetch } = useQuery({
  queryKey: ['employerJobs', employerId],
  queryFn: () => getEmployerJobs(employerId),
  enabled: !!employerId,
  staleTime: 1000 * 60 * 5,
  retry: 2
});


  // Show loading state if either employer or jobs data is loading
  if (isLoadingJobs || isLoadingEmployer) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error loading jobs</h4>
          <p>{error.message}</p>
          <hr />
          <button 
            className="btn btn-outline-danger"
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Sort jobs by most recent first
  const recentJobs = jobsData?.data
    ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
    .map(job => ({
      id: job.id,
      title: job.title,
      applicants: job.applicants_count || 0,
      status: job.status || 'active',
      posted: formatDate(job.created_at),
      isActive: job.status === 'active' || !job.status
    })) || [];

  return (
    <div className="container-fluid py-4">
      {/* Welcome Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            Welcome back, {employer?.data?.company_name || 'Employer'}!
          </h1>
          <p className="text-muted mb-0">Here's what's happening with your jobs.</p>
        </div>
        <Link to="/employer/post-job" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i> Post a New Job
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted mb-1">Active Jobs</h6>
                  <h2 className="mb-0"> jobs</h2>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <i className="fas fa-briefcase text-primary" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted mb-1">Total Applications</h6>
                  <h2 className="mb-0"> applications</h2>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <i className="fas fa-user-tie text-success" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-uppercase text-muted mb-0">Hiring Progress</h6>
                <span className="badge bg-primary">%</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-warning" 
                  role="progressbar" 
                  style={{ width: `%` }}
                  aria-valuenow="0"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <small className="text-muted">Hired</small>
                <small className="text-muted">Interviews</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Jobs */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Job Postings</h5>
                <Link to="/employer/manage-jobs" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body p-0">
              {recentJobs.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Applicants</th>
                        <th className="text-center">Status</th>
                        <th>Posted</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentJobs.map((job) => (
                        <tr key={job.id}>
                          <td>
                            <Link to={`/employer/job-applicants/${job.id}`} className="text-decoration-none">
                              {job.title}
                            </Link>
                          </td>
                          <td>{job.applicants}</td>
                          <td className="text-center">
                            <span className={`badge ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                              {job.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{job.posted}</td>
                          <td className="text-end">
                            <Link to={`/employer/edit-job/${job.id}`} className="btn btn-sm btn-outline-secondary">
                              <i className="fas fa-edit"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-5">
                  <i className="fas fa-briefcase fa-3x text-muted mb-3"></i>
                  <h5>No jobs posted yet</h5>
                  <p className="text-muted">Get started by posting your first job listing</p>
                  <Link to="/employer/post-job" className="btn btn-primary mt-2">
                    <i className="fas fa-plus me-2"></i>Post a Job
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body p-0">
              {recentActivities.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="list-group-item border-0 py-3">
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <i className="far fa-clock text-muted"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1">
                            <strong>{activity.action}</strong>
                            {activity.job && (
                              <span className="text-muted"> for {activity.job}</span>
                            )}
                            {activity.candidate && (
                              <span className="text-muted"> with {activity.candidate}</span>
                            )}
                          </p>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-5">
                  <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
