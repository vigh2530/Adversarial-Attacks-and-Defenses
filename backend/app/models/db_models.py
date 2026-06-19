from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='employee', nullable=False) # 'employee' or 'analyst'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

class Incident(db.Model):
    __tablename__ = 'incidents'
    
    id = db.Column(db.Integer, primary_key=True)
    threat_type = db.Column(db.String(50), nullable=False) # 'Phishing', 'Malware', 'Unauthorized Access'
    raw_data = db.Column(db.Text, nullable=False) # JSON or input text
    prediction_label = db.Column(db.Integer, nullable=False) # 0 = Benign, 1 = Threat
    confidence_score = db.Column(db.Float, nullable=False) # ML probability
    recommendation = db.Column(db.Text, nullable=False) # Mitigation instructions
    analyst_action_taken = db.Column(db.String(50), default='Pending', nullable=False) # 'Pending', 'Investigated', 'Mitigated', 'False Positive'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'threat_type': self.threat_type,
            'raw_data': self.raw_data,
            'prediction_label': self.prediction_label,
            'confidence_score': round(self.confidence_score, 4),
            'recommendation': self.recommendation,
            'analyst_action_taken': self.analyst_action_taken,
            'created_at': self.created_at.isoformat()
        }

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=True)
    action = db.Column(db.String(100), nullable=False) # 'LOGIN_SUCCESS', 'PHISHING_SCAN', etc.
    status = db.Column(db.String(50), nullable=False) # 'Success', 'Anomaly Detected', 'Failure'
    ip_address = db.Column(db.String(45), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'action': self.action,
            'status': self.status,
            'ip_address': self.ip_address,
            'created_at': self.created_at.isoformat()
        }
