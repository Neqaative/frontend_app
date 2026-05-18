import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { WorkDetailsPage } from '../pages/WorkDetailsPage';
import { EditWorkPage } from '../pages/EditWorkPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AddWorkPage } from '../pages/AddWorkPage';
import { AdminClientsPage } from '../pages/AdminClientsPage';
import WorkSchedulePage from '../pages/WorkSchedulePage';
import { CalendarPage } from '../pages/CalendarPage';
import UserTasksPage from '../pages/UserTasksPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <UserTasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/works/:id"
        element={
          <ProtectedRoute>
            <WorkDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/works/:id/edit"
        element={
          <ProtectedRoute adminOnly>
            <EditWorkPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/works/:id/schedule"
        element={
          <ProtectedRoute>
            <WorkSchedulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/works/new"
        element={
          <ProtectedRoute adminOnly>
            <AddWorkPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute adminOnly>
            <AdminClientsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
