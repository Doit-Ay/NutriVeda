export interface DoshaImpact {
  vata: number;
  pitta: number;
  kapha: number;
}

export interface AyurvedicProperties {
  rasa: string[];
  guna: string[];
  virya: 'Heating' | 'Cooling';
  vipaka: 'Sweet' | 'Sour' | 'Pungent';
  doshaImpact: DoshaImpact;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
  ayurvedicProperties: AyurvedicProperties;
  benefits: string[];
  contraindications: string[];
  bestTimeToEat: string[];
  preparation: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: string;
  medicalHistory: string[];
  allergies: string[];
  dietaryRestrictions: string[];
  constitutionalAnalysis: {
    prakriti: string;
    vikriti: string[];
    doshaImbalance: string[];
  };
  healthParameters: {
    weight: number;
    height: number;
    bloodPressure: string;
    diabetes: boolean;
    heartCondition: boolean;
    otherConditions: string[];
  };
  consultationHistory: any[];
  lastVisit: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  patientName: string;
}

export interface DashboardStats {
  totalPatients: number;
  activeDietPlans: number;
  completedConsultations: number;
  averageCompliance: number;
  recentActivity: RecentActivity[];
}

export interface Meal {
  id: string;
  name: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  ayurvedicProperties: AyurvedicProperties;
  timing: string;
  instructions: string;
  doshaEffect?: {
    vata: number;
    pitta: number;
    kapha: number;
  };
}

export interface DailyMeal {
  date: Date;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  waterIntake: number;
  notes: string;
}

export interface DietPlan {
  id: string;
  patientId: string;
  name: string;
  duration: 'weekly' | 'monthly' | 'quarterly';
  startDate: Date;
  endDate: Date;
  totalCalories: number;
  ayurvedicCompliance: number;
  modernNutritionCompliance: number;
  meals: DailyMeal[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PrescriptionData {
  patientName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  dosha: string;
  disease: string;
  allergies: string[];
  foods: string[];
  timestamp: string;
}

export interface ExportOptions {
  includeNutritionFacts: boolean;
  includeAyurvedicProperties: boolean;
  includeInstructions: boolean;
  clinicBranding: boolean;
}
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Ingredient {
    foodId: string;
    name?: string;
    quantity: number;
    unit: string;
}

export interface Recipe {
    id: string;
    name: string;
    description: string;
    mealType: MealType;
    servings: number;
    prepTime: number;
    cookTime: number;
    ingredients: Ingredient[];
    instructions: string[];
    ayurvedicProperties: AyurvedicProperties;
    ayurvedicDosha: {
        vata: boolean;
        pitta: boolean;
        kapha: boolean;
    };
    healthBenefits: string[];
    cookingTips?: string[];
    author?: string;
    createdAt?: Date;
    favorite?: boolean;
    isFavorite?: boolean; // For backward compatibility
    image?: string;
    tags?: string[];
    cuisineType?: string;
    dietaryType?: string[];
    cookingMethod?: string;
    isVeg?: boolean;
    ayurvedicTips?: string;
}
