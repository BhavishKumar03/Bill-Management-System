import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Sidebar } from './components/Sidebar'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Items } from './pages/Items'
import { Billing } from './pages/Billing'
import { Receipts } from './pages/Receipts'
import { Debts } from './pages/Debts'
import { Reports } from './pages/Reports'
import './App.css'

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 lg:ml-0 mt-20 lg:mt-0 p-4 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-blue-300 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        {/* Login route - always accessible */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Dashboard />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/items"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Items />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/billing"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Billing />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/receipts"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Receipts />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/debts"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Debts />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/reports"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Reports />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#000',
          },
        }}
      />
    </>
  )
}

function AppWithProvider() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  )
}

export default AppWithProvider
