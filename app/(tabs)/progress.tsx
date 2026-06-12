import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';

export default function ProgressScreen() {
  const { streaks, achievements } = useStore();

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1">
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-white mb-2">Your Progress</Text>
          <Text className="text-lg text-dark-300">Streaks and achievements</Text>
        </View>

        {/* Streaks */}
        <View className="px-6 pb-6">
          <Text className="text-white text-xl font-semibold mb-3">Current Streaks 🔥</Text>
          {streaks.length === 0 ? (
            <View className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <Text className="text-dark-400 text-center">
                Start tracking to build streaks!
              </Text>
            </View>
          ) : (
            streaks.map((streak) => (
              <View
                key={streak.id}
                className="bg-dark-800 rounded-xl p-4 mb-3 border border-dark-700"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white text-lg font-semibold capitalize">
                      {streak.category}
                    </Text>
                    <Text className="text-dark-400 text-sm">
                      Longest: {streak.longest_streak} days
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-4xl mb-1">🔥</Text>
                    <Text className="text-accent-400 text-2xl font-bold">
                      {streak.current_streak}
                    </Text>
                    <Text className="text-dark-400 text-xs">days</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Achievements */}
        <View className="px-6 pb-6">
          <Text className="text-white text-xl font-semibold mb-3">Achievements 🏆</Text>
          {achievements.length === 0 ? (
            <View className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <Text className="text-dark-400 text-center">
                Complete activities to unlock achievements!
              </Text>
            </View>
          ) : (
            achievements.map((achievement) => (
              <View
                key={achievement.id}
                className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl p-4 mb-3 border border-primary-500"
              >
                <View className="flex-row items-center">
                  <Text className="text-5xl mr-4">{achievement.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-white text-lg font-bold">
                      {achievement.title}
                    </Text>
                    <Text className="text-primary-100 text-sm">
                      {achievement.description}
                    </Text>
                    <Text className="text-primary-200 text-xs mt-1">
                      Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
                    </Text>
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
