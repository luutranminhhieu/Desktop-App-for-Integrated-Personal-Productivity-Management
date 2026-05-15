import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { JSX } from 'react';

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

function App(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
