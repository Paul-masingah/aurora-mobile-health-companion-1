import { HydrationLog, SleepLog, Habit, HabitLog, Meal, Streak } from '../types';

// Calculate total hydration for today
export const calculateTodayHydration = (logs: HydrationLog[]): number => {
  return logs.reduce((total, log) => total + log.amount_ml, 0);
};

// Calculate hydration percentage
export const calculateHydrationPercentage = (current: number, goal: number): number => {
  return Math.min(Math.round((current / goal) * 100), 100);
};

// Calculate sleep duration from start and end times
export const calculateSleepDuration = (start: string, end: string): number => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const diffMs = endTime.getTime() - startTime.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 10) / 10; // Round to 1 decimal
};

// Get sleep quality label
export const getSleepQualityLabel = (quality?: number): string => {
  if (!quality) return 'N/A';
  const labels: { [key: number]: string } = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };
  return labels[quality] || 'N/A';
};

// Calculate habit completion percentage for today
export const calculateHabitCompletion = (
  habits: Habit[],
  logs: HabitLog[],
  date: string
): { completed: number; total: number; percentage: number } => {
  const today = new Date(date).toDateString();
  const activeHabits = habits.filter((h) => h.is_active);
  const todayLogs = logs.filter((log) => new Date(log.logged_at).toDateString() === today);
  const completedHabits = todayLogs.filter((log) => log.completed);

  return {
    completed: completedHabits.length,
    total: activeHabits.length,
    percentage: activeHabits.length > 0 ? Math.round((completedHabits.length / activeHabits.length) * 100) : 0,
  };
};

// Calculate total calories for today
export const calculateTodayCalories = (meals: Meal[]): number => {
  return meals.reduce((total, meal) => total + (meal.calories || 0), 0);
};

// Calculate macros for today
export const calculateTodayMacros = (
  meals: Meal[]
): { protein: number; carbs: number; fat: number } => {
  return meals.reduce(
    (totals, meal) => ({
      protein: totals.protein + (meal.protein || 0),
      carbs: totals.carbs + (meal.carbs || 0),
      fat: totals.fat + (meal.fat || 0),
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );
};

// Update streak based on activity
export const updateStreak = (
  existingStreak: Streak | undefined,
  lastActivityDate: string,
  userId: string,
  category: 'hydration' | 'sleep' | 'habit' | 'nutrition'
): Streak => {
  const today = new Date().toDateString();
  const lastDate = existingStreak ? new Date(existingStreak.last_updated).toDateString() : null;
  const activityDate = new Date(lastActivityDate).toDateString();

  if (!existingStreak) {
    // Create new streak
    return {
      id: `${userId}-${category}`,
      user_id: userId,
      category,
      current_streak: 1,
      longest_streak: 1,
      last_updated: new Date().toISOString(),
    };
  }

  // Check if activity was yesterday (continuous streak)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  let newStreak = { ...existingStreak };

  if (lastDate === yesterdayStr && activityDate === today) {
    // Continue streak
    newStreak.current_streak += 1;
    newStreak.longest_streak = Math.max(newStreak.longest_streak, newStreak.current_streak);
  } else if (lastDate === today) {
    // Already logged today, no change
    return newStreak;
  } else {
    // Streak broken, restart
    newStreak.current_streak = 1;
  }

  newStreak.last_updated = new Date().toISOString();
  return newStreak;
};

// Check if user has achieved a goal
export const checkAchievement = (
  type: string,
  currentValue: number,
  threshold: number
): boolean => {
  return currentValue >= threshold;
};

// Format date for display
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format time for display
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Get week labels for charts
export const getWeekLabels = (): string[] => {
  const labels = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    labels.push(days[date.getDay()]);
  }

  return labels;
};

// Get last 7 days of data
export const getLast7DaysData = <T extends { logged_at: string }>(
  logs: T[],
  valueExtractor: (log: T) => number
): number[] => {
  const data: number[] = [0, 0, 0, 0, 0, 0, 0];
  const today = new Date();

  logs.forEach((log) => {
    const logDate = new Date(log.logged_at);
    const diffTime = today.getTime() - logDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < 7) {
      const index = 6 - diffDays;
      data[index] += valueExtractor(log);
    }
  });

  return data;
};

// Check if date is today
export const isToday = (date: string | Date): boolean => {
  const today = new Date().toDateString();
  const checkDate = new Date(date).toDateString();
  return today === checkDate;
};

// Get greeting based on time of day
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};
