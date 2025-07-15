import React, { useState, useEffect } from 'react';
import JobDetailsModal from './employee/JobDetailsModal';
import { getEmployerDetails } from '../db/api';

const JobCard = ({ job }) => {
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [employer, setEmployer] = useState(null);

  useEffect(() => {
    if (job.employer) {
      getEmployerDetails(job.employer).then(employerData => {
        if (employerData) {
          setEmployer(employerData);
        }
      });
    }
  }, [job.employer]);

  return (
    <div className="list-group-item list-group-item-action mb-3 rounded shadow-sm">
      <div className="d-flex w-100 justify-content-between">
        <div>
          <h5 className="mb-1">{job.title}</h5>
          <p className="mb-1">{employer?.company_name || "Company"} • {job.city || "Location"}</p>
          <div className="d-flex flex-wrap gap-2 mt-2">
            <span className="badge bg-primary">{job.type || "Hyperd"}</span>
            <span className="badge bg-secondary">{job.experience || "0-3"}</span>
            <span className="badge bg-success">{job.salary || "none"}</span>
          </div>
        </div>
        <small className="text-muted">{job.posted || "null"}</small>
      </div>

      <div className="mt-3">
        <button 
          type="button" 
          className="btn btn-primary btn-sm"
          onClick={() => setShowJobDetails(true)}
        >
          View Details
        </button>
      </div>

      <JobDetailsModal 
        job={job}
        show={showJobDetails}
        onHide={() => setShowJobDetails(false)}
      />
    </div>
  );
};

export default JobCard;
