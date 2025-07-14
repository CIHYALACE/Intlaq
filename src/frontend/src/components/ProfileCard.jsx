import React from 'react';

const ProfileCard = ({ profile }) => {
  return (
    <div>
      <h2>{profile.name}</h2>
      <p>{profile.title}</p>
      {/* Add more profile details here */}
    </div>
  );
};

export default ProfileCard;
