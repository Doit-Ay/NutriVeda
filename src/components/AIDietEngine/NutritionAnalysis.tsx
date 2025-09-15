import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Button,
  ButtonGroup,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Divider,
  useTheme
} from '@mui/material';
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
  Radar,
  LineChart,
  Line
} from 'recharts';
import { DietPlan, DailyMeal, Meal } from '../../types';

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
      id={`nutrition-tabpanel-${index}`}
      aria-labelledby={`nutrition-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

interface NutritionAnalysisProps {
  dietPlan: DietPlan;
}

const NutritionAnalysis: React.FC<NutritionAnalysisProps> = ({ dietPlan }) => {
  const [tabValue, setTabValue] = useState(0);
  const [chartView, setChartView] = useState<'daily' | 'weekly' | 'summary'>('summary');
  const [showDetailed, setShowDetailed] = useState(false);
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Calculate average daily nutrition values
  const calculateNutritionSummary = () => {
    const totalMeals = dietPlan.meals.length;
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let totalFiber = 0;

    dietPlan.meals.forEach(dailyMeal => {
      // Add breakfast, lunch, dinner
      totalCalories += dailyMeal.breakfast.totalCalories + dailyMeal.lunch.totalCalories + dailyMeal.dinner.totalCalories;
      totalProtein += dailyMeal.breakfast.totalProtein + dailyMeal.lunch.totalProtein + dailyMeal.dinner.totalProtein;
      totalCarbs += dailyMeal.breakfast.totalCarbs + dailyMeal.lunch.totalCarbs + dailyMeal.dinner.totalCarbs;
      totalFats += dailyMeal.breakfast.totalFats + dailyMeal.lunch.totalFats + dailyMeal.dinner.totalFats;
      
      // Add snacks if available
      if (dailyMeal.snacks.length > 0) {
        dailyMeal.snacks.forEach(snack => {
          totalCalories += snack.totalCalories;
          totalProtein += snack.totalProtein;
          totalCarbs += snack.totalCarbs;
          totalFats += snack.totalFats;
        });
      }
    });

    return {
      avgCalories: totalCalories / totalMeals,
      avgProtein: totalProtein / totalMeals,
      avgCarbs: totalCarbs / totalMeals,
      avgFats: totalFats / totalMeals,
      proteinPercentage: (totalProtein * 4 / (totalCalories)) * 100,
      carbsPercentage: (totalCarbs * 4 / (totalCalories)) * 100,
      fatsPercentage: (totalFats * 9 / (totalCalories)) * 100,
    };
  };

  // Get macro distribution data for pie chart
  const getMacroData = () => {
    const summary = calculateNutritionSummary();
    return [
      { name: 'Protein', value: Math.round(summary.proteinPercentage), color: '#0088FE' },
      { name: 'Carbs', value: Math.round(summary.carbsPercentage), color: '#00C49F' },
      { name: 'Fats', value: Math.round(summary.fatsPercentage), color: '#FFBB28' },
    ];
  };

  // Get daily calorie data
  const getDailyCalorieData = () => {
    return dietPlan.meals.slice(0, 7).map((dailyMeal, index) => {
      const totalCalories = dailyMeal.breakfast.totalCalories + dailyMeal.lunch.totalCalories + 
        dailyMeal.dinner.totalCalories + 
        dailyMeal.snacks.reduce((sum, snack) => sum + snack.totalCalories, 0);
      
      return {
        name: `Day ${index + 1}`,
        calories: totalCalories,
      };
    });
  };

  // Get daily macro breakdown
  const getDailyMacroData = () => {
    return dietPlan.meals.slice(0, 7).map((dailyMeal, index) => {
      const breakfast = dailyMeal.breakfast;
      const lunch = dailyMeal.lunch;
      const dinner = dailyMeal.dinner;
      const snacks = dailyMeal.snacks;
      
      const totalProtein = breakfast.totalProtein + lunch.totalProtein + dinner.totalProtein +
        snacks.reduce((sum, snack) => sum + snack.totalProtein, 0);
        
      const totalCarbs = breakfast.totalCarbs + lunch.totalCarbs + dinner.totalCarbs +
        snacks.reduce((sum, snack) => sum + snack.totalCarbs, 0);
        
      const totalFats = breakfast.totalFats + lunch.totalFats + dinner.totalFats +
        snacks.reduce((sum, snack) => sum + snack.totalFats, 0);
      
      return {
        name: `Day ${index + 1}`,
        protein: totalProtein,
        carbs: totalCarbs,
        fats: totalFats,
      };
    });
  };

  // Get meal distribution data
  const getMealDistributionData = () => {
    let breakfastTotal = 0;
    let lunchTotal = 0;
    let dinnerTotal = 0;
    let snacksTotal = 0;
    
    dietPlan.meals.forEach(dailyMeal => {
      breakfastTotal += dailyMeal.breakfast.totalCalories;
      lunchTotal += dailyMeal.lunch.totalCalories;
      dinnerTotal += dailyMeal.dinner.totalCalories;
      snacksTotal += dailyMeal.snacks.reduce((sum, snack) => sum + snack.totalCalories, 0);
    });
    
    const total = breakfastTotal + lunchTotal + dinnerTotal + snacksTotal;
    
    return [
      { name: 'Breakfast', value: Math.round((breakfastTotal / total) * 100), color: '#4caf50' },
      { name: 'Lunch', value: Math.round((lunchTotal / total) * 100), color: '#ff9800' },
      { name: 'Dinner', value: Math.round((dinnerTotal / total) * 100), color: '#2196f3' },
      { name: 'Snacks', value: Math.round((snacksTotal / total) * 100), color: '#9c27b0' },
    ];
  };

  // Get dosha impact data for radar chart
  const getDoshaImpactData = () => {
    // This is simplified - in a real app you'd calculate this from the food items
    return [
      { subject: 'Vata', value: 70, fullMark: 100 },
      { subject: 'Pitta', value: 45, fullMark: 100 },
      { subject: 'Kapha', value: 60, fullMark: 100 },
    ];
  };

  const macroData = getMacroData();
  const mealDistribution = getMealDistributionData();
  const dailyCalorieData = getDailyCalorieData();
  const dailyMacroData = getDailyMacroData();
  const doshaImpact = getDoshaImpactData();
  const nutritionSummary = calculateNutritionSummary();

  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Nutritional Analysis</Typography>
            <ButtonGroup variant="outlined" size="small">
              <Button 
                variant={chartView === 'summary' ? 'contained' : 'outlined'} 
                onClick={() => setChartView('summary')}
              >
                Summary
              </Button>
              <Button 
                variant={chartView === 'daily' ? 'contained' : 'outlined'} 
                onClick={() => setChartView('daily')}
              >
                Daily
              </Button>
              <Button 
                variant={chartView === 'weekly' ? 'contained' : 'outlined'} 
                onClick={() => setChartView('weekly')}
              >
                Weekly
              </Button>
            </ButtonGroup>
          </Box>
          
          <FormControlLabel
            control={<Switch checked={showDetailed} onChange={() => setShowDetailed(!showDetailed)} />}
            label="Show Detailed Analysis"
            sx={{ mb: 2 }}
          />
          
          {chartView === 'summary' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    Macro Distribution
                  </Typography>
                  <Box sx={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" align="center">
                      Daily Average: {Math.round(nutritionSummary.avgCalories)} calories
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
                      Protein: {Math.round(nutritionSummary.avgProtein)}g • 
                      Carbs: {Math.round(nutritionSummary.avgCarbs)}g • 
                      Fats: {Math.round(nutritionSummary.avgFats)}g
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    Meal Calorie Distribution
                  </Typography>
                  <Box sx={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mealDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {mealDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" align="center">
                      Recommended meal distribution
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
                      Breakfast: 25% • Lunch: 40% • Dinner: 25% • Snacks: 10%
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    Ayurvedic Dosha Impact
                  </Typography>
                  <Box sx={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius={80} data={doshaImpact}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar
                          name="Dosha Impact"
                          dataKey="value"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <RechartsTooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" align="center">
                      Diet plan balances all three doshas
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
                      Focus on pacifying Vata dosha
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              {showDetailed && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Detailed Nutrient Analysis
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                        <Tab label="Macronutrients" />
                        <Tab label="Micronutrients" />
                        <Tab label="Ayurvedic Properties" />
                      </Tabs>
                      
                      <TabPanel value={tabValue} index={0}>
                        <Box sx={{ height: 300 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={dailyMacroData}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <RechartsTooltip />
                              <Legend />
                              <Bar dataKey="protein" name="Protein (g)" fill="#0088FE" />
                              <Bar dataKey="carbs" name="Carbs (g)" fill="#00C49F" />
                              <Bar dataKey="fats" name="Fats (g)" fill="#FFBB28" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </TabPanel>
                      
                      <TabPanel value={tabValue} index={1}>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Detailed micronutrient data will be available in the full version.
                          </Typography>
                        </Box>
                      </TabPanel>
                      
                      <TabPanel value={tabValue} index={2}>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Detailed Ayurvedic analysis will be available in the full version.
                          </Typography>
                        </Box>
                      </TabPanel>
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
          )}
          
          {chartView === 'daily' && (
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyCalorieData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="calories" name="Calories" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
          
          {chartView === 'weekly' && (
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyCalorieData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    name="Daily Calories" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NutritionAnalysis;