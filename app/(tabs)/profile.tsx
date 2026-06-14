import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { signOut } from '../../lib/supabase';
import { useState } from 'react';

export default function ProfileScreen() {
  const { user, resetStore, hasCompletedOnboarding } = useAppStore();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              resetStore();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Sign out error:', error);
            }
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="items-center px-6 pt-10 pb-8">
          <View className="w-32 h-32 rounded-full bg-accent-500 items-center justify-center mb-4 border-4 border-dark-800 shadow-xl">
             <Text className="text-white text-5xl font-bold">
                {user?.full_name?.charAt(0) || 'A'}
             </Text>
          </View>
          <Text className="text-white text-2xl font-bold">{user?.full_name || 'Aurora User'}</Text>
          <Text className="text-dark-400 text-base">{user?.email}</Text>

          <TouchableOpacity className="mt-6 bg-dark-800 px-6 py-2 rounded-full border border-dark-700">
             <Text className="text-accent-400 font-bold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <View className="flex-row px-6 mb-8 gap-4">
           <View className="bg-dark-800 flex-1 p-4 rounded-2xl border border-dark-700 items-center">
              <Text className="text-white font-bold text-lg">{user?.age || '--'}</Text>
              <Text className="text-dark-500 text-xs">Age</Text>
           </View>
           <View className="bg-dark-800 flex-1 p-4 rounded-2xl border border-dark-700 items-center">
              <Text className="text-white font-bold text-lg">{user?.weight || '--'} kg</Text>
              <Text className="text-dark-500 text-xs">Weight</Text>
           </View>
           <View className="bg-dark-800 flex-1 p-4 rounded-2xl border border-dark-700 items-center">
              <Text className="text-white font-bold text-lg">{user?.height || '--'} cm</Text>
              <Text className="text-dark-500 text-xs">Height</Text>
           </View>
        </View>

        {/* Settings Groups */}
        <View className="px-6 pb-12">
           <Text className="text-dark-400 text-xs font-bold uppercase mb-4 tracking-widest px-1">Settings</Text>

           <View className="bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden mb-6">
              <View className="flex-row items-center justify-between p-5 border-b border-dark-700">
                 <View className="flex-row items-center">
                    <Text className="text-xl mr-3">🔔</Text>
                    <Text className="text-white text-base">Notifications</Text>
                 </View>
                 <Switch
                   value={notifications}
                   onValueChange={setNotifications}
                   trackColor={{ false: '#334155', true: '#14b8a6' }}
                 />
              </View>
              <View className="flex-row items-center justify-between p-5 border-b border-dark-700">
                 <View className="flex-row items-center">
                    <Text className="text-xl mr-3">🌙</Text>
                    <Text className="text-white text-base">Dark Mode</Text>
                 </View>
                 <Switch
                   value={darkMode}
                   onValueChange={setDarkMode}
                   trackColor={{ false: '#334155', true: '#14b8a6' }}
                 />
              </View>
              <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-dark-700">
                 <View className="flex-row items-center">
                    <Text className="text-xl mr-3">📏</Text>
                    <Text className="text-white text-base">Units</Text>
                 </View>
                 <Text className="text-dark-500">Metric</Text>
              </TouchableOpacity>
           </View>

           <Text className="text-dark-400 text-xs font-bold uppercase mb-4 tracking-widest px-1">Account</Text>

           <View className="bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden mb-8">
              <TouchableOpacity onPress={() => router.push('/(onboarding)/profile-setup')} className="flex-row items-center p-5 border-b border-dark-700">
                 <Text className="text-xl mr-3">⚙️</Text>
                 <Text className="text-white text-base">Redo Setup Wizard</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center p-5 border-b border-dark-700">
                 <Text className="text-xl mr-3">🛡️</Text>
                 <Text className="text-white text-base">Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSignOut} className="flex-row items-center p-5">
                 <Text className="text-xl mr-3">🚪</Text>
                 <Text className="text-red-400 text-base font-bold">Sign Out</Text>
              </TouchableOpacity>
           </View>

           <TouchableOpacity className="items-center py-4">
              <Text className="text-red-500/50 text-xs font-bold">DELETE ACCOUNT</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
