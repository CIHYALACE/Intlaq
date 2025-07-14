import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div>
      <h3>{job.title}</h3>
      <p>{job.company}</p>
      <p>{job.location}</p>
      {/* Add more job details or a link to the detail page */}
    </div>
  );
};

export default JobCard;
