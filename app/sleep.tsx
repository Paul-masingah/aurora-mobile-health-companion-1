import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';

export default function SleepScreen() {
  const { user, sleepGoal, addSleepLog } = useStore();
  const [hours, setHours] = useState('');
  const [quality, setQuality] = useState<number>(3);

  const qualityOptions = [
    { value: 1, label: 'Poor', emoji: '😫' },
    { value: 2, label: 'Fair', emoji: '😐' },
    { value: 3, label: 'Good', emoji: '😊' },
    { value: 4, label: 'Very Good', emoji: '😄' },
    { value: 5, label: 'Excellent', emoji: '🌟' },
  ];

  const handleLogSleep = () => {
    const sleepHours = parseFloat(hours);
    if (isNaN(sleepHours) || sleepHours <= 0 || sleepHours > 24) {
      Alert.alert('Error', 'Please enter valid sleep hours (0-24)');
      return;
    }

    if (!user) return;

    const now = new Date();
    const sleepStart = new Date(now.getTime() - sleepHours * 60 * 60 * 1000);

    const log = {
      id: Date.now().toString(),
      user_id: user.id,
      sleep_start: sleepStart.toISOString(),
      sleep_end: now.toISOString(),
      duration_hours: sleepHours,
      quality: quality as 1 | 2 | 3 | 4 | 5,
      logged_at: now.toISOString(),
      created_at: now.toISOString(),
    };

    addSleepLog(log);
    setHours('');
    setQuality(3);
    Alert.alert('Success', `Logged ${sleepHours} hours of sleep!`);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1">
        <View className="px-6 pt-4 pb-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-accent-400 text-lg">← Back</Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-6">
            <Text className="text-4xl mr-3">😴</Text>
            <Text className="text-3xl font-bold text-white">Sleep Tracking</Text>
          </View>

          {/* Sleep Hours Input */}
          <View className="bg-dark-800 rounded-2xl p-6 mb-4 border border-dark-700">
            <Text className="text-white text-lg font-semibold mb-3">How many hours did you sleep?</Text>
            <TextInput
              value={hours}
              onChangeText={setHours}
              placeholder="Enter hours (e.g., 7.5)"
              placeholderTextColor="#64748b"
              keyboardType="decimal-pad"
              className="bg-dark-700 text-white px-4 py-4 rounded-xl text-base"
            />
            <Text className="text-dark-400 text-sm mt-2">Goal: {sleepGoal} hours</Text>
          </View>

          {/* Sleep Quality */}
          <View className="bg-dark-800 rounded-2xl p-6 mb-4 border border-dark-700">
            <Text className="text-white text-lg font-semibold mb-3">Sleep Quality</Text>
            <View className="flex-row justify-between">
              {qualityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setQuality(option.value)}
                  className={`items-center p-3 rounded-xl ${
                    quality === option.value ? 'bg-primary-600' : 'bg-dark-700'
                  }`}
                >
                  <Text className="text-2xl mb-1">{option.emoji}</Text>
                  <Text className={`text-xs ${quality === option.value ? 'text-white' : 'text-dark-400'}`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Log Button */}
          <TouchableOpacity
            onPress={handleLogSleep}
            className="bg-primary-600 rounded-xl py-4 items-center"
          >
            <Text className="text-white text-lg font-bold">Log Sleep</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
