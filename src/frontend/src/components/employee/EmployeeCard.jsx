import React, { useState } from 'react';
import JobDetailsModal from './JobDetailsModal';

export default function EmployeeCard({ employee, job }) {
  if (!employee || typeof employee !== 'object') {
    return null;
  }

  // Ensure skills is an array and limit to 3 items
  const displaySkills = Array.isArray(employee.skills) 
    ? employee.skills.slice(0, 3) 
    : [];

  // Generate a unique key for each skill
  const getSkillKey = (skill, index) => 
    `${employee.id}-skill-${index}-${String(skill).substring(0, 10)}`;

  const [showJobDetails, setShowJobDetails] = useState(false);

  return (
    <div>
      <div className="card employee-card h-100 border-0 shadow-sm hover-lift transition-all">
        <div className="card-body p-4 text-center">
          <div className="avatar avatar-xl mb-3">
            <img
              src={employee.image}
              alt={employee.name}
              className="rounded-circle border border-3 border-white shadow-sm"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = 'https://via.placeholder.com/120';
              }}
            />
          </div>

          <h4 className="mb-1 fw-bold">
            {typeof employee.user === 'number' 
              ? `Employee #${employee.user}`
              : employee.user?.username?.slice(0, 10) || 'Unknown Employee'}
          </h4>

          {job && (
            <div className="mt-3">
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setShowJobDetails(true)}
              >
                View Job Details
              </button>
            </div>
          )}

          {displaySkills.length > 0 && (
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
              {displaySkills.map((skill, index) => (
                <span 
                  key={getSkillKey(skill, index)}
                  className="badge bg-light text-dark"
                >
                  {typeof skill === 'object' ? skill.name || skill.title : skill}
                </span>
              ))}
            </div>
          )}

          <a
            href={`/profile/${employee.user?.id || employee.id}`}
            className="btn btn-sm btn-outline-primary stretched-link"
            onClick={(e) => {
              if (!employee.user?.id && !employee.id) {
                e.preventDefault();
                console.warn('Employee ID is missing');
              }
            }}
          >
            View Profile
          </a>
        </div>
      </div>

      {employee.isAvailable && (
        <span className="badge bg-success position-absolute top-0 end-0 m-3">
          Available
        </span>
      )}

      <JobDetailsModal 
        job={job}
        show={showJobDetails}
        onHide={() => setShowJobDetails(false)}
      />
    </div>
  );
}
