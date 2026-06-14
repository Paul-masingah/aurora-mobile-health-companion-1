import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { getGreeting, calculateTodayHydration, calculateHydrationPercentage } from '../../utils/health-calculations';
import { chatWithGemini } from '../../lib/gemini';
import { HealthContext } from '../../types';

export default function HomeScreen() {
  const {
    user,
    todayHydration,
    hydrationGoal,
    recentSleep,
    sleepGoal,
    habits,
    habitLogs,
    todayMeals,
    nutritionGoal,
    streaks,
    achievements,
  } = useAppStore();

  const [refreshing, setRefreshing] = useState(false);
  const [dailyInsight, setDailyInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const buildHealthContext = (): HealthContext => {
    const todayHydrationTotal = todayHydration.reduce((sum, log) => sum + log.amount_ml, 0);
    return {
      todayHydration: todayHydrationTotal,
      hydrationGoal,
      lastSleep: recentSleep[0],
      activeHabits: habits.filter(h => h.is_active),
      todayMeals,
      currentStreaks: streaks,
      recentAchievements: achievements.slice(0, 5),
    };
  };

  const fetchDailyInsight = async () => {
    setLoadingInsight(true);
    try {
      const context = buildHealthContext();
      const response = await chatWithGemini(
        "Give me a short, encouraging daily health insight based on my current data. Keep it under 100 characters.",
        context
      );
      setDailyInsight(response.text.replace(/ACTION:.*$/i, '').trim());
    } catch (error) {
      console.error('Error fetching insight:', error);
      setDailyInsight('Stay hydrated and keep moving for a great day! 🌟');
    } finally {
      setLoadingInsight(false);
    }
  };

  useEffect(() => {
    fetchDailyInsight();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDailyInsight();
    setRefreshing(false);
  };

  // Calculate current stats
  const currentHydration = calculateTodayHydration(todayHydration);
  const hydrationPercentage = calculateHydrationPercentage(currentHydration, hydrationGoal);

  const lastSleep = recentSleep[0];
  const sleepHours = lastSleep?.duration_hours || 0;

  const activeHabits = habits.filter(h => h.is_active);
  const todayHabitLogs = habitLogs.filter(log => {
    const logDate = new Date(log.logged_at).toDateString();
    const today = new Date().toDateString();
    return logDate === today && log.completed;
  });
  const habitCompletion = activeHabits.length > 0
    ? Math.round((todayHabitLogs.length / activeHabits.length) * 100)
    : 0;

  const todayCalories = todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const caloriePercentage = Math.round((todayCalories / nutritionGoal.calories) * 100);

  const longestStreak = streaks.reduce((max, s) => Math.max(max, s.longest_streak), 0);

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#14b8a6" />}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-white">{getGreeting()}</Text>
          <Text className="text-lg text-dark-300 mt-1">{user?.full_name || 'Welcome'}</Text>
        </View>

        {/* Daily Insight Card */}
        <View className="px-6 mb-6">
          <View className="bg-dark-800 rounded-3xl p-6 border-2 border-accent-500/30">
            <View className="flex-row items-center mb-2">
              <Text className="text-xl mr-2">✨</Text>
              <Text className="text-accent-400 font-bold uppercase tracking-wider text-xs">Daily Insight</Text>
              {loadingInsight && <ActivityIndicator size="small" color="#14b8a6" className="ml-2" />}
            </View>
            <Text className="text-white text-lg font-medium italic">
              "{dailyInsight || 'Gathering insights for your day...'}"
            </Text>
            <TouchableOpacity onPress={fetchDailyInsight} className="mt-4 self-end">
               <Text className="text-dark-400 text-xs">Refresh 🔄</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats Cards */}
        <View className="px-6 pb-4">
          {/* Hydration Card */}
          <TouchableOpacity
            onPress={() => router.push('/track/hydration')}
            className="bg-dark-800 rounded-2xl p-6 mb-4 border border-dark-700"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="bg-accent-500/20 p-2 rounded-lg mr-3">
                   <Text className="text-2xl">💧</Text>
                </View>
                <Text className="text-white text-lg font-semibold">Hydration</Text>
              </View>
              <Text className="text-accent-400 text-2xl font-bold">{hydrationPercentage}%</Text>
            </View>
            <View className="bg-dark-700 h-3 rounded-full overflow-hidden">
              <View
                className="bg-accent-500 h-full rounded-full"
                style={{ width: `${Math.min(hydrationPercentage, 100)}%` }}
              />
            </View>
            <Text className="text-dark-400 text-sm mt-2">
              {currentHydration}ml / {hydrationGoal}ml
            </Text>
          </TouchableOpacity>

          {/* Sleep Card */}
          <TouchableOpacity
            onPress={() => router.push('/track/sleep')}
            className="bg-dark-800 rounded-2xl p-6 mb-4 border border-dark-700"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="bg-primary-500/20 p-2 rounded-lg mr-3">
                  <Text className="text-2xl">😴</Text>
                </View>
                <Text className="text-white text-lg font-semibold">Sleep</Text>
              </View>
              <Text className="text-primary-400 text-2xl font-bold">{sleepHours}h</Text>
            </View>
            <View className="bg-dark-700 h-3 rounded-full overflow-hidden">
              <View
                className="bg-primary-500 h-full rounded-full"
                style={{ width: `${Math.min((sleepHours / sleepGoal) * 100, 100)}%` }}
              />
            </View>
            <Text className="text-dark-400 text-sm mt-2">
              Goal: {sleepGoal}h {lastSleep?.quality ? `• Quality: ${lastSleep.quality}/5` : ''}
            </Text>
          </TouchableOpacity>

          <View className="flex-row gap-4 mb-4">
            {/* Habits Card */}
            <TouchableOpacity
              onPress={() => router.push('/track/habits')}
              className="bg-dark-800 rounded-2xl p-6 flex-1 border border-dark-700"
            >
              <View className="bg-green-500/20 p-2 rounded-lg w-10 items-center mb-3">
                <Text className="text-xl">✅</Text>
              </View>
              <Text className="text-white text-lg font-semibold mb-1">Habits</Text>
              <Text className="text-green-400 text-2xl font-bold">{habitCompletion}%</Text>
              <Text className="text-dark-400 text-xs mt-1">
                {todayHabitLogs.length}/{activeHabits.length} done
              </Text>
            </TouchableOpacity>

            {/* Nutrition Card */}
            <TouchableOpacity
              onPress={() => router.push('/track/nutrition')}
              className="bg-dark-800 rounded-2xl p-6 flex-1 border border-dark-700"
            >
              <View className="bg-orange-500/20 p-2 rounded-lg w-10 items-center mb-3">
                <Text className="text-xl">🍎</Text>
              </View>
              <Text className="text-white text-lg font-semibold mb-1">Nutrition</Text>
              <Text className="text-orange-400 text-2xl font-bold">{caloriePercentage}%</Text>
              <Text className="text-dark-400 text-xs mt-1">
                {todayCalories} kcal
              </Text>
            </TouchableOpacity>
          </View>

          {/* Streak Card */}
          <View className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-6 border border-primary-500 shadow-lg shadow-primary-900/50">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-lg font-semibold mb-1">Streak Status</Text>
                <Text className="text-primary-100 text-sm">You're on fire! 🔥</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-4xl font-bold">{longestStreak}</Text>
                <Text className="text-primary-200 text-xs">days</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 pb-8">
          <Text className="text-white text-xl font-semibold mb-4">Quick Actions</Text>
          <View className="flex-row justify-between gap-4">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/companion')}
              className="bg-dark-800 rounded-2xl p-4 flex-1 items-center border border-dark-700"
            >
              <Text className="text-3xl mb-2">🤖</Text>
              <Text className="text-white font-semibold text-xs">Talk to Aurora</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/track/hydration')}
              className="bg-dark-800 rounded-2xl p-4 flex-1 items-center border border-dark-700"
            >
              <Text className="text-3xl mb-2">💧</Text>
              <Text className="text-white font-semibold text-xs">Log Water</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/track/habits')}
              className="bg-dark-800 rounded-2xl p-4 flex-1 items-center border border-dark-700"
            >
              <Text className="text-3xl mb-2">✅</Text>
              <Text className="text-white font-semibold text-xs">Check Habits</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
