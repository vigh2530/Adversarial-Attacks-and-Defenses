import React from 'react';

const MetricCard = ({ title, value, icon, changeText, colorType }) => {
  const getGlowStyle = () => {
    switch (colorType) {
      case 'threat':
        return {
          boxShadow: 'var(--shadow-neon-threat)',
          borderLeft: '4px solid var(--state-threat)'
        };
      case 'safe':
        return {
          boxShadow: 'var(--shadow-neon-safe)',
          borderLeft: '4px solid var(--state-safe)'
        };
      default:
        return {
          borderLeft: '4px solid var(--accent-blue)'
        };
    }
  };

  const getIconStyle = () => {
    switch (colorType) {
      case 'threat': return { color: 'var(--state-threat)' };
      case 'safe': return { color: 'var(--state-safe)' };
      default: return { color: 'var(--accent-blue)' };
    }
  };

  return (
    <div className="glass-panel metric-card" style={getGlowStyle()}>
      <div className="metric-header">
        <span>{title}</span>
        <span className="metric-icon" style={getIconStyle()}>{icon}</span>
      </div>
      <div className="metric-value">{value}</div>
      {changeText && (
        <div className="metric-footer">
          <span>{changeText}</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
