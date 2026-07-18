# 📋 Smart Field Survey & Inspection App

A modern **React Native (Expo)** application that helps field employees perform surveys and inspections efficiently. The app allows users to create surveys, capture site photos, fetch GPS location, access contacts, copy important information using the clipboard, preview surveys, and maintain survey history.

---

# 📱 Project Overview

The **Smart Field Survey & Inspection App** is designed for field inspectors, surveyors, and employees who perform on-site inspections.

The application uses multiple **Expo APIs** including:

- 📷 Camera
- 📍 Location
- 👥 Contacts
- 📋 Clipboard

It also demonstrates modern React Native development with:

- Expo Router
- Bottom Tab Navigation
- Drawer Navigation
- Reusable Components
- Modern UI Design
- React Hooks

---

# 🚀 Features

## 🏠 Module 1 - Dashboard

- Welcome Screen
- Student Details
- Today's Survey Count
- Quick Action Cards
- Custom App Header
- Recent Survey Summary

---

## 📝 Module 2 - Create Survey

Create a new survey with:

- Site Name
- Client Name
- Description
- Priority Selection
- Survey Date
- Required Field Validation

---

## 📷 Module 3 - Camera

Camera functionalities include:

- Camera Permission Request
- Capture Survey Photo
- Image Preview
- Capture Timestamp
- Retake Photo
- Delete Photo
- Confirmation Alert Before Delete
- Loading Indicator while Opening Camera

---

## 📍 Module 4 - Location

Location services:

- Request Location Permission
- Current Latitude
- Current Longitude
- Location Accuracy
- Refresh Current Location
- Copy Location to Clipboard
- Success Alert After Copy

---

## 👥 Module 5 - Contacts

Contact management features:

- Request Contacts Permission
- Fetch Device Contacts
- Search Contacts
- Contact Counter
- Pull to Refresh
- Contact Avatar (Initial Letter)
- Copy Contact Number
- Show "No Number" if unavailable
- Empty State Screen

---

## 📋 Module 6 - Clipboard

Clipboard operations:

- Copy Survey ID
- Copy Contact Number
- Copy Current Location
- Paste Notes
- Clear Clipboard Data

---

## 👀 Module 7 - Survey Preview

Preview all survey information before submission:

- Site Details
- Client Details
- Captured Photo
- Selected Contact
- Current Location
- Notes
- Edit Survey
- Submit Survey

---

## 📚 Module 8 - Survey History

Manage previous surveys:

- FlatList Display
- Search Survey
- Filter by Priority
- View Survey Details
- Delete Survey
- Confirmation Before Delete

---

# 🧭 Navigation

## Bottom Tabs

- 🏠 Dashboard
- ➕ New Survey
- 📜 History
- 👤 Profile

---

## Drawer Navigation

- Dashboard
- Survey
- Camera
- Contacts
- Location
- Clipboard
- Settings

---

# 🛠 React Native Concepts Used

- View
- Text
- Image
- Button
- Pressable
- FlatList
- ScrollView
- TextInput
- Alert
- ActivityIndicator
- RefreshControl
- StyleSheet
- useState
- useEffect

---

# 📦 Expo APIs Used

| API | Purpose |
|------|----------|
| expo-camera | Capture survey photos |
| expo-location | Get GPS location |
| expo-contacts | Fetch device contacts |
| expo-clipboard | Copy and paste data |

---

# 📂 Project Structure

```
SmartFieldSurveyApp/
│
├── app/
│   ├── (tabs)/
│   │   ├── dashboard.jsx
│   │   ├── survey.jsx
│   │   ├── history.jsx
│   │   └── profile.jsx
│   │
│   ├── drawer/
│   │   ├── camera.jsx
│   │   ├── contacts.jsx
│   │   ├── location.jsx
│   │   ├── clipboard.jsx
│   │   └── settings.jsx
│   │
│   └── _layout.jsx
│
├── components/
│   ├── Header.jsx
│   ├── QuickCard.jsx
│   ├── SurveyCard.jsx
│   ├── ContactCard.jsx
│   └── EmptyState.jsx
│
├── assets/
│
├── constants/
│
├── hooks/
│
├── utils/
│
├── package.json
└── README.md
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/smart-field-survey-app.git
```

Go to project folder

```bash
cd smart-field-survey-app
```

Install dependencies

```bash
npm install
```

Start Expo

```bash
npx expo start
```

---

# 📦 Required Packages

```bash
npx expo install expo-camera
```

```bash
npx expo install expo-location
```

```bash
npx expo install expo-contacts
```

```bash
npx expo install expo-clipboard
```

```bash
npx expo install @react-navigation/drawer
```

```bash
npx expo install react-native-gesture-handler
```

```bash
npx expo install react-native-reanimated
```

---

# 📱 Screens

- Dashboard
- Create Survey
- Camera
- Contacts
- Location
- Clipboard
- Survey Preview
- Survey History
- Profile
- Settings

---

# 🎯 Learning Outcomes

After completing this project, you will understand:

- Expo Router
- Drawer Navigation
- Bottom Tab Navigation
- React Hooks
- State Management
- FlatList
- Pull-to-Refresh
- Camera Integration
- Location Services
- Contacts API
- Clipboard API
- Form Validation
- Reusable Components
- Modern UI Design
- CRUD-style Data Handling

---

# 🔮 Future Improvements

- Firebase Authentication
- Cloud Image Upload
- Offline Storage
- Dark Mode
- Push Notifications
- Survey Analytics
- PDF Report Export
- QR Code Scanner
- Map Integration
- Backend API Integration

---

# 👨‍💻 Developed By

**Vishv Patel**

Computer Science Engineering Student

---

# 📄 License

This project is created for educational purposes as part of the **React Native Mini Project Assignment**.

---