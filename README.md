# Aurora Mobile Health Companion

A comprehensive React Native + Expo mobile health tracking app with AI-powered features, built with TypeScript, Supabase, and Google Gemini AI.

## Features

### Core Health Tracking
- **Hydration Tracking** - Log water intake with quick add buttons and custom amounts
- **Sleep Tracking** - Record sleep hours and quality ratings
- **Habit Tracking** - Create and monitor daily habits with completion tracking
- **Nutrition Tracking** - Log meals with calorie tracking

### AI Companion (Aurora)
- **Voice-Enabled Chat** - Talk to Aurora using speech-to-text
- **Intelligent Responses** - AI-powered recommendations using Google Gemini
- **Action Execution** - Aurora can log data on your behalf ("I drank 500ml of water")
- **Text-to-Speech** - Aurora speaks responses back to you
- **Health Context Awareness** - Aurora knows your current stats and provides personalized advice

### Progress & Motivation
- **Streak Tracking** - Build and maintain daily/weekly streaks
- **Achievement System** - Unlock achievements for milestones
- **Progress Dashboard** - Visual charts and statistics
- **Weekly Trends** - See your progress over time with charts

### User Experience
- **Beautiful Dark Theme** - Indigo and teal color scheme
- **Smooth Animations** - Polished transitions and interactions
- **Responsive Design** - Works on all mobile screen sizes
- **Offline Support** - Data persists locally with Zustand + AsyncStorage

## Tech Stack

- **Framework**: React Native + Expo SDK 56
- **Language**: TypeScript
- **Routing**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand with AsyncStorage persistence
- **Backend**: Supabase (Auth + PostgreSQL)
- **AI**: Google Gemini 1.5 Flash
- **Voice**: Expo Speech (Text-to-Speech)
- **Charts**: react-native-chart-kit

## Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio (for emulators)
- Expo Go app on your phone (for physical device testing)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd aurora-mobile-health-companion-1
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then fill in your credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_GOOGLE_AI_API_KEY=your-gemini-api-key
```

### 3. Set Up Supabase

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema (see `docs/database-schema.sql`)
3. Copy your project URL and anon key to `.env`

### 4. Get Google AI API Key

1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy it to your `.env` file

### 5. Run the App

```bash
# Start the development server
npm start

# Or run directly on specific platform
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

Scan the QR code with Expo Go app on your phone to run on a physical device.

## Project Structure

```
aurora-mobile-health-companion-1/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (onboarding)/             # Onboarding flow
│   │   ├── index.tsx             # Welcome carousel
│   │   └── profile-setup.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx             # Home Dashboard
│   │   ├── track.tsx             # Tracking hub
│   │   ├── companion.tsx         # AI Companion
│   │   ├── progress.tsx          # Streaks & achievements
│   │   └── profile.tsx
│   ├── hydration.tsx             # Hydration tracking
│   ├── sleep.tsx                 # Sleep tracking
│   ├── habits.tsx                # Habit tracking
│   ├── nutrition.tsx             # Nutrition tracking
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable components (future)
├── lib/
│   ├── supabase.ts               # Supabase client & helpers
│   ├── gemini.ts                 # Google AI client
│   └── constants.ts              # App constants
├── store/
│   └── useStore.ts               # Zustand state management
├── types/
│   └── index.ts                  # TypeScript type definitions
├── utils/
│   └── health-calculations.ts    # Health-related utilities
├── assets/                       # Images, fonts
├── .env.example                  # Environment template
├── tailwind.config.js            # Tailwind configuration
├── metro.config.js               # Metro bundler config
├── app.json                      # Expo configuration
└── package.json
```

## Key Features Implementation

### AI Companion with Voice

The AI Companion is powered by Google Gemini and can:

1. **Understand Natural Language**
   - "I drank 500ml of water"
   - "Log 8 hours of sleep"
   - "Create a meditation habit"
   - "How am I doing today?"

2. **Execute Actions**
   - Parses user intent from natural language
   - Logs data directly to the app
   - Provides feedback and encouragement

3. **Voice Interaction**
   - Text-to-Speech for AI responses
   - Visual pulse animation when speaking
   - Quick action buttons for common commands

### Health Context System

Aurora AI has full context of your health data:
- Current hydration vs. goal
- Last night's sleep and quality
- Active habits and completion status
- Today's meals and calories
- Current streaks and achievements

This allows for personalized, context-aware responses.

### State Management

Uses Zustand for global state with AsyncStorage persistence:
- User profile and auth state
- Health data (hydration, sleep, habits, nutrition)
- Streaks and achievements
- AI chat history
- All data persists across app restarts

## Database Schema

The app uses Supabase PostgreSQL. See `docs/database-schema.sql` for the complete schema.

Main tables:
- `profiles` - User profile data
- `hydration_logs` - Water intake records
- `sleep_logs` - Sleep tracking
- `habits` - User-created habits
- `habit_logs` - Habit completion records
- `meals` - Nutrition logs
- `streaks` - Streak tracking
- `achievements` - Unlocked achievements

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
colors: {
  primary: { ... },  // Indigo shades
  accent: { ... },   // Teal shades
  dark: { ... },     // Dark theme colors
}
```

### AI Prompt

Customize Aurora's personality in `lib/gemini.ts`:

```typescript
const getSystemPrompt = (context: HealthContext) => `
  You are Aurora, a friendly and supportive AI health companion...
`
```

### Goals

Default health goals are in `lib/constants.ts`:

```typescript
export const DEFAULT_HYDRATION_GOAL = 2000; // ml
export const DEFAULT_SLEEP_GOAL = 8; // hours
export const DEFAULT_CALORIE_GOAL = 2000; // kcal
```

## Deployment

### Expo EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure your project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Environment Variables in EAS

Add your secrets to EAS:

```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "your-url"
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-key"
eas secret:create --name EXPO_PUBLIC_GOOGLE_AI_API_KEY --value "your-key"
```

## Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache and restart
npx expo start -c
```

### NativeWind Not Working

Ensure `global.css` is imported in `app/_layout.tsx`:

```typescript
import '../global.css';
```

### Supabase Connection Issues

- Check your `.env` file has the correct URL and key
- Ensure you're using `EXPO_PUBLIC_` prefix
- Restart the Expo dev server after changing `.env`

### AI Companion Not Responding

- Verify your Google AI API key is valid
- Check network connection
- Look for errors in console logs

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Expo team for the amazing framework
- Supabase for the backend infrastructure
- Google for Gemini AI API
- NativeWind for Tailwind CSS support

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ using Expo, React Native, and AI
