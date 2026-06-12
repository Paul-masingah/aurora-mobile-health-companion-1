# Aurora Health Companion - Quick Start

Get up and running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- Expo Go app on your phone

## Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
```

Edit `.env` and add your keys:
- Get Supabase URL/key from: https://supabase.com
- Get Google AI key from: https://makersuite.google.com/app/apikey

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
EXPO_PUBLIC_GOOGLE_AI_API_KEY=your_gemini_key
```

### 3. Set Up Database
1. Create Supabase project
2. Go to SQL Editor
3. Copy/paste contents of `docs/database-schema.sql`
4. Click Run

### 4. Start the App
```bash
npm start
```

Scan the QR code with Expo Go app!

## Test the App

1. Sign up with email
2. Complete profile setup
3. Try logging water: "Log Hydration" → tap 500ml
4. Ask Aurora: Go to AI Companion → "I drank 500ml of water"
5. Check dashboard to see your progress!

## Common Commands

```bash
npm start          # Start dev server
npm run ios        # iOS simulator (Mac only)
npm run android    # Android emulator
npx expo start -c  # Clear cache and start
```

## Troubleshooting

**App won't connect?**
- Restart server: `npx expo start -c`
- Check `.env` file exists
- Verify API keys are correct

**Need help?**
- Read `README.md` for full docs
- Check `docs/SETUP_GUIDE.md` for detailed setup
- Check `docs/database-schema.sql` for DB reference

## Next Steps

- Customize colors in `tailwind.config.js`
- Modify AI personality in `lib/gemini.ts`
- Add more features from `types/index.ts`

Enjoy building with Aurora! 🌟
