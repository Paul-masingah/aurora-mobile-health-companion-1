import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store/useStore';
import { signOut } from '../../lib/supabase';

export default function ProfileScreen() {
  const { user, resetStore } = useStore();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            resetStore();
            router.replace('/(onboarding)');
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1">
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-white mb-2">Profile</Text>
          <Text className="text-lg text-dark-300">Manage your account</Text>
        </View>

        {/* User Info */}
        <View className="px-6 pb-6">
          <View className="bg-dark-800 rounded-2xl p-6 border border-dark-700 mb-4">
            <View className="items-center mb-4">
              <View className="w-24 h-24 bg-accent-600 rounded-full items-center justify-center mb-3">
                <Text className="text-5xl">👤</Text>
              </View>
              <Text className="text-white text-2xl font-bold">{user?.full_name || 'User'}</Text>
              <Text className="text-dark-400 text-sm mt-1">{user?.email}</Text>
            </View>

            {user?.age && (
              <View className="flex-row justify-around pt-4 border-t border-dark-700">
                <View className="items-center">
                  <Text className="text-dark-400 text-xs">Age</Text>
                  <Text className="text-white text-lg font-bold">{user.age}</Text>
                </View>
                {user?.height && (
                  <View className="items-center">
                    <Text className="text-dark-400 text-xs">Height</Text>
                    <Text className="text-white text-lg font-bold">{user.height}cm</Text>
                  </View>
                )}
                {user?.weight && (
                  <View className="items-center">
                    <Text className="text-dark-400 text-xs">Weight</Text>
                    <Text className="text-white text-lg font-bold">{user.weight}kg</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Settings */}
          <View className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden mb-4">
            <TouchableOpacity className="p-4 border-b border-dark-700">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">⚙️</Text>
                  <Text className="text-white text-base">Settings</Text>
                </View>
                <Text className="text-dark-400">→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="p-4 border-b border-dark-700">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">🎯</Text>
                  <Text className="text-white text-base">Goals</Text>
                </View>
                <Text className="text-dark-400">→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">📊</Text>
                  <Text className="text-white text-base">Data & Privacy</Text>
                </View>
                <Text className="text-dark-400">→</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-600 rounded-xl p-4 items-center"
          >
            <Text className="text-white text-lg font-bold">Logout</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text className="text-dark-500 text-xs text-center mt-6">
            Aurora Health Companion v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
