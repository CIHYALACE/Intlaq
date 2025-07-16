import { Routes, Route } from 'react-router-dom';
import SharedLayout from '../shared/sharedLayout';
import HomePage from '../pages/homePage';

// Auth Pages
import AccountPage from '../pages/auth/AccountPage';

// Dashboard Pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import EmployerDashboard from '../pages/employer/EmployerDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

// Job Pages
import JobsPage from '../pages/JobsPage';
import EmployeesPage from '../pages/employee/EmployeesPage';

// Employer Pages
import PostJobPage from '../pages/employer/PostJobPage';
import JobApplicantsPage from '../pages/JobApplicantsPage';

// Admin Pages
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import ManageJobsPage from '../pages/admin/ManageJobsPage';
import EditProfilePage from '../pages/EditProfilePage';
import ActivationSuccess from '../pages/ActivationSuccess';

export default function App() {
  return (
    <Routes>
      <Route element={<SharedLayout />}>
        <Route index element={<HomePage />} />

        {/* Public Listings */}
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/employees" element={<EmployeesPage />} />

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
