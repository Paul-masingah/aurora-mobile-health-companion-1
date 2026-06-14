import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';

const MEAL_TYPES = [
  { label: 'Breakfast', value: 'breakfast', emoji: '🍳' },
  { label: 'Lunch', value: 'lunch', emoji: '🥗' },
  { label: 'Dinner', value: 'dinner', emoji: '🥩' },
  { label: 'Snack', value: 'snack', emoji: '🍎' },
] as const;

export default function NutritionScreen() {
  const { user, todayMeals, nutritionGoal, addMeal } = useAppStore();
  const [activeTab, setActiveTab] = useState<typeof MEAL_TYPES[number]['value']>('breakfast');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const handleLogMeal = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please describe your meal');
      return;
    }

    if (!user) return;

    const meal = {
      id: Date.now().toString(),
      user_id: user.id,
      meal_type: activeTab,
      description: description,
      calories: calories ? parseInt(calories) : undefined,
      protein: protein ? parseFloat(protein) : undefined,
      carbs: carbs ? parseFloat(carbs) : undefined,
      fat: fat ? parseFloat(fat) : undefined,
      logged_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    addMeal(meal);
    setDescription('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    Alert.alert('Success', 'Meal logged!');
  };

  const totalCalories = todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalProtein = todayMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  const totalCarbs = todayMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  const totalFat = todayMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0);

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

          {/* Calorie Progress Card */}
          <View className="bg-dark-800 rounded-3xl p-6 mb-8 border border-dark-700 shadow-lg">
            <View className="flex-row justify-between items-end mb-4">
              <View>
                <Text className="text-dark-400 text-xs font-bold uppercase mb-1">Calories Remaining</Text>
                <Text className="text-white text-4xl font-bold">
                  {Math.max(0, nutritionGoal.calories - totalCalories)}
                </Text>
              </View>
              <Text className="text-orange-400 text-lg font-bold">{caloriePercentage}% used</Text>
            </View>

            <View className="bg-dark-700 h-3 rounded-full overflow-hidden mb-6">
              <View
                className="bg-orange-500 h-full rounded-full"
                style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
              />
            </View>

            <View className="flex-row justify-between border-t border-dark-700 pt-4">
               <View className="items-center">
                  <Text className="text-dark-400 text-[10px] uppercase font-bold mb-1">Protein</Text>
                  <Text className="text-white font-bold">{totalProtein.toFixed(0)}g</Text>
                  <Text className="text-dark-500 text-[10px]">/ {nutritionGoal.protein}g</Text>
               </View>
               <View className="items-center">
                  <Text className="text-dark-400 text-[10px] uppercase font-bold mb-1">Carbs</Text>
                  <Text className="text-white font-bold">{totalCarbs.toFixed(0)}g</Text>
                  <Text className="text-dark-500 text-[10px]">/ {nutritionGoal.carbs}g</Text>
               </View>
               <View className="items-center">
                  <Text className="text-dark-400 text-[10px] uppercase font-bold mb-1">Fat</Text>
                  <Text className="text-white font-bold">{totalFat.toFixed(0)}g</Text>
                  <Text className="text-dark-500 text-[10px]">/ {nutritionGoal.fat}g</Text>
               </View>
            </View>
          </View>

          {/* Add Meal Section */}
          <Text className="text-white text-xl font-semibold mb-4">Log a Meal</Text>

          <View className="flex-row bg-dark-800 rounded-2xl p-1 mb-6 border border-dark-700">
            {MEAL_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                onPress={() => setActiveTab(type.value)}
                className={`flex-1 py-3 items-center rounded-xl ${
                  activeTab === type.value ? 'bg-orange-500' : ''
                }`}
              >
                <Text className={`text-xs font-bold ${activeTab === type.value ? 'text-white' : 'text-dark-400'}`}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="bg-dark-800 rounded-3xl p-6 mb-8 border border-dark-700">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={`What did you have for ${activeTab}?`}
              placeholderTextColor="#334155"
              multiline
              className="text-white text-lg mb-6 py-2"
            />

            <View className="flex-row gap-4 mb-6">
               <View className="flex-1">
                  <Text className="text-dark-400 text-[10px] uppercase font-bold mb-1">Cals</Text>
                  <TextInput
                    value={calories}
                    onChangeText={setCalories}
                    placeholder="0"
                    placeholderTextColor="#334155"
                    keyboardType="number-pad"
                    className="bg-dark-700 text-white px-4 py-3 rounded-xl font-bold"
                  />
               </View>
               <View className="flex-1">
                  <Text className="text-dark-400 text-[10px] uppercase font-bold mb-1">Protein (g)</Text>
                  <TextInput
                    value={protein}
                    onChangeText={setProtein}
                    placeholder="0"
                    placeholderTextColor="#334155"
                    keyboardType="decimal-pad"
                    className="bg-dark-700 text-white px-4 py-3 rounded-xl font-bold"
                  />
               </View>
            </View>

            <View className="flex-row gap-4 mb-8">
               <View className="flex-1">
                  <Text className="text-dark-400 text-[10px] uppercase font-bold mb-1">Carbs (g)</Text>
                  <TextInput
                    value={carbs}
                    onChangeText={setCarbs}
                    placeholder="0"
                    placeholderTextColor="#334155"
                    keyboardType="decimal-pad"
                    className="bg-dark-700 text-white px-4 py-3 rounded-xl font-bold"
                  />
               </View>
               <View className="flex-1">
                  <Text className="text-dark-400 text-[10px] uppercase font-bold mb-1">Fat (g)</Text>
                  <TextInput
                    value={fat}
                    onChangeText={setFat}
                    placeholder="0"
                    placeholderTextColor="#334155"
                    keyboardType="decimal-pad"
                    className="bg-dark-700 text-white px-4 py-3 rounded-xl font-bold"
                  />
               </View>
            </View>

            <TouchableOpacity
              onPress={handleLogMeal}
              className="bg-orange-500 rounded-2xl py-4 items-center shadow-lg shadow-orange-900/50"
            >
              <Text className="text-white text-lg font-bold">Add to Log</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Meals */}
          <Text className="text-white text-lg font-semibold mb-4">Today's Food</Text>
          {todayMeals.length === 0 ? (
            <Text className="text-dark-500 text-center italic">No meals logged yet today</Text>
          ) : (
            todayMeals.map((meal) => (
              <View key={meal.id} className="bg-dark-800 rounded-2xl p-4 mb-3 border border-dark-700 flex-row justify-between items-center">
                 <View className="flex-row items-center flex-1">
                    <View className="bg-dark-700 w-10 h-10 rounded-xl items-center justify-center mr-3">
                       <Text className="text-xl">
                          {MEAL_TYPES.find(t => t.value === meal.meal_type)?.emoji || '🍽️'}
                       </Text>
                    </View>
                    <View className="flex-1">
                       <Text className="text-white font-bold">{meal.description}</Text>
                       <Text className="text-dark-500 text-xs capitalize">{meal.meal_type} • {meal.calories} kcal</Text>
                    </View>
                 </View>
                 <View className="flex-row gap-2">
                    {meal.protein && <View className="bg-blue-500/10 px-2 py-0.5 rounded-full"><Text className="text-blue-400 text-[8px] font-bold">P: {meal.protein}g</Text></View>}
                    {meal.carbs && <View className="bg-green-500/10 px-2 py-0.5 rounded-full"><Text className="text-green-400 text-[8px] font-bold">C: {meal.carbs}g</Text></View>}
                 </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
