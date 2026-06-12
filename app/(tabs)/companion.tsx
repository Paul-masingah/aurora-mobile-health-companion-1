import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { useStore } from '../../store/useStore';
import { chatWithGemini, parseUserIntent } from '../../lib/gemini';
import { ChatMessage, HealthContext } from '../../types';

export default function CompanionScreen() {
  const {
    user,
    todayHydration,
    hydrationGoal,
    recentSleep,
    habits,
    todayMeals,
    streaks,
    achievements,
    chatMessages,
    addChatMessage,
    addHydrationLog,
    addSleepLog,
    addHabit,
    addMeal,
  } = useStore();

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Welcome message if no chat history
    if (chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Hello! I'm Aurora, your AI health companion. How can I help you today? You can ask me to log water, track sleep, create habits, or check your progress!",
        timestamp: new Date().toISOString(),
      };
      addChatMessage(welcomeMessage);
    }
  }, []);

  // Pulse animation for voice indicator
  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSpeaking]);

  const buildHealthContext = (): HealthContext => {
    const todayHydrationTotal = todayHydration.reduce((sum, log) => sum + log.amount_ml, 0);

    return {
      todayHydration: todayHydrationTotal,
      hydrationGoal,
      lastSleep: recentSleep[0],
      activeHabits: habits.filter(h => h.is_active),
      todayMeals,
      currentStreaks: streaks,
      recentAchievements: achievements.slice(0, 5),
    };
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    setInputText('');
    setLoading(true);

    try {
      // Build health context
      const context = buildHealthContext();

      // Check for direct actions first
      const directAction = parseUserIntent(inputText);

      // Get AI response
      const response = await chatWithGemini(inputText, context);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString(),
        action: response.action || directAction,
      };

      addChatMessage(assistantMessage);

      // Execute action if present
      if (assistantMessage.action) {
        executeAction(assistantMessage.action);
      }

      // Speak response (remove ACTION: prefix from speech)
      const speechText = response.text.replace(/ACTION:.*$/i, '').trim();
      speakText(speechText);

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      console.error('Chat error:', error);
      Alert.alert('Error', 'Failed to get response. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const executeAction = (action: any) => {
    if (!user) return;

    switch (action.type) {
      case 'log_water':
        const waterLog = {
          id: Date.now().toString(),
          user_id: user.id,
          amount_ml: action.data.amount_ml,
          logged_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        addHydrationLog(waterLog);
        break;

      case 'log_sleep':
        const sleepLog = {
          id: Date.now().toString(),
          user_id: user.id,
          sleep_start: new Date(Date.now() - action.data.duration_hours * 60 * 60 * 1000).toISOString(),
          sleep_end: new Date().toISOString(),
          duration_hours: action.data.duration_hours,
          quality: action.data.quality,
          logged_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        addSleepLog(sleepLog);
        break;

      case 'create_habit':
        const habit = {
          id: Date.now().toString(),
          user_id: user.id,
          name: action.data.name,
          frequency: 'daily' as const,
          target_count: 1,
          is_active: true,
          created_at: new Date().toISOString(),
        };
        addHabit(habit);
        break;

      case 'log_meal':
        const meal = {
          id: Date.now().toString(),
          user_id: user.id,
          meal_type: action.data.meal_type,
          description: action.data.description,
          logged_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        addMeal(meal);
        break;
    }
  };

  const speakText = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={10}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-3 border-b border-dark-700">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-white">Aurora AI</Text>
              <Text className="text-dark-400 text-sm">Your health companion</Text>
            </View>
            {isSpeaking && (
              <TouchableOpacity onPress={stopSpeaking}>
                <Animated.Text
                  style={{ transform: [{ scale: pulseAnim }] }}
                  className="text-4xl"
                >
                  🔊
                </Animated.Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6 pt-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {chatMessages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <View
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-accent-600'
                    : 'bg-dark-800 border border-dark-700'
                }`}
              >
                <Text className="text-white text-base leading-5">
                  {message.content.replace(/ACTION:.*$/i, '').trim()}
                </Text>
                {message.action && (
                  <View className="mt-2 pt-2 border-t border-dark-600">
                    <Text className="text-accent-300 text-xs">
                      ✓ Action: {message.action.type.replace(/_/g, ' ')}
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-dark-500 text-xs mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))}

          {loading && (
            <View className="items-start mb-4">
              <View className="bg-dark-800 border border-dark-700 p-4 rounded-2xl">
                <Text className="text-dark-400">Aurora is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="px-6 pb-6 pt-3 border-t border-dark-700">
          <View className="flex-row items-center bg-dark-800 rounded-2xl px-4 py-2">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask Aurora anything..."
              placeholderTextColor="#64748b"
              className="flex-1 text-white text-base py-2"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={loading || !inputText.trim()}
              className={`ml-2 ${loading || !inputText.trim() ? 'opacity-50' : ''}`}
            >
              <Text className="text-2xl">🚀</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-3 gap-2">
            <TouchableOpacity
              onPress={() => setInputText('Log 500ml of water')}
              className="bg-dark-700 px-3 py-2 rounded-lg"
            >
              <Text className="text-dark-300 text-xs">💧 Log Water</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setInputText('I slept 8 hours last night')}
              className="bg-dark-700 px-3 py-2 rounded-lg"
            >
              <Text className="text-dark-300 text-xs">😴 Log Sleep</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setInputText('How am I doing?')}
              className="bg-dark-700 px-3 py-2 rounded-lg"
            >
              <Text className="text-dark-300 text-xs">📊 Check Stats</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
