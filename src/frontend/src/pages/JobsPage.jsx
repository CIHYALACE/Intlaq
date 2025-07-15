import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getJobs } from '../db/api';
import JobCard from '../components/JobCard';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('type') || '',
    experience: searchParams.get('exp') || '',
  });

  // Fetch jobs when component mounts or filters change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Convert filters to match your API expected format if needed
        const apiFilters = {
          q: filters.search,
          location: filters.location,
          type: filters.jobType,
          experience: filters.experience
        };
        
        console.log('Fetching jobs with filters:', apiFilters);
        const response = await getJobs(apiFilters);
        console.log('Jobs API response:', response);
        // The response data is in response.data
        const jobsData = response.data || [];
        console.log('Jobs data:', jobsData);
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // You might want to set an error state to show to the user
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update URL parameters
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The useEffect will trigger with the updated filters
  };

  return (
    <div className="container-fluid py-4 bg-white bg-light" style={{ backgroundColor: '#ffffff' }}>
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Filter Jobs</h5>
              
              <form onSubmit={handleSearch}>
                <div className="mb-3">
                  <label htmlFor="search" className="form-label">Keywords</label>
                  <input
                    type="text"
                    className="form-control"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Job title, company..."
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City, state, or remote"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="jobType" className="form-label">Job Type</label>
                  <select
                    className="form-select"
                    id="jobType"
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="experience" className="form-label">Experience Level</label>
                  <select
                    className="form-select"
                    id="experience"
                    name="experience"
                    value={filters.experience}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Experience</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Apply Filters
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => {
                    setFilters({
                      search: '',
                      location: '',
                      jobType: '',
                      experience: '',
                    });
                    setSearchParams({});
                  }}
                >
                  Clear All
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Available Jobs</h2>
            <div>
              <span className="text-muted me-2">Sort by:</span>
              <select className="form-select d-inline-block w-auto">
                <option>Most Recent</option>
                <option>Most Relevant</option>
                <option>Highest Salary</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading jobs...</p>
            </div>
          ) : (
            <div>
              {jobs.length > 0 ? (
                <div className="list-group">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-briefcase fa-4x text-muted mb-3"></i>
                  <p className="text-muted">No jobs found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
