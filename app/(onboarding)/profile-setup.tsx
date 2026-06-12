import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { updateUserProfile } from '../../lib/supabase';

export default function ProfileSetupScreen() {
  const { user, setUser, setHasCompletedOnboarding } = useStore();
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

  const handleContinue = async () => {
    // Optional validation - users can skip
    if (!user) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const updates = {
        age: age ? parseInt(age) : null,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        gender: gender || null,
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

  const handleSkip = () => {
    setHasCompletedOnboarding(true);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1 px-6">
        <View className="pt-8">
          <Text className="text-3xl font-bold text-white mb-2">Tell us about yourself</Text>
          <Text className="text-lg text-dark-300 mb-8">
            Help us personalize your experience (optional)
          </Text>

          {/* Age Input */}
          <View className="mb-4">
            <Text className="text-dark-300 mb-2 text-sm font-medium">Age</Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor="#64748b"
              className="bg-dark-800 text-white px-4 py-4 rounded-xl text-base"
              keyboardType="number-pad"
            />
          </View>

          {/* Height Input */}
          <View className="mb-4">
            <Text className="text-dark-300 mb-2 text-sm font-medium">Height (cm)</Text>
            <TextInput
              value={height}
              onChangeText={setHeight}
              placeholder="Enter your height in cm"
              placeholderTextColor="#64748b"
              className="bg-dark-800 text-white px-4 py-4 rounded-xl text-base"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Weight Input */}
          <View className="mb-4">
            <Text className="text-dark-300 mb-2 text-sm font-medium">Weight (kg)</Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter your weight in kg"
              placeholderTextColor="#64748b"
              className="bg-dark-800 text-white px-4 py-4 rounded-xl text-base"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Gender Selection */}
          <View className="mb-6">
            <Text className="text-dark-300 mb-3 text-sm font-medium">Gender</Text>
            <View className="flex-row flex-wrap gap-2">
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setGender(option.value)}
                  className={`px-4 py-3 rounded-xl ${
                    gender === option.value ? 'bg-accent-500' : 'bg-dark-800'
                  }`}
                >
                  <Text
                    className={`${
                      gender === option.value ? 'text-white' : 'text-dark-300'
                    } font-medium`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={loading}
            className={`bg-accent-500 rounded-xl py-4 items-center mb-4 ${
              loading ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white text-lg font-bold">
              {loading ? 'Saving...' : 'Continue'}
            </Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity onPress={handleSkip} className="items-center py-2">
            <Text className="text-dark-400 text-base">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
