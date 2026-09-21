
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

// Keep the public landing eager and split the rest by route.
import LandingPage from '@/pages/LandingPage';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const DataDeletionPage = lazy(() => import('@/pages/DataDeletionPage'));
const DailyJobsPage = lazy(() => import('@/pages/DailyJobsPage'));
const DailyJobCreatePage = lazy(() => import('@/pages/DailyJobCreatePage'));
const DailyJobEditPage = lazy(() => import('@/pages/DailyJobEditPage'));
const MonthlyPanelPage = lazy(() => import('@/pages/MonthlyPanelPage'));
const JobDetailPage = lazy(() => import('@/pages/JobDetailPage'));
const GroupsPage = lazy(() => import('@/pages/GroupsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const WorkersPage = lazy(() => import('@/pages/WorkersPage'));
const TutorialPage = lazy(() => import('@/pages/TutorialPage'));
const EquipmentLogPage = lazy(() => import('@/pages/EquipmentLogPage'));

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a]" />
      </div>
    );
  }

  return (
    <Router>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a] dark:text-blue-300" />
          </div>
        }
      >
      <Routes>
        {/* Public Routes */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route 
          path="/" 
          element={user ? <Navigate to="/app/trabajos-diarios" replace /> : <LandingPage />} 
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/app/trabajos-diarios" replace /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={<RegisterPage />} 
        />
        <Route
          path="/politica-privacidad"
          element={<PrivacyPolicyPage />}
        />
        <Route
          path="/eliminacion-datos"
          element={<DataDeletionPage />}
        />
        
        {/* Protected Routes */}
        <Route path="/app" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="trabajos-diarios" replace />} />
          <Route path="trabajos-diarios" element={<DailyJobsPage />} />
          <Route path="trabajos-diarios/nuevo" element={<DailyJobCreatePage />} />
          <Route path="trabajos-diarios/:id/editar" element={<DailyJobEditPage />} />
          <Route path="panel-mensual" element={<MonthlyPanelPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
          <Route path="trabajadores" element={<WorkersPage />} />
          <Route path="grupos" element={
            <ProtectedRoute adminOnly={true}>
              <GroupsPage />
            </ProtectedRoute>
          } />
          <Route path="tutorial" element={<TutorialPage />} />
          <Route path="tutorial-admin" element={
            <Navigate to="/app/tutorial" replace />
          } />
          <Route path="equipment-log" element={
            <ProtectedRoute allowedRoles={['admin', 'chofer', 'user', 'solicitante', 'trabajador']}>
              <EquipmentLogPage />
            </ProtectedRoute>
          } />
          <Route path="configuracion" element={<SettingsPage />} />
          <Route path="admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
