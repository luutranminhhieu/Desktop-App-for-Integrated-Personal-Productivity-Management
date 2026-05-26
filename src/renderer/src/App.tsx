import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { JSX, useEffect } from 'react';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import MainLayout from './components/layout/MainLayout';
import Pomodoro from './pages/Pomodoro';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import TodoList from './pages/TodoList';

function ProtectedRoute({ children }: { children: React.JSX.Element }): JSX.Element {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

const withLayout = (element: React.JSX.Element): React.JSX.Element => (
  <ProtectedRoute>
    <MainLayout>{element}</MainLayout>
  </ProtectedRoute>
);

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
        <Route path="/" element={withLayout(<Dashboard />)} />
        <Route path="/calendar" element={withLayout(<Calendar />)} />
        <Route path="/tasks" element={withLayout(<TodoList />)} />
        <Route path="/focus" element={withLayout(<Pomodoro />)} />
        <Route path="/profile" element={withLayout(<Profile />)} />
        <Route path="/settings" element={withLayout(<Settings />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
