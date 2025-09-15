import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Recipe, FoodItem } from '../../types';

interface RecipeDataVisualizationsProps {
  recipe: Recipe;
  foodItems?: FoodItem[];
}

export const RecipeDataVisualizations: React.FC<RecipeDataVisualizationsProps> = ({ 
  recipe,
  foodItems = [] 
}) => {
  const theme = useTheme();

  // Calculate estimated nutritional content based on ingredients and food items
  const calculateNutrition = () => {
    // In a real app, this would use the foodItems to calculate nutrition
    // For now, we'll generate some sample data
    return {
      calories: 450,
      protein: 15,
      carbs: 60,
      fats: 12,
      fiber: 8
    };
  };

  const nutrition = calculateNutrition();

  // Data for Dosha Impact Radar Chart
  const doshaRadarData = [
    {
      attribute: 'Vata',
      value: recipe.ayurvedicDosha.vata ? 
        recipe.ayurvedicProperties.doshaImpact.vata * 20 + 60 : 30,
    },
    {
      attribute: 'Pitta',
      value: recipe.ayurvedicDosha.pitta ? 
        recipe.ayurvedicProperties.doshaImpact.pitta * 20 + 60 : 30,
    },
    {
      attribute: 'Kapha',
      value: recipe.ayurvedicDosha.kapha ? 
        recipe.ayurvedicProperties.doshaImpact.kapha * 20 + 60 : 30,
    },
  ];

  // Data for Nutrition Bar Chart
  const nutritionData = [
    { name: 'Protein', value: nutrition.protein, fill: '#8884d8' },
    { name: 'Carbs', value: nutrition.carbs, fill: '#82ca9d' },
    { name: 'Fats', value: nutrition.fats, fill: '#ffc658' },
    { name: 'Fiber', value: nutrition.fiber, fill: '#ff8042' },
  ];

  // Data for Taste (Rasa) Pie Chart
  const rasaPieData = [
    { name: 'Sweet', value: recipe.ayurvedicProperties.rasa.includes('Sweet') ? 1 : 0, color: '#FF8A65' },
    { name: 'Sour', value: recipe.ayurvedicProperties.rasa.includes('Sour') ? 1 : 0, color: '#FFD54F' },
    { name: 'Salty', value: recipe.ayurvedicProperties.rasa.includes('Salty') ? 1 : 0, color: '#81C784' },
    { name: 'Pungent', value: recipe.ayurvedicProperties.rasa.includes('Pungent') ? 1 : 0, color: '#4FC3F7' },
    { name: 'Bitter', value: recipe.ayurvedicProperties.rasa.includes('Bitter') ? 1 : 0, color: '#9575CD' },
    { name: 'Astringent', value: recipe.ayurvedicProperties.rasa.includes('Astringent') ? 1 : 0, color: '#F06292' },
  ].filter(item => item.value > 0);

  // Preparation and cooking time visualization
  const timeData = [
    { name: 'Prep Time', time: recipe.prepTime },
    { name: 'Cook Time', time: recipe.cookTime },
  ];

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Recipe Analytics & Insights
      </Typography>

      <Grid container spacing={3}>
        {/* Dosha Impact Radar Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Dosha Impact
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={doshaRadarData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="attribute" tick={{ fill: theme.palette.text.primary }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Dosha Balance"
                      dataKey="value"
                      stroke={theme.palette.primary.main}
                      fill={theme.palette.primary.main}
                      fillOpacity={0.5}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, gap: 1 }}>
                {recipe.ayurvedicDosha.vata && <Chip label="Vata" color="info" size="small" />}
                {recipe.ayurvedicDosha.pitta && <Chip label="Pitta" color="warning" size="small" />}
                {recipe.ayurvedicDosha.kapha && <Chip label="Kapha" color="success" size="small" />}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Nutrition Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Nutritional Content
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={nutritionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}g`, 'Amount']} />
                    <Legend />
                    <Bar dataKey="value" name="Grams" fill={theme.palette.secondary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Estimated {nutrition.calories} calories per serving
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Taste (Rasa) Distribution */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Taste (Rasa) Distribution
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={rasaPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {rasaPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 1 }}>
                  {recipe.ayurvedicProperties.rasa.map((taste) => (
                    <Chip key={taste} label={taste} size="small" />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Preparation Time Visualization */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Preparation & Cooking Time
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={timeData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" unit=" min" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`${value} minutes`, 'Time']} />
                    <Legend />
                    <Bar dataKey="time" fill={theme.palette.info.main} name="Minutes" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" fontWeight={500}>
                  Total Time: {recipe.prepTime + recipe.cookTime} minutes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Ayurvedic Properties Summary */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Ayurvedic Properties Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Taste (Rasa)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {recipe.ayurvedicProperties.rasa.map((taste) => (
                        <Chip key={taste} label={taste} size="small" />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Qualities (Guna)
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {recipe.ayurvedicProperties.guna.map((quality) => (
                        <Chip key={quality} label={quality} size="small" />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Energy (Virya)
                    </Typography>
                    <Chip 
                      label={recipe.ayurvedicProperties.virya} 
                      size="small"
                      color={recipe.ayurvedicProperties.virya === 'Heating' ? 'warning' : 'info'} 
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Post-Digestive (Vipaka)
                    </Typography>
                    <Chip label={recipe.ayurvedicProperties.vipaka} size="small" />
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeDataVisualizations;