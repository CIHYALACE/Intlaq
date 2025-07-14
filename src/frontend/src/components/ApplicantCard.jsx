import React from 'react';

export default function ApplicantCard({ applicant }) {
  return (
    <div>
      <h4>{applicant.name}</h4>
      <p>{applicant.email}</p>
      {/* Link to view full profile */}
    </div>
  );
};
