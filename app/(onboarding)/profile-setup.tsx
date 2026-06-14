import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { updateUserProfile } from '../../lib/supabase';

const { width } = Dimensions.get('window');

export default function ProfileSetupScreen() {
  const { user, setUser, setHasCompletedOnboarding } = useAppStore();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Personal Info
  const [name, setName] = useState(user?.full_name || '');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // Step 2: Schedule
  const [wakeTime, setWakeTime] = useState('07:00');
  const [bedtime, setBedtime] = useState('22:00');
  const [activityLevel, setActivityLevel] = useState('moderate');

  // Step 3: Goals
  const [goals, setGoals] = useState<string[]>([]);

  // Step 4: Notifications
  const [notifications, setNotifications] = useState({
    hydration: true,
    sleep: true,
    habits: true,
    daily_insight: true,
  });

  const [loading, setLoading] = useState(false);

  const goalOptions = [
    'Drink more water',
    'Improve sleep quality',
    'Lose weight',
    'Build muscle',
    'Reduce stress',
    'Eat healthier',
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const updates = {
        full_name: name,
        age: age ? parseInt(age) : null,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        gender: gender || null,
        health_goals: goals,
        updated_at: new Date().toISOString(),
      };

      await updateUserProfile(user.id, updates);

      // Update local state
      setUser({
        ...user,
        ...updates,
      });

      // Mark onboarding as complete
      setHasCompletedOnboarding(true);

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text className="text-white text-xl font-semibold mb-4">Step 1: Personal Details</Text>

            <View className="mb-4">
              <Text className="text-dark-300 mb-2 text-sm">Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
                placeholderTextColor="#64748b"
                className="bg-dark-800 text-white px-4 py-4 rounded-xl"
              />
            </View>

            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-dark-300 mb-2 text-sm">Age</Text>
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  placeholder="25"
                  placeholderTextColor="#64748b"
                  keyboardType="number-pad"
                  className="bg-dark-800 text-white px-4 py-4 rounded-xl"
                />
              </View>
              <View className="flex-1">
                <Text className="text-dark-300 mb-2 text-sm">Gender</Text>
                <TextInput
                  value={gender}
                  onChangeText={setGender}
                  placeholder="e.g. Male"
                  placeholderTextColor="#64748b"
                  className="bg-dark-800 text-white px-4 py-4 rounded-xl"
                />
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-dark-300 mb-2 text-sm">Height (cm)</Text>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  placeholder="175"
                  placeholderTextColor="#64748b"
                  keyboardType="decimal-pad"
                  className="bg-dark-800 text-white px-4 py-4 rounded-xl"
                />
              </View>
              <View className="flex-1">
                <Text className="text-dark-300 mb-2 text-sm">Weight (kg)</Text>
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="70"
                  placeholderTextColor="#64748b"
                  keyboardType="decimal-pad"
                  className="bg-dark-800 text-white px-4 py-4 rounded-xl"
                />
              </View>
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Text className="text-white text-xl font-semibold mb-4">Step 2: Daily Schedule</Text>

            <View className="mb-4">
              <Text className="text-dark-300 mb-2 text-sm">Typical Wake-up Time</Text>
              <TextInput
                value={wakeTime}
                onChangeText={setWakeTime}
                placeholder="07:00"
                placeholderTextColor="#64748b"
                className="bg-dark-800 text-white px-4 py-4 rounded-xl"
              />
            </View>

            <View className="mb-4">
              <Text className="text-dark-300 mb-2 text-sm">Typical Bedtime</Text>
              <TextInput
                value={bedtime}
                onChangeText={setBedtime}
                placeholder="22:00"
                placeholderTextColor="#64748b"
                className="bg-dark-800 text-white px-4 py-4 rounded-xl"
              />
            </View>

            <View>
              <Text className="text-dark-300 mb-2 text-sm">Activity Level</Text>
              <View className="flex-row flex-wrap gap-2">
                {['sedentary', 'moderate', 'active', 'very active'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => setActivityLevel(level)}
                    className={`px-4 py-3 rounded-xl ${
                      activityLevel === level ? 'bg-accent-500' : 'bg-dark-800'
                    }`}
                  >
                    <Text className={`capitalize ${activityLevel === level ? 'text-white' : 'text-dark-300'}`}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
      case 3:
        return (
          <View>
            <Text className="text-white text-xl font-semibold mb-4">Step 3: Your Health Goals</Text>
            <Text className="text-dark-400 mb-4">Select all that apply to you</Text>

            <View className="flex-row flex-wrap gap-3">
              {goalOptions.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  onPress={() => toggleGoal(goal)}
                  className={`px-4 py-3 rounded-2xl border-2 ${
                    goals.includes(goal) ? 'bg-accent-500/20 border-accent-500' : 'bg-dark-800 border-dark-700'
                  }`}
                >
                  <Text className={`${goals.includes(goal) ? 'text-accent-400 font-bold' : 'text-dark-300'}`}>
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 4:
        return (
          <View>
            <Text className="text-white text-xl font-semibold mb-4">Step 4: Notifications</Text>

            {Object.entries(notifications).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                onPress={() => setNotifications({ ...notifications, [key]: !value })}
                className="bg-dark-800 rounded-xl p-4 mb-3 flex-row justify-between items-center"
              >
                <Text className="text-white capitalize">
                  {key.replace('_', ' ')} Reminders
                </Text>
                <View className={`w-12 h-6 rounded-full px-1 justify-center ${value ? 'bg-accent-500' : 'bg-dark-700'}`}>
                  <View className={`w-4 h-4 rounded-full bg-white ${value ? 'self-end' : 'self-start'}`} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Text className="text-white font-bold text-lg">Profile Setup</Text>
        <Text className="text-dark-400">Step {step} of {totalSteps}</Text>
      </View>

      {/* Progress Bar */}
      <View className="px-6 mb-8">
        <View className="h-1 bg-dark-800 rounded-full">
          <View
            className="h-1 bg-accent-500 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="pb-12">
          {renderStep()}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="px-6 py-8 flex-row gap-4">
        {step > 1 && (
          <TouchableOpacity
            onPress={handleBack}
            className="flex-1 bg-dark-800 rounded-xl py-4 items-center"
          >
            <Text className="text-white text-lg font-bold">Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleNext}
          disabled={loading}
          className="flex-2 bg-accent-500 rounded-xl py-4 items-center"
          style={{ flex: step === 1 ? 1 : 2 }}
        >
          <Text className="text-white text-lg font-bold">
            {loading ? 'Saving...' : step === totalSteps ? 'Complete Setup' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
