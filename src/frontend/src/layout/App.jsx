import { Routes, Route } from 'react-router-dom';
import SharedLayout from '../shared/sharedLayout';
import HomePage from '../pages/homePage';
import LoginPage from '../pages/LoginPage';
import RegisterEmployeePage from '../pages/RegisterEmployeePage';
import RegisterEmployerPage from '../pages/RegisterEmployerPage';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import EditProfilePage from '../pages/EditProfilePage';
import JobListPage from '../pages/JobListPage';
import JobDetailPage from '../pages/JobDetailPage';
import MyApplicationsPage from '../pages/MyApplicationsPage';
import NotificationsPage from '../pages/NotificationsPage';
import ProfileViewsPage from '../pages/ProfileViewsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register/employee" element={<RegisterEmployeePage />} />
        <Route path="register/employer" element={<RegisterEmployerPage />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="profile/edit" element={<EditProfilePage />} />
        <Route path="jobs" element={<JobListPage />} />
        <Route path="jobs/:id" element={<JobDetailPage />} />
        <Route path="applications" element={<MyApplicationsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile/views" element={<ProfileViewsPage />} />
      </Route>
    </Routes>
  );
}
