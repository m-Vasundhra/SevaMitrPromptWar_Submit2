# SevaMitr AI (सेवामित्र AI) — Senior Citizen GenAI Digital Companion

> **"Don't replace the senior. Empower the senior."**

SevaMitr AI is a patient, step-by-step GenAI-powered digital companion specifically architected for senior citizens. It helps seniors navigate complex digital tasks (such as IRCTC railway ticket booking, flight comparisons, and senior netbanking) independently while shielding them against online fraud, dark patterns, and scam messages.

---

## 🛡️ Agentic Threat Modeling & Security Review

| Threat Zone | Identified Risk | Countermeasure Implemented |
| :--- | :--- | :--- |
| **1. Input Surfaces** | Prompt injection via untrusted user inputs, pasted scam SMS text, or malicious links. | Strict schema validation, Privacy Firewall regex redaction, and defensive prompt delimitation treating inputs purely as data. |
| **2. Planning & Reasoning** | System instruction bypass, hallucinated steps, or skipping mandatory security gates. | State-machine deterministic task engine (`/task-engine/engine.ts`) enforcing step verification and step-by-step sequential advancement. |
| **3. Tool Execution** | Dynamic credential exfiltration, unauthorized fund transfer, or autonomous actions. | **Empowerment Principle:** AI never performs financial execution. High-risk financial operations trigger an explicit user self-verification gate. |
| **4. Memory & State** | Exposure of PII (Aadhaar, PAN), passwords, or CVVs in memory or logs. | Client-side and server-side `PrivacyFirewall` systematically stripping passwords, 12-digit Aadhaar numbers, 16-digit debit cards, and CVVs before AI ingestion. |
| **5. Inter-System Comm** | Gemini API key leakage to browser client bundle or third-party interceptors. | Gemini SDK calls are strictly server-side (`/backend/gemini.ts`) using Google Cloud Secret Manager / environment variables. Zero hardcoded keys. |

---

## 🏗️ Decoupled Architecture

```
├── /src                    # Frontend SPA (First Page, Senior UI, Speech STT/TTS)
├── /backend                # Express API Gateway, Privacy Firewall, Route Handlers
├── /task-engine            # Deterministic State Machine, Recovery Logic, Workflows
├── /extension              # Content Script Inspector, DOM Target Highlighter Bridge
├── /shared                 # Shared Types, Locales (en, hi), Workflow Schemas
└── server.ts               # Unified Production & Dev Server Entrypoint
```

---

## 🚀 Google Cloud Run Deployment & Configuration

### 1. Enable Required APIs & Prerequisites
```bash
gcloud services enable run.googleapis.com secretmanager.googleapis.com firestore.googleapis.com
```

### 2. Secret Manager Bindings (Zero-Hardcoding Hygiene)
```bash
# Create and populate the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Grant Cloud Run service account access to read the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 3. Build & Deploy to Cloud Run
```bash
gcloud run deploy saarthi-senior-companion \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

### 4. Required Campaign Verification Binding
```bash
gcloud run services update saarthi-senior-companion \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```

---

## 🧪 Functional Test Walkthrough Cases

### Test Case 1: First Page Landing & Language Switching
1. Open application. Confirm direct landing on First Page with No Login Wall.
2. Click **[ हिन्दी ]** button. Verify UI instantly updates to Hindi ("सारथी AI", "वरिष्ठ नागरिकों का डिजिटल साथी").
3. Click **[ English ]** button. Verify UI switches back to English.
4. Test Senior Font Scale buttons (`A`, `A+`, `A++`) and confirm font scaling across text.

### Test Case 2: IRCTC Railway Booking Guided Step-by-Step Flow
1. Click **IRCTC Railway Ticket Booking** card.
2. Confirm Golden Pulse Ring highlights the "From (Departure)" input box (`#input-origin`).
3. Companion Bar speaks & displays: *"Type your departure station (e.g., New Delhi)"*.
4. Click `+ New Delhi (NDLS)`. Step completes and advances automatically to "To (Destination)".
5. Click `+ Jaipur (JP)` and click `Search Trains`.
6. Select **12015 Ajmer Shatabdi** and click **AC Chair Car (CC - ₹890)**.
7. Enter Passenger Full Name: *Ramesh Sharma*, Age: *68*, and check Senior Lower Berth option.
8. Click **Review & Proceed**. Review summary is displayed.
9. Click **Simulate Safe Payment (₹890)**. High-Risk Security Confirmation Modal appears.
10. Click **Confirm & Book Ticket**. Confirmed PNR demo booking card appears.

### Test Case 3: Mistake Recovery ("I made a mistake")
1. In active booking workflow, click **"I made a mistake" / "मुझसे गलती हो गई"**.
2. Select **"Go back one step"**. Verify companion returns to the preceding step with patient guidance.
3. Select **"Try this step again"**. Verify step resets for re-entry.

### Test Case 4: Senior NetBanking & High-Risk Authorization Gate
1. Select **Senior NetBanking Safety** workflow.
2. Click **View Balance** (`#bank-btn-show-balance`). Balance reveals from masked state.
3. Click **Send Money (Transfer)**.
4. Select beneficiary **Ramesh Sharma (Son)**.
5. Enter Amount ₹5,000.
6. Click **Confirm & Authorize ₹5,000 Transfer**.
7. High-Risk Security Authorization Gate appears, prompting user to personally verify the recipient without revealing PIN or OTP.
8. Authorize demo transfer. Transfer success confirmation is rendered.

### Test Case 5: AI Scam & Fraud Shield Analyzer
1. Select **Scam & Fraud Inspector** workflow.
2. Click sample: *"⚡ Electricity Disconnection Threat SMS"*.
3. Verify Privacy Firewall highlights masked phone numbers and PII.
4. Click **Analyze Message for Scam**.
5. AI analyzes the threat and renders a structured Scam Report Card with:
   - Risk Level: **HIGH RISK**
   - Red Flag breakdown: Urgency threat, Unofficial mobile contact, Coercive language
   - Actionable senior guidance: *"Do not call the number. Verify bill status on official power portal."*

### Test Case 6: Privacy Firewall & Architecture Inspection
1. Click **🔒 Privacy Shield** button in header.
2. Type custom test text containing Aadhaar, Card Number, and Password.
3. Verify live sanitized output masks all sensitive tokens.
4. Click **Architecture & Security** button to inspect the decoupled module breakdown.
