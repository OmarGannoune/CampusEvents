# CampusEvents 🎓

CampusEvents is a modern, cross-platform mobile application designed to simplify campus life by centralizing event discovery, registration, and management. Built with React Native and Expo, the app features a sleek, premium UI and is powered by a state-of-the-art AI Assistant to deeply personalize the student experience.

## 🚀 Key Features

### 👨‍🎓 Student Portal
- **Event Catalogue:** Browse upcoming and past events with advanced filtering (by category, date) and a powerful semantic search.
- **Personalized Dashboard:** View your registered events, favorite events, and manage your student profile (major, year).
- **Seamless Registration:** One-tap registration system with real-time capacity tracking and conflict detection.

### 🤖 AI Assistant (Powered by Groq & Llama 3)
The app integrates a deeply personalized AI Assistant tailored for campus life, utilizing the blazing-fast Groq API (`Llama-3.3-70b-versatile`):
- **🔍 Semantic Search:** Find events based on natural language queries (e.g., *"I want to improve my coding skills"* -> Hackathons).
- **💬 Q&A Catalogue:** Ask direct questions about campus events and get instant, context-aware answers.
- **✨ Smart Recommendations:** Generates highly personalized event suggestions based on your past favorites, registrations, and academic profile.
- **📅 AI Planner:** Automatically generates a conflict-free event schedule based on your personal constraints (e.g., *"I have classes Monday morning"*).

### 👨‍💼 Admin Dashboard
- **Event Management:** Create, edit, and delete campus events.
- **Data Entry:** Modern, segmented date/time input forms for streamlined event creation.
- **Analytics:** Track registration counts and event popularity at a glance.

## 🛠️ Technology Stack
- **Frontend:** React Native, Expo, Expo Router (File-based routing)
- **Language:** TypeScript
- **Styling:** Custom Design System (Vanilla StyleSheet) with modern paradigms (shadows, radiuses, dynamic components)
- **AI Integration:** Groq API (OpenAI-compatible endpoints)
- **Icons:** Lucide React Native

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI
- A Groq API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CampusEvents
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root of your project and add your Groq API key:
   ```env
   EXPO_PUBLIC_GROQ_API_KEY=gsk_your_api_key_here
   ```

4. **Start the application**
   ```bash
   npx expo start
   ```
   *Press `a` to open in Android Emulator, `i` to open in iOS Simulator, or scan the QR code with the Expo Go app.*

## 📂 Project Structure

```text
CampusEvents/
├── app/
│   ├── (admin)/        # Admin dashboard and event management
│   ├── (student)/      # Student portal, catalogue, and AI assistant
│   ├── auth/           # Authentication flow (Login/Register)
│   └── _layout.tsx     # Root navigation layout
├── components/
│   ├── admin/          # Admin-specific UI components
│   ├── student/        # Student-specific UI components
│   └── ui/             # Reusable design system (Cards, Buttons, Inputs, Icons)
├── constants/          # Colors, Spacing, Typography tokens
├── context/            # React Context (AuthContext)
├── database/           # Mock data and local storage utilities
├── hooks/              # Custom React hooks (useEvents, useProfile, etc.)
├── prompts/            # System prompts and JSON-schemas for the AI Assistant
├── services/           # External API services (llm.ts for Groq)
└── types/              # TypeScript interfaces and type definitions
```

## 🎨 Design Philosophy
CampusEvents is built with a **Premium UI** mindset:
- **Visual Excellence:** Utilizes modern, harmonious color palettes, subtle shadows, and beautifully crafted layout hierarchies.
- **Consistent Components:** The `EventCard` component enforces a unified calendar-style date layout across the entire app.
- **Responsive & Dynamic:** Extensive use of `ScrollView`s, floating action bars, and swipe-to-refresh interactions for a native, fluid feel.

---
*Built as an academic project demonstrating advanced mobile app development and LLM integration.*
