import React, { useState, useEffect } from 'react';

export default function NavBar() {
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const updateAuth = () => {
      const token = localStorage.getItem('access_token');
      setToken(token);
      if (token) {
        // Decode the token to get user role
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserRole(payload.user_type);
        } catch (e) {
          console.error('Error decoding token:', e);
        }
      } else {
        setUserRole(null);
      }
    };

    // Initial check
    updateAuth();

    // Listen for the custom event
    window.addEventListener('storage', updateAuth);

    // Cleanup listener
    return () => {
      window.removeEventListener('storage', updateAuth);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/';
  };

  const getDashboardPath = () => {
    if (!userRole) return '/login';
    return `/${userRole}/dashboard`;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Intilaq
        </a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="me-3">
            <div className="form-white input-group" style={{width: '250px'}}>
              <input 
                type="search" 
                className="form-control rounded" 
                placeholder="Search jobs or employees..." 
                aria-label="Search"
                aria-describedby="search-addon" 
              />
            </div>
          </form>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Always show these links to all users */}
            <li className="nav-item">
              <a className="nav-link" href="/jobs">Job Listings</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/employees">Find Employees</a>
            </li>

            {/* Show additional links for authenticated users */}
            {token && (
              <>
                <li className="nav-item">
                  <a className="nav-link" href={getDashboardPath()}>Dashboard</a>
                </li>
                {userRole === 'employer' && (
                  <li className="nav-item">
                    <a className="nav-link" href="/employer/post-job">Post a Job</a>
                  </li>
                )}
                {userRole === 'admin' && (
                  <li className="nav-item">
                    <a className="nav-link" href="/admin/dashboard">Admin Panel</a>
                  </li>
                )}
              </>
            )}
          </ul>
          <ul className="navbar-nav d-flex flex-row ms-auto me-3">
            <li className="nav-item me-3 me-lg-0 dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="userDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-user-circle fa-lg"></i>
              </a>
              {token ? (
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><a className="dropdown-item" href="/profile">My Profile</a></li>
                  <li><a className="dropdown-item" href="/settings">Settings</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#" onClick={handleSignOut}>Sign Out</a></li>
                </ul>
              ) : (
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><a className="dropdown-item" href="/login">Sign In</a></li>
                  <li><a className="dropdown-item" href="/register">Create Account</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="/employer/register">For Employers</a></li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
