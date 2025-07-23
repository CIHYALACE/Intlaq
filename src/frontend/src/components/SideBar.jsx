import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '@tanstack/react-store';
import { authStore } from '../store';
import logo from '../assets/logo.svg';

const employerMenuItems = [
  { name: 'dashboard', path: '/employer/dashboard', icon: 'fas fa-tachometer-alt' },
  { name: 'post job', path: '/employer/post-job', icon: 'fas fa-plus-circle' },
  { name: 'manage jobs', path: '/employer/manage-jobs', icon: 'fas fa-briefcase' },
  { name: 'applicants', path: '/employer/applicants', icon: 'fas fa-users' },
  { name: 'company profile', path: '/employer/company-profile', icon: 'fas fa-building' },
  { name: 'settings', path: '/employer/settings', icon: 'fas fa-cog' },
];

export default function Sidebar({ active, onItemClick }) {
  const user = useStore(authStore, (state) => state.user);
  const location = useLocation();

  // Check if a menu item should be active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-100 d-flex flex-column">
      {/* Logo/Brand */}
      <div className="p-3 border-bottom text-center">
        <Link to="/" className="text-decoration-none">
          <img 
            src={logo} 
            alt="Logo" 
            className="img-fluid" 
            style={{ maxHeight: '40px' }} 
          />
        </Link>
      </div>

      {/* User Profile Summary */}
      <div className="p-3 text-center border-bottom">
        <div className="position-relative d-inline-block mb-2">
          <div 
            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" 
            style={{ width: '80px', height: '80px' }}
          >
            <i className="fas fa-user-tie text-white" style={{ fontSize: '2rem' }}></i>
          </div>
        </div>
        <h6 className="mb-0 fw-bold text-truncate px-2">{user?.companyName || 'Company Name'}</h6>
        <small className="text-muted d-block text-truncate px-2">{user?.email || 'employer@example.com'}</small>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow-1 overflow-auto">
        <ul className="nav flex-column">
          {employerMenuItems.map((item) => (
            <li key={item.name} className="nav-item" onClick={onItemClick}>
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center px-3 py-3 ${
                  active === item.name || isActive(item.path) 
                    ? 'active text-primary fw-bold' 
                    : 'text-muted hover-bg-light'
                }`}
              >
                <i className={`${item.icon} me-2`} style={{ width: '24px', textAlign: 'center' }}></i>
                <span className="text-capitalize">{item.name}</span>
                {item.count && (
                  <span className="badge bg-primary rounded-pill ms-auto">
                    {item.count}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-top">
        <div className="d-grid">
          <Link 
            to="/post-job" 
            className="btn btn-primary btn-sm"
            onClick={onItemClick}
          >
            <i className="fas fa-plus me-1"></i> Post a Job
          </Link>
        </div>
      </div>
    </div>
  );
}
