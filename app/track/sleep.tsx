import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';

const QUALITY_OPTIONS = [
  { value: 1, label: 'Poor', emoji: '😫', color: 'bg-red-500' },
  { value: 2, label: 'Fair', emoji: '😐', color: 'bg-orange-500' },
  { value: 3, label: 'Good', emoji: '😊', color: 'bg-yellow-500' },
  { value: 4, label: 'V. Good', emoji: '😄', color: 'bg-green-500' },
  { value: 5, label: 'Perfect', emoji: '🌟', color: 'bg-accent-500' },
];

export default function SleepScreen() {
  const { user, sleepGoal, recentSleep, addSleepLog } = useAppStore();

  const [bedtime, setBedtime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [quality, setQuality] = useState(3);

  const calculateDuration = (start: string, end: string) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;

    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }

    const diffMinutes = endMinutes - startMinutes;
    const h = Math.floor(diffMinutes / 60);
    const m = diffMinutes % 60;

    return { hours: h, minutes: m, totalHours: diffMinutes / 60 };
  };

  const duration = calculateDuration(bedtime, wakeTime);

  const handleLogSleep = () => {
    if (!user) return;

    // Basic validation
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(bedtime) || !timeRegex.test(wakeTime)) {
      Alert.alert('Error', 'Please enter time in HH:MM format (e.g., 22:30)');
      return;
    }

    const now = new Date();
    // Simplified start date calculation
    const sleepStart = new Date();
    const [bh, bm] = bedtime.split(':').map(Number);
    sleepStart.setHours(bh, bm, 0, 0);
    if (sleepStart > now) sleepStart.setDate(sleepStart.getDate() - 1);

    const log = {
      id: Date.now().toString(),
      user_id: user.id,
      sleep_start: sleepStart.toISOString(),
      sleep_end: now.toISOString(), // Assuming wake time is roughly now for simplified logging
      duration_hours: duration.totalHours,
      quality: quality as 1 | 2 | 3 | 4 | 5,
      logged_at: now.toISOString(),
      created_at: now.toISOString(),
    };

    addSleepLog(log);
    Alert.alert('Success', 'Sleep logged!');
    router.back();
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
            <Text className="text-3xl font-bold text-white">Sleep</Text>
          </View>

          <View className="bg-dark-800 rounded-3xl p-6 border border-dark-700 items-center mb-8">
            <Text className="text-dark-400 mb-2 font-medium">Total Sleep Duration</Text>
            <Text className="text-white text-5xl font-bold">{duration.hours}h {duration.minutes}m</Text>
            <View className="bg-primary-500/20 px-4 py-1 rounded-full mt-3">
               <Text className="text-primary-400 font-bold">Goal: {sleepGoal}h</Text>
            </View>
          </View>

          <View className="flex-row gap-4 mb-8">
            <View className="flex-1 bg-dark-800 p-4 rounded-2xl border border-dark-700">
              <Text className="text-dark-400 text-xs mb-2 uppercase font-bold">Bedtime</Text>
              <TextInput
                value={bedtime}
                onChangeText={setBedtime}
                className="text-white text-2xl font-bold"
                placeholder="22:00"
                placeholderTextColor="#334155"
              />
            </View>
            <View className="flex-1 bg-dark-800 p-4 rounded-2xl border border-dark-700">
              <Text className="text-dark-400 text-xs mb-2 uppercase font-bold">Wake Time</Text>
              <TextInput
                value={wakeTime}
                onChangeText={setWakeTime}
                className="text-white text-2xl font-bold"
                placeholder="06:00"
                placeholderTextColor="#334155"
              />
            </View>
          </View>

          <Text className="text-white text-lg font-semibold mb-4">How did you sleep?</Text>
          <View className="flex-row justify-between mb-10">
             {QUALITY_OPTIONS.map((opt) => (
               <TouchableOpacity
                 key={opt.value}
                 onPress={() => setQuality(opt.value)}
                 className={`items-center justify-center p-3 rounded-2xl border-2 ${
                   quality === opt.value ? 'bg-primary-500/10 border-primary-500' : 'bg-dark-800 border-transparent'
                 }`}
               >
                 <Text className="text-3xl mb-1">{opt.emoji}</Text>
                 <Text className={`text-[10px] font-bold ${quality === opt.value ? 'text-primary-400' : 'text-dark-500'}`}>
                   {opt.label}
                 </Text>
               </TouchableOpacity>
             ))}
          </View>

          <TouchableOpacity
            onPress={handleLogSleep}
            className="bg-primary-600 rounded-2xl py-5 items-center shadow-lg shadow-primary-900/50"
          >
            <Text className="text-white text-xl font-bold">Save Sleep Log</Text>
          </TouchableOpacity>
        </View>

        <View className="px-6 pb-12">
          <Text className="text-white text-lg font-semibold mb-4">Recent Sleep</Text>
          {recentSleep.length === 0 ? (
            <Text className="text-dark-500 text-center italic">No sleep logs found</Text>
          ) : (
            recentSleep.map((log) => (
              <View key={log.id} className="bg-dark-800 rounded-2xl p-4 mb-3 border border-dark-700 flex-row justify-between items-center">
                <View>
                  <Text className="text-white font-bold">{log.duration_hours.toFixed(1)} hours</Text>
                  <Text className="text-dark-400 text-xs">{new Date(log.logged_at).toLocaleDateString()}</Text>
                </View>
                <View className="bg-dark-700 px-3 py-1 rounded-full">
                   <Text className="text-lg">{QUALITY_OPTIONS.find(q => q.value === log.quality)?.emoji || '😊'}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
