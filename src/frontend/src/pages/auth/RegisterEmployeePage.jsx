import React from 'react';
import RegisterForm from '../../components/RegisterForm';

export default function RegisterEmployeePage(){
  return (
    <div>
      <h1>Register as Employee</h1>
      <RegisterForm type="employee" />
    </div>
  );
};