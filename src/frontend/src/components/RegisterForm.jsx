import React from 'react';

const RegisterForm = ({ type }) => {
  // TODO: Add form logic and fields specific to employee/employer
  return (
    <form>
      <div>
        <label>Full Name</label>
        <input type="text" />
      </div>
      <div>
        <label>Email</label>
        <input type="email" />
      </div>
      <div>
        <label>Password</label>
        <input type="password" />
      </div>
      {type === 'employer' && (
        <div>
          <label>Company Name</label>
          <input type="text" />
        </div>
      )}
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
