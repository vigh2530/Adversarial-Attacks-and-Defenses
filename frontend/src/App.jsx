import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PhishingScanner from './pages/PhishingScanner';
import MalwareScanner from './pages/MalwareScanner';
import AccessGuard from './pages/AccessGuard';
import AuditLogs from './pages/AuditLogs';
import Login from './pages/Login';

import './styles/index.css';
import './styles/components.css';

const AppContent = () => {
  const { user } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'phishing':
        return <PhishingScanner />;
      case 'malware':
        return <MalwareScanner />;
      case 'access':
        return <AccessGuard />;
      case 'logs':
        return <AuditLogs />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Navbar activeTab={activeTab} />
        {renderContent()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
