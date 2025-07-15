import React from 'react';

export default function ApplicantCard({ application }) {
  // Assuming the application object contains employee details
  const { employee_details } = application;

  if (!employee_details) {
    return <div>Loading employee details...</div>;
  }

  return (
    <div style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
      <h4>{employee_details.full_name}</h4>
      <p>Email: {employee_details.email}</p>
      {/* You can add a link to the full employee profile here */}
    </div>
  );
}
