import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApplication, getEmployerDetails } from '../../db/api';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-dark/dark.css';

export default function JobDetailsModal({ job, show, onHide }) {
  const modalRef = useRef(null);
  const [employer, setEmployer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (job && job.employer) {
      getEmployerDetails(job.employer).then(employerData => {
        if (employerData) {
          setEmployer(employerData);
        }
      });
    }
  }, [job]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to apply for this job.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel',
        customClass: {
          confirmButton: 'btn btn-primary mx-2',
          cancelButton: 'btn btn-secondary'
        },
        buttonsStyling: false,
        width: '350px',
        padding: '2rem'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { from: window.location.pathname } });
        }
      });
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.user_id;

      await createApplication({
        job: job.id,
        applicant: userId
      });

      Swal.fire({
        title: 'Success!',
        text: 'Your application has been submitted successfully!',
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-success'
        },
        buttonsStyling: false,
        width: '350px',
        padding: '2rem'
      });
      
      onHide();
    } catch (error) {
      console.error('Error applying:', error);
      Swal.fire({
        title: 'Error',
        text: 'You Already Applied To This Job.',
        icon: 'error',
        customClass: {
          confirmButton: 'btn btn-danger'
        },
        buttonsStyling: false,
        width: '350px',
        padding: '2rem'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <div>
      <div
        className={`modal fade ${show ? 'show' : ''}`}
        style={{ display: show ? 'block' : 'none' }}
        tabIndex="-1"
        ref={modalRef}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="d-flex justify-content-between mb-4">
                <h5 className="mb-0">Job Details</h5>
                <h6 className="text-muted">{employer?.company_name || 'Company Name'}</h6>
              </div>
              <hr className="mb-4" />
              <button
                type="button"
                className="btn-close"
                onClick={onHide}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="job-details-modal">
                <div className="mb-3">
                  <h6>Company</h6>
                  <p className="fw-bold">{employer?.company_name || 'Company Name'}</p>
                </div>
                <div className="mb-3">
                  <h6>Job Title</h6>
                  <p className="fw-bold">{job.title}</p>
                </div>
                <div className="mb-4">
                  <h5 className="mb-2">Description</h5>
                  <p className="mb-0">{job.description}</p>
                </div>

                <div className="mb-4">
                  <h5 className="mb-2">Requirements</h5>
                  <ul>
                    {job.requirements?.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h5 className="mb-2">Location</h5>
                  <p className="mb-0">{job.location}</p>
                </div>

                <div className="mb-4">
                  <h5 className="mb-2">Salary Range</h5>
                  <p className="mb-0">{job.salaryRange}</p>
                </div>

                <div className="mb-4">
                  <h5 className="mb-2">Experience Level</h5>
                  <p className="mb-0">{job.experienceLevel}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleApply}
                disabled={loading}
              >
                {loading ? 'Applying...' : 'Apply Now'}
              </button>
            </div>

            {error && (
              <div className="alert alert-danger mt-3">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
      {show && (
        <div
          className="modal-backdrop fade show"
          onClick={onHide}
        />
      )}
    </div>
  );
}
