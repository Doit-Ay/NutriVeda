// API Service for NutriVeda
// This service handles all API calls and data management

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000;

// HTTP client with error handling
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      return {
        success: false,
        data: null as T,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  // Generic CRUD operations
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload
  async uploadFile<T>(endpoint: string, file: File, additionalData?: any): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
    });
  }
}

const apiClient = new ApiClient(API_BASE_URL, API_TIMEOUT);

// Patient Management API
export const patientApi = {
  // Get all patients with pagination
  getPatients: (page: number = 1, limit: number = 10, filters?: any) =>
    apiClient.get<PaginatedResponse<any>>(`/patients?page=${page}&limit=${limit}&${new URLSearchParams(filters)}`),

  // Get patient by ID
  getPatient: (id: string) =>
    apiClient.get<any>(`/patients/${id}`),

  // Create new patient
  createPatient: (patientData: any) =>
    apiClient.post<any>('/patients', patientData),

  // Update patient
  updatePatient: (id: string, patientData: any) =>
    apiClient.put<any>(`/patients/${id}`, patientData),

  // Delete patient
  deletePatient: (id: string) =>
    apiClient.delete<any>(`/patients/${id}`),

  // Get patient's diet plans
  getPatientDietPlans: (patientId: string) =>
    apiClient.get<any[]>(`/patients/${patientId}/diet-plans`),

  // Get patient's assessment
  getPatientAssessment: (patientId: string) =>
    apiClient.get<any>(`/patients/${patientId}/assessment`),
};

// Food Database API
export const foodApi = {
  // Get all foods with pagination and filters
  getFoods: (page: number = 1, limit: number = 20, filters?: any) =>
    apiClient.get<PaginatedResponse<any>>(`/foods?page=${page}&limit=${limit}&${new URLSearchParams(filters)}`),

  // Get food by ID
  getFood: (id: string) =>
    apiClient.get<any>(`/foods/${id}`),

  // Search foods
  searchFoods: (query: string, filters?: any) =>
    apiClient.get<any[]>(`/foods/search?q=${encodeURIComponent(query)}&${new URLSearchParams(filters)}`),

  // Create new food
  createFood: (foodData: any) =>
    apiClient.post<any>('/foods', foodData),

  // Update food
  updateFood: (id: string, foodData: any) =>
    apiClient.put<any>(`/foods/${id}`, foodData),

  // Delete food
  deleteFood: (id: string) =>
    apiClient.delete<any>(`/foods/${id}`),

  // Get foods by category
  getFoodsByCategory: (category: string) =>
    apiClient.get<any[]>(`/foods/category/${category}`),

  // Get foods by dosha
  getFoodsByDosha: (dosha: string) =>
    apiClient.get<any[]>(`/foods/dosha/${dosha}`),
};

// Recipe Management API
export const recipeApi = {
  // Get all recipes
  getRecipes: (page: number = 1, limit: number = 20, filters?: any) =>
    apiClient.get<PaginatedResponse<any>>(`/recipes?page=${page}&limit=${limit}&${new URLSearchParams(filters)}`),

  // Get recipe by ID
  getRecipe: (id: string) =>
    apiClient.get<any>(`/recipes/${id}`),

  // Create new recipe
  createRecipe: (recipeData: any) =>
    apiClient.post<any>('/recipes', recipeData),

  // Update recipe
  updateRecipe: (id: string, recipeData: any) =>
    apiClient.put<any>(`/recipes/${id}`, recipeData),

  // Delete recipe
  deleteRecipe: (id: string) =>
    apiClient.delete<any>(`/recipes/${id}`),

  // Analyze recipe nutrition
  analyzeRecipeNutrition: (recipeData: any) =>
    apiClient.post<any>('/recipes/analyze', recipeData),

  // Get recipes by cuisine
  getRecipesByCuisine: (cuisine: string) =>
    apiClient.get<any[]>(`/recipes/cuisine/${cuisine}`),

  // Get recipes by difficulty
  getRecipesByDifficulty: (difficulty: string) =>
    apiClient.get<any[]>(`/recipes/difficulty/${difficulty}`),
};

// Diet Plan Generation API
export const dietPlanApi = {
  // Generate diet plan
  generateDietPlan: (patientId: string, parameters: any) =>
    apiClient.post<any>('/diet-plans/generate', { patientId, ...parameters }),

  // Get diet plan by ID
  getDietPlan: (id: string) =>
    apiClient.get<any>(`/diet-plans/${id}`),

  // Update diet plan
  updateDietPlan: (id: string, dietPlanData: any) =>
    apiClient.put<any>(`/diet-plans/${id}`, dietPlanData),

  // Delete diet plan
  deleteDietPlan: (id: string) =>
    apiClient.delete<any>(`/diet-plans/${id}`),

  // Get patient's diet plans
  getPatientDietPlans: (patientId: string) =>
    apiClient.get<any[]>(`/diet-plans/patient/${patientId}`),

  // Export diet plan
  exportDietPlan: (id: string, format: 'pdf' | 'excel') =>
    apiClient.get<any>(`/diet-plans/${id}/export?format=${format}`),

  // Analyze diet plan compliance
  analyzeCompliance: (dietPlanId: string, patientData: any) =>
    apiClient.post<any>(`/diet-plans/${dietPlanId}/analyze`, patientData),
};

// Prescription Processing API
export const prescriptionApi = {
  // Upload prescription
  uploadPrescription: (file: File, patientId: string) =>
    apiClient.uploadFile<any>('/prescriptions/upload', file, { patientId }),

  // Process prescription with OCR
  processPrescription: (prescriptionId: string) =>
    apiClient.post<any>(`/prescriptions/${prescriptionId}/process`, {}),

  // Get prescription by ID
  getPrescription: (id: string) =>
    apiClient.get<any>(`/prescriptions/${id}`),

  // Get patient's prescriptions
  getPatientPrescriptions: (patientId: string) =>
    apiClient.get<any[]>(`/prescriptions/patient/${patientId}`),

  // Extract foods from prescription
  extractFoods: (prescriptionId: string) =>
    apiClient.post<any>(`/prescriptions/${prescriptionId}/extract-foods`, {}),
};

// Assessment API
export const assessmentApi = {
  // Create patient assessment
  createAssessment: (patientId: string, assessmentData: any) =>
    apiClient.post<any>(`/assessments/patient/${patientId}`, assessmentData),

  // Get patient assessment
  getAssessment: (patientId: string) =>
    apiClient.get<any>(`/assessments/patient/${patientId}`),

  // Update assessment
  updateAssessment: (assessmentId: string, assessmentData: any) =>
    apiClient.put<any>(`/assessments/${assessmentId}`, assessmentData),

  // Analyze dosha
  analyzeDosha: (assessmentData: any) =>
    apiClient.post<any>('/assessments/analyze-dosha', assessmentData),

  // Get assessment recommendations
  getRecommendations: (assessmentId: string) =>
    apiClient.get<any>(`/assessments/${assessmentId}/recommendations`),
};

// Reports API
export const reportsApi = {
  // Generate report
  generateReport: (reportType: string, parameters: any) =>
    apiClient.post<any>('/reports/generate', { reportType, ...parameters }),

  // Get report by ID
  getReport: (id: string) =>
    apiClient.get<any>(`/reports/${id}`),

  // Get available report types
  getReportTypes: () =>
    apiClient.get<any[]>('/reports/types'),

  // Export report
  exportReport: (id: string, format: 'pdf' | 'excel') =>
    apiClient.get<any>(`/reports/${id}/export?format=${format}`),

  // Get dashboard statistics
  getDashboardStats: () =>
    apiClient.get<any>('/reports/dashboard-stats'),
};

// Analytics API
export const analyticsApi = {
  // Get patient compliance analytics
  getComplianceAnalytics: (patientId: string, dateRange: any) =>
    apiClient.get<any>(`/analytics/compliance/${patientId}?start=${dateRange.start}&end=${dateRange.end}`),

  // Get diet plan effectiveness
  getDietPlanEffectiveness: (dietPlanId: string) =>
    apiClient.get<any>(`/analytics/diet-plan/${dietPlanId}/effectiveness`),

  // Get nutritional analysis
  getNutritionalAnalysis: (patientId: string, dateRange: any) =>
    apiClient.get<any>(`/analytics/nutrition/${patientId}?start=${dateRange.start}&end=${dateRange.end}`),

  // Get ayurvedic compliance
  getAyurvedicCompliance: (patientId: string) =>
    apiClient.get<any>(`/analytics/ayurvedic-compliance/${patientId}`),
};

import ExcelJS from 'exceljs';

// Export API
export const exportApi = {
  // Export patient data
  exportPatientData: async (patientId: string, format: 'pdf' | 'excel' | 'csv') => {
    if (format === 'excel') {
      const response = await apiClient.get<any>(`/patients/${patientId}`);
      const patient = response.data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Patient Data');

      // Add patient info
      worksheet.columns = [
        { header: 'Field', key: 'field', width: 20 },
        { header: 'Value', key: 'value', width: 40 }
      ];

      worksheet.addRow({ field: 'Name', value: patient.name });
      worksheet.addRow({ field: 'Age', value: patient.age });
      worksheet.addRow({ field: 'Gender', value: patient.gender });
      worksheet.addRow({ field: 'Primary Dosha', value: patient.dosha });

      // Style
      worksheet.getRow(1).font = { bold: true };
      
      return await workbook.xlsx.writeBuffer();
    }
    return apiClient.get<any>(`/export/patient/${patientId}?format=${format}`);
  },

  // Export diet plan
  exportDietPlan: async (dietPlanId: string, format: 'pdf' | 'excel') => {
    if (format === 'excel') {
      const response = await apiClient.get<any>(`/diet-plans/${dietPlanId}`);
      const plan = response.data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Diet Plan');

      // Add plan info
      worksheet.columns = [
        { header: 'Meal Time', key: 'mealTime', width: 15 },
        { header: 'Foods', key: 'foods', width: 30 },
        { header: 'Calories', key: 'calories', width: 15 },
        { header: 'Protein (g)', key: 'protein', width: 15 },
        { header: 'Carbs (g)', key: 'carbs', width: 15 },
        { header: 'Fats (g)', key: 'fats', width: 15 }
      ];

  plan.meals.forEach((meal: any) => {
        worksheet.addRow({
          mealTime: meal.time,
          foods: meal.foods.join(', '),
          calories: meal.nutritionalInfo.calories,
          protein: meal.nutritionalInfo.protein,
          carbs: meal.nutritionalInfo.carbs,
          fats: meal.nutritionalInfo.fats
        });
      });

      // Style
      worksheet.getRow(1).font = { bold: true };
      
      return await workbook.xlsx.writeBuffer();
    }
    return apiClient.get<any>(`/export/diet-plan/${dietPlanId}?format=${format}`);
  },

  // Bulk export
  bulkExport: async (exportData: { planIds: string[], format: 'pdf' | 'excel' }) => {
    if (exportData.format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      
      for (const planId of exportData.planIds) {
        const response = await apiClient.get<any>(`/diet-plans/${planId}`);
        const plan = response.data;
        
        const worksheet = workbook.addWorksheet(`Plan ${planId}`);
        
        // Add plan info
        worksheet.columns = [
          { header: 'Meal Time', key: 'mealTime', width: 15 },
          { header: 'Foods', key: 'foods', width: 30 },
          { header: 'Calories', key: 'calories', width: 15 },
          { header: 'Protein (g)', key: 'protein', width: 15 },
          { header: 'Carbs (g)', key: 'carbs', width: 15 },
          { header: 'Fats (g)', key: 'fats', width: 15 }
        ];

  plan.meals.forEach((meal: any) => {
          worksheet.addRow({
            mealTime: meal.time,
            foods: meal.foods.join(', '),
            calories: meal.nutritionalInfo.calories,
            protein: meal.nutritionalInfo.protein,
            carbs: meal.nutritionalInfo.carbs,
            fats: meal.nutritionalInfo.fats
          });
        });

        // Style
        worksheet.getRow(1).font = { bold: true };
      }
      
      return await workbook.xlsx.writeBuffer();
    }
    return apiClient.post<any>('/export/bulk', exportData);
  },
};

// Authentication API
export const authApi = {
  // Login
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<any>('/auth/login', credentials),

  // Logout
  logout: () =>
    apiClient.post<any>('/auth/logout', {}),

  // Refresh token
  refreshToken: () =>
    apiClient.post<any>('/auth/refresh', {}),

  // Get user profile
  getProfile: () =>
    apiClient.get<any>('/auth/profile'),

  // Update profile
  updateProfile: (profileData: any) =>
    apiClient.put<any>('/auth/profile', profileData),
};

// System Health API
export const systemApi = {
  // Health check
  healthCheck: () =>
    apiClient.get<any>('/health'),

  // Get system status
  getSystemStatus: () =>
    apiClient.get<any>('/system/status'),

  // Get API version
  getVersion: () =>
    apiClient.get<any>('/system/version'),
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Request interceptor for adding auth token
export const addAuthInterceptor = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Response interceptor for handling common errors
export const handleResponse = (response: any) => {
  if (response.status === 401) {
    // Handle unauthorized access
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  return response;
};

export default apiClient;
