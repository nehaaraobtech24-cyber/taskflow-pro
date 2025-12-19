import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('taskflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username) => {
    const userData = {
      username,
      joinedDate: new Date().toISOString(),
      tasksCompleted: 0,
      plantStage: 0
    };
    setUser(userData);
    localStorage.setItem('taskflow_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_user');
  };

  const updateUserProgress = (tasksCompleted) => {
    const plantStage = Math.floor(tasksCompleted / 3); // Every 3 tasks = 1 plant stage
    const updatedUser = { ...user, tasksCompleted, plantStage };
    setUser(updatedUser);
    localStorage.setItem('taskflow_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProgress, loading }}>
      {children}
    </AuthContext.Provider>
  );
};