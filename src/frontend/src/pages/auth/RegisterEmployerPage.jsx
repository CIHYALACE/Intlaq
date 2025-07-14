import React from 'react';
import RegisterForm from '../../components/RegisterForm';

export default function RegisterEmployerPage(){
  return (
    <div>
      <h1>Register as Employer</h1>
      <RegisterForm type="employer" />
    </div>
  );
};