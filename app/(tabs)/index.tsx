import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { getGreeting, calculateTodayHydration, calculateHydrationPercentage } from '../../utils/health-calculations';

export default function HomeScreen() {
  const {
    user,
    hydrationGoal,
    todayHydration,
    sleepGoal,
    recentSleep,
    habits,
    habitLogs,
    todayMeals,
    nutritionGoal,
    streaks,
  } = useStore();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Here you would fetch fresh data from Supabase
    setTimeout(() => setRefreshing(false), 1000);
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

        {/* Quick Stats Cards */}
        <View className="px-6 pb-4">
          {/* Hydration Card */}
          <TouchableOpacity
            onPress={() => router.push('/hydration')}
            className="bg-dark-800 rounded-2xl p-6 mb-4 border border-dark-700"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">💧</Text>
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
            onPress={() => router.push('/sleep')}
            className="bg-dark-800 rounded-2xl p-6 mb-4 border border-dark-700"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">😴</Text>
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

          {/* Habits Card */}
          <TouchableOpacity
            onPress={() => router.push('/habits')}
            className="bg-dark-800 rounded-2xl p-6 mb-4 border border-dark-700"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">✅</Text>
                <Text className="text-white text-lg font-semibold">Habits</Text>
              </View>
              <Text className="text-green-400 text-2xl font-bold">{habitCompletion}%</Text>
            </View>
            <View className="bg-dark-700 h-3 rounded-full overflow-hidden">
              <View
                className="bg-green-500 h-full rounded-full"
                style={{ width: `${habitCompletion}%` }}
              />
            </View>
            <Text className="text-dark-400 text-sm mt-2">
              {todayHabitLogs.length} / {activeHabits.length} completed
            </Text>
          </TouchableOpacity>

          {/* Nutrition Card */}
          <TouchableOpacity
            onPress={() => router.push('/nutrition')}
            className="bg-dark-800 rounded-2xl p-6 mb-4 border border-dark-700"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">🍎</Text>
                <Text className="text-white text-lg font-semibold">Nutrition</Text>
              </View>
              <Text className="text-orange-400 text-2xl font-bold">{caloriePercentage}%</Text>
            </View>
            <View className="bg-dark-700 h-3 rounded-full overflow-hidden">
              <View
                className="bg-orange-500 h-full rounded-full"
                style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
              />
            </View>
            <Text className="text-dark-400 text-sm mt-2">
              {todayCalories} / {nutritionGoal.calories} kcal • {todayMeals.length} meals logged
            </Text>
          </TouchableOpacity>

          {/* Streak Card */}
          <View className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-6 border border-primary-500">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-lg font-semibold mb-1">Longest Streak</Text>
                <Text className="text-primary-100 text-sm">Keep up the great work!</Text>
              </View>
              <View className="items-center">
                <Text className="text-5xl mb-1">🔥</Text>
                <Text className="text-white text-3xl font-bold">{longestStreak}</Text>
                <Text className="text-primary-200 text-xs">days</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 pb-6">
          <Text className="text-white text-xl font-semibold mb-4">Quick Actions</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/companion')}
              className="bg-accent-600 rounded-xl p-4 flex-1 mr-2 items-center"
            >
              <Text className="text-3xl mb-2">🤖</Text>
              <Text className="text-white font-semibold text-sm">Ask Aurora</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/hydration')}
              className="bg-primary-600 rounded-xl p-4 flex-1 ml-2 items-center"
            >
              <Text className="text-3xl mb-2">💧</Text>
              <Text className="text-white font-semibold text-sm">Log Water</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
