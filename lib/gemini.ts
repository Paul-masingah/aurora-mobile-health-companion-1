import { GoogleGenerativeAI } from '@google/generative-ai';
import { HealthContext, AIAction } from '../types';

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_AI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Initialize Gemini model
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

// System prompt for health companion
const getSystemPrompt = (context: HealthContext) => `
You are Aurora, a friendly and supportive AI health companion. Your role is to help users track and improve their health habits.

Current User Health Context:
- Today's Hydration: ${context.todayHydration}ml / ${context.hydrationGoal}ml
- Last Sleep: ${context.lastSleep ? `${context.lastSleep.duration_hours} hours (Quality: ${context.lastSleep.quality}/5)` : 'No data'}
- Active Habits: ${context.activeHabits.map(h => h.name).join(', ') || 'None'}
- Today's Meals: ${context.todayMeals.length} logged
- Current Streaks: ${context.currentStreaks.map(s => `${s.category}: ${s.current_streak} days`).join(', ') || 'None'}

You can help users with:
1. Logging water intake (e.g., "I drank 500ml" or "log 2 glasses of water")
2. Recording sleep (e.g., "I slept from 10pm to 6am" or "log 8 hours of sleep")
3. Creating habits (e.g., "create a meditation habit" or "add daily exercise")
4. Logging meals (e.g., "I ate chicken salad for lunch" or "log breakfast")
5. Checking progress (e.g., "how am I doing?" or "show my stats")

When users want to perform actions, respond with the action in your message using this format:
ACTION: [action_type] [data]

Available actions:
- ACTION: LOG_WATER [amount_in_ml]
- ACTION: LOG_SLEEP [hours] [quality_1_to_5]
- ACTION: CREATE_HABIT [habit_name]
- ACTION: LOG_MEAL [meal_type] [description]
- ACTION: CHECK_PROGRESS

Be encouraging, supportive, and conversational. Use emojis occasionally to be friendly.
Keep responses concise and actionable.
`;

export const chatWithGemini = async (
  userMessage: string,
  context: HealthContext,
  chatHistory: { role: string; parts: { text: string }[] }[] = []
) => {
  try {
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: getSystemPrompt(context) }],
        },
        {
          role: 'model',
          parts: [{ text: 'Hello! I\'m Aurora, your AI health companion. I\'m here to help you track your health and reach your goals. How can I assist you today? 🌟' }],
        },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const text = response.text();

    // Parse action from response
    const action = parseAction(text);

    return {
      text,
      action,
    };
  } catch (error) {
    console.error('Error chatting with Gemini:', error);
    throw error;
  }
};

// Parse actions from AI response
export const parseAction = (text: string): AIAction | undefined => {
  const actionMatch = text.match(/ACTION:\s*(\w+)\s*(.*)/i);

  if (!actionMatch) return undefined;

  const actionType = actionMatch[1].toLowerCase();
  const actionData = actionMatch[2].trim();

  switch (actionType) {
    case 'log_water':
      const waterAmount = parseInt(actionData);
      if (!isNaN(waterAmount)) {
        return {
          type: 'log_water',
          data: { amount_ml: waterAmount },
          executed: false,
        };
      }
      break;

    case 'log_sleep':
      const sleepParts = actionData.split(' ');
      const hours = parseFloat(sleepParts[0]);
      const quality = parseInt(sleepParts[1]);
      if (!isNaN(hours)) {
        return {
          type: 'log_sleep',
          data: {
            duration_hours: hours,
            quality: !isNaN(quality) ? quality : 3,
          },
          executed: false,
        };
      }
      break;

    case 'create_habit':
      if (actionData) {
        return {
          type: 'create_habit',
          data: { name: actionData },
          executed: false,
        };
      }
      break;

    case 'log_meal':
      const mealParts = actionData.split(' ');
      const mealType = mealParts[0];
      const description = mealParts.slice(1).join(' ');
      if (mealType && description) {
        return {
          type: 'log_meal',
          data: {
            meal_type: mealType,
            description: description,
          },
          executed: false,
        };
      }
      break;

    case 'check_progress':
      return {
        type: 'check_progress',
        executed: false,
      };
  }

  return undefined;
};

// Helper to convert text input to actionable commands
export const parseUserIntent = (text: string): AIAction | undefined => {
  const lowerText = text.toLowerCase();

  // Water logging patterns
  if (lowerText.includes('water') || lowerText.includes('drink') || lowerText.includes('hydrat')) {
    const mlMatch = text.match(/(\d+)\s*(ml|milliliters?)/i);
    const glassMatch = text.match(/(\d+)\s*(glass|cup)/i);
    const literMatch = text.match(/(\d+\.?\d*)\s*(liter|litre)/i);

    if (mlMatch) {
      return {
        type: 'log_water',
        data: { amount_ml: parseInt(mlMatch[1]) },
        executed: false,
      };
    }
    if (glassMatch) {
      return {
        type: 'log_water',
        data: { amount_ml: parseInt(glassMatch[1]) * 250 }, // 250ml per glass
        executed: false,
      };
    }
    if (literMatch) {
      return {
        type: 'log_water',
        data: { amount_ml: parseFloat(literMatch[1]) * 1000 },
        executed: false,
      };
    }
  }

  // Sleep logging patterns
  if (lowerText.includes('sleep') || lowerText.includes('slept')) {
    const hoursMatch = text.match(/(\d+\.?\d*)\s*hours?/i);
    if (hoursMatch) {
      return {
        type: 'log_sleep',
        data: {
          duration_hours: parseFloat(hoursMatch[1]),
          quality: 3,
        },
        executed: false,
      };
    }
  }

  // Habit creation patterns
  if (lowerText.includes('create') && lowerText.includes('habit')) {
    const habitMatch = text.match(/create.*habit.*[:\-]?\s*(.+)/i);
    if (habitMatch) {
      return {
        type: 'create_habit',
        data: { name: habitMatch[1].trim() },
        executed: false,
      };
    }
  }

  return undefined;
};
