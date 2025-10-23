import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './pages/App'
import Login from './pages/Login'
import Register from './pages/Register'
import Menu from './pages/Menu'
import Contact from './pages/Contact'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Reviews from './pages/Reviews'
import Landing from './pages/Landing'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { getAccessToken, getUserRole } from './services/api'

// Simple auth guard: redirects to login if no token
function RequireAuth({ children }: { children: JSX.Element }) {
  const token = getAccessToken()
  const location = useLocation()
  if (!token) return <Navigate to="/" state={{ from: location }} replace />
  return children
}

// Role guard: ensures the stored role matches required role
function RequireRole({ children, roleRequired }: { children: JSX.Element; roleRequired: 'admin' | 'customer' }) {
  const role = getUserRole()
  // No role -> force to login
  if (!role) return <Navigate to="/" replace />
  if (role !== roleRequired) {
    // Redirect to the correct dashboard for the current role
    return <Navigate to={role === 'admin' ? '/admin' : '/customer'} replace />
  }
  return children
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing: show public landing for unauthenticated users; if authenticated, redirect to role dashboard */}
        <Route
          path="/"
          element={
            getAccessToken() ? (
              <Navigate to={getUserRole() === 'admin' ? '/admin' : '/customer'} replace />
            ) : (
              // When unauthenticated, show the public Landing page with Menu/Contact/About/Gallery/Reviews
              <Landing />
            )
          }
        />

        {/* Public admin login path: visit /admin to sign in as admin */}
        <Route path="/admin" element={<Login />} />

        {/* Public customer login path: visit /customer to sign in as customer */}
        <Route path="/customer" element={<Login />} />

        {/* Public registration page for customers */}
        <Route path="/register" element={<Register />} />

        {/* Public informational pages */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/reviews" element={<Reviews />} />

        {/* Admin routes (protected) */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <RequireRole roleRequired="admin">
                <App initialTab="stock" />
              </RequireRole>
            </RequireAuth>
          }
        />

        {/* Customer routes (protected) */}
        <Route
          path="/customer/*"
          element={
            <RequireAuth>
              <RequireRole roleRequired="customer">
                <App initialTab="waste" />
              </RequireRole>
            </RequireAuth>
          }
        />

        {/* Catch-all -> landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
