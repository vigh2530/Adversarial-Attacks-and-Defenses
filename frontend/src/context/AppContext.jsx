import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cyberguard_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = 'http://localhost:5000/api';

  const login = async (username, password) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      setUser(data.user);
      localStorage.setItem('cyberguard_user', JSON.stringify(data.user));
      return true;
    } catch (err) {
      setErrorMessage(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, password, role) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      setUser(data.user);
      localStorage.setItem('cyberguard_user', JSON.stringify(data.user));
      return true;
    } catch (err) {
      setErrorMessage(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setDashboardStats(null);
    localStorage.removeItem('cyberguard_user');
  };

  const fetchDashboardStats = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/dashboard/stats`);
      if (res.ok) {
        const data = await res.json();
        setDashboardStats(data);
      }
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
      // Poll stats every 10 seconds for real-time look
      const interval = setInterval(fetchDashboardStats, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <AppContext.Provider value={{
      user,
      isLoading,
      errorMessage,
      dashboardStats,
      apiUrl: API_URL,
      login,
      register,
      logout,
      refreshStats: fetchDashboardStats
    }}>
      {children}
    </AppContext.Provider>
  );
};
