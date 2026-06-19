from flask import Blueprint, request, jsonify
from ..models.db_models import db, Incident, AuditLog
from ..models.ml_manager import ml_manager

detection_bp = Blueprint('detection', __name__)

@detection_bp.route('/phishing', methods=['POST'])
def detect_phishing():
    data = request.get_json() or {}
    text = data.get('text', '')
    username = data.get('username', 'anonymous')
    
    if not text:
        return jsonify({'error': 'Email text is required'}), 400
        
    # Predict using ML Manager
    label, confidence = ml_manager.predict_phishing(text)
    
    # Generate recommendations
    if label == 1:
        recommendation = (
            "1. Do NOT click any links in this email.\n"
            "2. Report this email to the security response team (abuse@abc.com).\n"
            "3. Delete the email from your inbox to prevent accidental clicks.\n"
            "4. Block sender domain in corporate email gateway."
        )
    else:
        recommendation = "No threat detected. Standard corporate security policies apply."
        
    # Log incident
    incident = Incident(
        threat_type='Phishing',
        raw_data=text,
        prediction_label=label,
        confidence_score=confidence,
        recommendation=recommendation
    )
    
    # Audit log
    audit = AuditLog(
        username=username,
        action='PHISHING_SCAN',
        status='Anomaly Detected' if label == 1 else 'Success',
        ip_address=request.remote_addr
    )
    
    try:
        db.session.add(incident)
        db.session.add(audit)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
        
    return jsonify({
        'status': 'success',
        'prediction': {
            'label': label,
            'confidence': confidence,
            'is_threat': label == 1,
            'recommendation': recommendation
        },
        'incident_id': incident.id
    })

@detection_bp.route('/malware', methods=['POST'])
def detect_malware():
    data = request.get_json() or {}
    username = data.get('username', 'anonymous')
    
    # We expect features or raw metadata. If files are uploaded, the frontend computes basic metrics
    # or the backend uses default/input features.
    file_features = data.get('features', {})
    filename = data.get('filename', 'unknown_file')
    
    if not file_features:
        return jsonify({'error': 'File features are required'}), 400
        
    # Predict using ML Manager
    label, confidence = ml_manager.predict_malware(file_features)
    
    if label == 1:
        recommendation = (
            f"1. Threat Alert: Isolate the endpoint hosting '{filename}' immediately.\n"
            "2. Terminate any active process running this binary.\n"
            "3. Quarantine the file and conduct full endpoint virus scan.\n"
            "4. Push endpoint agent update to blacklist file hash."
        )
    else:
        recommendation = f"File '{filename}' appears benign. Standard scanning completed successfully."
        
    # Log incident
    incident = Incident(
        threat_type='Malware',
        raw_data=f"Filename: {filename} | Features: {str(file_features)}",
        prediction_label=label,
        confidence_score=confidence,
        recommendation=recommendation
    )
    
    # Audit log
    audit = AuditLog(
        username=username,
        action=f'MALWARE_SCAN_{filename}',
        status='Anomaly Detected' if label == 1 else 'Success',
        ip_address=request.remote_addr
    )
    
    try:
        db.session.add(incident)
        db.session.add(audit)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
        
    return jsonify({
        'status': 'success',
        'prediction': {
            'label': label,
            'confidence': confidence,
            'is_threat': label == 1,
            'recommendation': recommendation
        },
        'incident_id': incident.id
    })

@detection_bp.route('/access', methods=['POST'])
def detect_access():
    data = request.get_json() or {}
    username_logged = data.get('target_username', 'unknown_user')
    username = data.get('username', 'anonymous')
    access_features = data.get('features', {})
    
    if not access_features:
        return jsonify({'error': 'Access log features are required'}), 400
        
    # Predict using ML Manager
    label, confidence = ml_manager.predict_access(access_features)
    
    if label == 1:
        recommendation = (
            f"1. CRITICAL: High-risk login attempt for user '{username_logged}'.\n"
            "2. Temporarily lock the account credentials to prevent compromise.\n"
            "3. Require Multi-Factor Authentication (MFA) re-enrollment.\n"
            "4. Verify source IP location and block unauthorized traffic."
        )
    else:
        recommendation = f"Login event for '{username_logged}' verified as normal."
        
    # Log incident
    incident = Incident(
        threat_type='Unauthorized Access',
        raw_data=f"Target: {username_logged} | Features: {str(access_features)}",
        prediction_label=label,
        confidence_score=confidence,
        recommendation=recommendation
    )
    
    # Audit log
    audit = AuditLog(
        username=username,
        action=f'ACCESS_GUARD_{username_logged}',
        status='Anomaly Detected' if label == 1 else 'Success',
        ip_address=request.remote_addr
    )
    
    try:
        db.session.add(incident)
        db.session.add(audit)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
        
    return jsonify({
        'status': 'success',
        'prediction': {
            'label': label,
            'confidence': confidence,
            'is_threat': label == 1,
            'recommendation': recommendation
        },
        'incident_id': incident.id
    })
