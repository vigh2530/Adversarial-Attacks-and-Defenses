# Project Documentation: Adversarial Attacks and Defenses (CyberGuard AI)

This document contains the strategic, analytical, and architectural details for **CyberGuard AI**, an end-to-end AI-driven threat detection and defense orchestration platform built for ABC Corporation.

---

## 1. Empathy Map
Designed to align defensive system design with the user experience of security operators and corporate employees.

| Quadrant | Security Analyst (Incident Response) | Corporate Employee |
| :--- | :--- | :--- |
| **SAYS** | "Analyzing thousands of logs manually is exhausting."<br>"We need a fast, automated way to triage file downloads and phishing reports." | "Is this email safe to click?"<br>"My computer feels slow, could it be malware?" |
| **THINKS** | "I hope a major breach isn't happening right now."<br>"If we can filter out the noise, we can focus on advanced threats." | "I don't want to get blamed for a security breach."<br>"Security procedures sometimes slow down my daily work." |
| **DOES** | Reviews logs, runs manual file analysis, maintains blocklists, triggers patch updates. | Checks email, downloads attachments, accesses internal databases, logs into corporate portals. |
| **FEELS** | Stressed by alert fatigue, anxious about missing critical incidents, proactive. | Uncertain, cautious, sometimes annoyed by complex security checks, protective of company assets. |
| **PAINS** | • High false-positive rates in existing tools.<br>• Lack of unified threat views.<br>• Delayed incident response times. | • Confusion identifying sophisticated phishing.<br>• Security alerts that interrupt workflows.<br>• Fear of making mistakes. |
| **GAINS** | • Centralized visual dashboard.<br>• High-accuracy ML-driven threat detection.<br>• Faster containment and remediation suggestions. | • Instant checking of suspicious content.<br>• Confidence that endpoint protection is active.<br>• Clean, non-intrusive security notifications. |

---

## 2. Brainstorming Map

```mermaid
mindmap
  root((CyberGuard AI))
    Phishing Detection
      NLP Text Vectorization
      Logistic Regression
      URL Heuristics
    Malware Analysis
      PE Header Signatures
      Entropy Metrics
      Random Forest Classifier
    Access Guard
      Anomaly Isolation Forest
      Failed Attempts
      Privilege Escalation Rules
    Data Storage
      PostgreSQL Relational DB
      Audit Log Traceability
      Incident Action History
```

---

## 3. Proposed Solution
**CyberGuard AI** is a consolidated web suite addressing threat vectors by combining Machine Learning classifiers with a live operations dashboard.
* **Phishing Shield**: Implements a Term Frequency-Inverse Document Frequency (TF-IDF) feature engineering pipeline coupled with a Logistic Regression classifier to inspect email semantics.
* **Malware Static Sandbox**: Employs a Random Forest Classifier trained on structural features of PE headers (entropy, size, signature status, section properties) to flag malicious files.
* **Access Guard**: Runs anomaly classification logic on session metadata (login hours, geographic location leaps, privilege levels requested) to block unauthorized access.

---

## 4. Solution Architecture

```mermaid
graph TD
    Client[React Frontend] -->|HTTPS Requests| API[Flask REST Backend]
    API -->|Inference Query| Models[AI/ML Models]
    API -->|SQL Operations| DB[(PostgreSQL Database)]
```

---

## 5. Data Flow Diagrams

### DFD Level 0 (Context Diagram)
```mermaid
graph LR
    User([Corporate User]) -->|Login Activity / Scans| System[[CyberGuard AI System]]
    System -->|Alerts / Security Verdict| User
    Analyst([Security Analyst]) -->|Triage Action updates| System
    System -->|Aggregated Threat Stats| Analyst
```

### DFD Level 1 (Detailed Process Diagram)
```mermaid
graph TD
    User([User]) -->|Input Text / File PE / Logs| Gateway[Flask REST API Gateway]
    
    Gateway -->|Verify Session| Auth[1.0 User Authenticator]
    Auth -->|Read/Write| DB_Users[(DB: Users)]
    
    Gateway -->|Parse Text| NLP_Process[2.0 Phishing NLP Analyzer]
    NLP_Process -->|Vectorize & Classify| ML_Phish[ML: Phishing Classifier]
    
    Gateway -->|Inspect Headers| Malware_Process[3.0 Malware Binary Scanner]
    Malware_Process -->|Feature Vector Classify| ML_Malware[ML: Malware Classifier]
    
    Gateway -->|Inspect Session Logs| Access_Process[4.0 Access Anomaly Detector]
    Access_Process -->|Anomalous Level Check| ML_Access[ML: Anomaly Classifier]
    
    NLP_Process & Malware_Process & Access_Process -->|Log Incident| DB_Incidents[(DB: Threat Incidents)]
    DB_Incidents -->|Query Aggregated Stats| Metrics[5.0 Dashboard Metrics Engine]
    Metrics -->|Dashboard JSON| Gateway
```

---

## 6. Technology Stack
* **Frontend**: React (Vite environment), styled with high-end modular Vanilla CSS (glassmorphism tokens, responsive grid layouts).
* **Backend**: Python Flask REST API server.
* **Database**: PostgreSQL (backed by SQLAlchemy ORM with SQLite local fallback).
* **Machine Learning**: `scikit-learn` for TF-IDF Text Vectorization, Logistic Regression, and Random Forest classification.

---

## 7. Sprint Planning
* **Sprint 1**: Database schema creation, synthetic cybersecurity dataset compilation, ML model training, and pickle model serialization.
* **Sprint 2**: Flask server configuration, endpoint routing (`/api/auth`, `/api/detect`, `/api/dashboard`), and database logger implementation.
* **Sprint 3**: React UI layout design, styling index setup, state binding to Flask endpoints, and dashboard widgets construction.
* **Sprint 4**: Integration testing, system documentation, and repository deployment to GitHub.
