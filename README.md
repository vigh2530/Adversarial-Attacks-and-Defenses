# Adversarial-Attacks-and-Defenses
# CyberGuard AI: Adversarial Attacks & Defenses Platform

Comprehensive end-to-end research and demo platform for detecting adversarial security threats across email (phishing), binary files (malware), and authentication events (access anomalies). Built as a full-stack example combining a React dashboard, Flask REST API, a relational audit store, and lightweight ML engines for inference and demonstration.

---

## Key Features
- Real-time phishing detection using a TF-IDF vectorizer + classifier (with heuristic fallback).
- Malware risk scoring from binary metadata features and heuristic fallbacks.
- Access anomaly detection for authentication events (time, geo, failed attempts).
- Audit logging and incident tracking with analyst action workflow (Pending → Mitigated / Investigated / False Positive).
- Full SPA dashboard with incident lists, metrics, and manual incident triage.

---

## Repository Layout
```text
adversarial-attacks-defenses/
├── README.md
├── docs/                         # Strategic and architectural documentation
├── backend/                      # Flask API, DB models, ML manager, utils
│   ├── app/
│   │   ├── models/               # db_models.py, ml_manager.py
│   │   ├── routes/               # auth.py, dashboard.py, detection.py
│   │   └── utils/                # data_generator.py, trainer.py
│   ├── requirements.txt          # Python dependency list
│   └── run.py                    # Backend entrypoint
├── frontend/                     # React SPA (Vite)
└── ml_models/                    # Trained model artifacts (.pkl)
```

---

## Technology Stack
- Frontend: React (Vite), JavaScript, CSS
- Backend: Python 3.8+, Flask, SQLAlchemy
- ML: Scikit-learn models serialized with `joblib`
- Database: SQLite (development) or any SQLAlchemy-supported RDBMS
- Dev tooling: npm, pip, virtualenv

---

## Installation & Quickstart

Prerequisites: `python` (3.8+), `pip`, Node.js (14+), `npm`.

Backend (local dev):
```powershell
cd C:\Users\PARTH\.gemini\antigravity\scratch\adversarial-attacks-defenses
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

Generate synthetic data and train models (optional — pre-trained pickles may be provided in `ml_models/`):
```powershell
python backend/app/utils/data_generator.py
python backend/app/utils/trainer.py
```

Start the Flask backend:
```powershell
python backend/run.py
```

Frontend (dev):
```bash
cd frontend
npm install
npm run dev
```

Default endpoints:
- Backend base: `http://localhost:5000`
- Frontend dev: `http://localhost:5173`

---

## API Reference (selected)
All API routes are registered as blueprints under `backend/app/routes`.

- `POST /register` — Register a new user
  - Request JSON: `{ "username": "alice", "password": "pass", "role": "analyst" }`

- `POST /login` — Authenticate a user
  - Request JSON: `{ "username": "alice", "password": "pass" }`

- `POST /phishing` — Phishing detection
  - Request JSON: `{ "text": "email body...", "username": "alice" }`
  - Response: `{ prediction: { label, confidence, is_threat, recommendation }, incident_id }

- `POST /malware` — Malware detection (expects computed features)
  - Request JSON: `{ "filename": "suspicious.exe", "features": { file_size_kb: 1024, entropy: 7.2, ... } }

- `POST /access` — Access anomaly detection
  - Request JSON: `{ "target_username": "bob", "features": { login_hour: 3, failed_attempts_last_hour: 5, is_known_ip: 0, ... } }

- `GET /dashboard/stats` — Dashboard metrics and recent events
- `GET /incidents` — List incidents
- `PUT /incidents/<incident_id>` — Update incident analyst action (triage)
- `GET /logs` — Audit logs list

Refer to [backend/app/routes](backend/app/routes) for implementation details.

---

## ML Models & Inference
Model loading and inference logic lives in `backend/app/models/ml_manager.py`.

- Phishing: packaged object with `vectorizer` + `model` (TF-IDF + classifier). If the model pickle is missing, the code uses keyword-based heuristics.
- Malware: model trained on file metadata (entropy, digital signature, sections, API calls). Heuristic fallback computes a risk score from those features.
- Access: anomaly classifier using hour, failed attempts, known device/IP, requested privilege and geo-distance. Heuristic fallback is implemented for demo scenarios.

Trained artifacts are expected in `ml_models/` as:
- `phishing_model.pkl` (dict with `vectorizer`, `model`)
- `malware_model.pkl`
- `access_anomaly_model.pkl`

If artifacts are absent the system will still function using heuristics so the demo can run without full ML training.

---

## Data & Examples
- Example datasets (CSV) located in `backend/app/data/`: `phishing_dataset.csv`, `malware_dataset.csv`, `access_dataset.csv` used by utilities to synthesize/train models.

Example `curl` request — phishing scan:
```bash
curl -X POST http://localhost:5000/phishing -H "Content-Type: application/json" -d '{"text":"Please verify account immediately"}'
```

Example `curl` request — malware scan:
```bash
curl -X POST http://localhost:5000/malware -H "Content-Type: application/json" -d '{"filename":"test.exe","features":{"entropy":7.4,"has_digital_signature":0}}'
```

---

## Development Notes
- Database: The app uses SQLAlchemy models defined in `backend/app/models/db_models.py` — adjust DB URL in `backend/app/config.py`.
- ML training: `backend/app/utils/trainer.py` contains model training and `joblib.dump` calls to write pickles to `ml_models/`.
- Logging: Actions create `AuditLog` entries for traceability.

---

## Contributing
- Fork the repo, create a feature branch, and open a pull request.
- Keep training data and heavy artifacts out of commits (use `.gitignore` for `ml_models/` if needed).

---

## License & Contact
- This repository is provided for demonstration and research. Add a license file (`LICENSE`) if you plan to share it.
- Questions / help: open an issue or contact the maintainers.

---

If you'd like, I can also:
- add a minimal `CONTRIBUTING.md` and `LICENSE`
- run the backend locally to verify endpoints
