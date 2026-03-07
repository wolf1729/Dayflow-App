# Dayflow - Ritual & Habit Tracker

Dayflow is a modern, intuitive mobile application designed to help users cultivate meaningful rituals and track their daily habits. Built with a focus on visual progress and ease of use, Dayflow empowers you to stay consistent and achieve your personal goals.

## 🚀 Features

- **Cultivate Rituals**: Create and manage personalized habits with flexible scheduling.
- **Garden View**: A beautiful, visual representation of your progress and consistency.
- **Deep Insights**: Track your trends with dynamic line graphs and completion statistics.
- **Secure Authentication**: Seamless login and signup powered by Firebase and Google Sign-In.
- **Real-time Sync**: Your data is securely stored and synchronized across your devices.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Charts**: [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- **Backend/Auth**: [Firebase](https://firebase.google.com/) (Auth, Analytics) & FastAPI (Core API)

## 📦 Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/expo-go) app on your mobile device (for development)
- A configured [Dayflow Backend](https://github.com/your-repo/dayflow-backend) instance

### Steps

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd Dayflow-App
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:

   ```env
   EXPO_PUBLIC_API_URL=https://dayflow-backend-llwn.onrender.com
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
   ```

4. **Start the development server**:
   ```bash
   npx expo start
   ```

## 📱 Running the App

- Scan the QR code with the **Expo Go** app (Android) or the Camera app (iOS).
- Press `a` for Android Emulator.
- Press `i` for iOS Simulator.
- Press `w` for Web.

## 📁 Project Structure

```
Dayflow-App/
├── assets/             # Images, icons, and splash screens
├── src/
│   ├── components/     # Reusable UI components
│   ├── navigation/     # App routing and navigation logic
│   ├── screens/        # Main application screens (Cultivate, Garden, Insights)
│   ├── services/       # API and external service integrations
│   ├── store/          # Zustand state management
│   └── utils/          # Helper functions and constants
├── App.js              # Application entry point
└── app.json            # Expo configuration
```
