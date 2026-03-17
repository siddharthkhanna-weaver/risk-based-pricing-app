import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewDeal from './pages/NewDeal';
import './styles/App.css';

function Layout({ user, onLogout, children }) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          <img src="/logo.png" alt="PeopleHome" className="header-logo-img" />
          <span className="header-title">Pricing Calculator</span>
        </div>
        <div className="header-right">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.role}</span>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

function ProtectedRoute({ user, onLogout, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return <Layout user={user} onLogout={onLogout}>{children}</Layout>;
}

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={setUser} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} onLogout={handleLogout}>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-deal"
          element={
            <ProtectedRoute user={user} onLogout={handleLogout}>
              <NewDeal user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
