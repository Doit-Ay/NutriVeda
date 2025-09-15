import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NutriVedaThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import AiDietEngine from './components/AIDietEngine/AiDietEngine';
import PrescriptionUpload from './components/AIDietEngine/PrescriptionUpload';
import DietPlanGenerator from './components/AIDietEngine/DietPlanGenerator';
import ExportTools from './components/Export/ExportTools';
import Patients from './components/Patients/Patients';
import FoodDatabase from './components/FoodDatabase/FoodDatabase';
import Reports from './components/Reports/Reports';
import RecipeManager from './components/RecipeManager/RecipeManager';
import RecipeDetailsPage from './components/RecipeManager/RecipeDetailsPage';
import PatientAssessment from './components/Assessment/PatientAssessment';
import PatientApp from './components/Mobile/PatientApp';
import Settings from './components/Settings/Settings';
import Homepage from './components/Homepage/Homepage';
import Profile from './components/Profile/Profile';
import NotificationCenter from './components/Notifications/NotificationCenter';

function App() {
  return (
    <NutriVedaThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-diet-engine/upload" element={<PrescriptionUpload />} />
            <Route path="/ai-diet-engine/generate" element={<DietPlanGenerator />} />
            <Route path="/ai-diet-engine" element={<AiDietEngine />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/food-database" element={<FoodDatabase />} />
            <Route path="/recipes" element={<RecipeManager />} />
            <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
            <Route path="/assessment" element={<PatientAssessment />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/export" element={<ExportTools />} />
            <Route path="/mobile" element={<PatientApp />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<NotificationCenter />} />
          </Routes>
        </Layout>
      </Router>
    </NutriVedaThemeProvider>
  );
}

export default App;
