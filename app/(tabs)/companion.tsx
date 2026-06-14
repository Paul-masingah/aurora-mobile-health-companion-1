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
import { Audio } from 'expo-av';
import { useAppStore } from '../../store/useAppStore';
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
  } = useAppStore();

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recordingAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Hello! I'm Aurora, your AI health companion. I'm here to help you track your progress and provide personalized health advice. What's on your mind today? 🌟",
        timestamp: new Date().toISOString(),
      };
      addChatMessage(welcomeMessage);
    }

    // Request permissions
    Audio.requestPermissionsAsync();
  }, []);

  useEffect(() => {
    if (isSpeaking || isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(isRecording ? recordingAnim : pulseAnim, {
            toValue: 1.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(isRecording ? recordingAnim : pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      recordingAnim.setValue(1);
    }
  }, [isSpeaking, isRecording]);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);

      // In a real app, you would send this audio to a STT service
      // For this demo, we'll show a mock transcription
      Alert.alert('Voice Input', 'Voice recognition is being processed...', [
        { text: 'OK' }
      ]);

      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

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

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || inputText;
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    setInputText('');
    setLoading(true);

    try {
      const context = buildHealthContext();
      const directAction = parseUserIntent(messageText);
      const response = await chatWithGemini(messageText, context);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString(),
        action: response.action || directAction,
      };

      addChatMessage(assistantMessage);

      if (assistantMessage.action) {
        executeAction(assistantMessage.action);
      }

      const speechText = response.text.replace(/ACTION:.*$/i, '').trim();
      speakText(speechText);

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
        addHydrationLog({
          id: Date.now().toString(),
          user_id: user.id,
          amount_ml: action.data.amount_ml,
          logged_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
        break;
      case 'log_sleep':
        addSleepLog({
          id: Date.now().toString(),
          user_id: user.id,
          sleep_start: new Date(Date.now() - action.data.duration_hours * 60 * 60 * 1000).toISOString(),
          sleep_end: new Date().toISOString(),
          duration_hours: action.data.duration_hours,
          quality: action.data.quality,
          logged_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
        break;
      case 'create_habit':
        addHabit({
          id: Date.now().toString(),
          user_id: user.id,
          name: action.data.name,
          frequency: 'daily' as const,
          target_count: 1,
          is_active: true,
          created_at: new Date().toISOString(),
        });
        break;
      case 'log_meal':
        addMeal({
          id: Date.now().toString(),
          user_id: user.id,
          meal_type: action.data.meal_type || 'snack',
          description: action.data.description,
          logged_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
        break;
    }
  };

  const speakText = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'en-US',
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-dark-700">
           <View>
              <Text className="text-white text-2xl font-bold">Aurora</Text>
              <View className="flex-row items-center">
                 <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                 <Text className="text-dark-400 text-xs">Ready to help</Text>
              </View>
           </View>
           {isSpeaking && (
              <TouchableOpacity onPress={() => Speech.stop()}>
                 <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Text className="text-2xl">🔊</Text>
                 </Animated.View>
              </TouchableOpacity>
           )}
        </View>

        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6 pt-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {chatMessages.map((msg) => (
            <View key={msg.id} className={`mb-6 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <View className={`p-4 rounded-3xl max-w-[85%] ${
                msg.role === 'user' ? 'bg-accent-600 rounded-tr-none' : 'bg-dark-800 border border-dark-700 rounded-tl-none'
              }`}>
                <Text className="text-white text-base leading-6">
                   {msg.content.replace(/ACTION:.*$/i, '').trim()}
                </Text>
                {msg.action && (
                  <View className="mt-3 pt-2 border-t border-white/10">
                     <Text className="text-accent-300 text-[10px] font-bold uppercase tracking-widest">
                        Action Executed: {msg.action.type.replace('_', ' ')}
                     </Text>
                  </View>
                )}
              </View>
              <Text className="text-dark-500 text-[10px] mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}
          {loading && (
            <View className="bg-dark-800 border border-dark-700 p-4 rounded-2xl self-start rounded-tl-none">
               <Text className="text-dark-400">Aurora is typing...</Text>
            </View>
          )}
        </ScrollView>

        <View className="px-6 pb-6 pt-4 bg-dark-900 border-t border-dark-700">
          <View className="flex-row items-end gap-3">
             <View className="flex-1 bg-dark-800 rounded-3xl px-5 py-3 border border-dark-700">
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Message Aurora..."
                  placeholderTextColor="#475569"
                  className="text-white text-base max-h-32"
                  multiline
                />
             </View>

             {inputText.trim() ? (
               <TouchableOpacity
                 onPress={() => handleSend()}
                 className="bg-accent-500 w-12 h-12 rounded-full items-center justify-center shadow-lg shadow-accent-900/50"
               >
                  <Text className="text-xl">🚀</Text>
               </TouchableOpacity>
             ) : (
               <TouchableOpacity
                 onPressIn={startRecording}
                 onPressOut={stopRecording}
                 className={`w-12 h-12 rounded-full items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-primary-600 shadow-lg shadow-primary-900/50'}`}
               >
                  <Animated.View style={{ transform: [{ scale: recordingAnim }] }}>
                     <Text className="text-xl">{isRecording ? '🛑' : '🎤'}</Text>
                  </Animated.View>
               </TouchableOpacity>
             )}
          </View>

          {!inputText.trim() && !isRecording && (
            <View className="flex-row justify-center mt-4 gap-2">
               <TouchableOpacity onPress={() => setInputText('Log 500ml water')} className="bg-dark-800 px-3 py-1.5 rounded-full border border-dark-700">
                  <Text className="text-dark-400 text-[10px] font-bold">💧 LOG WATER</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={() => setInputText('I slept 7 hours')} className="bg-dark-800 px-3 py-1.5 rounded-full border border-dark-700">
                  <Text className="text-dark-400 text-[10px] font-bold">😴 LOG SLEEP</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={() => setInputText('What are my goals?')} className="bg-dark-800 px-3 py-1.5 rounded-full border border-dark-700">
                  <Text className="text-dark-400 text-[10px] font-bold">🎯 MY GOALS</Text>
               </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
