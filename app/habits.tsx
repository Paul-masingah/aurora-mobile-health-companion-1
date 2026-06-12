import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';

export default function HabitsScreen() {
  const { user, habits, habitLogs, addHabit, updateHabit, addHabitLog } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [habitName, setHabitName] = useState('');

  const handleAddHabit = () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (!user) return;

    const newHabit = {
      id: Date.now().toString(),
      user_id: user.id,
      name: habitName,
      frequency: 'daily' as const,
      target_count: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    addHabit(newHabit);
    setHabitName('');
    setShowAddForm(false);
    Alert.alert('Success', 'Habit created!');
  };

  const handleToggleHabit = (habitId: string) => {
    if (!user) return;

    const today = new Date().toDateString();
    const existingLog = habitLogs.find(
      (log) => log.habit_id === habitId && new Date(log.logged_at).toDateString() === today
    );

    if (existingLog) {
      Alert.alert('Info', 'Already logged today');
      return;
    }

    const log = {
      id: Date.now().toString(),
      habit_id: habitId,
      user_id: user.id,
      completed: true,
      logged_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    addHabitLog(log);
    Alert.alert('Success', 'Habit completed!');
  };

  const activeHabits = habits.filter((h) => h.is_active);
  const today = new Date().toDateString();

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1">
        <View className="px-6 pt-4 pb-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-accent-400 text-lg">← Back</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <Text className="text-4xl mr-3">✅</Text>
              <Text className="text-3xl font-bold text-white">Habits</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowAddForm(!showAddForm)}
              className="bg-accent-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-bold">+ Add</Text>
            </TouchableOpacity>
          </View>

          {/* Add Habit Form */}
          {showAddForm && (
            <View className="bg-dark-800 rounded-2xl p-6 mb-4 border border-dark-700">
              <Text className="text-white text-lg font-semibold mb-3">Create New Habit</Text>
              <TextInput
                value={habitName}
                onChangeText={setHabitName}
                placeholder="Enter habit name..."
                placeholderTextColor="#64748b"
                className="bg-dark-700 text-white px-4 py-4 rounded-xl text-base mb-3"
              />
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={handleAddHabit}
                  className="bg-green-600 flex-1 py-3 rounded-xl"
                >
                  <Text className="text-white font-bold text-center">Create</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowAddForm(false)}
                  className="bg-dark-700 flex-1 py-3 rounded-xl"
                >
                  <Text className="text-white font-bold text-center">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Habits List */}
          {activeHabits.length === 0 ? (
            <View className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <Text className="text-dark-400 text-center">
                No habits yet. Create your first habit!
              </Text>
            </View>
          ) : (
            activeHabits.map((habit) => {
              const todayLog = habitLogs.find(
                (log) =>
                  log.habit_id === habit.id &&
                  new Date(log.logged_at).toDateString() === today &&
                  log.completed
              );

              return (
                <View
                  key={habit.id}
                  className="bg-dark-800 rounded-xl p-4 mb-3 border border-dark-700"
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="text-white text-lg font-semibold">{habit.name}</Text>
                      <Text className="text-dark-400 text-sm capitalize">
                        {habit.frequency}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleToggleHabit(habit.id)}
                      className={`w-12 h-12 rounded-full items-center justify-center ${
                        todayLog ? 'bg-green-600' : 'bg-dark-700'
                      }`}
                    >
                      <Text className="text-2xl">{todayLog ? '✓' : '○'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
