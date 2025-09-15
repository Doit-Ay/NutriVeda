
import React, { useState, useMemo } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Badge,
  Paper,
  Container,
  Typography,
  LinearProgress,
  Fade,
  Divider,
  useTheme,
  useMediaQuery,
  Grid
} from '@mui/material';
import { 
  Restaurant as FoodIcon,
  ViewModule as CardIcon,
  ViewList as TableIcon,
  Assessment as AnalyticsIcon,
  Compare as CompareIcon
} from '@mui/icons-material';
import { mockFoodDatabase } from '../../data/mockData';
import { FoodItem } from '../../types';
import FoodToolbar from './FoodToolbar';
import FoodCardView from './FoodCardView';
import FoodTableView from './FoodTableView';
import FoodAnalytics from './FoodAnalytics';
import FoodDialog from './FoodDialog';

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
      id={`food-tabpanel-${index}`}
      aria-labelledby={`food-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const FoodDatabase: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [foods, setFoods] = useState<FoodItem[]>(mockFoodDatabase);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDosha, setSelectedDosha] = useState('all');
  const [nutritionFilter, setNutritionFilter] = useState<{ [key: string]: [number, number] }>({
    calories: [0, 1000],
    protein: [0, 100],
    carbs: [0, 100],
    fats: [0, 100]
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [foodsToCompare, setFoodsToCompare] = useState<FoodItem[]>([]);
  
  const categories = ['all', ...Array.from(new Set(foods.map(f => f.category)))];
  const doshas = ['all', 'Vata', 'Pitta', 'Kapha', 'Tridoshic'];

  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      // Search term matching
      const matchesSearch = !searchTerm || 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (food.benefits && food.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (food.ayurvedicProperties.rasa && food.ayurvedicProperties.rasa.some(rasa => rasa.toLowerCase().includes(searchTerm.toLowerCase())));
      
      // Category filtering
      const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
      
      // Dosha impact filtering
      const matchesDosha = selectedDosha === 'all' || 
        (selectedDosha === 'Vata' && food.ayurvedicProperties.doshaImpact.vata < 0) ||
        (selectedDosha === 'Pitta' && food.ayurvedicProperties.doshaImpact.pitta < 0) ||
        (selectedDosha === 'Kapha' && food.ayurvedicProperties.doshaImpact.kapha < 0) ||
        (selectedDosha === 'Tridoshic' && 
          food.ayurvedicProperties.doshaImpact.vata >= 0 && 
          food.ayurvedicProperties.doshaImpact.pitta >= 0 && 
          food.ayurvedicProperties.doshaImpact.kapha >= 0);
      
      // Nutrition filtering
      const matchesNutrition = 
        food.calories >= nutritionFilter.calories[0] && food.calories <= nutritionFilter.calories[1] &&
        food.protein >= nutritionFilter.protein[0] && food.protein <= nutritionFilter.protein[1] &&
        food.carbs >= nutritionFilter.carbs[0] && food.carbs <= nutritionFilter.carbs[1] &&
        food.fats >= nutritionFilter.fats[0] && food.fats <= nutritionFilter.fats[1];
      
      return matchesSearch && matchesCategory && matchesDosha && matchesNutrition;
    });
  }, [foods, searchTerm, selectedCategory, selectedDosha, nutritionFilter]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    
    // Exit compare mode when switching tabs
    if (compareMode && newValue !== 0) {
      setCompareMode(false);
      setFoodsToCompare([]);
    }
  };

  const handleOpenDialog = (food?: FoodItem) => {
    setSelectedFood(food || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFood(null);
  };

  const handleDelete = (foodToDelete: FoodItem) => {
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setFoods(foods.filter(food => food.id !== foodToDelete.id));
      // Also remove from comparison if present
      if (foodsToCompare.some(f => f.id === foodToDelete.id)) {
        setFoodsToCompare(foodsToCompare.filter(f => f.id !== foodToDelete.id));
      }
      setLoading(false);
    }, 500);
  };

  const handleSaveFood = (newFood: FoodItem) => {
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      if (newFood.id) {
        // Update existing food
        setFoods(foods.map(f => f.id === newFood.id ? newFood : f));
      } else {
        // Add new food with generated ID
        const foodWithId = { ...newFood, id: `f-${Date.now()}` };
        setFoods([...foods, foodWithId]);
      }
      setLoading(false);
      handleCloseDialog();
    }, 800);
  };

  const handleNutritionFilterChange = (nutrient: string, range: [number, number]) => {
    setNutritionFilter(prev => ({
      ...prev,
      [nutrient]: range
    }));
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (compareMode) {
      setFoodsToCompare([]);
    }
  };

  const toggleFoodComparison = (food: FoodItem) => {
    if (foodsToCompare.some(f => f.id === food.id)) {
      setFoodsToCompare(foodsToCompare.filter(f => f.id !== food.id));
    } else {
      if (foodsToCompare.length < 3) {
        setFoodsToCompare([...foodsToCompare, food]);
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 1 }}>
          <FoodIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Ayurvedic Food Database
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Explore comprehensive nutritional and ayurvedic properties of foods to create balanced meal plans.
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <FoodToolbar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          selectedDosha={selectedDosha}
          onDoshaChange={setSelectedDosha}
          doshas={doshas}
          onAddNew={() => handleOpenDialog()}
          compareMode={compareMode}
          onToggleCompareMode={toggleCompareMode}
          nutritionFilter={nutritionFilter}
          onNutritionFilterChange={handleNutritionFilterChange}
        />
      </Box>
      
      {loading && (
        <Fade in={loading} style={{ transitionDelay: loading ? '300ms' : '0ms' }}>
          <LinearProgress sx={{ mb: 2 }} />
        </Fade>
      )}

      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          mb: 3
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
            sx={{ 
              '& .MuiTabs-indicator': { 
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3
              } 
            }}
          >
            <Tab 
              icon={<CardIcon />} 
              iconPosition="start" 
              label={<Badge badgeContent={filteredFoods.length} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}>
                Card View
              </Badge>} 
            />
            <Tab 
              icon={<TableIcon />}
              iconPosition="start" 
              label={<Badge badgeContent={filteredFoods.length} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}>
                Table View
              </Badge>} 
            />
            <Tab 
              icon={<AnalyticsIcon />}
              iconPosition="start" 
              label="Analytics" 
            />
            {compareMode && foodsToCompare.length > 0 && (
              <Tab 
                icon={<CompareIcon />}
                iconPosition="start" 
                label={<Badge badgeContent={foodsToCompare.length} color="secondary" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}>
                  Compare
                </Badge>} 
              />
            )}
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <TabPanel value={selectedTab} index={0}>
            <FoodCardView 
              foods={filteredFoods} 
              onView={handleOpenDialog} 
              onEdit={handleOpenDialog} 
              onDelete={handleDelete}
              compareMode={compareMode}
              foodsToCompare={foodsToCompare}
              onToggleCompare={toggleFoodComparison}
            />
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            <FoodTableView 
              foods={filteredFoods} 
              onView={handleOpenDialog} 
              onEdit={handleOpenDialog} 
              onDelete={handleDelete}
            />
          </TabPanel>

          <TabPanel value={selectedTab} index={2}>
            <FoodAnalytics foods={foods} />
          </TabPanel>
          
          {compareMode && foodsToCompare.length > 0 && (
            <TabPanel value={selectedTab} index={3}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Comparing {foodsToCompare.length} {foodsToCompare.length === 1 ? 'food' : 'foods'}
                </Typography>
                {foodsToCompare.length < 3 && (
                  <Typography variant="body2" color="text.secondary">
                    You can select up to 3 foods to compare
                  </Typography>
                )}
              </Box>
              {/* Food comparison will be implemented in a separate component */}
              <Grid container spacing={2}>
                {foodsToCompare.map(food => (
                  <Grid item xs={12} md={12 / foodsToCompare.length} key={food.id}>
                    <Paper 
                      variant="outlined" 
                      sx={{ p: 2, height: '100%', borderColor: theme.palette.primary.light }}
                    >
                      <Typography variant="h6">{food.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{food.category}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          )}
        </Box>
      </Paper>
      
      <FoodDialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        food={selectedFood} 
        categories={categories.slice(1)}
        onSave={handleSaveFood}
      />
    </Container>
  );
};

export default FoodDatabase;
