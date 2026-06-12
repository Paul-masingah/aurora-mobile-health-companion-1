import { useState, useRef } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Welcome to Aurora',
    description: 'Your personal AI health companion to help you build better habits and reach your wellness goals.',
    icon: '🌟',
  },
  {
    title: 'Track Your Health',
    description: 'Monitor hydration, sleep, nutrition, and daily habits all in one place.',
    icon: '💧',
  },
  {
    title: 'AI-Powered Insights',
    description: 'Get personalized recommendations and voice-guided support from Aurora.',
    icon: '🤖',
  },
  {
    title: 'Build Streaks',
    description: 'Stay motivated with streaks and achievements as you progress toward your goals.',
    icon: '🔥',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ x: width * nextIndex, animated: true });
    } else {
      router.push('/(auth)/signup');
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/signup');
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <View className="flex-1">
        {/* Skip button */}
        <View className="absolute top-4 right-4 z-10">
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-accent-400 text-base font-semibold">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Carousel */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {onboardingData.map((item, index) => (
            <View
              key={index}
              style={{ width }}
              className="flex-1 items-center justify-center px-8"
            >
              <Text className="text-8xl mb-8">{item.icon}</Text>
              <Text className="text-3xl font-bold text-white text-center mb-4">
                {item.title}
              </Text>
              <Text className="text-lg text-dark-300 text-center leading-6">
                {item.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Pagination dots */}
        <View className="flex-row justify-center items-center py-6">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex ? 'w-8 bg-accent-400' : 'w-2 bg-dark-600'
              }`}
            />
          ))}
        </View>

        {/* Next/Get Started button */}
        <View className="px-8 pb-8">
          <TouchableOpacity
            onPress={handleNext}
            className="bg-accent-500 rounded-2xl py-4 items-center"
          >
            <Text className="text-white text-lg font-bold">
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>

          {currentIndex < onboardingData.length - 1 && (
            <TouchableOpacity onPress={handleSkip} className="mt-4 items-center">
              <Text className="text-dark-400 text-base">Skip to Sign Up</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
