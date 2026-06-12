import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';
import { calculateTodayHydration, getLast7DaysData, getWeekLabels } from '../utils/health-calculations';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const QUICK_ADD_AMOUNTS = [250, 500, 750, 1000];

export default function HydrationScreen() {
  const { user, hydrationGoal, todayHydration, setHydrationGoal, addHydrationLog } = useStore();
  const [customAmount, setCustomAmount] = useState('');
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(hydrationGoal.toString());

  const currentTotal = calculateTodayHydration(todayHydration);
  const percentage = Math.round((currentTotal / hydrationGoal) * 100);

  const handleQuickAdd = (amount: number) => {
    if (!user) return;

    const log = {
      id: Date.now().toString(),
      user_id: user.id,
      amount_ml: amount,
      logged_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    addHydrationLog(log);
    Alert.alert('Success', `Added ${amount}ml of water!`);
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    handleQuickAdd(amount);
    setCustomAmount('');
  };

  const handleUpdateGoal = () => {
    const goal = parseInt(newGoal);
    if (isNaN(goal) || goal <= 0) {
      Alert.alert('Error', 'Please enter a valid goal');
      return;
    }

    setHydrationGoal(goal);
    setEditingGoal(false);
    Alert.alert('Success', 'Goal updated!');
  };

  // Chart data
  const weekData = getLast7DaysData(todayHydration, (log) => log.amount_ml);
  const chartData = {
    labels: getWeekLabels(),
    datasets: [
      {
        data: weekData.length > 0 ? weekData : [0],
        color: (opacity = 1) => `rgba(20, 184, 166, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-accent-400 text-lg">← Back</Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-2">
            <Text className="text-4xl mr-3">💧</Text>
            <Text className="text-3xl font-bold text-white">Hydration</Text>
          </View>

          {/* Current Progress */}
          <View className="bg-dark-800 rounded-2xl p-6 mt-4 border border-dark-700">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-dark-300 text-base">Today's Progress</Text>
              <Text className="text-accent-400 text-3xl font-bold">{percentage}%</Text>
            </View>

            <View className="bg-dark-700 h-4 rounded-full overflow-hidden mb-3">
              <View
                className="bg-accent-500 h-full rounded-full"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-white text-2xl font-bold">{currentTotal}ml</Text>
              <TouchableOpacity onPress={() => setEditingGoal(!editingGoal)}>
                <Text className="text-dark-400 text-sm">Goal: {hydrationGoal}ml ✏️</Text>
              </TouchableOpacity>
            </View>

            {editingGoal && (
              <View className="mt-4 flex-row items-center">
                <TextInput
                  value={newGoal}
                  onChangeText={setNewGoal}
                  keyboardType="number-pad"
                  className="bg-dark-700 text-white px-4 py-2 rounded-lg flex-1 mr-2"
                />
                <TouchableOpacity
                  onPress={handleUpdateGoal}
                  className="bg-accent-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-semibold">Save</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Quick Add Buttons */}
        <View className="px-6 pb-6">
          <Text className="text-white text-lg font-semibold mb-3">Quick Add</Text>
          <View className="flex-row flex-wrap gap-3">
            {QUICK_ADD_AMOUNTS.map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => handleQuickAdd(amount)}
                className="bg-accent-600 rounded-xl p-4 items-center flex-1 min-w-[45%]"
              >
                <Text className="text-white text-2xl font-bold">{amount}ml</Text>
                <Text className="text-accent-100 text-xs mt-1">
                  {amount === 250 ? 'Glass' : amount === 500 ? 'Bottle' : amount === 750 ? 'Large' : 'Liter'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount */}
          <View className="mt-4">
            <Text className="text-white text-lg font-semibold mb-3">Custom Amount</Text>
            <View className="flex-row items-center">
              <TextInput
                value={customAmount}
                onChangeText={setCustomAmount}
                placeholder="Enter ml..."
                placeholderTextColor="#64748b"
                keyboardType="number-pad"
                className="bg-dark-800 text-white px-4 py-4 rounded-xl flex-1 mr-3"
              />
              <TouchableOpacity
                onPress={handleCustomAdd}
                className="bg-primary-600 px-6 py-4 rounded-xl"
              >
                <Text className="text-white font-bold">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Weekly Chart */}
        <View className="px-6 pb-6">
          <Text className="text-white text-lg font-semibold mb-3">This Week</Text>
          <View className="bg-dark-800 rounded-2xl p-4 border border-dark-700">
            <LineChart
              data={chartData}
              width={screenWidth - 80}
              height={200}
              chartConfig={{
                backgroundColor: '#1e293b',
                backgroundGradientFrom: '#1e293b',
                backgroundGradientTo: '#0f172a',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(20, 184, 166, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(203, 213, 225, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#14b8a6',
                },
              }}
              bezier
              style={{ borderRadius: 16 }}
            />
          </View>
        </View>

        {/* Today's Logs */}
        <View className="px-6 pb-6">
          <Text className="text-white text-lg font-semibold mb-3">Today's Logs</Text>
          {todayHydration.length === 0 ? (
            <View className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <Text className="text-dark-400 text-center">No logs yet. Start tracking!</Text>
            </View>
          ) : (
            todayHydration.map((log) => (
              <View
                key={log.id}
                className="bg-dark-800 rounded-xl p-4 mb-2 border border-dark-700 flex-row justify-between items-center"
              >
                <View>
                  <Text className="text-white text-lg font-semibold">{log.amount_ml}ml</Text>
                  <Text className="text-dark-400 text-sm">
                    {new Date(log.logged_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <Text className="text-2xl">💧</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
