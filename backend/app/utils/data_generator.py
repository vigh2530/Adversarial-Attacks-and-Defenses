import os
import random
import csv
import pandas as pd
import numpy as np

# Ensure data directory exists
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

def generate_phishing_data(n_samples=1500):
    """Generates synthetic phishing and legitimate email datasets."""
    phishing_subjects = [
        "URGENT: Verify your account immediately",
        "Security Alert: Unusual login activity detected",
        "Action Required: Update your billing information",
        "Your account has been suspended",
        "Invoice payment overdue - Action required",
        "Confirm your password change request",
        "You have won a free gift card! Claim now",
        "Crypto alert: Double your investments today",
        "HR: Mandatory safety update and verification link",
        "IT Support: System upgrade password confirmation needed"
    ]
    
    phishing_bodies = [
        "We detected suspicious login attempts from a foreign IP. Please click the link to confirm your identity: http://secure-verify-abc-login.com/auth",
        "Your account will be terminated in 24 hours due to non-compliance. Update details here: http://abc-support-upgrade-portal.net",
        "Dear employee, you have a pending payroll adjustment. Please verify your bank details on this external page: http://payroll-portal-verification.xyz",
        "Congratulations! You were selected for a $500 Amazon Gift card. Redeem it immediately: http://giftcard-rewards-winner.info",
        "We are upgrading our active directory database. Please log in with your corporate credentials to prevent account lockout: http://active-directory-portal.org/login",
        "Please review the attached invoice details and resolve the payment by clicking this link: http://invoice-viewer-download.online",
        "Your password expires today. Click here to keep your current password: http://reset-password-now.com",
        "Important notification from HR department. View the document at: http://hr-announcements-doc.icu",
        "Urgent system patch required. Download and run this update: http://system-update-downloader.cc/patch.exe",
        "Your cloud subscription renewal failed. Update your credit card details immediately: http://cloud-portal-payment-update.top"
    ]
    
    legit_subjects = [
        "Weekly Team Sync Meeting",
        "Project Status Update - Phase 2",
        "Quarterly financial report review",
        "Feedback requested: New policy document",
        "Welcome to the team!",
        "Happy Friday - Lunch plans?",
        "Tech Talk: Intro to Machine Learning",
        "System maintenance schedule: Friday 10 PM",
        "Expense report approved for trip",
        "Vacation approval notification"
    ]
    
    legit_bodies = [
        "Hi team, just a reminder that our weekly sync is tomorrow at 10 AM. We'll go over the project milestones.",
        "Attached is the draft of the project documentation for next week's launch. Let me know if you have any feedback.",
        "The Q2 financial report has been published on the internal wiki portal. Please review prior to the all-hands meeting.",
        "Welcome to ABC Corporation! We're excited to have you. Please check your onboarding guide on the corporate intranet page.",
        "Hey, are you free for lunch at 12:30 PM today? We're heading to the Italian bistro down the street.",
        "Please note that the corporate VPN server will undergo scheduled updates this Friday night. No action is required.",
        "Your expense report for the Seattle developer conference has been processed and approved. Funds will transfer in 3 business days.",
        "Hi, your request for annual leave from July 5th to July 12th has been approved. Enjoy your vacation!",
        "Here is the slide deck for the upcoming design review. Looking forward to your thoughts and suggestions.",
        "Don't forget to submit your weekly timesheet by today at 5 PM to ensure prompt payroll processing."
    ]

    data = []
    
    # Phishing samples (label = 1)
    for _ in range(n_samples // 2):
        subj = random.choice(phishing_subjects)
        body = random.choice(phishing_bodies)
        # Mix in some randomized noise to make it realistic
        noise = f" Ref Code: {random.randint(1000, 9999)}."
        text = f"Subject: {subj}\n\n{body}{noise}"
        data.append((text, 1))
        
    # Legitimate samples (label = 0)
    for _ in range(n_samples // 2):
        subj = random.choice(legit_subjects)
        body = random.choice(legit_bodies)
        noise = f" Sent from my device. Ticket #{random.randint(10000, 99999)}."
        text = f"Subject: {subj}\n\n{body}{noise}"
        data.append((text, 0))
        
    # Shuffle and save to CSV
    random.shuffle(data)
    filepath = os.path.join(DATA_DIR, 'phishing_dataset.csv')
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['text', 'label'])
        writer.writerows(data)
    print(f"Generated {len(data)} phishing samples at {filepath}")

def generate_malware_data(n_samples=1500):
    """Generates synthetic malware dataset based on PE header and file structural characteristics."""
    data = []
    for _ in range(n_samples):
        is_malware = random.choice([0, 1])
        if is_malware:
            # Malware properties
            file_size_kb = random.randint(10, 8000)
            has_digital_signature = random.choices([0, 1], weights=[85, 15])[0]
            entropy = random.uniform(6.5, 7.99)
            imported_dlls_count = random.randint(1, 4)
            sections_count = random.randint(2, 9)
            contains_suspicious_sections = random.choices([0, 1], weights=[20, 80])[0]
            suspicious_api_calls_count = random.randint(3, 15)
        else:
            # Benign properties
            file_size_kb = random.randint(100, 50000)
            has_digital_signature = random.choices([0, 1], weights=[15, 85])[0]
            entropy = random.uniform(3.5, 6.4)
            imported_dlls_count = random.randint(5, 15)
            sections_count = random.randint(4, 7)
            contains_suspicious_sections = random.choices([0, 1], weights=[95, 5])[0]
            suspicious_api_calls_count = random.randint(0, 3)
            
        data.append({
            'file_size_kb': file_size_kb,
            'has_digital_signature': has_digital_signature,
            'entropy': round(entropy, 4),
            'imported_dlls_count': imported_dlls_count,
            'sections_count': sections_count,
            'contains_suspicious_sections': contains_suspicious_sections,
            'suspicious_api_calls_count': suspicious_api_calls_count,
            'label': is_malware
        })
        
    df = pd.DataFrame(data)
    filepath = os.path.join(DATA_DIR, 'malware_dataset.csv')
    df.to_csv(filepath, index=False)
    print(f"Generated {len(df)} malware samples at {filepath}")

def generate_access_data(n_samples=1500):
    """Generates synthetic unauthorized access log dataset."""
    data = []
    for _ in range(n_samples):
        is_anomaly = random.choice([0, 1])
        if is_anomaly:
            # Anomaly/Unauthorized login properties
            login_hour = random.choices(
                [random.randint(0, 5), random.randint(22, 23), random.randint(6, 21)],
                weights=[45, 45, 10]
            )[0]
            failed_attempts_last_hour = random.choices(
                [random.randint(4, 15), random.randint(0, 3)],
                weights=[80, 20]
            )[0]
            is_known_ip = random.choices([0, 1], weights=[90, 10])[0]
            is_known_device = random.choices([0, 1], weights=[85, 15])[0]
            requested_privilege_level = random.choices([0, 1, 2], weights=[20, 30, 50])[0]
            geo_distance = random.uniform(500.0, 12000.0)
        else:
            # Normal/Authorized login properties
            login_hour = random.randint(8, 18)
            failed_attempts_last_hour = random.choices([0, 1, 2, 3], weights=[80, 15, 4, 1])[0]
            is_known_ip = random.choices([0, 1], weights=[5, 95])[0]
            is_known_device = random.choices([0, 1], weights=[5, 95])[0]
            requested_privilege_level = random.choices([0, 1, 2], weights=[75, 20, 5])[0]
            geo_distance = random.uniform(0.0, 100.0)
            
        data.append({
            'login_hour': login_hour,
            'failed_attempts_last_hour': failed_attempts_last_hour,
            'is_known_ip': is_known_ip,
            'is_known_device': is_known_device,
            'requested_privilege_level': requested_privilege_level,
            'geo_distance': round(geo_distance, 2),
            'label': is_anomaly
        })
        
    df = pd.DataFrame(data)
    filepath = os.path.join(DATA_DIR, 'access_dataset.csv')
    df.to_csv(filepath, index=False)
    print(f"Generated {len(df)} access logs samples at {filepath}")

if __name__ == '__main__':
    generate_phishing_data()
    generate_malware_data()
    generate_access_data()
