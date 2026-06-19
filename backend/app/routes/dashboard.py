from flask import Blueprint, request, jsonify
from ..models.db_models import db, Incident, AuditLog

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard/stats', methods=['GET'])
def get_stats():
    try:
        total_incidents = Incident.query.count()
        threats_count = Incident.query.filter_by(prediction_label=1).count()
        benign_count = Incident.query.filter_by(prediction_label=0).count()
        
        # Threat breakdown
        phish_threats = Incident.query.filter_by(threat_type='Phishing', prediction_label=1).count()
        malware_threats = Incident.query.filter_by(threat_type='Malware', prediction_label=1).count()
        access_threats = Incident.query.filter_by(threat_type='Unauthorized Access', prediction_label=1).count()
        
        # Recent logs & incidents
        recent_incidents = Incident.query.order_by(Incident.created_at.desc()).limit(10).all()
        recent_audit = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(10).all()
        
        # Metrics over time / mock graph data
        # Let's count resolved vs unresolved
        pending_threats = Incident.query.filter_by(prediction_label=1, analyst_action_taken='Pending').count()
        resolved_threats = Incident.query.filter_by(prediction_label=1).filter(Incident.analyst_action_taken != 'Pending').count()
        
        return jsonify({
            'status': 'success',
            'summary': {
                'total_scans': total_incidents,
                'total_threats': threats_count,
                'total_benign': benign_count,
                'pending_action': pending_threats,
                'resolved_action': resolved_threats
            },
            'breakdown': {
                'phishing': phish_threats,
                'malware': malware_threats,
                'access_control': access_threats
            },
            'recent_incidents': [inc.to_dict() for inc in recent_incidents],
            'recent_audit_logs': [log.to_dict() for log in recent_audit]
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve dashboard stats: {str(e)}'}), 500

@dashboard_bp.route('/incidents', methods=['GET'])
def get_incidents():
    try:
        incidents = Incident.query.order_by(Incident.created_at.desc()).all()
        return jsonify([inc.to_dict() for inc in incidents]), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve incidents: {str(e)}'}), 500

@dashboard_bp.route('/incidents/<int:incident_id>', methods=['PUT'])
def update_incident(incident_id):
    data = request.get_json() or {}
    action = data.get('action')
    username = data.get('username', 'anonymous')
    
    if not action:
        return jsonify({'error': 'Action is required'}), 400
        
    incident = Incident.query.get(incident_id)
    if not incident:
        return jsonify({'error': 'Incident not found'}), 404
        
    old_action = incident.analyst_action_taken
    incident.analyst_action_taken = action
    
    audit = AuditLog(
        username=username,
        action=f'UPDATE_INCIDENT_{incident_id}',
        status=f'Changed action from {old_action} to {action}',
        ip_address=request.remote_addr
    )
    
    try:
        db.session.add(audit)
        db.session.commit()
        return jsonify({
            'message': 'Incident updated successfully',
            'incident': incident.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Database update failed: {str(e)}'}), 500

@dashboard_bp.route('/logs', methods=['GET'])
def get_logs():
    try:
        logs = AuditLog.query.order_by(AuditLog.created_at.desc()).all()
        return jsonify([log.to_dict() for log in logs]), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve logs: {str(e)}'}), 500
