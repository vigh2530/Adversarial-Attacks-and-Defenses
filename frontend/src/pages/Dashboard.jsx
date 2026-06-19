import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import MetricCard from '../components/MetricCard';

const Dashboard = ({ setActiveTab }) => {
  const { dashboardStats, refreshStats, apiUrl } = useContext(AppContext);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    refreshStats();
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const res = await fetch(`${apiUrl}/incidents`);
      if (res.ok) {
        const data = await res.json();
        // Take the 5 most recent threat incidents
        setIncidents(data.filter(i => i.prediction_label === 1).slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getMetricValue = (val) => val !== undefined ? val : '...';

  // Calculate percentage for styling the bars
  const phishVal = dashboardStats?.breakdown?.phishing || 0;
  const malwareVal = dashboardStats?.breakdown?.malware || 0;
  const accessVal = dashboardStats?.breakdown?.access_control || 0;
  const maxVal = Math.max(phishVal, malwareVal, accessVal, 1);

  const phishHeight = `${(phishVal / maxVal) * 100}%`;
  const malwareHeight = `${(malwareVal / maxVal) * 100}%`;
  const accessHeight = `${(accessVal / maxVal) * 100}%`;

  return (
    <div className="animate-slideup">
      <div className="metrics-grid">
        <MetricCard
          title="Total Threat Scans"
          value={getMetricValue(dashboardStats?.summary?.total_scans)}
          icon="👁️"
          changeText="System-wide audit pipeline"
        />
        <MetricCard
          title="Active Threats Flagged"
          value={getMetricValue(dashboardStats?.summary?.total_threats)}
          icon="🚨"
          colorType="threat"
          changeText="Confirmed security threats"
        />
        <MetricCard
          title="Benign Activities"
          value={getMetricValue(dashboardStats?.summary?.total_benign)}
          icon="🛡️"
          colorType="safe"
          changeText="Verified safe operations"
        />
        <MetricCard
          title="Mitigation Rate"
          value={
            dashboardStats?.summary?.total_threats 
              ? `${Math.round((dashboardStats.summary.resolved_action / dashboardStats.summary.total_threats) * 100)}%`
              : '100%'
          }
          icon="⚡"
          colorType="safe"
          changeText="Active defenses resolution"
        />
      </div>

      <div className="dashboard-grid">
        {/* Threat breakdown visual chart */}
        <div className="glass-panel chart-card">
          <div className="chart-header">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Active Incident Matrix</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Threat Count by Vector</span>
          </div>

          <div className="chart-placeholder">
            <div className="chart-bar-container">
              <div 
                className="chart-bar" 
                style={{ height: phishHeight }} 
                data-value={phishVal}
              ></div>
              <span className="chart-label">Phishing Emails</span>
            </div>

            <div className="chart-bar-container">
              <div 
                className="chart-bar" 
                style={{ 
                  height: malwareHeight,
                  background: 'linear-gradient(to top, var(--state-threat), var(--accent-pink))'
                }} 
                data-value={malwareVal}
              ></div>
              <span className="chart-label">Malware Blobs</span>
            </div>

            <div className="chart-bar-container">
              <div 
                className="chart-bar" 
                style={{ 
                  height: accessHeight,
                  background: 'linear-gradient(to top, var(--accent-purple), var(--state-threat))'
                }} 
                data-value={accessVal}
              ></div>
              <span className="chart-label">Access Anomalies</span>
            </div>
          </div>
        </div>

        {/* Live Attack Feed */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Live Alert Feed</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1, overflowY: 'auto', maxHeight: '250px' }}>
            {incidents.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', margin: 'auto', padding: '1rem' }}>
                🛡️ No active threat incidents reported in logs.
              </div>
            ) : (
              incidents.map((incident) => (
                <div 
                  key={incident.id}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255, 51, 102, 0.05)',
                    border: '1px solid rgba(255, 51, 102, 0.15)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span style={{ color: 'var(--state-threat)' }}>[CRITICAL] {incident.threat_type}</span>
                    <span style={{ fontFamily: 'var(--font-code)', color: 'var(--color-text-muted)' }}>
                      Conf: {Math.round(incident.confidence_score * 100)}%
                    </span>
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {incident.raw_data}
                  </div>
                </div>
              ))
            )}
          </div>

          <button 
            className="secondary" 
            onClick={() => setActiveTab('logs')}
            style={{ marginTop: '1.25rem', width: '100%' }}
          >
            Review Audit Vault
          </button>
        </div>
      </div>

      {/* Threat Vector Navigation Panels */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>AI Model Sandboxes</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div 
            className="glass-panel" 
            style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)', cursor: 'pointer' }}
            onClick={() => setActiveTab('phishing')}
          >
            <h4 style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✉️</span> Phishing Detector
            </h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
              Evaluate emails, texts, and subject lines against advanced NLP classification models to discover spear-phishing campaigns.
            </p>
          </div>

          <div 
            className="glass-panel" 
            style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)', cursor: 'pointer' }}
            onClick={() => setActiveTab('malware')}
          >
            <h4 style={{ color: 'var(--state-threat)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📦</span> Malware Static Analyzer
            </h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
              Submit file headers and structural metadata (entropy, imports, sections) to analyze binaries for trojan and ransomware profiles.
            </p>
          </div>

          <div 
            className="glass-panel" 
            style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)', cursor: 'pointer' }}
            onClick={() => setActiveTab('access')}
          >
            <h4 style={{ color: 'var(--accent-purple)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔐</span> Access Guard
            </h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
              Monitor authentication requests and identify compromised accounts or unauthorized privilege escalations via anomaly detection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
