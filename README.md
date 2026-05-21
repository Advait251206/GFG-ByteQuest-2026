# 🏥 Silent Disease — AI-Powered Health Risk Analyzer

### *GFG ByteQuest 2026 — Advanced Health Diagnostic Platform*

---

<div align="center">
  <img src="https://img.shields.io/badge/Hackathon-GFG_ByteQuest_2026-green?style=for-the-badge&logo=geeksforgeeks" alt="GFG Hackathon Badge" />
  <img src="https://img.shields.io/badge/AI_Engine-Groq_Llama_3.1-9C27B0?style=for-the-badge" alt="AI Engine Badge" />
  <img src="https://img.shields.io/badge/Stack-MERN_&_TypeScript-00599C?style=for-the-badge&logo=react" alt="Tech Stack Badge" />
</div>

---

> 📢 **"Silent diseases are the most dangerous because they whisper before they roar."**
> 
> *This submission introduces a comprehensive, AI-integrated prognostic engine designed to flag hidden medical risks and lifestyle imbalances before they escalate into clinical conditions.*

---

## 🎯 Platform Objectives

**Silent Disease** is an enterprise-grade full-stack solution built specifically for the **GFG ByteQuest 2026** competition. By aligning dynamic health metric tracking with low-latency LLM analysis, the platform empowers everyday users to screen themselves for chronic risks, identify invisible stressors, and receive guided health instructions.

---

## ⚡ Core Feature Modules

### 📈 1. Immersive Health Analytics Dashboard
* **Dynamic Metric Grid:** Tracks vital daily bio-parameters: **Sleep Quality (hours), Stress Levels (1-10), Heart Rate (BPM), and Blood Pressure**.
* **Data Visualization:** Employs high-fidelity **Recharts** displaying historical trends, fluctuations, and correlations over time.
* **Intelligent Risk Gauge:** Renders a probabilistic clinical risk score indicating potential health warning levels.

### 🧠 2. Groq-Powered AI Risk Analyzer
* **Llama-3.1-8b Processing:** Translates unstructured metrics and custom symptom descriptions into structured clinical summaries.
* **Predictive Anomaly Detection:** Instantly flags overlapping hazards (e.g., matching a high-stress profile with low REM sleep) and synthesizes risk mitigations.
* **Conversational Symptom Mining:** Intelligently extracts conversational statements (e.g., *"I've been feeling feverish with muscle fatigue"*) and formats them into an organized medical review.

### 💬 3. State-Preserving AI Health Companion
* **Persistent Session Memory:** An interactive medical chatbot that retains memory of conversational logs across the platform.
* **Context-Aware Recommendations:** The virtual assistant automatically references the user's latest dashboard metrics and risk scores to provide tailored, localized wellness guidance.

### 🔐 4. Secure Profile Gateways
* **JWT Infrastructure:** Secure token-based user authentication and data encryption using Bcrypt.
* **Full Profile Administration:** Custom settings to update biographical information, change authentication passwords, or securely offboard/delete accounts.

---

## 🛠️ Tech Stack Architecture

### **Frontend Interface** ⚛️
* **Framework:** React 19 (via Vite) + TypeScript
* **Styling Pipeline:** Tailwind CSS (Modern Glassmorphism UI elements)
* **Animation Layer:** Framer Motion (Fluid page switches & micro-animations)
* **Data Visualizations:** Recharts (Dynamic interactive charts)
* **Icon Pack:** Lucide React

### **Backend Service Engine** ⚙️
* **Runtime Environment:** Node.js + Express.js APIs
* **Database Layer:** MongoDB + Mongoose ORM
* **Inference Pipeline:** Groq SDK (Llama-3.1-8b-instant inference)
* **Authentication Gateway:** JSON Web Tokens (JWT) & Bcrypt hashing

---

## 🚀 Installation & Local Environment Setup

Run the application locally by executing the following terminal commands:

### **Prerequisites**
* **Node.js** (v16 or higher)
* **MongoDB** (A local connection string or MongoDB Atlas URI)
* **Groq API Key** (Generate a key at [console.groq.com](https://console.groq.com))

---

### **1. Clone the Workspace**
Clone the GeeksforGeeks ByteQuest workspace and navigate to the project directory:
```bash
git clone https://github.com/Advait251206/GFG-ByteQuest-2026.git
cd GFG-ByteQuest-2026
```

### **2. Install Dependencies**
Install standard Node modules across all directories concurrently:
```bash
# Install root concurrency tools
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### **3. Configure Environment Credentials**
Establish a `.env` file inside your **`backend/`** subdirectory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=super_secret_jwt_key_change_me
```

### **4. Launch the Platform**
Run the client server and backend APIs concurrently with one command from the project root:
```bash
# Execute from the GFG-ByteQuest-2026/ root directory
npm run dev
```

* **Frontend Hub:** [http://localhost:5173](http://localhost:5173)
* **Backend API Gateway:** [http://localhost:5000](http://localhost:5000)

---

## 📁 Repository Organization

```
├── .gitignore                                      # Excludes node_modules, local .env keys, and build assets
├── README.md                                       # Advanced GFG ByteQuest 2026 documentation
├── Demo Video.mp4                                  # Full video demonstration of app usage and dashboard features
├── The-Silent-Disease-Unveiling-Hidden-Health.pptx # Hackathon presentation pitch slides
├── package.json                                    # Configures concurrently to boot client and server
├── backend/                                        # Express REST APIs & Groq AI configuration
└── frontend/                                       # Vite + React 18 + TS dashboard interface
```

---

<br>
<p align="center">
  <i>Developed with precision for GeeksforGeeks ByteQuest 2026 🔬.</i>
</p>