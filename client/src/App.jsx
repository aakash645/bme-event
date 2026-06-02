import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Success from './pages/Success';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CheckIn from './pages/CheckIn';

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.875rem',
            borderRadius: '10px',
            border: '1px solid #E2E0D8',
          },
          success: { iconTheme: { primary: '#0F6E56', secondary: '#fff' } },
          error: { iconTheme: { primary: '#A32D2D', secondary: '#fff' } },
        }}
      />
      <div className="app-layout">
        <Navbar />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/checkin"
            element={<ProtectedRoute><CheckIn /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
