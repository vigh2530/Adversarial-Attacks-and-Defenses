import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
MODEL_DIR = os.path.join(BASE_DIR, 'ml_models')
os.makedirs(MODEL_DIR, exist_ok=True)

def train_phishing_model():
    print("--- Training Phishing Detection Model ---")
    data_path = os.path.join(DATA_DIR, 'phishing_dataset.csv')
    if not os.path.exists(data_path):
        raise FileNotFoundError("Phishing dataset not found. Run data_generator.py first.")
        
    df = pd.read_csv(data_path)
    X = df['text']
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Text vectorization
    vectorizer = TfidfVectorizer(max_features=2000, stop_words='english')
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # Model definition
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train_vec, y_train)
    
    # Evaluation
    y_pred = model.predict(X_test_vec)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred))
    
    # Save model package
    model_package = {
        'vectorizer': vectorizer,
        'model': model
    }
    model_path = os.path.join(MODEL_DIR, 'phishing_model.pkl')
    joblib.dump(model_package, model_path)
    print(f"Saved phishing model package to {model_path}")

def train_malware_model():
    print("--- Training Malware Detection Model ---")
    data_path = os.path.join(DATA_DIR, 'malware_dataset.csv')
    if not os.path.exists(data_path):
        raise FileNotFoundError("Malware dataset not found. Run data_generator.py first.")
        
    df = pd.read_csv(data_path)
    features = [
        'file_size_kb', 'has_digital_signature', 'entropy', 
        'imported_dlls_count', 'sections_count', 
        'contains_suspicious_sections', 'suspicious_api_calls_count'
    ]
    X = df[features]
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluation
    y_pred = model.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred))
    
    model_path = os.path.join(MODEL_DIR, 'malware_model.pkl')
    joblib.dump(model, model_path)
    print(f"Saved malware model to {model_path}")

def train_access_model():
    print("--- Training Access Anomaly Detection Model ---")
    data_path = os.path.join(DATA_DIR, 'access_dataset.csv')
    if not os.path.exists(data_path):
        raise FileNotFoundError("Access dataset not found. Run data_generator.py first.")
        
    df = pd.read_csv(data_path)
    features = [
        'login_hour', 'failed_attempts_last_hour', 'is_known_ip', 
        'is_known_device', 'requested_privilege_level', 'geo_distance'
    ]
    X = df[features]
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluation
    y_pred = model.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred))
    
    model_path = os.path.join(MODEL_DIR, 'access_anomaly_model.pkl')
    joblib.dump(model, model_path)
    print(f"Saved access anomaly model to {model_path}")

if __name__ == '__main__':
    train_phishing_model()
    train_malware_model()
    train_access_model()
