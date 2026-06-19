import os
import joblib
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_DIR = os.path.join(BASE_DIR, 'ml_models')

class MLManager:
    def __init__(self):
        self.phishing_pkg = None
        self.malware_model = None
        self.access_model = None
        self.load_models()

    def load_models(self):
        phishing_path = os.path.join(MODEL_DIR, 'phishing_model.pkl')
        malware_path = os.path.join(MODEL_DIR, 'malware_model.pkl')
        access_path = os.path.join(MODEL_DIR, 'access_anomaly_model.pkl')
        
        if os.path.exists(phishing_path):
            try:
                self.phishing_pkg = joblib.load(phishing_path)
                print("Successfully loaded Phishing Detection Model.")
            except Exception as e:
                print(f"Error loading Phishing Model: {e}")
        else:
            print("Phishing model file not found. Fallback heuristics will be used.")

        if os.path.exists(malware_path):
            try:
                self.malware_model = joblib.load(malware_path)
                print("Successfully loaded Malware Detection Model.")
            except Exception as e:
                print(f"Error loading Malware Model: {e}")
        else:
            print("Malware model file not found. Fallback heuristics will be used.")

        if os.path.exists(access_path):
            try:
                self.access_model = joblib.load(access_path)
                print("Successfully loaded Access Anomaly Detection Model.")
            except Exception as e:
                print(f"Error loading Access Anomaly Model: {e}")
        else:
            print("Access Anomaly model file not found. Fallback heuristics will be used.")

    def predict_phishing(self, email_text):
        """Predicts if an email is phishing. Returns (label, confidence_score)."""
        if self.phishing_pkg is not None:
            try:
                vectorizer = self.phishing_pkg['vectorizer']
                model = self.phishing_pkg['model']
                vec_text = vectorizer.transform([email_text])
                pred = int(model.predict(vec_text)[0])
                prob = float(model.predict_proba(vec_text)[0][pred])
                return pred, prob
            except Exception as e:
                print(f"Inference error in phishing model: {e}")
                
        # Heuristic fallback
        keywords = ['urgent', 'password reset', 'verify account', 'bank transfer', 'suspicious login', 'click here', 'amazon gift card', 'bitcoin', 'verify bank']
        score = sum(1 for kw in keywords if kw in email_text.lower())
        prob = min(0.5 + (score * 0.1), 0.99) if score > 0 else 0.05
        label = 1 if score >= 2 else 0
        return label, prob

    def predict_malware(self, file_features):
        """
        Predicts if a file is malware given its feature dictionary:
        {file_size_kb, has_digital_signature, entropy, imported_dlls_count, 
         sections_count, contains_suspicious_sections, suspicious_api_calls_count}
        Returns (label, confidence_score).
        """
        features_list = [
            file_features.get('file_size_kb', 500),
            file_features.get('has_digital_signature', 1),
            file_features.get('entropy', 5.0),
            file_features.get('imported_dlls_count', 6),
            file_features.get('sections_count', 4),
            file_features.get('contains_suspicious_sections', 0),
            file_features.get('suspicious_api_calls_count', 0)
        ]
        
        if self.malware_model is not None:
            try:
                X = np.array([features_list])
                pred = int(self.malware_model.predict(X)[0])
                prob = float(self.malware_model.predict_proba(X)[0][pred])
                return pred, prob
            except Exception as e:
                print(f"Inference error in malware model: {e}")
                
        # Heuristic fallback
        score = 0
        if file_features.get('has_digital_signature', 1) == 0:
            score += 2
        if file_features.get('entropy', 5.0) > 6.8:
            score += 2
        if file_features.get('contains_suspicious_sections', 0) == 1:
            score += 2
        if file_features.get('suspicious_api_calls_count', 0) > 4:
            score += 3
            
        label = 1 if score >= 4 else 0
        prob = min(0.3 + (score * 0.08), 0.99) if label == 1 else 0.95 - (score * 0.05)
        return label, prob

    def predict_access(self, access_features):
        """
        Predicts if an access request is unauthorized/anomalous given features:
        {login_hour, failed_attempts_last_hour, is_known_ip, is_known_device, 
         requested_privilege_level, geo_distance}
        Returns (label, confidence_score).
        """
        features_list = [
            access_features.get('login_hour', 12),
            access_features.get('failed_attempts_last_hour', 0),
            access_features.get('is_known_ip', 1),
            access_features.get('is_known_device', 1),
            access_features.get('requested_privilege_level', 0),
            access_features.get('geo_distance', 10.0)
        ]
        
        if self.access_model is not None:
            try:
                X = np.array([features_list])
                pred = int(self.access_model.predict(X)[0])
                prob = float(self.access_model.predict_proba(X)[0][pred])
                return pred, prob
            except Exception as e:
                print(f"Inference error in access model: {e}")
                
        # Heuristic fallback
        score = 0
        if access_features.get('login_hour', 12) < 6 or access_features.get('login_hour', 12) > 21:
            score += 1
        if access_features.get('failed_attempts_last_hour', 0) > 3:
            score += 3
        if access_features.get('is_known_ip', 1) == 0:
            score += 2
        if access_features.get('is_known_device', 1) == 0:
            score += 1
        if access_features.get('requested_privilege_level', 0) == 2: # Admin escalation
            score += 2
        if access_features.get('geo_distance', 10.0) > 1000.0:
            score += 2
            
        label = 1 if score >= 4 else 0
        prob = min(0.4 + (score * 0.07), 0.99) if label == 1 else 0.95 - (score * 0.05)
        return label, prob

# Singleton instance
ml_manager = MLManager()
