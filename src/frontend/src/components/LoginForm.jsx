import React from 'react';

export default function LoginForm () {
  // TODO: Add form logic
  return (
    <form>
      <div>
        <label>Email</label>
        <input type="email" />
      </div>
      <div>
        <label>Password</label>
        <input type="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};