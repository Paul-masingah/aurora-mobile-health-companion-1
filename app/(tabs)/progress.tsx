import { useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { getWeekLabels, getLast7DaysData } from '../../utils/health-calculations';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const { streaks, achievements, todayHydration, recentSleep, todayMeals, habits } = useAppStore();
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  const chartConfig = {
    backgroundColor: '#0f172a',
    backgroundGradientFrom: '#1e293b',
    backgroundGradientTo: '#0f172a',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(20, 184, 166, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#14b8a6',
    },
  };

  const hydrationData = {
    labels: getWeekLabels(),
    datasets: [{ data: getLast7DaysData(todayHydration, (log) => log.amount_ml) }],
  };

  const sleepData = {
    labels: getWeekLabels(),
    datasets: [{ data: getLast7DaysData(recentSleep, (log) => log.duration_hours) }],
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1">
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-white mb-2">Progress</Text>
          <View className="flex-row bg-dark-800 p-1 rounded-xl w-48 mt-2">
             <TouchableOpacity
               onPress={() => setViewMode('weekly')}
               className={`flex-1 py-2 items-center rounded-lg ${viewMode === 'weekly' ? 'bg-dark-700' : ''}`}
             >
                <Text className={`text-xs font-bold ${viewMode === 'weekly' ? 'text-accent-400' : 'text-dark-400'}`}>Weekly</Text>
             </TouchableOpacity>
             <TouchableOpacity
               onPress={() => setViewMode('monthly')}
               className={`flex-1 py-2 items-center rounded-lg ${viewMode === 'monthly' ? 'bg-dark-700' : ''}`}
             >
                <Text className={`text-xs font-bold ${viewMode === 'monthly' ? 'text-accent-400' : 'text-dark-400'}`}>Monthly</Text>
             </TouchableOpacity>
          </View>
        </View>

        {/* Analytics Charts */}
        <View className="px-6 pb-6">
           <Text className="text-white text-lg font-semibold mb-4">Hydration Trend (ml)</Text>
           <View className="bg-dark-800 rounded-3xl p-4 border border-dark-700 overflow-hidden">
              <LineChart
                data={hydrationData}
                width={screenWidth - 72}
                height={160}
                chartConfig={chartConfig}
                bezier
                withInnerLines={false}
                style={{ marginLeft: -10 }}
              />
           </View>
        </View>

        <View className="px-6 pb-6">
           <Text className="text-white text-lg font-semibold mb-4">Sleep Trend (hrs)</Text>
           <View className="bg-dark-800 rounded-3xl p-4 border border-dark-700 overflow-hidden">
              <BarChart
                data={sleepData}
                width={screenWidth - 72}
                height={160}
                chartConfig={{...chartConfig, color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`}}
                withInnerLines={false}
                fromZero
                style={{ marginLeft: -10 }}
              />
           </View>
        </View>

        {/* Streaks */}
        <View className="px-6 pb-6">
          <Text className="text-white text-xl font-semibold mb-3">Your Streaks 🔥</Text>
          <View className="flex-row flex-wrap gap-4">
             {['hydration', 'sleep', 'habit', 'nutrition'].map(cat => {
               const s = streaks.find(s => s.category === cat);
               return (
                 <View key={cat} className="bg-dark-800 rounded-3xl p-5 flex-1 min-w-[45%] border border-dark-700">
                    <Text className="text-dark-400 text-[10px] font-bold uppercase mb-2">{cat}</Text>
                    <View className="flex-row items-baseline">
                       <Text className="text-white text-3xl font-bold mr-1">{s?.current_streak || 0}</Text>
                       <Text className="text-dark-500 text-xs">days</Text>
                    </View>
                    <View className="mt-4 bg-dark-700 h-1.5 rounded-full">
                       <View className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.min(((s?.current_streak || 0) / 7) * 100, 100)}%` }} />
                    </View>
                 </View>
               )
             })}
          </View>
        </View>

        {/* Achievements */}
        <View className="px-6 pb-12">
          <Text className="text-white text-xl font-semibold mb-4">Unlocked Achievements 🏆</Text>
          {achievements.length === 0 ? (
            <View className="bg-dark-800 rounded-3xl p-8 items-center border border-dark-700 border-dashed">
               <Text className="text-dark-500 text-center">Complete goals to unlock badges!</Text>
            </View>
          ) : (
            achievements.map((achievement) => (
              <View
                key={achievement.id}
                className="bg-gradient-to-br from-primary-600/20 to-accent-600/20 rounded-3xl p-5 mb-4 border border-primary-500/30 flex-row items-center"
              >
                <View className="bg-dark-800 w-16 h-16 rounded-2xl items-center justify-center mr-4 border border-primary-500/20 shadow-lg">
                   <Text className="text-4xl">{achievement.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold">{achievement.title}</Text>
                  <Text className="text-primary-100 text-xs opacity-70">{achievement.description}</Text>
                  <Text className="text-accent-400 text-[10px] mt-2 font-bold uppercase">
                    Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
