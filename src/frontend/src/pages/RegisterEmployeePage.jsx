import React from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterEmployeePage = () => {
  return (
    <div>
      <h1>Register as Employee</h1>
      <RegisterForm type="employee" />
    </div>
  );
};

export default RegisterEmployeePage;
