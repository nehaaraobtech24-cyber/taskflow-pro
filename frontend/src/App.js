import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Progress from './components/Progress';
import CalendarView from './components/CalendarView';
import Analytics from './components/Analytics';
import Goals from './components/Goals';
import './App.css';


// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/" />;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/progress" 
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calendar" 
        element={
          <ProtectedRoute>
            <CalendarView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/goals" 
        element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
