import { Routes, Route } from 'react-router-dom';
import SharedLayout from '../shared/sharedLayout';
import HomePage from '../pages/homePage';

// Auth Pages
import LoginPage from '../pages/LoginPage';

// Employer Pages
import EmployerDashboard from '../pages/EmployerDashboard';
import PostJobPage from '../pages/PostJobPage';
import MyJobsPage from '../pages/MyJobsPage';
import EditJobPage from '../pages/EditJobPage';
import JobApplicantsPage from '../pages/JobApplicantsPage';
import SearchEmployeesPage from '../pages/SearchEmployeesPage';
import ViewEmployeeProfilePage from '../pages/ViewEmployeeProfilePage';
import RequestMatchesPage from '../pages/RequestMatchesPage';

// Admin Pages
import AdminDashboard from '../pages/AdminDashboard';
import ManageUsersPage from '../pages/ManageUsersPage';
import ManageJobsPage from '../pages/ManageJobsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<HomePage />} />

        {/* Auth Routes */}
        <Route path="login" element={<LoginPage />} />

        {/* Employer Routes */}
        <Route path="employer/dashboard" element={<EmployerDashboard />} />
        <Route path="employer/jobs/post" element={<PostJobPage />} />
        <Route path="employer/jobs" element={<MyJobsPage />} />
        <Route path="employer/jobs/edit/:id" element={<EditJobPage />} />
        <Route path="employer/jobs/:id/applicants" element={<JobApplicantsPage />} />
        <Route path="employer/employees/search" element={<SearchEmployeesPage />} />
        <Route path="employer/employees/:id" element={<ViewEmployeeProfilePage />} />
        <Route path="employer/matches/request" element={<RequestMatchesPage />} />

        {/* Admin Routes */}
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/users" element={<ManageUsersPage />} />
        <Route path="admin/jobs" element={<ManageJobsPage />} />

      </Route>
    </Routes>
  );
}
