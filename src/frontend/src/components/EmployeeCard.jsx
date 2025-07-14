import React from 'react';

export default function EmployeeCard({ employee }) {
  return (
    <div>
      <h4>{employee.name}</h4>
      <p>{employee.title}</p>
      {/* Link to view full profile */}
    </div>
  );
};
