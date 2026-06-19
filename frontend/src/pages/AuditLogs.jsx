import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

const AuditLogs = () => {
  const { apiUrl, user } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('incidents'); // 'incidents' or 'system'
  const [incidents, setIncidents] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeSubTab === 'incidents') {
        const res = await fetch(`${apiUrl}/incidents`);
        if (res.ok) {
          const data = await res.json();
          setIncidents(data);
        }
      } else {
        const res = await fetch(`${apiUrl}/logs`);
        if (res.ok) {
          const data = await res.json();
          setSystemLogs(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (incidentId, newAction) => {
    try {
      const res = await fetch(`${apiUrl}/incidents/${incidentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: newAction,
          username: user?.username || 'anonymous'
        })
      });

      if (res.ok) {
        // Refresh local list
        setIncidents(prev => 
          prev.map(inc => inc.id === incidentId ? { ...inc, analyst_action_taken: newAction } : inc)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'Pending': return 'badge-warning';
      case 'Mitigated': return 'badge-safe';
      case 'Investigated': return 'badge-safe';
      case 'False Positive': return 'badge-threat';
      default: return 'badge-safe';
    }
  };

  return (
    <div className="animate-slideup glass-panel" style={{ padding: '2rem' }}>
      {/* Sub tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <button 
          className={activeSubTab === 'incidents' ? '' : 'secondary'}
          onClick={() => setActiveSubTab('incidents')}
          style={{ padding: '0.5rem 1.25rem' }}
        >
          🚨 Logged Security Incidents
        </button>
        <button 
          className={activeSubTab === 'system' ? '' : 'secondary'}
          onClick={() => setActiveSubTab('system')}
          style={{ padding: '0.5rem 1.25rem' }}
        >
          📁 System Audit Log Vault
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
          Loading vaults...
        </div>
      ) : activeSubTab === 'incidents' ? (
        <div className="table-container">
          {incidents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              No threat incidents logged. Run scans to generate alerts.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Vector</th>
                  <th>Raw Diagnostic Content</th>
                  <th>Result</th>
                  <th>Mitigation Status</th>
                  {user?.role === 'analyst' && <th>Action Run</th>}
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                      {new Date(incident.created_at).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600 }}>{incident.threat_type}</td>
                    <td className="log-details" title={incident.raw_data}>{incident.raw_data}</td>
                    <td>
                      <span className={`badge ${incident.prediction_label === 1 ? 'badge-threat' : 'badge-safe'}`}>
                        {incident.prediction_label === 1 ? 'THREAT' : 'BENIGN'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getActionBadgeClass(incident.analyst_action_taken)}`}>
                        {incident.analyst_action_taken}
                      </span>
                    </td>
                    {user?.role === 'analyst' && (
                      <td>
                        {incident.prediction_label === 1 ? (
                          <select 
                            value={incident.analyst_action_taken}
                            onChange={(e) => handleUpdateStatus(incident.id, e.target.value)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Investigated">Investigated</option>
                            <option value="Mitigated">Mitigated</option>
                            <option value="False Positive">False Positive</option>
                          </select>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>N/A</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="table-container">
          {systemLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              Audit log vault is empty.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Operator</th>
                  <th>Triggered Action</th>
                  <th>Outcome Status</th>
                  <th>Network Address</th>
                </tr>
              </thead>
              <tbody>
                {systemLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600 }}>{log.username}</td>
                    <td>{log.action}</td>
                    <td>
                      <span className={`badge ${log.status.includes('Success') ? 'badge-safe' : log.status.includes('Anomaly') ? 'badge-threat' : 'badge-warning'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-code)', fontSize: '0.85rem' }}>{log.ip_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
