# 🏥 Silent Disease - AI-Powered Health Risk Analyzer

> **"Silent diseases are the most dangerous because they whisper before they roar."**

**Silent Disease** is a modern, AI-driven web application designed to help users identify potential health risks based on their lifestyle metrics and symptoms. By leveraging the power of **Groq's Llama-3 AI**, it provides real-time risk analysis, personalized insights, and an intelligent chat companion to guide users toward better health decisions.

---

## ✨ Key Features

### 📊 **Interactive Dashboard**

- Visualize your health trends with **Recharts**.
- Track key metrics: **Heart Rate, Sleep Quality, Stress Levels, and Blood Pressure**.
- Real-time **Risk Gauge** showing your probabilistic health risk score.

### 🤖 **AI Risk Analysis**

- Uses **Groq (Llama-3.1-8b)** to analyze your specific health data.
- Detects patterns and anomalies (e.g., high stress + low sleep).
- Recognizes conversational symptoms (e.g., "I feel symptoms of Covid") and integrates them into the medical report.

### 💬 **AI Health Companion**

- Persistent Chatbot that remembers your conversation history.
- Ask questions about symptoms, precautions, and general wellness.
- **Smart Context**: The AI knows your latest health metrics and risk score.

### 🔐 **Secure & Personalized**

- **JWT Authentication**: Secure Login and Signup.
- **Profile Management**: Update your details, change passwords, or delete your account properly.
- **Mobile Responsive**: Fully optimized layout for desktop and mobile devices.

---

## 🛠️ Tech Stack

### **Frontend**

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Glassmorphism UI)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

### **Backend**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **AI Engine**: Groq SDK (Llama-3.1-8b-instant)
- **Auth**: JSON Web Tokens (JWT) & Bcrypt

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- **Node.js** (v16+)
- **MongoDB** (Local or Atlas URI)
- **Groq API Key** (Get one for free at [console.groq.com](https://console.groq.com))

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/silent-disease.git
cd silent-disease
```

### 2. Install Dependencies

Install dependencies for both the root, backend, and frontend.

```bash
# Root (for concurrent scripts)
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the **`backend/`** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```

### 4. Run the Application

You can run both the backend and frontend simultaneously from the root directory:

```bash
# From the root directory
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

---