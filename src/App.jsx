import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  FamilyPage,
  AddMemberPage,
  MemberDetailPage,
  BandsPage,
  RegisterBandPage,
  SubscriptionPage,
  PublicProfilePage
} from './pages'

// Admin imports
import { AdminAuthProvider, useAdminAuth } from './admin/context/AdminAuthContext'
import {
  AdminLoginPage,
  AdminDashboardPage,
  UsersPage,
  FamilyMembersPage,
  SubscriptionsPage,
  BandsManagementPage,
  PaymentsPage,
  ContentManagementPage,
  SupportTicketsPage,
  NotificationsPage,
  ReportsPage
} from './admin/pages'

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid #E2E8F0',
          borderTopColor: '#5DADE2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public Route wrapper (redirects to dashboard if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Admin Protected Route wrapper
function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth()

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC'
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid #E2E8F0',
          borderTopColor: '#2563EB',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

// Admin Public Route wrapper
function AdminPublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Public Profile Route (accessible without login) */}
      <Route path="/profile/:bui" element={<PublicProfilePage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/family"
        element={
          <ProtectedRoute>
            <FamilyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/family/add"
        element={
          <ProtectedRoute>
            <AddMemberPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/family/:id"
        element={
          <ProtectedRoute>
            <MemberDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bands"
        element={
          <ProtectedRoute>
            <BandsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bands/register"
        element={
          <ProtectedRoute>
            <RegisterBandPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <SubscriptionPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes - wrapped in AdminAuthProvider */}
      <Route
        path="/admin/*"
        element={
          <AdminAuthProvider>
            <Routes>
              <Route
                path="login"
                element={
                  <AdminPublicRoute>
                    <AdminLoginPage />
                  </AdminPublicRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboardPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="users"
                element={
                  <AdminProtectedRoute>
                    <UsersPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="family-members"
                element={
                  <AdminProtectedRoute>
                    <FamilyMembersPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="subscriptions"
                element={
                  <AdminProtectedRoute>
                    <SubscriptionsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="bands"
                element={
                  <AdminProtectedRoute>
                    <BandsManagementPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="payments"
                element={
                  <AdminProtectedRoute>
                    <PaymentsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="content"
                element={
                  <AdminProtectedRoute>
                    <ContentManagementPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="support"
                element={
                  <AdminProtectedRoute>
                    <SupportTicketsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="notifications"
                element={
                  <AdminProtectedRoute>
                    <NotificationsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <AdminProtectedRoute>
                    <ReportsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/admin/login" replace />} />
            </Routes>
          </AdminAuthProvider>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
