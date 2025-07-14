import React from 'react';

export default function JobPostForm() {
  // TODO: Add form logic for creating/editing a job
  return (
    <form>
      <div>
        <label>Job Title</label>
        <input type="text" />
      </div>
      <div>
        <label>Job Description</label>
        <textarea />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
