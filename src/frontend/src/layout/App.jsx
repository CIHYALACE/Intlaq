import { Routes, Route } from 'react-router-dom';
import SharedLayout from '../shared/sharedLayout';
import HomePage from '../pages/homePage';

// Auth Pages
import AccountPage from '../pages/auth/AccountPage';

// Dashboard Pages
import EmployeeDashboard from '../pages/EmployeeDashboard';
import EmployerDashboard from '../pages/EmployerDashboard';
import AdminDashboard from '../pages/AdminDashboard';

// Job Pages
import JobsPage from '../pages/JobsPage';

// Employer Pages
import PostJobPage from '../pages/PostJobPage';
import JobApplicantsPage from '../pages/JobApplicantsPage';

// Admin Pages
import ManageUsersPage from '../pages/ManageUsersPage';
import ManageJobsPage from '../pages/ManageJobsPage';
import EditProfilePage from '../pages/EditProfilePage';
import ActivationSuccess from '../pages/ActivationSuccess';

export default function App() {
  return (
    <Routes>
      {/* Routes with Navbar and Footer */}
      <Route element={<SharedLayout />}>
        <Route index element={<HomePage />} />

        {/* Job Listings */}
        <Route path="/jobs" element={<JobsPage />} />

        {/* Dashboard Routes */}
        <Route path="employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="employer/dashboard" element={<EmployerDashboard />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />

        {/* Employer Routes */}
        <Route path="employer/post-job" element={<PostJobPage />} />
        <Route path="employer/manage-jobs" element={<ManageJobsPage />} />
        <Route path="employer/job-applicants/:jobId" element={<JobApplicantsPage />} />

        {/* Profile Routes */}
        <Route path="/profile/edit" element={<EditProfilePage />} />

        {/* Admin Routes */}
        <Route path="/admin/manage-users" element={<ManageUsersPage />} />
      </Route>

      {/* Auth Routes without Navbar and Footer */}
      <Route path="/login" element={<AccountPage />} />
      <Route path="/register" element={<AccountPage />} />
      <Route path="/activate/" element={<ActivationSuccess />} />
    </Routes>
  );
}
