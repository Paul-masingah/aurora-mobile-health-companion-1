import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const trackingOptions = [
  { title: 'Hydration', icon: '💧', route: '/track/hydration', color: 'bg-accent-600' },
  { title: 'Sleep', icon: '😴', route: '/track/sleep', color: 'bg-primary-600' },
  { title: 'Habits', icon: '✅', route: '/track/habits', color: 'bg-green-600' },
  { title: 'Nutrition', icon: '🍎', route: '/track/nutrition', color: 'bg-orange-600' },
];

export default function TrackScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1">
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-white mb-2">Track Your Health</Text>
          <Text className="text-lg text-dark-300">What would you like to log?</Text>
        </View>

        <View className="px-6 pb-6">
          {trackingOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(option.route as any)}
              className={`${option.color} rounded-2xl p-6 mb-4 shadow-lg`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-5xl mr-4">{option.icon}</Text>
                  <Text className="text-white text-2xl font-bold">{option.title}</Text>
                </View>
                <Text className="text-white text-3xl">→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
