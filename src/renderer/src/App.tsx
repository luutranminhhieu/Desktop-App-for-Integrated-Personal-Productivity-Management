import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { JSX, useEffect } from 'react';

function ProtectedRoute({ children }: { children: React.JSX.Element }): JSX.Element {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function MainApp(): JSX.Element {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to Main App</h1>
      <button 
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => {
          localStorage.removeItem('token');
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}

function DeepLinkListener(): null {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.api?.app?.onDeepLink) {
      return;
    }

    const unsubscribe = window.api.app.onDeepLink((url) => {
      try {
        const parsed = new URL(url);
        const path = parsed.pathname === '/' && parsed.host
          ? `/${parsed.host}`
          : parsed.pathname;
        if (path === '/reset-password') {
          const token = parsed.searchParams.get('token');
          const suffix = token ? `?token=${encodeURIComponent(token)}` : '';
          navigate(`/reset-password${suffix}`);
        }
      } catch (error) {
        console.error('Invalid deep link', error);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return null;
}

function App(): React.JSX.Element {
  return (
    <Router>
      <DeepLinkListener />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
