import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const AccessGuard = () => {
  const { apiUrl, user } = useContext(AppContext);
  const [targetUsername, setTargetUsername] = useState('j.doe@abc.com');
  const [features, setFeatures] = useState({
    login_hour: 9,
    failed_attempts_last_hour: 0,
    is_known_ip: 1,
    is_known_device: 1,
    requested_privilege_level: 0, // 0=User, 1=Manager, 2=Admin
    geo_distance: 5.0
  });

  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Scenarios helper to quickly load parameters
  const loadScenario = (type) => {
    switch (type) {
      case 'benign':
        setTargetUsername('s.smith@abc.com');
        setFeatures({
          login_hour: 10,
          failed_attempts_last_hour: 0,
          is_known_ip: 1,
          is_known_device: 1,
          requested_privilege_level: 0,
          geo_distance: 12.5
        });
        break;
      case 'brute_force':
        setTargetUsername('admin@abc.com');
        setFeatures({
          login_hour: 2,
          failed_attempts_last_hour: 12,
          is_known_ip: 0,
          is_known_device: 0,
          requested_privilege_level: 2,
          geo_distance: 8500.0
        });
        break;
      case 'privilege_escalation':
        setTargetUsername('g.visitor@abc.com');
        setFeatures({
          login_hour: 14,
          failed_attempts_last_hour: 2,
          is_known_ip: 1,
          is_known_device: 0,
          requested_privilege_level: 2,
          geo_distance: 50.0
        });
        break;
      default:
        break;
    }
    setResult(null);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!targetUsername) return;

    setIsScanning(true);
    setResult(null);

    try {
      const res = await fetch(`${apiUrl}/detect/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_username: targetUsername,
          features,
          username: user?.username || 'anonymous'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.prediction);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="animate-slideup scanner-container">
      <div className="scanner-left">
        <div className="glass-panel scanner-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>Login Event Auditor</h2>
          
          {/* Quick Scenarios */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Load Demo Scenarios:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="secondary" 
                onClick={() => loadScenario('benign')}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                🟢 Normal Employee Login
              </button>
              <button 
                type="button" 
                className="secondary" 
                onClick={() => loadScenario('brute_force')}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                🔴 Out-of-Hours Brute Force
              </button>
              <button 
                type="button" 
                className="secondary" 
                onClick={() => loadScenario('privilege_escalation')}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                🟡 Suspect Admin Upgrade
              </button>
            </div>
          </div>

          <form onSubmit={handleScan}>
            <div className="form-group">
              <label>Target Account Username</label>
              <input 
                type="text" 
                value={targetUsername}
                onChange={e => setTargetUsername(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Login Hour (0 - 23)</label>
                <input 
                  type="number" 
                  min="0"
                  max="23"
                  value={features.login_hour}
                  onChange={e => setFeatures({...features, login_hour: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="form-group">
                <label>Failed Attempts (Last Hour)</label>
                <input 
                  type="number" 
                  min="0"
                  value={features.failed_attempts_last_hour}
                  onChange={e => setFeatures({...features, failed_attempts_last_hour: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Known IP Address</label>
                <select 
                  value={features.is_known_ip}
                  onChange={e => setFeatures({...features, is_known_ip: parseInt(e.target.value)})}
                >
                  <option value={1}>Yes (Trusted Network)</option>
                  <option value={0}>No (Untrusted IP)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Known Device (cookie/agent)</label>
                <select 
                  value={features.is_known_device}
                  onChange={e => setFeatures({...features, is_known_device: parseInt(e.target.value)})}
                >
                  <option value={1}>Yes (Registered Laptop)</option>
                  <option value={0}>No (New Device / Browser)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Privilege Level Requested</label>
                <select 
                  value={features.requested_privilege_level}
                  onChange={e => setFeatures({...features, requested_privilege_level: parseInt(e.target.value)})}
                >
                  <option value={0}>Standard User (L1)</option>
                  <option value={1}>Department Manager (L2)</option>
                  <option value={2}>Domain Administrator (L3)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Geographic Distance (KM)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={features.geo_distance}
                  onChange={e => setFeatures({...features, geo_distance: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <button type="submit" disabled={isScanning} style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--state-threat) 100%)', color: '#fff' }}>
              {isScanning ? 'Querying Anomaly Forests...' : 'Inspect Access Behavior'}
            </button>
          </form>
        </div>
      </div>

      <div className="scanner-right">
        <div className="glass-panel scanner-card" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Audit Verdict</h2>

          {!result && !isScanning && (
            <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--color-text-muted)' }}>
              <span style={{ fontSize: '3rem' }}>🔐</span>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Run a scenario or input login records to evaluate threats.</p>
            </div>
          )}

          {isScanning && (
            <div style={{ textAlign: 'center', margin: 'auto' }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid var(--border-glass)',
                borderTopColor: 'var(--accent-purple)',
                borderRadius: '50%',
                animation: 'pulseGlow 1.5s infinite linear',
                margin: '0 auto 1.5rem auto'
              }}></div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Analyzing geo-location and failed metrics...</p>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexGrow: 1 }}>
              <div className="gauge-container">
                <div 
                  className="gauge-circle"
                  style={{
                    borderColor: result.is_threat ? 'var(--state-threat)' : 'var(--state-safe)',
                    boxShadow: result.is_threat ? 'var(--shadow-neon-threat)' : 'var(--shadow-neon-safe)'
                  }}
                >
                  <span className="gauge-value" style={{ color: result.is_threat ? 'var(--state-threat)' : 'var(--state-safe)' }}>
                    {Math.round(result.confidence * 100)}%
                  </span>
                  <span className="gauge-label">ANOMALY INDEX</span>
                </div>
                
                <span className={`badge ${result.is_threat ? 'badge-threat' : 'badge-safe'}`}>
                  {result.is_threat ? 'UNAUTHORIZED ACCESS SUSPECTED' : 'AUTHORIZED ACCESS PASSED'}
                </span>
              </div>

              <div className={`remediation-box ${result.is_threat ? 'danger' : 'safe'}`}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Access Safeguard Recommendations</h4>
                <ul className="remediation-list">
                  {result.recommendation.split('\n').map((rec, index) => (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessGuard;
