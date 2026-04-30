# CapEvent AI

**CapEvent AI** is a React Native / Expo mobile app that helps you capture event moments on the go and generates intelligent daily summaries using AI.

---

## Features

- **Moment Capture** – Quickly log text notes, voice recordings, and photos for any event moment. Tag moments with categories for easy retrieval.
- **Daily Summary** – AI-powered summaries of your captured moments, surfacing key highlights and actionable insights.
- **Home Dashboard** – Overview of recent moments and quick access to capture new ones.
- **Onboarding** – Smooth first-run experience to get you set up in seconds.
- **Profile** – Manage your personal settings and preferences.
- **Offline-first** – All moments are stored locally with AsyncStorage so the app works without an internet connection.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) ~55 / [React Native](https://reactnative.dev) 0.83 |
| Language | TypeScript 5.8 |
| Navigation | [Expo Router](https://expo.github.io/router) (file-based routing) |
| Storage | [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) |
| AI | OpenAI API (via `src/services/aiSummary.ts`) |
| Media | expo-av (audio), expo-image-picker (photos) |
| Animations | react-native-reanimated 4 + react-native-gesture-handler |

---

## Project Structure

```
CapEvent/
├── app/                  # Expo Router file-based routes
│   ├── (tabs)/           # Tab navigator screens
│   ├── _layout.tsx       # Root layout
│   └── onboarding.tsx    # Onboarding route
├── src/
│   ├── components/       # Shared UI components
│   ├── design/           # Design tokens (colors, typography, spacing)
│   ├── hooks/            # Custom React hooks
│   ├── screens/          # Full-page screen components
│   │   ├── DailySummaryScreen.tsx
│   │   ├── HomeDashboardScreen.tsx
│   │   ├── MomentCaptureScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/         # External service integrations
│   │   └── aiSummary.ts  # OpenAI summary generation
│   ├── storage/          # AsyncStorage data layer
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, and other static assets
├── components/           # Expo-generated shared components
├── constants/            # App-wide constants
├── hooks/                # Expo-generated hooks
└── scripts/              # Developer utility scripts
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) – `npm install -g expo-cli`
- iOS Simulator (macOS) or Android Emulator, or the [Expo Go](https://expo.dev/go) app on a physical device

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Smartnaka/CapEvent.git
cd CapEvent

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Add your OpenAI API key to .env
```

### Running the App

```bash
# Start the Expo development server
npm start

# Open on Android emulator
npm run android

# Open on iOS simulator
npm run ios

# Open in web browser
npm run web
```

### Type Checking

```bash
npm run typecheck
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key for AI-powered summaries |

> The key is also referenced in `app.json` under `expo.extra.openaiApiKey` for EAS builds.

---

## Building for Production

This project uses [EAS Build](https://docs.expo.dev/build/introduction/).

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please follow the [Development Workflow](DEVELOPMENT_WORKFLOW.md) guidelines when contributing.

---

## License

This project is private. All rights reserved © Smartnaka.
