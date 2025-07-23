import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEmployer } from '../../db/api';
import { getCurrentUser } from '../../utils/auth';

export default function EmployerProfilePage() {
  const currentUser = getCurrentUser();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['employer', currentUser?.id],
    queryFn: () => currentUser?.id ? getEmployer(currentUser.id) : Promise.reject(new Error('No user ID')),
    enabled: !!currentUser?.id,
  });

  if (isLoading) return <div className="container mt-4">Loading profile...</div>;
  if (isError) return <div className="container mt-4">Error: {error.message}</div>;
  if (!data) return <div className="container mt-4">No profile data found</div>;

  const employer = data.data;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="fas fa-building fa-5x text-primary"></i>
              </div>
              <h3>{employer.company_name || 'Company Name'}</h3>
              <p className="text-muted">{employer.industry || 'Industry not specified'}</p>
              <a href="/employer/profile/edit" className="btn btn-primary">
                <i className="fas fa-edit me-2"></i>Edit Profile
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Company Information</h4>
              <div className="mb-3">
                <h6>About Us</h6>
                <p>{employer.about || 'No description provided.'}</p>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <h6>Contact Information</h6>
                  <p className="mb-1"><i className="fas fa-envelope me-2"></i> {employer.email}</p>
                  <p className="mb-1"><i className="fas fa-phone me-2"></i> {employer.phone || 'Not provided'}</p>
                  <p className="mb-1"><i className="fas fa-globe me-2"></i> 
                    {employer.website ? (
                      <a href={employer.website.startsWith('http') ? employer.website : `https://${employer.website}`} target="_blank" rel="noopener noreferrer">
                        {employer.website}
                      </a>
                    ) : 'Not provided'}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6>Location</h6>
                  <p className="mb-1"><i className="fas fa-map-marker-alt me-2"></i> 
                    {employer.location || 'Location not specified'}
                  </p>
                  <h6 className="mt-3">Company Size</h6>
                  <p>{employer.company_size || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
