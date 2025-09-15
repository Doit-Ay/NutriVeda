import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  ButtonGroup,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Paper,
  Slider,
  Avatar,
  Stack,
  Switch,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
  Autocomplete,
  Stepper,
  Step,
  StepLabel,
  Badge,
  Collapse,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Psychology,
  Restaurant,
  CheckCircle,
  Edit,
  Download,
  Share,
  Add,
  Remove,
  WaterDrop,
  LocalFireDepartment,
  Spa,
  QueryStats,
  Favorite,
  Monitor,
  FilterList,
  CalendarMonth,
  TrendingUp,
  TrendingDown,
  Person,
  Settings,
  Autorenew,
  FavoriteBorder,
  Star,
  StarBorder,
  DateRange,
  Visibility as ViewMode,
  ExpandMore,
  ExpandLess,
  Save,
  Close,
  Opacity,
  FitnessCenter,
  Grain,
  ChevronRight,
  ChevronLeft
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip as RechartsTooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { DietPlan, DailyMeal, Meal, FoodItem } from '../../types';
import { mockFoodDatabase } from '../../data/mockData';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`diet-tabpanel-${index}`}
      aria-labelledby={`diet-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DietPlanGenerator: React.FC = () => {
  const theme = useTheme();
  const [selectedPatient, setSelectedPatient] = useState('1');
  const [duration, setDuration] = useState<'weekly' | 'monthly' | 'quarterly'>('weekly');
  const [generatedPlan, setGeneratedPlan] = useState<DietPlan | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [patientData, setPatientData] = useState<any>(null);
  const [expandedMealTypes, setExpandedMealTypes] = useState<{[key: string]: boolean}>({
    breakfast: true,
    lunch: true,
    dinner: true,
    snacks: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [doshaFilter, setDoshaFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Mock patients data
  const patients = [
    { 
      id: '1', 
      name: 'Rajesh Kumar', 
      age: 45, 
      gender: 'male',
      height: 172,
      weight: 78,
      email: 'rajesh@example.com',
      doshaType: { vata: 30, pitta: 60, kapha: 10 },
      allergies: ['Peanuts', 'Shellfish'],
      preferences: ['Vegetarian', 'Low Sugar'],
      medicalConditions: ['Type 2 Diabetes', 'Hypertension']
    },
    { 
      id: '2', 
      name: 'Priya Sharma', 
      age: 32, 
      gender: 'female',
      height: 165,
      weight: 62,
      email: 'priya@example.com',
      doshaType: { vata: 50, pitta: 30, kapha: 20 },
      allergies: ['Gluten'],
      preferences: ['Low Carb', 'High Protein'],
      medicalConditions: ['PCOS']
    }
  ];

  const generateDietPlan = () => {
    const mockPlan: DietPlan = {
      id: '1',
      patientId: selectedPatient,
      name: `${duration.charAt(0).toUpperCase() + duration.slice(1)} Diet Plan`,
      duration,
      startDate: new Date(),
      endDate: new Date(Date.now() + (duration === 'weekly' ? 7 : duration === 'monthly' ? 30 : 90) * 24 * 60 * 60 * 1000),
      totalCalories: 1800,
      ayurvedicCompliance: 92,
      modernNutritionCompliance: 88,
      meals: generateMockMeals(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setGeneratedPlan(mockPlan);
  };

  const generateMockMeals = (): DailyMeal[] => {
    const days = duration === 'weekly' ? 7 : duration === 'monthly' ? 30 : 90;
    const meals: DailyMeal[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      meals.push({
        date,
        breakfast: generateMockMeal('Breakfast', 'morning'),
        lunch: generateMockMeal('Lunch', 'afternoon'),
        dinner: generateMockMeal('Dinner', 'evening'),
        snacks: [generateMockMeal('Evening Snack', 'evening')],
        waterIntake: 2.5,
        notes: `Day ${i + 1} - Follow Ayurvedic principles`
      });
    }
    
    return meals;
  };

  const generateMockMeal = (name: string, timing: string): Meal => {
    const foods = [...mockFoodDatabase].sort(() => 0.5 - Math.random()).slice(0, 3);
    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
    const totalProtein = foods.reduce((sum, food) => sum + food.protein, 0);
    const totalCarbs = foods.reduce((sum, food) => sum + food.carbs, 0);
    const totalFats = foods.reduce((sum, food) => sum + food.fats, 0);

    return {
      id: Math.random().toString(),
      name,
      foods,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      ayurvedicProperties: {
        rasa: ['Sweet', 'Pungent'],
        guna: ['Light', 'Warm'],
        virya: 'Heating',
        vipaka: 'Sweet',
        doshaImpact: {
          vata: -1,
          pitta: 0,
          kapha: -1
        }
      },
      timing,
      instructions: `Consume ${name.toLowerCase()} at ${timing} for optimal digestion`
    };
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!generatedPlan || !selectedMeal) return;

    const newMeals = generatedPlan.meals.map(dailyMeal => {
      if (dailyMeal.breakfast.id === selectedMeal.id) {
        return { ...dailyMeal, breakfast: selectedMeal };
      }
      if (dailyMeal.lunch.id === selectedMeal.id) {
        return { ...dailyMeal, lunch: selectedMeal };
      }
      if (dailyMeal.dinner.id === selectedMeal.id) {
        return { ...dailyMeal, dinner: selectedMeal };
      }
      return dailyMeal;
    });

    setGeneratedPlan({ ...generatedPlan, meals: newMeals });
    setEditDialogOpen(false);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    if (!generatedPlan) return;

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text(generatedPlan.name, 20, 20);
      autoTable(doc, {
        head: [['Day', 'Meal', 'Foods', 'Calories']],
        body: generatedPlan.meals.flatMap((dailyMeal, index) => [
          [`Day ${index + 1}`,'Breakfast', dailyMeal.breakfast.foods.map(f => f.name).join(', '), dailyMeal.breakfast.totalCalories.toString()],
          ['','Lunch', dailyMeal.lunch.foods.map(f => f.name).join(', '), dailyMeal.lunch.totalCalories.toString()],
          ['','Dinner', dailyMeal.dinner.foods.map(f => f.name).join(', '), dailyMeal.dinner.totalCalories.toString()],
        ])
      });
      doc.save('diet-plan.pdf');
    }
  };

  const handleShare = () => {
    if (!generatedPlan) return;
    const shareText = `Check out this diet plan: ${generatedPlan.name}`;
    if (navigator.share) {
      navigator.share({
        title: 'Diet Plan',
        text: shareText,
        url: window.location.href,
      });
    }
  };

  // Get meal type color
  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return '#4caf50';
      case 'lunch':
        return '#ff9800';
      case 'dinner':
        return '#2196f3';
      case 'snack':
      case 'snacks':
        return '#9c27b0';
      default:
        return '#757575';
    }
  };
  
  // Get dosha effect icon and color
  const getDoshaEffectIcon = (effect: number | 'increase' | 'decrease' | 'neutral', dosha: string) => {
    const doshaColors = {
      vata: '#8561c5',
      pitta: '#ff7043',
      kapha: '#29b6f6'
    };
    
    const color = doshaColors[dosha as keyof typeof doshaColors] || 'text.secondary';
    
    // Convert numeric effect to string status
    let effectStatus: 'increase' | 'decrease' | 'neutral';
    if (typeof effect === 'number') {
      effectStatus = effect > 0.3 ? 'increase' : effect < -0.3 ? 'decrease' : 'neutral';
    } else {
      effectStatus = effect;
    }
    
    return {
      icon: effectStatus === 'decrease' ? <TrendingDown sx={{ fontSize: '1rem', color }} /> : 
            effectStatus === 'increase' ? <TrendingUp sx={{ fontSize: '1rem', color }} /> : 
            <Remove sx={{ fontSize: '1rem', color }} />,
      label: `${effectStatus === 'decrease' ? 'Decreases' : effectStatus === 'increase' ? 'Increases' : 'Neutral'} ${dosha}`
    };
  };

  const renderMealCard = (meal: Meal | null | undefined, mealType: string) => {
    if (!meal) return null;
    
    const mealTypeColor = getMealTypeColor(mealType);
    
    return (
      <Card key={meal.id} sx={{ mb: 2, borderLeft: `4px solid ${mealTypeColor}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Restaurant sx={{ color: mealTypeColor, mr: 1 }} />
              <Typography variant="h6" sx={{ color: mealTypeColor }}>{mealType}</Typography>
            </Box>
            <Box>
              <IconButton 
                size="small" 
                onClick={() => handleEditMeal(meal)}
                sx={{ mr: 1 }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <Chip 
                label={`${meal.totalCalories} cal`} 
                size="small" 
                color="primary" 
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {meal.name}
          </Typography>
          
          <List dense disablePadding>
            {meal.foods.map((food: FoodItem, index: number) => (
              <ListItem key={index} sx={{ py: 0.5, px: 0 }} dense disablePadding>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Restaurant fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {food.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {food.calories} cal
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {food.ayurvedicProperties?.rasa ? food.ayurvedicProperties.rasa.join(', ') : 'N/A'}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Tooltip title="Protein">
                <Chip 
                  icon={<FitnessCenter sx={{ fontSize: '0.8rem' }} />}
                  label={`${meal.totalProtein?.toFixed(1)}g`} 
                  size="small" 
                  variant="outlined"
                  sx={{ height: 20, '& .MuiChip-label': { px: 0.5, fontSize: '0.7rem' } }}
                />
              </Tooltip>
              <Tooltip title="Carbohydrates">
                <Chip 
                  icon={<Grain sx={{ fontSize: '0.8rem' }} />}
                  label={`${meal.totalCarbs?.toFixed(1)}g`} 
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, '& .MuiChip-label': { px: 0.5, fontSize: '0.7rem' } }}
                />
              </Tooltip>
              <Tooltip title="Fats">
                <Chip 
                  icon={<Opacity sx={{ fontSize: '0.8rem' }} />}
                  label={`${meal.totalFats?.toFixed(1)}g`} 
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, '& .MuiChip-label': { px: 0.5, fontSize: '0.7rem' } }}
                />
              </Tooltip>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {meal.doshaEffect && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title={getDoshaEffectIcon(meal.doshaEffect.vata, 'vata').label}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getDoshaEffectIcon(meal.doshaEffect.vata, 'vata').icon}
                    </Box>
                  </Tooltip>
                  <Tooltip title={getDoshaEffectIcon(meal.doshaEffect.pitta, 'pitta').label}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getDoshaEffectIcon(meal.doshaEffect.pitta, 'pitta').icon}
                    </Box>
                  </Tooltip>
                  <Tooltip title={getDoshaEffectIcon(meal.doshaEffect.kapha, 'kapha').label}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getDoshaEffectIcon(meal.doshaEffect.kapha, 'kapha').icon}
                    </Box>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Create steps for the stepper component
  const steps = ['Patient Profile', 'Diet Preferences', 'Generate & Customize', 'Review & Export'];
  
  // Additional state for meal template selection
  const [selectedMealTemplate, setSelectedMealTemplate] = useState<string>('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailedNutrition, setShowDetailedNutrition] = useState(false);
  
  // Weekday labels
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Track the open state of nutrition analysis
  const [openAnalysis, setOpenAnalysis] = useState(false);
  
  // Function to handle step changes
  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };
  
  // For calendar navigation
  const handleDateChange = (days: number) => {
    const newDate = new Date(calendarDate);
    newDate.setDate(newDate.getDate() + days);
    setCalendarDate(newDate);
  };
  
  // Function to toggle meal type expansion
  const toggleMealType = (mealType: string) => {
    setExpandedMealTypes(prev => ({
      ...prev,
      [mealType]: !prev[mealType]
    }));
  };
  
  // Data for dosha radar chart
  const doshaRadarData = [
    { subject: 'Vata', A: 80, B: 60, fullMark: 100 },
    { subject: 'Pitta', A: 45, B: 65, fullMark: 100 },
    { subject: 'Kapha', A: 65, B: 45, fullMark: 100 },
  ];

  // Data for nutrition distribution
  const nutritionPieData = [
    { name: 'Protein', value: 25, color: '#0088FE' },
    { name: 'Carbs', value: 55, color: '#00C49F' },
    { name: 'Fats', value: 20, color: '#FFBB28' },
  ];

  // To help filtering meal templates
  const mealCategories = ['All', 'Vata-balancing', 'Pitta-balancing', 'Kapha-balancing', 'Diabetes-friendly', 'Weight management', 'Heart health'];
  
  return (
    <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
        AI Diet Plan Generator
      </Typography>
      
      <Paper elevation={0} sx={{ mb: 4, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
      
      <Grid container spacing={3}>
        {activeStep === 0 && (
          <>
            {/* Patient Selection */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    Patient Selection
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Select a patient to create a personalized diet plan
                    </Typography>
                    
                    <FormControl fullWidth>
                      <InputLabel>Select Patient</InputLabel>
                      <Select
                        value={selectedPatient}
                        onChange={(e) => {
                          setSelectedPatient(e.target.value);
                          const patient = patients.find(p => p.id === e.target.value);
                          setPatientData(patient || null);
                        }}
                        startAdornment={<Person sx={{ mr: 1, color: 'action.active', ml: 1 }} />}
                      >
                        {patients.map(patient => (
                          <MenuItem key={patient.id} value={patient.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                                {patient.name.charAt(0)}
                              </Avatar>
                              {patient.name} 
                              {patient.medicalConditions && patient.medicalConditions.length > 0 && (
                                <Chip 
                                  label={patient.medicalConditions[0]} 
                                  size="small" 
                                  sx={{ ml: 1, fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={!selectedPatient}
                    >
                      Next
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Patient Profile Summary */}
            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  {patientData ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mr: 2 }}>
                          {patientData.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{patientData.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {patientData.age} years • {patientData.gender} • {patientData.height}cm • {patientData.weight}kg
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Dosha Profile
                          </Typography>
                          
                          {patientData.doshaType && (
                            <Box sx={{ height: 200 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart outerRadius={70} data={[
                                  { subject: 'Vata', A: patientData.doshaType.vata, fullMark: 100 },
                                  { subject: 'Pitta', A: patientData.doshaType.pitta, fullMark: 100 },
                                  { subject: 'Kapha', A: patientData.doshaType.kapha, fullMark: 100 },
                                ]}>
                                  <PolarGrid />
                                  <PolarAngleAxis dataKey="subject" />
                                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                  <Radar name="Dosha" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                </RadarChart>
                              </ResponsiveContainer>
                            </Box>
                          )}
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Medical Conditions
                          </Typography>
                          
                          <List dense>
                            {patientData.medicalConditions?.map((condition: string, index: number) => (
                              <ListItem key={index} dense sx={{ py: 0.5 }}>
                                <ListItemIcon>
                                  <Favorite fontSize="small" color="error" />
                                </ListItemIcon>
                                <ListItemText primary={condition} />
                              </ListItem>
                            ))}
                          </List>
                          
                          <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                            Allergies
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {patientData.allergies?.length ? 
                              patientData.allergies.map((allergy: string, index: number) => (
                                <Chip key={index} label={allergy} size="small" color="warning" />
                              )) : 
                              <Typography variant="body2" color="text.secondary">No known allergies</Typography>
                            }
                          </Box>
                          
                          <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                            Preferences
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {patientData.preferences?.map((preference: string, index: number) => (
                              <Chip key={index} label={preference} size="small" />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle2" color="primary">
                        Ayurvedic Recommendations
                      </Typography>
                      <Box sx={{ mt: 1, mb: 2 }}>
                        {patientData.doshaType && patientData.doshaType.vata > 40 && (
                          <Alert severity="info" sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              <strong>Vata balancing:</strong> Include warm, cooked, moist foods. Favor sweet, sour, and salty tastes.
                            </Typography>
                          </Alert>
                        )}
                        {patientData.doshaType && patientData.doshaType.pitta > 40 && (
                          <Alert severity="info" sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              <strong>Pitta balancing:</strong> Include cooling foods. Favor sweet, bitter, and astringent tastes.
                            </Typography>
                          </Alert>
                        )}
                        {patientData.doshaType && patientData.doshaType.kapha > 40 && (
                          <Alert severity="info">
                            <Typography variant="body2">
                              <strong>Kapha balancing:</strong> Include light, warm, dry foods. Favor pungent, bitter, and astringent tastes.
                            </Typography>
                          </Alert>
                        )}
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                      <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Select a patient to view their profile
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
        
        {activeStep === 1 && (
          <>
            {/* Diet Configuration */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Settings sx={{ mr: 1, color: 'primary.main' }} />
                    Diet Preferences
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Plan Duration</InputLabel>
                    <Select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value as any)}
                      startAdornment={<DateRange sx={{ mr: 1, color: 'action.active', ml: 1 }} />}
                    >
                      <MenuItem value="weekly">Weekly (7 days)</MenuItem>
                      <MenuItem value="monthly">Monthly (30 days)</MenuItem>
                      <MenuItem value="quarterly">Quarterly (90 days)</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Target Calories
                  </Typography>
                  <Slider
                    value={1800}
                    step={100}
                    min={1000}
                    max={3000}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 1000, label: '1000' },
                      { value: 2000, label: '2000' },
                      { value: 3000, label: '3000' },
                    ]}
                    sx={{ mb: 3 }}
                  />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Macro Distribution
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Protein</Typography>
                      <Slider 
                        value={25} 
                        min={10} 
                        max={40} 
                        valueLabelDisplay="auto" 
                        sx={{ color: '#0088FE' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Carbs</Typography>
                      <Slider 
                        value={55} 
                        min={30} 
                        max={70} 
                        valueLabelDisplay="auto" 
                        sx={{ color: '#00C49F' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>Fats</Typography>
                      <Slider 
                        value={20} 
                        min={10} 
                        max={40} 
                        valueLabelDisplay="auto" 
                        sx={{ color: '#FFBB28' }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Ayurvedic Focus
                  </Typography>
                  
                  <RadioGroup
                    row
                    value={doshaFilter}
                    onChange={(e) => setDoshaFilter(e.target.value)}
                    sx={{ mb: 3 }}
                  >
                    <FormControlLabel value="all" control={<Radio />} label="Balanced" />
                    <FormControlLabel value="vata" control={<Radio />} label="Vata" />
                    <FormControlLabel value="pitta" control={<Radio />} label="Pitta" />
                    <FormControlLabel value="kapha" control={<Radio />} label="Kapha" />
                  </RadioGroup>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Special Requirements
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter any special dietary requirements, restrictions, or health goals..."
                    sx={{ mb: 3 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Meal Templates */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Restaurant sx={{ mr: 1, color: 'primary.main' }} />
                    Meal Templates
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Select meal templates to include in your diet plan. These will be customized based on patient needs.
                  </Typography>
                  
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <TextField
                      placeholder="Search templates..."
                      size="small"
                      fullWidth
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{ maxWidth: 300, mr: 2 }}
                    />
                    <Chip 
                      label="Filter" 
                      icon={<FilterList />} 
                      onClick={() => setFilterOpen(!filterOpen)}
                      variant={filterOpen ? "filled" : "outlined"}
                      color={filterOpen ? "primary" : "default"}
                    />
                  </Box>
                  
                  {filterOpen && (
                    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Filter by Category
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {mealCategories.map(category => (
                          <Chip 
                            key={category} 
                            label={category} 
                            onClick={() => {}} 
                            variant={category === 'All' ? 'filled' : 'outlined'} 
                            color={category === 'All' ? 'primary' : 'default'}
                          />
                        ))}
                      </Box>
                      
                      <FormControlLabel
                        control={<Switch checked={showOnlyFavorites} onChange={() => setShowOnlyFavorites(!showOnlyFavorites)} />}
                        label="Show only favorites"
                      />
                    </Paper>
                  )}
                  
                  <Grid container spacing={2}>
                    {/* Breakfast Templates */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Restaurant sx={{ mr: 1, color: 'primary.main' }} />
                        Breakfast Templates
                      </Typography>
                    </Grid>
                    {[1, 2, 3].map(i => (
                      <Grid item xs={12} sm={6} md={4} key={`breakfast-${i}`}>
                        <Card variant="outlined">
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle2">
                                {i === 1 ? 'Ayurvedic Porridge' : i === 2 ? 'Fruit & Nut Bowl' : 'Herbal Tea & Toast'}
                              </Typography>
                              <IconButton size="small" color={i === 1 ? 'primary' : 'default'}>
                                {i === 1 ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                              </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', mb: 1 }}>
                              <Chip label={i === 1 ? 'Vata' : i === 2 ? 'Pitta' : 'Kapha'} size="small" sx={{ mr: 1 }} />
                              <Chip label={`${(i * 100) + 250} cal`} size="small" color="primary" variant="outlined" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {i === 1 
                                ? 'Warm oats with ghee, cinnamon and dates' 
                                : i === 2 
                                ? 'Mixed seasonal fruits with nuts and honey' 
                                : 'Herbal tea with whole grain toast and avocado'}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                    
                    {/* Lunch Templates */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Restaurant sx={{ mr: 1, color: 'primary.main' }} />
                        Lunch Templates
                      </Typography>
                    </Grid>
                    {[1, 2, 3].map(i => (
                      <Grid item xs={12} sm={6} md={4} key={`lunch-${i}`}>
                        <Card variant="outlined">
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle2">
                                {i === 1 ? 'Kitchari Bowl' : i === 2 ? 'Quinoa Salad' : 'Lentil Soup'}
                              </Typography>
                              <IconButton size="small" color={i === 2 ? 'primary' : 'default'}>
                                {i === 2 ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                              </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', mb: 1 }}>
                              <Chip label={i === 1 ? 'Tri-doshic' : i === 2 ? 'Pitta' : 'Vata'} size="small" sx={{ mr: 1 }} />
                              <Chip label={`${(i * 150) + 400} cal`} size="small" color="primary" variant="outlined" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {i === 1 
                                ? 'Traditional mung bean and rice with digestive spices' 
                                : i === 2 
                                ? 'Cooling quinoa with fresh vegetables and herbs' 
                                : 'Warming lentil soup with root vegetables'}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                    
                    {/* Dinner Templates */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Restaurant sx={{ mr: 1, color: 'primary.main' }} />
                        Dinner Templates
                      </Typography>
                    </Grid>
                    {[1, 2, 3].map(i => (
                      <Grid item xs={12} sm={6} md={4} key={`dinner-${i}`}>
                        <Card variant="outlined">
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle2">
                                {i === 1 ? 'Light Vegetable Curry' : i === 2 ? 'Steamed Fish & Greens' : 'Millet & Vegetables'}
                              </Typography>
                              <IconButton size="small" color={i === 3 ? 'primary' : 'default'}>
                                {i === 3 ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                              </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', mb: 1 }}>
                              <Chip label={i === 1 ? 'Kapha' : i === 2 ? 'Pitta' : 'Vata'} size="small" sx={{ mr: 1 }} />
                              <Chip label={`${(i * 120) + 350} cal`} size="small" color="primary" variant="outlined" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {i === 1 
                                ? 'Light vegetable curry with minimal oil and spices' 
                                : i === 2 
                                ? 'Steamed white fish with seasonal greens' 
                                : 'Warm millet with ghee and steamed vegetables'}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
        
        {activeStep === 2 && (
          <>
            {/* Generate Plan Button */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center', mb: 3, borderRadius: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Psychology />}
                  onClick={generateDietPlan}
                  disabled={!selectedPatient || isLoading}
                  sx={{ px: 4, py: 1 }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Generating Diet Plan...
                    </>
                  ) : 'Generate AI Diet Plan'}
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Our AI will create a personalized diet plan based on the patient's dosha type and health conditions
                </Typography>
              </Paper>
            </Grid>

            {/* Diet Plan Generated View */}
            {generatedPlan ? (
              <>
                {/* Controls */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6">
                          {generatedPlan.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <ButtonGroup variant="outlined">
                            <Button
                              startIcon={<CalendarMonth />}
                              variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
                              onClick={() => setViewMode('calendar')}
                            >
                              Calendar
                            </Button>
                            <Button
                              startIcon={<ViewMode />}
                              variant={viewMode === 'list' ? 'contained' : 'outlined'}
                              onClick={() => setViewMode('list')}
                            >
                              List
                            </Button>
                          </ButtonGroup>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button
                            variant="outlined"
                            startIcon={<QueryStats />}
                            onClick={() => setOpenAnalysis(!openAnalysis)}
                          >
                            Analysis
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Autorenew />}
                            onClick={() => generateDietPlan()}
                          >
                            Regenerate
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                {/* Analysis Section */}
                <Grid item xs={12}>
                  <Collapse in={openAnalysis}>
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Diet Plan Analysis
                      </Typography>
                      
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" align="center" gutterBottom>
                            Dosha Balance Impact
                          </Typography>
                          <Box sx={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart outerRadius={90} data={doshaRadarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="Before" dataKey="B" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Radar name="After Plan" dataKey="A" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                <Legend />
                              </RadarChart>
                            </ResponsiveContainer>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" align="center" gutterBottom>
                            Nutritional Distribution
                          </Typography>
                          <Box sx={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={nutritionPieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  paddingAngle={5}
                                  dataKey="value"
                                  label
                                >
                                  {nutritionPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Legend />
                                <RechartsTooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" align="center" gutterBottom>
                            Compliance Metrics
                          </Typography>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2">
                              Ayurvedic Principles Compliance
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={92} 
                                  sx={{ 
                                    height: 10, 
                                    borderRadius: 5,
                                    backgroundColor: 'rgba(136, 132, 216, 0.2)',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: '#8884d8',
                                    }
                                  }}
                                />
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary">92%</Typography>
                              </Box>
                            </Box>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2">
                              Modern Nutrition Guidelines
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={88} 
                                  sx={{ 
                                    height: 10, 
                                    borderRadius: 5,
                                    backgroundColor: 'rgba(130, 202, 157, 0.2)',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: '#82ca9d',
                                    }
                                  }}
                                />
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary">88%</Typography>
                              </Box>
                            </Box>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2">
                              Patient Specific Adaptations
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={96} 
                                  sx={{ 
                                    height: 10, 
                                    borderRadius: 5,
                                    backgroundColor: 'rgba(255, 187, 40, 0.2)',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: '#FFBB28',
                                    }
                                  }}
                                />
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary">96%</Typography>
                              </Box>
                            </Box>
                          </Box>
                          
                          <Alert severity="success" sx={{ mt: 2 }}>
                            <Typography variant="body2">
                              This plan is optimally balanced for the patient's dosha type and health conditions
                            </Typography>
                          </Alert>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Collapse>
                </Grid>
                
                {/* Calendar View */}
                {viewMode === 'calendar' && (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Button 
                            startIcon={<ChevronLeft />} 
                            onClick={() => handleDateChange(-7)}
                          >
                            Previous Week
                          </Button>
                          <Typography variant="h6">
                            {calendarDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                          </Typography>
                          <Button 
                            endIcon={<ChevronRight />} 
                            onClick={() => handleDateChange(7)}
                          >
                            Next Week
                          </Button>
                        </Box>
                        
                        <Grid container spacing={2}>
                          {weekDays.map((day, index) => (
                            <Grid item xs={12} key={day}>
                              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  {day} - {new Date(calendarDate.getTime() + (index * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                                </Typography>
                                
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={3}>
                                    {renderMealCard(generatedPlan.meals[index].breakfast, 'Breakfast')}
                                  </Grid>
                                  <Grid item xs={12} md={3}>
                                    {renderMealCard(generatedPlan.meals[index].lunch, 'Lunch')}
                                  </Grid>
                                  <Grid item xs={12} md={3}>
                                    {renderMealCard(generatedPlan.meals[index].dinner, 'Dinner')}
                                  </Grid>
                                  <Grid item xs={12} md={3}>
                                    {generatedPlan.meals[index].snacks.length > 0 && 
                                      renderMealCard(generatedPlan.meals[index].snacks[0], 'Snack')}
                                  </Grid>
                                </Grid>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                {/* List View */}
                {viewMode === 'list' && (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => (
                          <Box key={mealType} sx={{ mb: 3 }}>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 2, 
                                mb: 2, 
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                cursor: 'pointer',
                                borderRadius: 2
                              }}
                              onClick={() => toggleMealType(mealType)}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                                  {mealType}
                                </Typography>
                                <IconButton size="small">
                                  {expandedMealTypes[mealType] ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                              </Box>
                            </Paper>
                            
                            <Collapse in={expandedMealTypes[mealType]}>
                              <Grid container spacing={2}>
                                {generatedPlan.meals.slice(0, 7).map((dailyMeal, index) => {
                                  const meal: Meal | null = mealType === 'snacks' ? 
                                    (dailyMeal.snacks && dailyMeal.snacks.length > 0 ? dailyMeal.snacks[0] : null) : 
                                    dailyMeal[mealType as keyof typeof dailyMeal] as Meal;
                                    
                                  if (!meal) return null;
                                  
                                  return (
                                    <Grid item xs={12} sm={6} md={4} key={`${mealType}-${index}`}>
                                      <Card variant="outlined">
                                        <CardContent>
                                          <Typography variant="subtitle2" gutterBottom>
                                            Day {index + 1} - {dailyMeal.date.toLocaleDateString()}
                                          </Typography>
                                          {renderMealCard(meal, mealType)}
                                        </CardContent>
                                      </Card>
                                    </Grid>
                                  );
                                })}
                              </Grid>
                            </Collapse>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!generatedPlan}
                    >
                      Next
                    </Button>
                  </Box>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Psychology sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Generate Your AI Diet Plan
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click the "Generate AI Diet Plan" button above to create a personalized diet plan
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button onClick={handleBack}>
                    Back
                  </Button>
                </Box>
              </Grid>
            )}
          </>
        )}
        
        {activeStep === 3 && (
          <>
            {/* Review & Export */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Diet Plan Summary
                  </Typography>
                  
                  {generatedPlan ? (
                    <>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {generatedPlan.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Personalized diet plan for {patientData?.name} based on their dosha type and health conditions.
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={3}>
                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                              <Typography variant="body2" color="text.secondary">Duration</Typography>
                              <Typography variant="h6">{duration.charAt(0).toUpperCase() + duration.slice(1)}</Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                              <Typography variant="body2" color="text.secondary">Daily Calories</Typography>
                              <Typography variant="h6">{generatedPlan.totalCalories} kcal</Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: 'rgba(136, 132, 216, 0.1)' }}>
                              <Typography variant="body2" color="text.secondary">Ayurvedic Score</Typography>
                              <Typography variant="h6">{generatedPlan.ayurvedicCompliance}%</Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: 'rgba(130, 202, 157, 0.1)' }}>
                              <Typography variant="body2" color="text.secondary">Nutrition Score</Typography>
                              <Typography variant="h6">{generatedPlan.modernNutritionCompliance}%</Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Box>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Typography variant="subtitle1" gutterBottom>
                        Sample Day Preview
                      </Typography>
                      
                      <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            Day 1 - {generatedPlan.meals[0].date.toLocaleDateString()}
                          </Typography>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={3}>
                              {renderMealCard(generatedPlan.meals[0].breakfast, 'Breakfast')}
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                              {renderMealCard(generatedPlan.meals[0].lunch, 'Lunch')}
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                              {renderMealCard(generatedPlan.meals[0].dinner, 'Dinner')}
                            </Grid>
                            <Grid item xs={12} md={6} lg={3}>
                              {generatedPlan.meals[0].snacks.length > 0 && 
                                renderMealCard(generatedPlan.meals[0].snacks[0], 'Snack')}
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <Typography variant="subtitle1" gutterBottom>
                        Key Recommendations
                      </Typography>
                      
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <WaterDrop color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Maintain Adequate Hydration" 
                            secondary="Drink 3-3.5 liters of water daily, preferably warm or room temperature"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <LocalFireDepartment sx={{ color: '#ff9800' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Follow Meal Timings" 
                            secondary="Eat meals at consistent times to support digestive fire (Agni)"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Spa sx={{ color: '#4caf50' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Mindful Eating Practices" 
                            secondary="Eat in a calm environment, focus on food, chew thoroughly"
                          />
                        </ListItem>
                      </List>
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        Please generate a diet plan first
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Export Options
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Export Format
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: 'primary.main',
                        }}
                      >
                        <Download sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="subtitle2">PDF</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          textAlign: 'center',
                          cursor: 'pointer',
                          opacity: 0.7,
                        }}
                      >
                        <Download sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="subtitle2">Excel</Typography>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Content Options
                  </Typography>
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Include nutrition information"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Include ayurvedic properties"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Include preparation instructions"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Include clinic branding"
                    sx={{ display: 'block', mb: 3 }}
                  />
                  
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Download />}
                    onClick={() => handleExport('pdf')}
                    disabled={!generatedPlan}
                    sx={{ mb: 2 }}
                  >
                    Export Diet Plan
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Share />}
                    onClick={handleShare}
                    disabled={!generatedPlan}
                  >
                    Share with Patient
                  </Button>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Patient Follow-up
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={!generatedPlan}
                  >
                    Schedule Follow-up
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    disabled={!generatedPlan}
                  >
                    Set Compliance Reminders
                  </Button>
                </CardContent>
              </Card>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    // Reset to beginning
                    setActiveStep(0);
                  }}
                >
                  Finish
                </Button>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
      
      {/* Edit Meal Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Meal
          <IconButton
            aria-label="close"
            onClick={() => setEditDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedMeal && (
            <Grid container spacing={3}>
              {/* Left Column - Food Selection */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Meal Details
                </Typography>
                
                <TextField
                  label="Meal Name"
                  value={selectedMeal.name}
                  onChange={(e) => setSelectedMeal({ ...selectedMeal, name: e.target.value })}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                
                <Box sx={{ mt: 2, mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Foods
                  </Typography>
                  
                  <Paper variant="outlined" sx={{ maxHeight: 250, overflow: 'auto', p: 1, bgcolor: 'background.default' }}>
                    <List dense disablePadding>
                      {selectedMeal.foods.map((food: FoodItem, index: number) => (
                        <ListItem 
                          key={index}
                          secondaryAction={
                            <IconButton edge="end" size="small" onClick={() => {
                              const newFoods = selectedMeal.foods.filter((_, i) => i !== index);
                              setSelectedMeal({ ...selectedMeal, foods: newFoods });
                            }}>
                              <Remove />
                            </IconButton>
                          }
                        >
                          <ListItemIcon>
                            <Restaurant fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={food.name}
                            secondary={
                              <Box component="span" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Typography variant="caption" component="span">{food.calories} cal</Typography>
                                <Typography variant="caption" component="span" color="text.secondary">•</Typography>
                                <Typography variant="caption" component="span">
                                  {food.ayurvedicProperties?.rasa ? food.ayurvedicProperties.rasa.join(', ') : 'N/A'}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Box>
                
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Add Foods
                  </Typography>
                  
                  <Autocomplete
                    options={mockFoodDatabase || []}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2">{option.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.calories} cal • {option.category} • 
                            {option.ayurvedicProperties.rasa.join(', ')}
                          </Typography>
                        </Box>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Search foods" size="small" />
                    )}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setSelectedMeal({ 
                          ...selectedMeal, 
                          foods: [...selectedMeal.foods, newValue] 
                        });
                      }
                    }}
                    sx={{ mb: 2 }}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label="Vata-pacifying" 
                      onClick={() => {
                        const vataFoods = mockFoodDatabase.filter(
                          food => food.ayurvedicProperties.doshaImpact.vata < 0
                        );
                        if (vataFoods.length) {
                          const randomFood = vataFoods[Math.floor(Math.random() * vataFoods.length)];
                          setSelectedMeal({ ...selectedMeal, foods: [...selectedMeal.foods, randomFood] });
                        }
                      }}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip 
                      label="Pitta-pacifying" 
                      onClick={() => {
                        const pittaFoods = mockFoodDatabase.filter(
                          food => food.ayurvedicProperties.doshaImpact.pitta < 0
                        );
                        if (pittaFoods.length) {
                          const randomFood = pittaFoods[Math.floor(Math.random() * pittaFoods.length)];
                          setSelectedMeal({ ...selectedMeal, foods: [...selectedMeal.foods, randomFood] });
                        }
                      }}
                      color="secondary"
                      variant="outlined"
                    />
                    <Chip 
                      label="Kapha-pacifying" 
                      onClick={() => {
                        const kaphaFoods = mockFoodDatabase.filter(
                          food => food.ayurvedicProperties.doshaImpact.kapha < 0
                        );
                        if (kaphaFoods.length) {
                          const randomFood = kaphaFoods[Math.floor(Math.random() * kaphaFoods.length)];
                          setSelectedMeal({ ...selectedMeal, foods: [...selectedMeal.foods, randomFood] });
                        }
                      }}
                      color="info"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                
                <TextField
                  label="Preparation Instructions"
                  value={selectedMeal.instructions || ''}
                  onChange={(e) => setSelectedMeal({ ...selectedMeal, instructions: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
              
              {/* Right Column - Nutritional Analysis */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Nutritional Analysis
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Total Calories</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {selectedMeal.foods.reduce((sum, food) => sum + food.calories, 0)} kcal
                    </Typography>
                  </Box>
                  
                  <Box sx={{ height: 15, bgcolor: 'background.default', borderRadius: 5, mb: 2 }}>
                    <Box 
                      sx={{ 
                        height: '100%', 
                        width: '70%',
                        bgcolor: 'primary.main',
                        borderRadius: 5
                      }}
                    />
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Protein
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {selectedMeal.foods.reduce((sum, food) => sum + food.protein, 0).toFixed(1)}g
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Carbs
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {selectedMeal.foods.reduce((sum, food) => sum + food.carbs, 0).toFixed(1)}g
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Fats
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {selectedMeal.foods.reduce((sum, food) => sum + food.fats, 0).toFixed(1)}g
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box sx={{ height: 180, mb: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { 
                            name: 'Protein', 
                            value: selectedMeal.foods.reduce((sum, food) => sum + food.protein, 0) * 4
                          },
                          { 
                            name: 'Carbs', 
                            value: selectedMeal.foods.reduce((sum, food) => sum + food.carbs, 0) * 4
                          },
                          { 
                            name: 'Fats', 
                            value: selectedMeal.foods.reduce((sum, food) => sum + food.fats, 0) * 9
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#00C49F" />
                        <Cell fill="#FFBB28" />
                      </Pie>
                      <Legend />
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  Ayurvedic Properties
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Predominant Tastes</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {['Sweet', 'Sour', 'Salty', 'Pungent', 'Bitter', 'Astringent'].map(taste => {
                      // Count how many foods have this taste
                      const count = selectedMeal.foods.filter(
                        food => food.ayurvedicProperties?.rasa?.includes(taste)
                      ).length;
                      
                      return (
                        <Chip 
                          key={taste}
                          label={taste}
                          size="small"
                          variant={count > 0 ? "filled" : "outlined"}
                          color={count > 0 ? "primary" : "default"}
                          sx={{ opacity: count > 0 ? 1 : 0.5 }}
                        />
                      );
                    })}
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="body2" gutterBottom>Dosha Impact</Typography>
                  
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Vata
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          {selectedMeal.foods.reduce((sum, food) => sum + (food.ayurvedicProperties?.doshaImpact?.vata || 0), 0) < 0 ? (
                            <TrendingDown color="success" fontSize="small" />
                          ) : selectedMeal.foods.reduce((sum, food) => sum + (food.ayurvedicProperties?.doshaImpact?.vata || 0), 0) > 0 ? (
                            <TrendingUp color="error" fontSize="small" />
                          ) : (
                            <Remove color="action" fontSize="small" />
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Pitta
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          {selectedMeal.foods.reduce((sum, food) => sum + (food.ayurvedicProperties?.doshaImpact?.pitta || 0), 0) < 0 ? (
                            <TrendingDown color="success" fontSize="small" />
                          ) : selectedMeal.foods.reduce((sum, food) => sum + (food.ayurvedicProperties?.doshaImpact?.pitta || 0), 0) > 0 ? (
                            <TrendingUp color="error" fontSize="small" />
                          ) : (
                            <Remove color="action" fontSize="small" />
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Kapha
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          {selectedMeal.foods.reduce((sum, food) => sum + (food.ayurvedicProperties?.doshaImpact?.kapha || 0), 0) < 0 ? (
                            <TrendingDown color="success" fontSize="small" />
                          ) : selectedMeal.foods.reduce((sum, food) => sum + (food.ayurvedicProperties?.doshaImpact?.kapha || 0), 0) > 0 ? (
                            <TrendingUp color="error" fontSize="small" />
                          ) : (
                            <Remove color="action" fontSize="small" />
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', px: 1 }}>
            <Button startIcon={<Star />} onClick={() => {}}>
              Save as Template
            </Button>
            <Box>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSaveChanges} startIcon={<Save />}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DietPlanGenerator;
