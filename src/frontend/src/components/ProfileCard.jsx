import React from 'react';

export default function ProfileCard ({ profile }) {
  return (
    <div>
      <h2>{profile.name}</h2>
      <p>{profile.title}</p>
      {/* Add more profile details here */}
    </div>
  );
};