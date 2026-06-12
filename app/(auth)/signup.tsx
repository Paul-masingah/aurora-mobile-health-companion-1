import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signUp } from '../../lib/supabase';
import { useStore } from '../../store/useStore';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();

  const handleSignUp = async () => {
    // Validation
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const data = await signUp(email, password, fullName);

      // Set user in store
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          created_at: data.user.created_at!,
          updated_at: new Date().toISOString(),
        });

        // Navigate to profile setup
        router.replace('/(onboarding)/profile-setup');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6">
          <View className="pt-12">
            <Text className="text-4xl font-bold text-white mb-2">Create Account</Text>
            <Text className="text-lg text-dark-300 mb-8">
              Join Aurora and start your wellness journey
            </Text>

            {/* Full Name Input */}
            <View className="mb-4">
              <Text className="text-dark-300 mb-2 text-sm font-medium">Full Name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor="#64748b"
                className="bg-dark-800 text-white px-4 py-4 rounded-xl text-base"
                autoCapitalize="words"
              />
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-dark-300 mb-2 text-sm font-medium">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#64748b"
                className="bg-dark-800 text-white px-4 py-4 rounded-xl text-base"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-dark-300 mb-2 text-sm font-medium">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor="#64748b"
                className="bg-dark-800 text-white px-4 py-4 rounded-xl text-base"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-dark-300 mb-2 text-sm font-medium">
                Confirm Password
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#64748b"
                className="bg-dark-800 text-white px-4 py-4 rounded-xl text-base"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              className={`bg-accent-500 rounded-xl py-4 items-center mb-4 ${
                loading ? 'opacity-50' : ''
              }`}
            >
              <Text className="text-white text-lg font-bold">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-dark-400">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text className="text-accent-400 font-semibold">Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
