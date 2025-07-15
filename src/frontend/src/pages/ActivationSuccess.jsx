import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ActivationSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get status and message from URL parameters
  const status = searchParams.get('status');
  const message = searchParams.get('message');
  
  // Set initial state based on URL parameters
  const [isLoading, setIsLoading] = useState(!status);
  const [activationStatus, setActivationStatus] = useState(status);
  const [statusMessage, setStatusMessage] = useState(message || 'Activating your account...');

  useEffect(() => {
    // If we don't have a status, we're not coming from a redirect
    if (!status) {
      // This handles direct access to /activate/ without parameters
      setActivationStatus('error');
      setStatusMessage('Invalid activation link');
      setIsLoading(false);
    } else {
      // Process the status from the URL
      switch (status) {
        case 'success':
          setStatusMessage('Your account has been successfully activated!');
          break;
        case 'already_active':
          setStatusMessage('This account is already activated.');
          break;
        case 'error':
          setStatusMessage(message || 'An error occurred during activation');
          break;
        default:
          setStatusMessage('Unknown status');
      }
      setActivationStatus(status);
      setIsLoading(false);
    }
  }, [status, message]);

  const handleRedirect = () => {
    navigate(activationStatus === 'success' || activationStatus === 'already_active' ? '/login' : '/');
  };

  // Determine icon and title based on status
  const getStatusDetails = () => {
    switch (activationStatus) {
      case 'success':
        return {
          icon: 'bi-check-circle-fill',
          title: 'Activation Successful!',
          color: 'success'
        };
      case 'already_active':
        return {
          icon: 'bi-info-circle-fill',
          title: 'Account Already Active',
          color: 'info'
        };
      case 'error':
      default:
        return {
          icon: 'bi-x-circle-fill',
          title: 'Activation Failed',
          color: 'danger'
        };
    }
  };

  const { icon, title, color } = getStatusDetails();

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-light">
      <div className="w-100">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-4">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-lg-5 text-center">
                {isLoading ? (
                  <div className="d-flex flex-column align-items-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 mb-0">Activating your account...</p>
                  </div>
                ) : (
                  <>
                    <div className={`mb-4 text-${color}`}>
                      <i className={`bi ${icon}`} style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h2 className="h3 mb-3">{title}</h2>
                    <p className="mb-4">{statusMessage}</p>
                    <button 
                      onClick={handleRedirect}
                      className={`btn btn-${activationStatus === 'error' ? 'secondary' : 'primary'}`}
                    >
                      {activationStatus === 'success' || activationStatus === 'already_active' ? 'Go to Login' : 'Back to Home'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationSuccess;
