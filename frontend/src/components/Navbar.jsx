import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = ({ activeTab }) => {
  const { dashboardStats } = useContext(AppContext);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Threat Intelligence Command Center';
      case 'phishing': return 'Phishing Email & URL Shield';
      case 'malware': return 'Malware Static Feature Sandbox';
      case 'access': return 'Access Guard Behavior Scanner';
      case 'logs': return 'Audit Logs & Threat Vault';
      default: return 'Security Dashboard';
    }
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid var(--border-glass)'
    }}>
      <div>
        <h1 className="glow-text" style={{ fontSize: '1.75rem', fontWeight: 700 }}>{getTitle()}</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Real-time AI-driven defensive threat orchestration
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          background: 'rgba(0, 230, 118, 0.08)',
          border: '1px solid rgba(0, 230, 118, 0.2)',
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          color: 'var(--state-safe)',
          boxShadow: 'var(--shadow-neon-safe)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--state-safe)',
            display: 'inline-block',
            boxShadow: '0 0 8px var(--state-safe)'
          }}></span>
          <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>ENGINE ONLINE</span>
        </div>
        
        <div style={{
          fontFamily: 'var(--font-code)',
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-glass)',
          padding: '0.4rem 1rem',
          borderRadius: '8px'
        }}>
          {time}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
