import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';

const CATEGORIES = [
  { label: 'Exercise', value: 'exercise', emoji: '💪' },
  { label: 'Meditation', value: 'meditation', emoji: '🧘' },
  { label: 'Reading', value: 'reading', emoji: '📚' },
  { label: 'Other', value: 'other', emoji: '✨' },
];

export default function HabitsScreen() {
  const { user, habits, habitLogs, streaks, addHabit, addHabitLog } = useAppStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [category, setCategory] = useState('exercise');

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
      category: category as any,
      frequency: 'daily' as const,
      target_count: 1,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    addHabit(newHabit);
    setHabitName('');
    setModalVisible(false);
  };

  const handleToggleHabit = (habitId: string) => {
    if (!user) return;

    const today = new Date().toDateString();
    const existingLog = habitLogs.find(
      (log) => log.habit_id === habitId && new Date(log.logged_at).toDateString() === today
    );

    if (existingLog) {
      // In a real app, maybe toggle off, but here we just confirm it's done
      Alert.alert('Info', 'You already completed this habit today!');
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
              onPress={() => setModalVisible(true)}
              className="bg-accent-600 w-12 h-12 rounded-full items-center justify-center shadow-lg shadow-accent-900/50"
            >
              <Text className="text-white text-3xl font-bold">+</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Overview */}
          <View className="bg-dark-800 rounded-3xl p-6 mb-8 border border-dark-700">
             <Text className="text-dark-400 text-sm font-bold uppercase mb-2">Today's Progress</Text>
             <View className="flex-row items-center">
                <Text className="text-white text-4xl font-bold mr-3">
                   {habitLogs.filter(l => new Date(l.logged_at).toDateString() === today).length}/{activeHabits.length}
                </Text>
                <Text className="text-dark-400 text-lg">habits completed</Text>
             </View>
          </View>

          {/* Habits List */}
          <Text className="text-white text-xl font-semibold mb-4">My Habits</Text>
          {activeHabits.length === 0 ? (
            <View className="bg-dark-800 rounded-2xl p-10 items-center border border-dark-700 border-dashed">
              <Text className="text-dark-400 text-center mb-4">You haven't set any habits yet.</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-dark-700 px-6 py-3 rounded-xl">
                 <Text className="text-accent-400 font-bold">Create Habit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            activeHabits.map((habit) => {
              const isCompleted = habitLogs.some(
                (log) =>
                  log.habit_id === habit.id &&
                  new Date(log.logged_at).toDateString() === today &&
                  log.completed
              );

              const streak = streaks.find(s => s.category === 'habit')?.current_streak || 0;

              return (
                <TouchableOpacity
                  key={habit.id}
                  onPress={() => handleToggleHabit(habit.id)}
                  activeOpacity={0.7}
                  className={`bg-dark-800 rounded-2xl p-5 mb-4 border-2 flex-row items-center justify-between ${
                    isCompleted ? 'border-green-500/50 bg-green-500/5' : 'border-dark-700'
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${isCompleted ? 'bg-green-500' : 'bg-dark-700'}`}>
                       <Text className="text-2xl">
                          {isCompleted ? '✓' : CATEGORIES.find(c => c.value === habit.category)?.emoji || '✨'}
                       </Text>
                    </View>
                    <View>
                      <Text className={`text-lg font-bold ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                        {habit.name}
                      </Text>
                      <View className="flex-row items-center mt-1">
                         <Text className="text-orange-400 text-xs mr-2">🔥 {streak} day streak</Text>
                         <Text className="text-dark-500 text-xs">• {habit.frequency}</Text>
                      </View>
                    </View>
                  </View>
                  {!isCompleted && (
                     <View className="w-8 h-8 rounded-full border-2 border-dark-600" />
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Add Habit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/60">
            <View className="bg-dark-900 rounded-t-[40px] p-8 pb-12 border-t border-dark-700">
              <View className="flex-row justify-between items-center mb-6">
                 <Text className="text-white text-2xl font-bold">New Habit</Text>
                 <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text className="text-dark-400 text-lg">Cancel</Text>
                 </TouchableOpacity>
              </View>

              <Text className="text-dark-300 mb-2 text-sm">Habit Name</Text>
              <TextInput
                value={habitName}
                onChangeText={setHabitName}
                placeholder="e.g. Daily Meditation"
                placeholderTextColor="#334155"
                className="bg-dark-800 text-white px-5 py-4 rounded-2xl text-lg mb-6 border border-dark-700"
              />

              <Text className="text-dark-300 mb-3 text-sm">Category</Text>
              <View className="flex-row flex-wrap gap-3 mb-8">
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => setCategory(cat.value)}
                    className={`px-4 py-3 rounded-2xl border-2 ${
                      category === cat.value ? 'bg-accent-500/10 border-accent-500' : 'bg-dark-800 border-dark-700'
                    }`}
                  >
                    <Text className="mr-1">{cat.emoji}</Text>
                    <Text className={`${category === cat.value ? 'text-accent-400 font-bold' : 'text-dark-300'}`}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleAddHabit}
                className="bg-accent-500 rounded-2xl py-4 items-center shadow-lg shadow-accent-900/50"
              >
                <Text className="text-white text-lg font-bold">Start This Habit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
