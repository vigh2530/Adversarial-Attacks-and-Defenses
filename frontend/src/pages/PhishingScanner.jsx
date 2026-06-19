import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const PhishingScanner = () => {
  const { apiUrl, user } = useContext(AppContext);
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!emailText.trim()) return;

    setIsScanning(true);
    setResult(null);

    try {
      const res = await fetch(`${apiUrl}/detect/phishing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: emailText,
          username: user?.username || 'anonymous'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.prediction);
      } else {
        console.error("Scanning failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const getGaugeColor = (conf, isThreat) => {
    if (!isThreat) return 'var(--state-safe)';
    return conf > 0.8 ? 'var(--state-threat)' : 'var(--state-warning)';
  };

  const getGaugeShadow = (conf, isThreat) => {
    if (!isThreat) return 'var(--shadow-neon-safe)';
    return conf > 0.8 ? 'var(--shadow-neon-threat)' : '0 0 15px rgba(255, 179, 0, 0.25)';
  };

  return (
    <div className="animate-slideup scanner-container">
      <div className="scanner-left">
        <div className="glass-panel scanner-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Analyze Email Content</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Paste the raw subject line and email body to run standard Natural Language Processing checks.
          </p>

          <form onSubmit={handleScan}>
            <div className="form-group">
              <label htmlFor="email-text">Email Text / Header Data</label>
              <textarea
                id="email-text"
                rows="8"
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Subject: Verify your identity...
Dear User, your account has experienced unusual login activity. Please update your billing information immediately..."
                required
              ></textarea>
            </div>

            <button type="submit" disabled={isScanning} style={{ width: '100%' }}>
              {isScanning ? 'Scrutinizing Text...' : 'Perform NLP Threat Analysis'}
            </button>
          </form>
        </div>
      </div>

      <div className="scanner-right">
        <div className="glass-panel scanner-card" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Scan Outcome</h2>

          {!result && !isScanning && (
            <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--color-text-muted)' }}>
              <span style={{ fontSize: '3rem' }}>✉️</span>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Awaiting input context. Enter email text on the left to begin.</p>
            </div>
          )}

          {isScanning && (
            <div style={{ textAlign: 'center', margin: 'auto' }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid var(--border-glass)',
                borderTopColor: 'var(--accent-blue)',
                borderRadius: '50%',
                animation: 'pulseGlow 1.5s infinite linear',
                margin: '0 auto 1.5rem auto'
              }}></div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Deploying vectorizer token matchers...</p>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexGrow: 1 }}>
              <div className="gauge-container">
                <div 
                  className="gauge-circle"
                  style={{
                    borderColor: getGaugeColor(result.confidence, result.is_threat),
                    boxShadow: getGaugeShadow(result.confidence, result.is_threat)
                  }}
                >
                  <span className="gauge-value" style={{ color: getGaugeColor(result.confidence, result.is_threat) }}>
                    {Math.round(result.confidence * 100)}%
                  </span>
                  <span className="gauge-label">THREAT PROBABILITY</span>
                </div>
                
                <span className={`badge ${result.is_threat ? 'badge-threat' : 'badge-safe'}`}>
                  {result.is_threat ? 'PHISHING CAMPAIGN DETECTED' : 'LEGITIMATE COMMUNICATION'}
                </span>
              </div>

              <div className={`remediation-box ${result.is_threat ? 'danger' : 'safe'}`}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Defensive Recommendations</h4>
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

export default PhishingScanner;
