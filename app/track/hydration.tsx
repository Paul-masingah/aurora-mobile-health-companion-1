import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { calculateTodayHydration, getLast7DaysData, getWeekLabels } from '../../utils/health-calculations';
import { LineChart } from 'react-native-chart-kit';
import Svg, { Path, Rect, G } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;
const QUICK_ADD_AMOUNTS = [100, 250, 500, 750];

const WaterBottleIcon = ({ percentage }: { percentage: number }) => {
  const fillLevel = 100 - Math.min(percentage, 100);
  return (
    <View className="items-center justify-center py-4">
      <Svg width="120" height="200" viewBox="0 0 100 160">
        <G>
          {/* Bottle Shape */}
          <Path
            d="M30 20 L70 20 L75 40 L85 45 L85 140 Q85 155 70 155 L30 155 Q15 155 15 140 L15 45 L25 40 Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="3"
          />
          {/* Water Fill */}
          <Rect
            x="18"
            y={45 + (105 * fillLevel) / 100}
            width="64"
            height={105 - (105 * fillLevel) / 100}
            fill="#14b8a6"
            rx="5"
          />
          {/* Cap */}
          <Rect x="35" y="5" width="30" height="15" fill="#334155" rx="2" />
        </G>
      </Svg>
    </View>
  );
};

export default function HydrationScreen() {
  const { user, hydrationGoal, todayHydration, setHydrationGoal, addHydrationLog } = useAppStore();
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
  };

  const weekData = getLast7DaysData(todayHydration, (log) => log.amount_ml);
  const chartData = {
    labels: getWeekLabels(),
    datasets: [
      {
        data: weekData.length > 0 ? weekData : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(20, 184, 166, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1">
        <View className="px-6 pt-4 pb-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-accent-400 text-lg">← Back</Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-2">
            <Text className="text-4xl mr-3">💧</Text>
            <Text className="text-3xl font-bold text-white">Hydration</Text>
          </View>

          <View className="items-center justify-center">
            <WaterBottleIcon percentage={percentage} />
            <Text className="text-5xl font-bold text-white mt-2">{currentTotal}ml</Text>
            <Text className="text-dark-400 mt-1">Goal: {hydrationGoal}ml</Text>
            <View className="flex-row items-center mt-4 bg-dark-800 rounded-full px-6 py-2">
               <Text className="text-accent-400 font-bold mr-2">{percentage}%</Text>
               <Text className="text-dark-300">of daily goal</Text>
            </View>
          </View>
        </View>

        <View className="px-6 pb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-semibold">Quick Add</Text>
            <TouchableOpacity onPress={() => setEditingGoal(!editingGoal)}>
               <Text className="text-accent-400 text-sm">Edit Goal</Text>
            </TouchableOpacity>
          </View>

          {editingGoal && (
            <View className="bg-dark-800 p-4 rounded-2xl mb-6 border border-dark-700">
               <Text className="text-white mb-2 text-sm">Set New Daily Goal (ml)</Text>
               <View className="flex-row gap-2">
                  <TextInput
                    value={newGoal}
                    onChangeText={setNewGoal}
                    keyboardType="number-pad"
                    className="bg-dark-700 text-white px-4 py-2 rounded-xl flex-1"
                  />
                  <TouchableOpacity onPress={handleUpdateGoal} className="bg-accent-500 px-6 py-2 rounded-xl items-center justify-center">
                    <Text className="text-white font-bold">Save</Text>
                  </TouchableOpacity>
               </View>
            </View>
          )}

          <View className="flex-row flex-wrap gap-3">
            {QUICK_ADD_AMOUNTS.map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => handleQuickAdd(amount)}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-4 items-center flex-1 min-w-[45%]"
              >
                <Text className="text-white text-xl font-bold">+{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-6">
            <View className="flex-row items-center bg-dark-800 rounded-2xl px-4 py-1 border border-dark-700">
              <TextInput
                value={customAmount}
                onChangeText={setCustomAmount}
                placeholder="Custom amount (ml)"
                placeholderTextColor="#64748b"
                keyboardType="number-pad"
                className="flex-1 text-white py-4"
              />
              <TouchableOpacity onPress={handleCustomAdd} className="bg-accent-500 px-6 py-2 rounded-xl">
                <Text className="text-white font-bold">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-6 pb-6">
          <Text className="text-white text-lg font-semibold mb-4">Weekly Consumption</Text>
          <View className="bg-dark-800 rounded-3xl p-4 border border-dark-700 items-center">
            <LineChart
              data={chartData}
              width={screenWidth - 48}
              height={180}
              chartConfig={{
                backgroundColor: '#1e293b',
                backgroundGradientFrom: '#1e293b',
                backgroundGradientTo: '#1e293b',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(20, 184, 166, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#14b8a6',
                },
              }}
              bezier
              withInnerLines={false}
              withOuterLines={false}
              style={{ borderRadius: 16, paddingRight: 40 }}
            />
          </View>
        </View>

        <View className="px-6 pb-12">
          <Text className="text-white text-lg font-semibold mb-4">Today's Logs</Text>
          {todayHydration.length === 0 ? (
            <Text className="text-dark-500 text-center italic">No water logged yet today</Text>
          ) : (
            [...todayHydration].reverse().map((log) => (
              <View key={log.id} className="bg-dark-800 rounded-2xl p-4 mb-3 flex-row justify-between items-center border border-dark-700">
                <View className="flex-row items-center">
                  <View className="bg-accent-500/20 p-2 rounded-lg mr-3">
                    <Text>💧</Text>
                  </View>
                  <View>
                    <Text className="text-white font-bold">{log.amount_ml}ml</Text>
                    <Text className="text-dark-400 text-xs">{new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
