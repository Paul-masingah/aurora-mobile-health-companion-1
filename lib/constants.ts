// App Constants
export const APP_NAME = 'Aurora Health Companion';
export const APP_VERSION = '1.0.0';

// Theme Colors
export const COLORS = {
  primary: '#4f46e5', // Indigo
  primaryDark: '#3730a3',
  primaryLight: '#818cf8',
  accent: '#14b8a6', // Teal
  accentDark: '#0f766e',
  accentLight: '#5eead4',
  dark: '#0f172a', // Midnight blue
  darkLight: '#1e293b',
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#0f172a',
  card: '#1e293b',
};

// Health Goals Defaults
export const DEFAULT_HYDRATION_GOAL = 2000; // ml
export const DEFAULT_SLEEP_GOAL = 8; // hours
export const DEFAULT_CALORIE_GOAL = 2000; // kcal

// Glass/Cup sizes in ml
export const WATER_SIZES = {
  small: 250,
  medium: 500,
  large: 750,
};

// Meal types
export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

// Habit frequencies
export const HABIT_FREQUENCIES = ['daily', 'weekly'] as const;

// Habit categories
export const HABIT_CATEGORIES = ['exercise', 'meditation', 'reading', 'other'] as const;

// Sleep quality labels
export const SLEEP_QUALITY_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

// Achievement thresholds
export const ACHIEVEMENT_THRESHOLDS = {
  first_water: 1,
  hydration_streak_3: 3,
  hydration_streak_7: 7,
  hydration_streak_30: 30,
  first_sleep: 1,
  sleep_streak_7: 7,
  good_sleep_streak_7: 7, // 7 days of 7+ hours
  first_habit: 1,
  habit_streak_7: 7,
  habit_streak_30: 30,
  first_meal: 1,
  meal_logging_streak_7: 7,
};

// Chart configuration
export const CHART_CONFIG = {
  backgroundColor: '#1e293b',
  backgroundGradientFrom: '#1e293b',
  backgroundGradientTo: '#0f172a',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(203, 213, 225, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#14b8a6',
  },
};

// Voice settings
export const VOICE_SETTINGS = {
  language: 'en-US',
  pitch: 1.0,
  rate: 0.9,
};
