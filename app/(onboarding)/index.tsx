import { useState, useRef } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Meet your personal health companion.',
    description: 'Aurora is here to guide you on your journey to better health and wellness.',
    icon: '🌟',
    hero: '✨',
  },
  {
    title: 'Track hydration, sleep, habits, and nutrition.',
    description: 'Easily log your daily activities and see your progress in real-time.',
    icon: '💧',
    hero: '📊',
  },
  {
    title: 'Receive personalized daily insights.',
    description: 'Aurora uses AI to provide tailored advice based on your health data.',
    icon: '🤖',
    hero: '💡',
  },
  {
    title: 'Build healthier routines through consistency.',
    description: 'Stay motivated with streaks and achievements as you reach your milestones.',
    icon: '🔥',
    hero: '🏆',
  },
  {
    title: 'Learn more about yourself every day.',
    description: 'Discover patterns and insights that help you make better health choices.',
    icon: '🧠',
    hero: '🌈',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollToIndex(nextIndex);
    } else {
      router.push('/(auth)/signup');
    }
  };

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({ x: width * index, animated: true });
  };

  const handleSkip = () => {
    router.push('/(auth)/signup');
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
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
          className="flex-1"
        >
          {onboardingData.map((item, index) => (
            <View
              key={index}
              style={{ width }}
              className="flex-1 items-center justify-center px-8"
            >
              <View className="mb-12 items-center justify-center">
                <Text className="text-9xl">{item.hero}</Text>
                <View className="absolute -bottom-4 -right-4 bg-dark-800 rounded-full p-4 border-2 border-accent-500">
                   <Text className="text-4xl">{item.icon}</Text>
                </View>
              </View>

              <Text className="text-3xl font-bold text-white text-center mb-4 px-4">
                {item.title}
              </Text>
              <Text className="text-lg text-dark-300 text-center leading-6 px-4">
                {item.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Pagination dots */}
        <View className="flex-row justify-center items-center py-6">
          {onboardingData.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
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
            className="bg-accent-500 rounded-2xl py-4 items-center shadow-lg shadow-accent-900"
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
