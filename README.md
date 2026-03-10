# RAD-PAL-QOL Study Data Collection System

A full-stack clinical data collection platform built to support the **RAD-PAL-QOL palliative care study**.
The system allows doctors to record structured patient assessments, complete standardized questionnaires, and export the collected dataset for research analysis.

This project digitizes the study forms and ensures that all responses are captured consistently and exported into a structured dataset.

# Overview

The system provides a secure interface for clinicians to:

• Register and manage patients
• Conduct structured clinical assessments
• Record questionnaire responses (QLQ-C30 and ESAS)
• Document radiology conference outcomes
• Capture body map symptom locations
• Export the entire study dataset to Excel for analysis

The platform ensures that the questionnaire data is stored in a **structured format suitable for research datasets**.

# Key Features

### Authentication

Secure login system using **JWT authentication**.

### Patient Management

Doctors can create and manage patient records for the study.

### Assessment Wizard

A multi-step clinical form that captures:

1. Demographic information
2. Clinical history
3. Investigations
4. Pre-conference assessment
5. QLQ-C30 questionnaire
6. ESAS symptom scoring
7. Body map symptom location
8. Radiology conference findings
9. Post-conference outcomes
10. Final clinical summary

### Multilingual Questionnaire Support

The questionnaires can be displayed in:

• English
• Hindi
• Hindi transliteration

The doctor reads the questions to the patient and records the response.

### Dataset Export

All responses from the assessment wizard are exported to Excel where:

• Every questionnaire item is stored as a **separate column**
• Each assessment becomes a **single row in the dataset**

This ensures the exported file is ready for statistical analysis.

---

# Technology Stack

## Frontend

React
React Router
Axios
Custom CSS

## Backend

Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
ExcelJS

---

# Project Structure

```
rad-pal-qol-study
│
├── backend
│   ├── src
│   │   ├── models
│   │   │   ├── Patient.js
│   │   │   ├── Assessment.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes
│   │   │   ├── auth.routes.js
│   │   │   ├── patients.routes.js
│   │   │   ├── assessment.routes.js
│   │   │   └── export.routes.js
│   │   │
│   │   ├── middleware
│   │   │   ├── auth.js
│   │   │   └── validate.js
│   │   │
│   │   ├── utils
│   │   │   └── tokens.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── layout
│   │   │   └── common
│   │   │
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PatientsPage.jsx
│   │   │   ├── AssessmentCreatePage.jsx
│   │   │   └── ExportPage.jsx
│   │   │
│   │   ├── services
│   │   │   └── api.js
│   │   │
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# Running the Project Locally

## Backend

Install dependencies

```bash
cd backend
npm install
```

Create `.env`

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/rad_pal_qol
JWT_ACCESS_SECRET=replace_with_secret
JWT_REFRESH_SECRET=replace_with_secret
ACCESS_TOKEN_MIN=30
REFRESH_TOKEN_DAYS=7
CORS_ORIGIN=http://localhost:5173
```

Start server

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

## Frontend

Install dependencies

```bash
cd frontend
npm install
```

Run the application

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# Dataset Export

The export feature generates an Excel dataset where:

• Each **assessment = one row**
• Each **questionnaire item = one column**

The dataset includes:

• Demographic fields
• Clinical history
• Investigation details
• QLQ-C30 responses
• ESAS scores
• Body map symptom indicators
• Radiology conference outcomes
• Post-conference assessment

The exported dataset is ready for statistical analysis in:

• SPSS
• R
• Python
• Excel

---

# Intended Use

This system was built to support a clinical research workflow for collecting structured patient assessment data in a palliative care study.

It digitizes the paper questionnaire process and ensures that study responses are captured in a consistent format suitable for research analysis.

---

# Author

Blessy Grace

