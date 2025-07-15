import { Routes, Route } from 'react-router-dom';
import SharedLayout from '../shared/sharedLayout';
import HomePage from '../pages/homePage';

// Auth Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Dashboard Pages
import EmployeeDashboard from '../pages/EmployeeDashboard';
import EmployerDashboard from '../pages/EmployerDashboard';
import AdminDashboard from '../pages/AdminDashboard';

// Employer Pages
import PostJobPage from '../pages/PostJobPage';
import JobApplicantsPage from '../pages/JobApplicantsPage';

// Admin Pages
import ManageUsersPage from '../pages/ManageUsersPage';
import ManageJobsPage from '../pages/ManageJobsPage';
import EditProfilePage from '../pages/EditProfilePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<HomePage />} />

        {/* Auth Routes */}
                <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Dashboard Routes */}
        <Route path="employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="employer/dashboard" element={<EmployerDashboard />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />

        {/* Employer Routes */}
        <Route path="employer/jobs/post" element={<PostJobPage />} />
                <Route path="employer/jobs/:id/applicants" element={<JobApplicantsPage />} />

        {/* Admin Routes */}
        <Route path="admin/users" element={<ManageUsersPage />} />
        <Route path="admin/jobs" element={<ManageJobsPage />} />

        {/* Profile Route */}
        <Route path="profile/edit" element={<EditProfilePage />} />

      </Route>
    </Routes>
  );
}
