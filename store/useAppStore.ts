import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProfile,
  HydrationLog,
  SleepLog,
  Habit,
  HabitLog,
  Meal,
  Streak,
  Achievement,
  ChatMessage,
  DashboardData,
} from '../types';

interface AppState {
  // Auth
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Hydration
  hydrationGoal: number;
  todayHydration: HydrationLog[];
  setHydrationGoal: (goal: number) => void;
  addHydrationLog: (log: HydrationLog) => void;
  setTodayHydration: (logs: HydrationLog[]) => void;

  // Sleep
  sleepGoal: number;
  recentSleep: SleepLog[];
  setSleepGoal: (goal: number) => void;
  addSleepLog: (log: SleepLog) => void;
  setRecentSleep: (logs: SleepLog[]) => void;

  // Habits
  habits: Habit[];
  habitLogs: HabitLog[];
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  addHabitLog: (log: HabitLog) => void;
  setHabitLogs: (logs: HabitLog[]) => void;

  // Nutrition
  nutritionGoal: { calories: number; protein: number; carbs: number; fat: number };
  todayMeals: Meal[];
  setNutritionGoal: (goal: { calories: number; protein: number; carbs: number; fat: number }) => void;
  addMeal: (meal: Meal) => void;
  setTodayMeals: (meals: Meal[]) => void;

  // Streaks & Achievements
  streaks: Streak[];
  achievements: Achievement[];
  setStreaks: (streaks: Streak[]) => void;
  updateStreak: (streak: Streak) => void;
  addAchievement: (achievement: Achievement) => void;
  setAchievements: (achievements: Achievement[]) => void;

  // AI Companion
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;

  // Dashboard
  dashboardData: DashboardData | null;
  setDashboardData: (data: DashboardData) => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;

  // Reset all data (logout)
  resetStore: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),

      // Hydration
      hydrationGoal: 2000,
      todayHydration: [],
      setHydrationGoal: (goal) => set({ hydrationGoal: goal }),
      addHydrationLog: (log) =>
        set((state) => ({
          todayHydration: [...state.todayHydration, log],
        })),
      setTodayHydration: (logs) => set({ todayHydration: logs }),

      // Sleep
      sleepGoal: 8,
      recentSleep: [],
      setSleepGoal: (goal) => set({ sleepGoal: goal }),
      addSleepLog: (log) =>
        set((state) => ({
          recentSleep: [log, ...state.recentSleep].slice(0, 30),
        })),
      setRecentSleep: (logs) => set({ recentSleep: logs }),

      // Habits
      habits: [],
      habitLogs: [],
      setHabits: (habits) => set({ habits }),
      addHabit: (habit) =>
        set((state) => ({
          habits: [...state.habits, habit],
        })),
      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),
      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),
      addHabitLog: (log) =>
        set((state) => ({
          habitLogs: [...state.habitLogs, log],
        })),
      setHabitLogs: (logs) => set({ habitLogs: logs }),

      // Nutrition
      nutritionGoal: { calories: 2000, protein: 150, carbs: 250, fat: 65 },
      todayMeals: [],
      setNutritionGoal: (goal) => set({ nutritionGoal: goal }),
      addMeal: (meal) =>
        set((state) => ({
          todayMeals: [...state.todayMeals, meal],
        })),
      setTodayMeals: (meals) => set({ todayMeals: meals }),

      // Streaks & Achievements
      streaks: [],
      achievements: [],
      setStreaks: (streaks) => set({ streaks }),
      updateStreak: (streak) =>
        set((state) => ({
          streaks: state.streaks.map((s) =>
            s.category === streak.category && s.user_id === streak.user_id ? streak : s
          ),
        })),
      addAchievement: (achievement) =>
        set((state) => ({
          achievements: [...state.achievements, achievement],
        })),
      setAchievements: (achievements) => set({ achievements }),

      // AI Companion
      chatMessages: [],
      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),
      clearChatMessages: () => set({ chatMessages: [] }),

      // Dashboard
      dashboardData: null,
      setDashboardData: (data) => set({ dashboardData: data }),

      // Onboarding
      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),

      // Reset
      resetStore: () =>
        set({
          user: null,
          hydrationGoal: 2000,
          todayHydration: [],
          sleepGoal: 8,
          recentSleep: [],
          habits: [],
          habitLogs: [],
          nutritionGoal: { calories: 2000, protein: 150, carbs: 250, fat: 65 },
          todayMeals: [],
          streaks: [],
          achievements: [],
          chatMessages: [],
          dashboardData: null,
          hasCompletedOnboarding: false,
        }),
    }),
    {
      name: 'aurora-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
