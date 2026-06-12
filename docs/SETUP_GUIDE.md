# Aurora Health Companion - Complete Setup Guide

This guide will walk you through setting up the Aurora Mobile Health Companion app from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Google AI (Gemini) Setup](#google-ai-gemini-setup)
5. [Running the App](#running-the-app)
6. [Testing Features](#testing-features)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** 18 or higher - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** - Install with: `npm install -g expo-cli`
- **Git** - [Download](https://git-scm.com/)

### For iOS Development
- **macOS** with Xcode installed
- Or use **Expo Go** app on your iPhone

### For Android Development
- **Android Studio** with emulator set up
- Or use **Expo Go** app on your Android phone

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aurora-mobile-health-companion-1
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Native and Expo SDK
- Supabase client
- Google Generative AI (Gemini)
- Zustand for state management
- NativeWind for styling
- And more...

### 3. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

You'll fill this in with your actual API keys in the next steps.

---

## Supabase Configuration

Supabase provides the backend database and authentication for Aurora.

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub or email
4. Click "New Project"
5. Fill in:
   - **Project name**: `aurora-health` (or your choice)
   - **Database password**: Generate a strong password (save this!)
   - **Region**: Choose the closest to your users
   - **Pricing plan**: Free tier is fine for development

### Step 2: Get Your API Credentials

1. Once the project is created, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: Found under "Project URL"
   - **anon/public key**: Found under "Project API keys" → "anon public"

### Step 3: Update .env File

Add these to your `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Set Up Database Schema

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click "New query"
3. Copy the entire contents of `docs/database-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute

This will create all necessary tables:
- `profiles` - User data
- `hydration_logs` - Water intake
- `sleep_logs` - Sleep tracking
- `habits` & `habit_logs` - Habit tracking
- `meals` - Nutrition logs
- `streaks` - Streak tracking
- `achievements` - Achievement system

### Step 5: Enable Email Auth (Optional)

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if desired

---

## Google AI (Gemini) Setup

The AI Companion uses Google's Gemini AI API.

### Step 1: Get API Key

1. Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Choose "Create API key in new project" or select existing project
5. Copy the generated API key

### Step 2: Update .env File

Add this to your `.env` file:

```env
EXPO_PUBLIC_GOOGLE_AI_API_KEY=your-gemini-api-key-here
```

### Important Notes
- The free tier includes 60 requests per minute
- Gemini 1.5 Flash is used for fast responses
- API keys are client-side in this app - for production, consider a backend proxy

---

## Running the App

### Method 1: On Physical Device (Recommended for Testing)

1. Install **Expo Go** app:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Start the development server:

```bash
npm start
```

3. Scan the QR code:
   - **iOS**: Use the Camera app
   - **Android**: Use the Expo Go app's scanner

### Method 2: iOS Simulator (Mac Only)

```bash
npm run ios
```

Xcode and iOS Simulator must be installed.

### Method 3: Android Emulator

```bash
npm run android
```

Android Studio and an AVD must be set up.

### Method 4: Web (Limited Functionality)

```bash
npm run web
```

Note: Some features like voice won't work on web.

---

## Testing Features

### 1. Sign Up Flow

- Open the app
- Swipe through onboarding screens
- Click "Get Started"
- Sign up with email and password
- Complete profile setup (optional)

### 2. Test Hydration Tracking

- From home, tap "Hydration" card
- Use quick add buttons (250ml, 500ml, etc.)
- Or enter a custom amount
- Verify the progress bar updates
- Check that today's logs appear at the bottom

### 3. Test AI Companion

- Go to "AI Companion" tab
- Try these commands:
  - "I drank 500ml of water"
  - "Log 8 hours of sleep"
  - "Create a meditation habit"
  - "How am I doing today?"
- Verify Aurora responds with voice
- Check that actions are executed (water logged, etc.)

### 4. Test Sleep Tracking

- Navigate to Sleep screen
- Enter hours slept (e.g., 7.5)
- Select sleep quality (1-5 stars)
- Click "Log Sleep"
- Verify it appears on the dashboard

### 5. Test Habits

- Go to Habits screen
- Click "+ Add" button
- Create a habit (e.g., "Morning meditation")
- Toggle the completion circle
- Verify completion percentage updates on home

### 6. Test Nutrition

- Go to Nutrition screen
- Select meal type (breakfast, lunch, etc.)
- Describe what you ate
- Optionally add calories
- Click "Log Meal"
- Check progress bar and meal list

---

## Troubleshooting

### App Won't Start

**Solution 1: Clear Cache**
```bash
npx expo start -c
```

**Solution 2: Reinstall Dependencies**
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Network request failed" Errors

**Check:**
- Is your `.env` file in the root directory?
- Are the environment variables prefixed with `EXPO_PUBLIC_`?
- Did you restart the Expo server after adding `.env`?

**Solution:**
1. Stop the Expo server (Ctrl+C)
2. Restart: `npm start`

### Supabase Authentication Not Working

**Check:**
1. Is Email auth enabled in Supabase dashboard?
2. Are your credentials correct in `.env`?
3. Check browser console/logs for specific errors

**Debug:**
```typescript
// In lib/supabase.ts, add console logs:
console.log('Supabase URL:', supabaseUrl);
console.log('Has anon key:', !!supabaseAnonKey);
```

### AI Companion Not Responding

**Check:**
1. Is your Google AI API key valid?
2. Have you exceeded the free tier limits (60 req/min)?
3. Is your device connected to the internet?

**Test API Key:**
Visit: `https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY`

Should return a JSON list of models.

### NativeWind Styles Not Working

**Solution:**
1. Ensure `global.css` is imported in `app/_layout.tsx`
2. Check `metro.config.js` has NativeWind setup
3. Restart Metro bundler with cache clear:
   ```bash
   npx expo start -c
   ```

### Voice Features Not Working

**iOS:** Check microphone permissions in Settings → Expo Go
**Android:** Grant microphone permission when prompted

**Note:** Voice features don't work in web browser.

---

## Production Deployment

### Build for App Stores

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for iOS:
```bash
eas build --platform ios
```

4. Build for Android:
```bash
eas build --platform android
```

### Environment Variables in Production

Add secrets to EAS:

```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "your-url"
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-key"
eas secret:create --name EXPO_PUBLIC_GOOGLE_AI_API_KEY --value "your-key"
```

---

## Next Steps

- Customize colors in `tailwind.config.js`
- Adjust AI personality in `lib/gemini.ts`
- Add more achievement types
- Implement device health data integration (Apple Health, Google Fit)
- Add notifications for reminders

---

## Support

- **GitHub Issues**: Report bugs and request features
- **Expo Docs**: https://docs.expo.dev
- **Supabase Docs**: https://supabase.com/docs
- **Google AI Docs**: https://ai.google.dev/docs

---

## Common Commands Reference

```bash
# Development
npm start              # Start Expo dev server
npm run ios           # Run on iOS simulator
npm run android       # Run on Android emulator
npm run web           # Run in web browser

# Maintenance
npx expo start -c     # Clear cache and start
npm install           # Install dependencies
npm audit fix         # Fix security issues

# Building
eas build --platform ios      # Build iOS app
eas build --platform android  # Build Android app

# Database
# Run SQL in Supabase dashboard → SQL Editor
```

---

Built with ❤️ using Expo, React Native, Supabase, and Google AI
