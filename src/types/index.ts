// Core Types for NutriVeda

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
  lastVisit?: Date;
  constitutionalAnalysis: {
    prakriti: 'Vata' | 'Pitta' | 'Kapha' | 'Mixed';
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
  consultationHistory: Consultation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Consultation {
  id: string;
  date: Date;
  practitioner: string;
  diagnosis: string;
  prescribedDietPlan: DietPlan;
  notes: string;
  followUpDate?: Date;
}

export interface DietPlan {
  id: string;
  patientId: string;
  name: string;
  duration: 'weekly' | 'monthly' | 'quarterly';
  startDate: Date;
  endDate: Date;
  meals: DailyMeal[];
  totalCalories: number;
  ayurvedicCompliance: number;
  modernNutritionCompliance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyMeal {
  date: Date;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  waterIntake: number; // in liters
  notes: string;
}

export interface Meal {
  id: string;
  name: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  ayurvedicProperties: {
    rasa: string[];
    guna: string[];
    virya: string;
    vipaka: string;
    doshaImpact: {
      vata: number;
      pitta: number;
      kapha: number;
    };
  };
  timing: string;
  instructions: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
  ayurvedicProperties: {
    rasa: string[];
    guna: string[];
    virya: string;
    vipaka: string;
    doshaImpact: {
      vata: number;
      pitta: number;
      kapha: number;
    };
  };
  benefits: string[];
  contraindications: string[];
  bestTimeToEat: string[];
  preparation: string;
}

export interface PrescriptionData {
  id: string;
  patientId: string;
  fileName: string;
  extractedText: string;
  foods: string[];
  instructions: string;
  duration: string;
  specialNotes: string;
  processedAt: Date;
}

export interface DashboardStats {
  totalPatients: number;
  activeDietPlans: number;
  completedConsultations: number;
  averageCompliance: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'patient_added' | 'diet_created' | 'consultation_completed' | 'prescription_processed';
  description: string;
  timestamp: Date;
  patientName?: string;
}

import type * as ExcelJS from 'exceljs';

export interface ExportOptions {
  format: 'pdf' | 'excel';
  includeNutritionFacts: boolean;
  includeAyurvedicProperties: boolean;
  includeInstructions: boolean;
  clinicBranding: boolean;
}

export interface ExcelExportConfig {
  sheetName: string;
  columns: ExcelColumn[];
  data: Record<string, any>[];
  styling?: {
    headerFontColor?: string;
    headerBackgroundColor?: string;
    borderColor?: string;
    alternateRowColor?: string;
  };
}

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
  style?: {
    font?: Partial<ExcelJS.Font>;
    alignment?: Partial<ExcelJS.Alignment>;
    border?: Partial<ExcelJS.Borders>;
    fill?: ExcelJS.Fill;
  };
}

export interface BulkExportRequest {
  planIds: string[];
  format: 'pdf' | 'excel';
  options?: ExportOptions;
}
