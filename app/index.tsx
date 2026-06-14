import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import { getCurrentUser } from '../lib/supabase';

export default function Index() {
  const { user, hasCompletedOnboarding, setUser } = useAppStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        // Not authenticated, go to onboarding
        setTimeout(() => {
          router.replace('/(onboarding)');
        }, 1000);
        return;
      }

      // Set user in store
      setUser({
        id: currentUser.id,
        email: currentUser.email!,
        full_name: currentUser.user_metadata?.full_name || '',
        created_at: currentUser.created_at!,
        updated_at: new Date().toISOString(),
      });

      // Check if onboarding is complete
      if (!hasCompletedOnboarding) {
        setTimeout(() => {
          router.replace('/(onboarding)/profile-setup');
        }, 1000);
      } else {
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1000);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setTimeout(() => {
        router.replace('/(onboarding)');
      }, 1000);
    }
  };

  return (
    <View className="flex-1 bg-dark-900 items-center justify-center">
      <Text className="text-4xl font-bold text-accent-400 mb-4">Aurora</Text>
      <Text className="text-lg text-dark-200 mb-8">Your AI Health Companion</Text>
      <ActivityIndicator size="large" color="#14b8a6" />
    </View>
  );
}
