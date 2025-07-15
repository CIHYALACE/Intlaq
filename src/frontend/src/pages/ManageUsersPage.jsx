import React from 'react';
import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, getEmployers, deleteEmployee, deleteEmployer } from '../db/api';

const UserList = ({ title, users, deleteMutation }) => (
  <div>
    <h3>{title}</h3>
    <ul>
      {users.map(user => (
        <li key={user.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>{user.full_name} ({user.email})</span>
          <button onClick={() => deleteMutation.mutate(user.id)} disabled={deleteMutation.isPending && deleteMutation.variables === user.id}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default function ManageUsersPage() {
  const queryClient = useQueryClient();

  const results = useQueries({
    queries: [
      { queryKey: ['employees'], queryFn: getEmployees },
      { queryKey: ['employers'], queryFn: getEmployers },
    ],
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });

  const deleteEmployerMutation = useMutation({
    mutationFn: deleteEmployer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employers'] }),
  });

  const isLoading = results.some(query => query.isLoading);
  if (isLoading) return <span>Loading users...</span>;

  const [employees, employers] = results.map(query => query.data?.data || []);

  return (
    <div>
      <h1>Manage Users</h1>
      <UserList title="Employees" users={employees} deleteMutation={deleteEmployeeMutation} />
      <UserList title="Employers" users={employers} deleteMutation={deleteEmployerMutation} />
    </div>
  );
}
