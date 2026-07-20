<div align="center">



<a href="https://github.com/Purnansh29/smart-field-survey-inspection-app">
  <img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=600&size=24&duration=3000&pause=800&color=0F9D6C&center=true&vCenter=true&width=600&lines=Digitizing+Field+Surveys+%F0%9F%8F%97%EF%B8%8F;Offline-First+%7C+Cross-Platform+%7C+Fast+%E2%9A%A1;Built+with+React+Native+%2B+Expo+%F0%9F%9A%80" alt="Typing SVG" />
</a>

<br/>

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-0F9D6C?style=for-the-badge)

![GitHub Repo stars](https://img.shields.io/github/stars/Purnansh29/smart-field-survey-inspection-app?style=for-the-badge&color=gold)
![GitHub last commit](https://img.shields.io/github/last-commit/Purnansh29/smart-field-survey-inspection-app?style=for-the-badge&color=blue)
![GitHub license](https://img.shields.io/github/license/Purnansh29/smart-field-survey-inspection-app?style=for-the-badge&color=green)

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

## 📖 About The Project

*SmartSurvey* is a modern, premium, cross-platform mobile and web application built using *React Native* and the *Expo* framework. It's specifically designed to streamline and digitize the field survey and site inspection process — replacing traditional paper forms with a fast, reliable, *offline-first* digital solution.

The project features a sleek design, dynamic statistics, native camera/gallery integration, and automated GPS location fetching with offline persistence.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

## 📸 Screenshots

<div align="center">

<table>
  <tr>
    <td align="center"><b>Dashboard</b></td>
    <td align="center"><b>Create Surveys</b></td>
    <td align="center"><b>History & Filters</b></td>
    <td align="center"><b>Profile</b></td>
  </tr>
  <tr>
    <td><img src="https://res.cloudinary.com/drj44l5df/image/upload/v1784568107/1_ovjx1b.jpg" width="200"/></td>
    <td><img src="https://res.cloudinary.com/drj44l5df/image/upload/v1784568188/3_ljowpj.jpg" width="200"/></td>
    <td><img src="https://res.cloudinary.com/drj44l5df/image/upload/v1784568169/2_tkywxd.jpg" width="200"/></td>
    <td><img src="https://res.cloudinary.com/drj44l5df/image/upload/v1784568259/5_suwbh4.jpg" width="200" alt="Profile Screen" /></td>
  </tr>
</table>

</div>

> 💡 The *Profile* screen shows account details — course, semester, and contact info — with a clean editable card layout and quick-access bottom navigation.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

## ✨ Features

| | Feature | Description |
|---|---|---|
| 📱 | *Cross-Platform Compatibility* | Run seamlessly on *iOS, Android, and Web* from a single codebase |
| 🎨 | *Premium UI/UX* | Custom design system with layered cards, rounded aesthetics, dynamic progress rings & icons |
| 💾 | *Offline-First Storage* | Local persistence via @react-native-async-storage/async-storage — survives reloads & network loss |
| 📸 | *Native Device Media* | Capture inspection photos via expo-image-picker (camera or gallery) |
| 📍 | *GPS Geo-tagging* | Auto-captures Latitude, Longitude & Accuracy using expo-location with a testing fallback |
| 🔍 | *Survey Management & History* | Filter and search surveys by ID, site name, client, or priority (High/Medium/Low) |
| 🗑️ | *Quick Deletions* | Delete draft surveys via long-press on Dashboard or the Preview screen |
| 🍔 | *Hamburger Menu Navigation* | Drawer navigation with shortcuts to every module |

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

## 🛠️ Tech Stack & Libraries

<div align="center">

![Expo Router](https://img.shields.io/badge/Expo_Router-000020?style=flat-square&logo=expo&logoColor=white)
![Context API](https://img.shields.io/badge/State-Context_API-61DAFB?style=flat-square&logo=react&logoColor=white)
![AsyncStorage](https://img.shields.io/badge/Storage-AsyncStorage-3E863D?style=flat-square)
![Expo Location](https://img.shields.io/badge/GPS-expo--location-0F9D6C?style=flat-square)
![Expo Image Picker](https://img.shields.io/badge/Media-expo--image--picker-orange?style=flat-square)
![Expo Haptics](https://img.shields.io/badge/Feedback-expo--haptics-purple?style=flat-square)

</div>

- *Framework*: [React Native](https://reactnative.dev/) with [Expo (SDK 54)](https://expo.dev/)
- *Navigation*: File-based routing via [Expo Router](https://docs.expo.dev/router/introduction/)
- *State Management*: React Context API (ProfileContext, SurveyContext)
- *Data Persistence*: React Native Async Storage
- *Device APIs*: expo-image-picker · expo-location · expo-haptics

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

## 🚀 Getting Started

### Prerequisites
Make sure you have *Node.js* and the *Expo CLI* installed on your machine.

### Installation

bash
# 1. Clone the repository
git clone https://github.com/vishvpatel210/smart-field-survey-inspection-app
cd smart-field-survey-inspection-app/survey

# 2. Install dependencies
npm install

# 3. Start the local development server
npx expo start


<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

## 📂 Project Structure


survey/
├── app/                  # Expo Router directory (Screens and Navigation)
│   ├── (tabs)/           # Main bottom tabs (Dashboard, Profile, New Survey, History)
│   ├── menu.tsx          # Drawer Hamburger Menu
│   ├── survey-preview.tsx# Survey Details screen
│   └── edit-profile.tsx  # Edit Profile screen
├── components/           # Reusable UI components (Form inputs, Headers, Cards)
├── constants/            # Styling theme values (colors, shadows, spacing)
├── contexts/             # Global Context API providers (Profile, Survey lists)
└── types/                # TypeScript type definitions


<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.gif" width="100%">

## 👤 Developer

<div align="center">

<img src="https://github.com/vishvpatel210.png" width="100" style="border-radius:50%"/>

### *Vishv Patel*
React Native Developer



</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0A6E4E,100:0F9D6C&height=120&section=footer" width="100%"/>
