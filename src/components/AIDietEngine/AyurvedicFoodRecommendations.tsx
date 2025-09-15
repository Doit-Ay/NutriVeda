import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Spa,
  LocalFireDepartment,
  WaterDrop,
  Restaurant,
  Add,
  Check,
  InfoOutlined,
  Star,
  StarBorder
} from '@mui/icons-material';
import { FoodItem } from '../../types';

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
      id={`dosha-tabpanel-${index}`}
      aria-labelledby={`dosha-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

interface AyurvedicFoodRecommendationsProps {
  dominantDosha?: 'vata' | 'pitta' | 'kapha' | 'balanced';
  patientConditions?: string[];
  foods: FoodItem[];
  onAddFood: (food: FoodItem) => void;
}

const AyurvedicFoodRecommendations: React.FC<AyurvedicFoodRecommendationsProps> = ({
  dominantDosha = 'balanced',
  patientConditions = [],
  foods,
  onAddFood
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const theme = useTheme();
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const toggleFavorite = (foodId: string) => {
    if (favorites.includes(foodId)) {
      setFavorites(favorites.filter(id => id !== foodId));
    } else {
      setFavorites([...favorites, foodId]);
    }
  };
  
  // Get dosha color
  const getDoshaColor = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case 'vata':
        return theme.palette.mode === 'dark' ? '#9c27b0' : '#7b1fa2';
      case 'pitta':
        return theme.palette.mode === 'dark' ? '#ff9800' : '#ef6c00';
      case 'kapha':
        return theme.palette.mode === 'dark' ? '#2196f3' : '#1976d2';
      default:
        return theme.palette.primary.main;
    }
  };
  
  // Filter foods based on selected dosha and tab
  const getFilteredFoods = () => {
    let filteredFoods = [...foods];
    
    // First filter by dosha impact if specified
    if (dominantDosha !== 'balanced') {
      filteredFoods = filteredFoods.filter(food => 
        food.ayurvedicProperties.doshaImpact[dominantDosha] <= 0
      );
    }
    
    // Then filter based on selected tab
    switch (tabValue) {
      case 0: // All
        return filteredFoods;
      case 1: // Grains
        return filteredFoods.filter(food => food.category === 'Grains');
      case 2: // Vegetables
        return filteredFoods.filter(food => food.category === 'Vegetables');
      case 3: // Fruits
        return filteredFoods.filter(food => food.category === 'Fruits');
      case 4: // Proteins
        return filteredFoods.filter(food => 
          food.category === 'Proteins' || 
          food.category === 'Legumes' || 
          food.category === 'Nuts & Seeds'
        );
      case 5: // Spices
        return filteredFoods.filter(food => food.category === 'Spices');
      default:
        return filteredFoods;
    }
  };
  
  // Group foods by category
  const getFoodsByCategory = () => {
    const filteredFoods = getFilteredFoods();
    const categories: Record<string, FoodItem[]> = {};
    
    filteredFoods.forEach(food => {
      if (!categories[food.category]) {
        categories[food.category] = [];
      }
      categories[food.category].push(food);
    });
    
    return categories;
  };
  
  // Check if a food is recommended for patient's conditions
  const isRecommendedForConditions = (food: FoodItem) => {
    if (patientConditions.length === 0) return false;
    
    // Check if any of the food benefits address the patient's conditions
    return food.benefits.some(benefit => 
      patientConditions.some(condition => 
        benefit.toLowerCase().includes(condition.toLowerCase())
      )
    );
  };

  const filteredFoods = getFilteredFoods();
  const foodsByCategory = getFoodsByCategory();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <Spa sx={{ mr: 1, color: getDoshaColor(dominantDosha) }} />
            Ayurvedic Food Recommendations
          </Typography>
          
          {dominantDosha !== 'balanced' && (
            <Chip 
              label={`${dominantDosha.charAt(0).toUpperCase() + dominantDosha.slice(1)}-balancing`} 
              color="primary"
              sx={{ bgcolor: getDoshaColor(dominantDosha) }}
            />
          )}
        </Box>
        
        <Typography variant="body2" paragraph>
          {dominantDosha === 'vata' && 
            "Foods that are warming, grounding, and moistening help balance Vata dosha. Favor sweet, sour, and salty tastes."}
          {dominantDosha === 'pitta' && 
            "Foods that are cooling, soothing, and not too spicy help balance Pitta dosha. Favor sweet, bitter, and astringent tastes."}
          {dominantDosha === 'kapha' && 
            "Foods that are warming, light, and dry help balance Kapha dosha. Favor pungent, bitter, and astringent tastes."}
          {dominantDosha === 'balanced' && 
            "A balanced tri-doshic diet includes foods from all six tastes - sweet, sour, salty, pungent, bitter, and astringent."}
        </Typography>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All" />
          <Tab label="Grains" />
          <Tab label="Vegetables" />
          <Tab label="Fruits" />
          <Tab label="Proteins" />
          <Tab label="Spices" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {Object.keys(foodsByCategory).map(category => (
              <Grid item xs={12} key={category}>
                <Typography variant="subtitle1" sx={{ mb: 1, pb: 0.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {category}
                </Typography>
                <Grid container spacing={2}>
                  {foodsByCategory[category].map(food => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={food.id}>
                      <Paper 
                        elevation={0} 
                        variant="outlined"
                        sx={{ 
                          p: 2,
                          height: '100%',
                          position: 'relative',
                          borderColor: isRecommendedForConditions(food) ? 'success.main' : undefined,
                          bgcolor: isRecommendedForConditions(food) ? 
                            theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)' : 
                            undefined
                        }}
                      >
                        {isRecommendedForConditions(food) && (
                          <Tooltip title="Recommended for patient's conditions">
                            <Chip 
                              label="Recommended" 
                              color="success" 
                              size="small"
                              sx={{ 
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                fontSize: '0.7rem'
                              }}
                            />
                          </Tooltip>
                        )}
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2">
                            {food.name}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => toggleFavorite(food.id)}
                            sx={{ ml: 1 }}
                          >
                            {favorites.includes(food.id) ? 
                              <Star fontSize="small" color="warning" /> : 
                              <StarBorder fontSize="small" />}
                          </IconButton>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                          <Chip 
                            label={`${food.calories} cal`} 
                            size="small" 
                            variant="outlined"
                          />
                          {food.ayurvedicProperties.rasa.slice(0, 2).map(taste => (
                            <Chip 
                              key={taste} 
                              label={taste} 
                              size="small" 
                              variant="outlined"
                            />
                          ))}
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Tooltip title={`Impact on Vata: ${food.ayurvedicProperties.doshaImpact.vata < 0 ? 'Decreases' : food.ayurvedicProperties.doshaImpact.vata > 0 ? 'Increases' : 'Neutral'}`}>
                            <Box>
                              <Avatar 
                                sx={{ 
                                  width: 24, 
                                  height: 24, 
                                  bgcolor: getDoshaColor('vata'),
                                  fontSize: '0.8rem',
                                  opacity: food.ayurvedicProperties.doshaImpact.vata < 0 ? 1 : 0.5
                                }}
                              >
                                V
                              </Avatar>
                            </Box>
                          </Tooltip>
                          
                          <Tooltip title={`Impact on Pitta: ${food.ayurvedicProperties.doshaImpact.pitta < 0 ? 'Decreases' : food.ayurvedicProperties.doshaImpact.pitta > 0 ? 'Increases' : 'Neutral'}`}>
                            <Box>
                              <Avatar 
                                sx={{ 
                                  width: 24, 
                                  height: 24, 
                                  bgcolor: getDoshaColor('pitta'),
                                  fontSize: '0.8rem',
                                  opacity: food.ayurvedicProperties.doshaImpact.pitta < 0 ? 1 : 0.5
                                }}
                              >
                                P
                              </Avatar>
                            </Box>
                          </Tooltip>
                          
                          <Tooltip title={`Impact on Kapha: ${food.ayurvedicProperties.doshaImpact.kapha < 0 ? 'Decreases' : food.ayurvedicProperties.doshaImpact.kapha > 0 ? 'Increases' : 'Neutral'}`}>
                            <Box>
                              <Avatar 
                                sx={{ 
                                  width: 24, 
                                  height: 24, 
                                  bgcolor: getDoshaColor('kapha'),
                                  fontSize: '0.8rem',
                                  opacity: food.ayurvedicProperties.doshaImpact.kapha < 0 ? 1 : 0.5
                                }}
                              >
                                K
                              </Avatar>
                            </Box>
                          </Tooltip>
                        </Box>
                        
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Add />}
                          onClick={() => onAddFood(food)}
                          fullWidth
                        >
                          Add to Meal
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        
        {[1, 2, 3, 4, 5].map(tabIndex => (
          <TabPanel value={tabValue} index={tabIndex} key={tabIndex}>
            <Grid container spacing={2}>
              {filteredFoods.map(food => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={food.id}>
                  <Paper 
                    elevation={0} 
                    variant="outlined"
                    sx={{ 
                      p: 2,
                      position: 'relative',
                      borderColor: isRecommendedForConditions(food) ? 'success.main' : undefined,
                      bgcolor: isRecommendedForConditions(food) ? 
                        theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)' : 
                        undefined
                    }}
                  >
                    {isRecommendedForConditions(food) && (
                      <Tooltip title="Recommended for patient's conditions">
                        <Chip 
                          label="Recommended" 
                          color="success" 
                          size="small"
                          sx={{ 
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontSize: '0.7rem'
                          }}
                        />
                      </Tooltip>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2">
                        {food.name}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => toggleFavorite(food.id)}
                        sx={{ ml: 1 }}
                      >
                        {favorites.includes(food.id) ? 
                          <Star fontSize="small" color="warning" /> : 
                          <StarBorder fontSize="small" />}
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                      <Chip 
                        label={`${food.calories} cal`} 
                        size="small" 
                        variant="outlined"
                      />
                      {food.ayurvedicProperties.rasa.slice(0, 2).map(taste => (
                        <Chip 
                          key={taste} 
                          label={taste} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Tooltip title={`Impact on Vata: ${food.ayurvedicProperties.doshaImpact.vata < 0 ? 'Decreases' : food.ayurvedicProperties.doshaImpact.vata > 0 ? 'Increases' : 'Neutral'}`}>
                        <Box>
                          <Avatar 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              bgcolor: getDoshaColor('vata'),
                              fontSize: '0.8rem',
                              opacity: food.ayurvedicProperties.doshaImpact.vata < 0 ? 1 : 0.5
                            }}
                          >
                            V
                          </Avatar>
                        </Box>
                      </Tooltip>
                      
                      <Tooltip title={`Impact on Pitta: ${food.ayurvedicProperties.doshaImpact.pitta < 0 ? 'Decreases' : food.ayurvedicProperties.doshaImpact.pitta > 0 ? 'Increases' : 'Neutral'}`}>
                        <Box>
                          <Avatar 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              bgcolor: getDoshaColor('pitta'),
                              fontSize: '0.8rem',
                              opacity: food.ayurvedicProperties.doshaImpact.pitta < 0 ? 1 : 0.5
                            }}
                          >
                            P
                          </Avatar>
                        </Box>
                      </Tooltip>
                      
                      <Tooltip title={`Impact on Kapha: ${food.ayurvedicProperties.doshaImpact.kapha < 0 ? 'Decreases' : food.ayurvedicProperties.doshaImpact.kapha > 0 ? 'Increases' : 'Neutral'}`}>
                        <Box>
                          <Avatar 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              bgcolor: getDoshaColor('kapha'),
                              fontSize: '0.8rem',
                              opacity: food.ayurvedicProperties.doshaImpact.kapha < 0 ? 1 : 0.5
                            }}
                          >
                            K
                          </Avatar>
                        </Box>
                      </Tooltip>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => onAddFood(food)}
                      fullWidth
                    >
                      Add to Meal
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        ))}
      </CardContent>
    </Card>
  );
};

export default AyurvedicFoodRecommendations;