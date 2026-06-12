// User Profile Types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  health_goals?: string[];
  created_at: string;
  updated_at: string;
}

// Hydration Types
export interface HydrationLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
  created_at: string;
}

export interface HydrationGoal {
  daily_goal_ml: number;
  user_id: string;
}

// Sleep Types
export interface SleepLog {
  id: string;
  user_id: string;
  sleep_start: string;
  sleep_end: string;
  duration_hours: number;
  quality?: 1 | 2 | 3 | 4 | 5; // 1=poor, 5=excellent
  notes?: string;
  logged_at: string;
  created_at: string;
}

export interface SleepGoal {
  daily_goal_hours: number;
  preferred_bedtime?: string;
  preferred_wake_time?: string;
  user_id: string;
}

// Habit Types
export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  target_count: number;
  category?: 'exercise' | 'meditation' | 'reading' | 'other';
  icon?: string;
  color?: string;
  created_at: string;
  is_active: boolean;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed: boolean;
  logged_at: string;
  notes?: string;
  created_at: string;
}

// Nutrition Types
export interface Meal {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  logged_at: string;
  created_at: string;
}

export interface NutritionGoal {
  daily_calories?: number;
  daily_protein?: number;
  daily_carbs?: number;
  daily_fat?: number;
  user_id: string;
}

// Streak & Achievement Types
export interface Streak {
  id: string;
  user_id: string;
  category: 'hydration' | 'sleep' | 'habit' | 'nutrition';
  current_streak: number;
  longest_streak: number;
  last_updated: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at: string;
  category: 'hydration' | 'sleep' | 'habit' | 'nutrition' | 'overall';
}

// AI Companion Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  action?: AIAction;
}

export interface AIAction {
  type: 'log_water' | 'log_sleep' | 'create_habit' | 'log_meal' | 'check_progress';
  data?: any;
  executed: boolean;
}

export interface HealthContext {
  todayHydration: number;
  hydrationGoal: number;
  lastSleep?: SleepLog;
  activeHabits: Habit[];
  todayMeals: Meal[];
  currentStreaks: Streak[];
  recentAchievements: Achievement[];
}

// Dashboard Types
export interface DashboardData {
  hydration: {
    current: number;
    goal: number;
    percentage: number;
  };
  sleep: {
    lastNight: number;
    goal: number;
    quality?: number;
  };
  habits: {
    completed: number;
    total: number;
    percentage: number;
  };
  nutrition: {
    calories: number;
    goal: number;
    meals: number;
  };
  streaks: {
    longest: number;
    current: number;
    category: string;
  };
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface TrendData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
  }[];
}
