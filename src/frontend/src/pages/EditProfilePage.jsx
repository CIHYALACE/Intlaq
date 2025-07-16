import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEmployee, getEmployer, getAdmin } from '../db/api';
import { getCurrentUser } from '../utils/auth';
import EmployeeProfileForm from '../components/employee/EmployeeProfileForm';
import EmployerProfileForm from '../components/employer/EmployerProfileForm';
import AdminProfileForm from '../components/AdminProfileForm';

export default function EditProfilePage() {
  const currentUser = getCurrentUser();

  const isEmployee = currentUser?.type === 'employee';
  const isEmployer = currentUser?.type === 'employer';
  const isAdmin = currentUser?.type === 'admin';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [currentUser?.type, currentUser?.id],
    queryFn: () => {
      if (isEmployee) return getEmployee(currentUser.id);
      if (isEmployer) return getEmployer(currentUser.id);
      if (isAdmin) return getAdmin(currentUser.id);
      return Promise.reject(new Error('Invalid user type'));
    },
    enabled: !!currentUser && (isEmployee || isEmployer || isAdmin),
  });

  if (!currentUser) {
    return <div>You must be logged in to view this page.</div>;
  }

  if (!isEmployee && !isEmployer && !isAdmin) {
    return <div>Profile editing is not available for your role.</div>;
  }

  if (isLoading) return <span>Loading profile...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return (
    <div>
      <h1>Edit Your Profile</h1>
      {isEmployee && data && <EmployeeProfileForm employeeData={data.data} />}
      {isEmployer && data && <EmployerProfileForm employerData={data.data} />}
      {isAdmin && data && <AdminProfileForm adminData={data.data} />}
    </div>
  );
}
