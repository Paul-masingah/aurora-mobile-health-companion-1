import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export default function NutritionScreen() {
  const { user, todayMeals, nutritionGoal, addMeal } = useStore();
  const [mealType, setMealType] = useState<typeof MEAL_TYPES[number]>('breakfast');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');

  const handleLogMeal = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please describe your meal');
      return;
    }

    if (!user) return;

    const meal = {
      id: Date.now().toString(),
      user_id: user.id,
      meal_type: mealType,
      description: description,
      calories: calories ? parseInt(calories) : undefined,
      logged_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    addMeal(meal);
    setDescription('');
    setCalories('');
    Alert.alert('Success', 'Meal logged!');
  };

  const totalCalories = todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const caloriePercentage = Math.round((totalCalories / nutritionGoal.calories) * 100);

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <ScrollView className="flex-1">
        <View className="px-6 pt-4 pb-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-accent-400 text-lg">← Back</Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-6">
            <Text className="text-4xl mr-3">🍎</Text>
            <Text className="text-3xl font-bold text-white">Nutrition</Text>
          </View>

          {/* Calorie Progress */}
          <View className="bg-dark-800 rounded-2xl p-6 mb-4 border border-dark-700">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-dark-300 text-base">Today's Calories</Text>
              <Text className="text-orange-400 text-2xl font-bold">{caloriePercentage}%</Text>
            </View>
            <View className="bg-dark-700 h-4 rounded-full overflow-hidden mb-2">
              <View
                className="bg-orange-500 h-full rounded-full"
                style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
              />
            </View>
            <Text className="text-white text-xl font-bold">
              {totalCalories} / {nutritionGoal.calories} kcal
            </Text>
          </View>

          {/* Log Meal Form */}
          <View className="bg-dark-800 rounded-2xl p-6 mb-4 border border-dark-700">
            <Text className="text-white text-lg font-semibold mb-3">Log Meal</Text>

            {/* Meal Type Selection */}
            <Text className="text-dark-300 mb-2 text-sm">Meal Type</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {MEAL_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setMealType(type)}
                  className={`px-4 py-2 rounded-lg ${
                    mealType === type ? 'bg-orange-600' : 'bg-dark-700'
                  }`}
                >
                  <Text className={`capitalize ${mealType === type ? 'text-white' : 'text-dark-300'}`}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Description */}
            <Text className="text-dark-300 mb-2 text-sm">What did you eat?</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="E.g., Grilled chicken salad"
              placeholderTextColor="#64748b"
              className="bg-dark-700 text-white px-4 py-4 rounded-xl text-base mb-3"
              multiline
            />

            {/* Calories (Optional) */}
            <Text className="text-dark-300 mb-2 text-sm">Calories (optional)</Text>
            <TextInput
              value={calories}
              onChangeText={setCalories}
              placeholder="Enter calories"
              placeholderTextColor="#64748b"
              keyboardType="number-pad"
              className="bg-dark-700 text-white px-4 py-4 rounded-xl text-base mb-4"
            />

            <TouchableOpacity
              onPress={handleLogMeal}
              className="bg-orange-600 rounded-xl py-3 items-center"
            >
              <Text className="text-white text-base font-bold">Log Meal</Text>
            </TouchableOpacity>
          </View>

          {/* Today's Meals */}
          <Text className="text-white text-lg font-semibold mb-3">Today's Meals</Text>
          {todayMeals.length === 0 ? (
            <View className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <Text className="text-dark-400 text-center">No meals logged yet</Text>
            </View>
          ) : (
            todayMeals.map((meal) => (
              <View
                key={meal.id}
                className="bg-dark-800 rounded-xl p-4 mb-2 border border-dark-700"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-orange-400 text-xs font-semibold uppercase mb-1">
                      {meal.meal_type}
                    </Text>
                    <Text className="text-white text-base">{meal.description}</Text>
                    {meal.calories && (
                      <Text className="text-dark-400 text-sm mt-1">{meal.calories} kcal</Text>
                    )}
                  </View>
                  <Text className="text-2xl">🍽️</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
