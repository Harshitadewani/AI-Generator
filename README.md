# 🚀 AI Code Generator - Premium Logic Builder

A cutting-edge MERN stack application that leverages Google's Gemini AI to generate modern, animated, and fully responsive UI components in seconds. Designed with a **Cyber-Vibrant** aesthetic, it offers a seamless experience for developers to build premium user interfaces.

![AI Code Generator Preview](https://via.placeholder.com/1200x600/0f172a/6366f1?text=AI+Code+Generator+Premium+Aesthetics)

## ✨ Key Features

- 🤖 **Gemini AI Integration**: Powered by the latest `@google/genai` SDK for high-quality code generation.
- 🎨 **Cyber-Vibrant UI**: Advanced glassmorphism, animated backgrounds, and a high-contrast design system.
- 🎙️ **Voice Commands**: Integrated Web Speech API for hands-free code generation.
- 💻 **Live Code Preview**: Instant logic and visual preview of generated components.
- 🔐 **Secure Authentication**: Robust JWT-based auth with MongoDB storage.
- 📜 **Generation History**: Keep track of all your past generations with a persistence layer.

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express, Mongoose |
| **Database** | MongoDB Atlas |
| **AI Engine** | Google Gemini (1.5 Flash / Pro) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas Account
- Google AI Studio API Key

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/Harshitadewani/AI-Generator.git
   cd AI-Generator
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file and add your MONGO_URI, JWT_SECRET, and GEMINI_API_KEY
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   # Create a .env file and add VITE_API_BASE_URL
   npm run dev
   ```

## 🌐 Deployment Configuration

### Render (Backend)
- **Engine**: Node
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- **Env Vars**: `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `CLIENT_URL`.

### Vercel (Frontend)
- **Framework**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Env Vars**: `VITE_API_BASE_URL`.

---

## 👨‍💻 Author

Developed with ❤️ by **Harshita Dewani**. 

---

> [!TIP]
> Make sure to set the `CLIENT_URL` on Render with a comma-separated list of your Vercel deployment URLs to avoid CORS issues!
