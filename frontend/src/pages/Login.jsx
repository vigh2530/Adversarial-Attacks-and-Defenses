import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const { login, register, isLoading, errorMessage } = useContext(AppContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // 'employee' or 'analyst'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    if (isRegistering) {
      await register(username, password, role);
    } else {
      await login(username, password);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="glass-panel login-card">
        <div className="login-header">
          <div className="login-logo logo-icon" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
            CG
          </div>
          <h2 className="login-title">CyberGuard AI</h2>
          <p className="login-subtitle">
            {isRegistering ? 'Register corporate credentials' : 'Authenticate security credentials'}
          </p>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(255, 51, 102, 0.1)',
            border: '1px solid rgba(255, 51, 102, 0.25)',
            color: 'var(--state-threat)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username / Corporate Email</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. j.doe@abc.com"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: isRegistering ? '1.25rem' : '2rem' }}>
            <label>Security Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {isRegistering && (
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label>System Authorization Level</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="employee">Corporate Employee (L1 Shield Access)</option>
                <option value="analyst">SOC Threat Analyst (L2 Command Access)</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Processing Credentials...' : isRegistering ? 'Create Security Credentials' : 'Secure Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          {isRegistering ? 'Already registered?' : 'First time running the system?'}
          {' '}
          <span 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setUsername('');
              setPassword('');
            }}
            style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
          >
            {isRegistering ? 'Sign In' : 'Create Account'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
