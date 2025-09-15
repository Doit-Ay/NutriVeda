
import React, { useState, useMemo } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Badge,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Divider,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Favorite, FilterList } from '@mui/icons-material';
import { mockRecipes } from '../../data/mockRecipes'; 
import { Recipe } from '../../types';
import RecipeToolbar, { RecipeFilters } from './RecipeToolbar';
import RecipeCardView from './RecipeCardView';
import RecipeTableView from './RecipeTableView';
import RecipeDialog from './RecipeDialog';

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
      id={`recipe-tabpanel-${index}`}
      aria-labelledby={`recipe-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const RecipeManager: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes.map(recipe => ({ ...recipe, favorite: false, isFavorite: false })));
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [filters, setFilters] = useState<RecipeFilters>({
    mealType: [],
    maxPrepTime: 120,
    doshaImpact: { vata: false, pitta: false, kapha: false },
    tags: [],
    dietaryType: [],
    cookingMethod: [],
    cuisineType: [],
    prepDifficulty: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = (recipe?: Recipe) => {
    setSelectedRecipe(recipe || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecipe(null);
  };

  const handleDelete = (recipe: Recipe) => {
    console.log("Deleting recipe", recipe.name);
    // In a real app, you would delete the recipe from the database
  };
  
  const toggleFavorite = (recipeId: string) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === recipeId 
        ? { ...recipe, favorite: !recipe.favorite, isFavorite: !recipe.isFavorite }
        : recipe
    ));
  };
  
  const toggleFavoritesFilter = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  const filteredAndSortedRecipes = useMemo(() => {
    // Filter first
    const filtered = recipes.filter(recipe => {
      // Favorites filter
      if (showFavoritesOnly && !(recipe.favorite || recipe.isFavorite)) {
        return false;
      }
      // Text search filter
      const matchesSearch = searchTerm.trim() === '' || 
                          recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.ingredients.some(ing => {
                            // This would ideally search by ingredient name from the foodId
                            return ing.foodId.toLowerCase().includes(searchTerm.toLowerCase());
                          });
      
      // Meal type filter
      const matchesMealType = filters.mealType && filters.mealType.length === 0 || 
                             (filters.mealType?.includes(recipe.mealType));
      
      // Prep time filter
      const matchesPrepTime = !filters.maxPrepTime || 
                             (recipe.prepTime + recipe.cookTime) <= filters.maxPrepTime;
      
      // Dosha filter
      const matchesDosha = (!filters.doshaImpact?.vata || recipe.ayurvedicDosha.vata) && 
                         (!filters.doshaImpact?.pitta || recipe.ayurvedicDosha.pitta) &&
                         (!filters.doshaImpact?.kapha || recipe.ayurvedicDosha.kapha);
      
      // Determine recipe difficulty level based on complexity
      const getDifficultyLevel = () => {
        const ingredientsCount = recipe.ingredients.length;
        const instructionsCount = recipe.instructions.length;
        const totalComplexity = ingredientsCount + instructionsCount;
        
        if (totalComplexity > 12) return 'Advanced';
        if (totalComplexity > 8) return 'Intermediate';
        return 'Beginner';
      };
                
      // Difficulty filter
      const matchesDifficulty = !filters.prepDifficulty || 
                               filters.prepDifficulty === getDifficultyLevel();
      
      // Dietary type and cooking method filters would be applied to actual data in a real app
      // For now we'll simulate it by checking that filters are empty or match our mockup
      const matchesDietaryType = !filters.dietaryType || 
                               filters.dietaryType.length === 0 || 
                               (recipe.healthBenefits && recipe.healthBenefits.some(
                                 benefit => filters.dietaryType?.some(
                                   diet => benefit.toLowerCase().includes(diet.toLowerCase())
                                 )
                               ));
      
      const matchesCookingMethod = !filters.cookingMethod || 
                                 filters.cookingMethod.length === 0 || 
                                 (recipe.instructions && recipe.instructions.some(
                                   instruction => filters.cookingMethod?.some(
                                     method => instruction.toLowerCase().includes(method.toLowerCase())
                                   )
                                 ));
      
      const matchesCuisineType = !filters.cuisineType || 
                               filters.cuisineType.length === 0 || 
                               (recipe.description && filters.cuisineType.some(
                                 cuisine => recipe.description.toLowerCase().includes(cuisine.toLowerCase())
                               ));
      
      return matchesSearch && 
             matchesMealType && 
             matchesPrepTime && 
             matchesDosha && 
             matchesDifficulty && 
             matchesDietaryType &&
             matchesCookingMethod &&
             matchesCuisineType;
    });
    
    // Then sort
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'prepTime':
          comparison = (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
          break;
        case 'ingredients':
          comparison = a.ingredients.length - b.ingredients.length;
          break;
        case 'complexity':
          // Complexity is determined by ingredients count + instructions count
          comparison = (a.ingredients.length + a.instructions.length) - 
                       (b.ingredients.length + b.instructions.length);
          break;
        case 'mealType':
          comparison = a.mealType.localeCompare(b.mealType);
          break;
        case 'doshaBalance':
          // Higher number of balanced doshas comes first
          const aDoshaCount = Number(a.ayurvedicDosha.vata) + Number(a.ayurvedicDosha.pitta) + Number(a.ayurvedicDosha.kapha);
          const bDoshaCount = Number(b.ayurvedicDosha.vata) + Number(b.ayurvedicDosha.pitta) + Number(b.ayurvedicDosha.kapha);
          comparison = bDoshaCount - aDoshaCount; // Descending by default for dosha balance
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      // Apply sort order (except for doshaBalance which is always descending)
      return sortBy === 'doshaBalance' 
        ? comparison 
        : (sortOrder === 'asc' ? comparison : -comparison);
    });
  }, [recipes, searchTerm, filters, sortBy, sortOrder]);
  
  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };
  
  // Toggle sort order
  const handleSortOrderChange = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value as 'asc' | 'desc');
  };


  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <RecipeToolbar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
          onAddNew={() => handleOpenDialog()}
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        {/* Sorting controls */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            mt: 2,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              {filteredAndSortedRecipes.length} {filteredAndSortedRecipes.length === 1 ? 'recipe' : 'recipes'} found
            </Typography>
            
            <Tooltip title={showFavoritesOnly ? "Show all recipes" : "Show favorites only"}>
              <IconButton 
                onClick={toggleFavoritesFilter} 
                color={showFavoritesOnly ? "warning" : "default"} 
                sx={{ mr: 2 }}
              >
                <Favorite />
              </IconButton>
            </Tooltip>
            
            {filters.mealType && filters.mealType.length > 0 && (
              <Chip 
                label={`Meal: ${filters.mealType.join(', ')}`} 
                size="small" 
                color="primary" 
                onDelete={() => setFilters({...filters, mealType: []})}
                sx={{ mr: 1 }}
              />
            )}
            
            {filters.maxPrepTime !== 120 && (
              <Chip 
                label={`Max time: ${filters.maxPrepTime} min`} 
                size="small" 
                color="primary"
                onDelete={() => setFilters({...filters, maxPrepTime: 120})}
                sx={{ mr: 1 }}
              />
            )}
            
            {(filters.doshaImpact?.vata || filters.doshaImpact?.pitta || filters.doshaImpact?.kapha) && (
              <Chip 
                label="Dosha filter" 
                size="small" 
                color="primary"
                onDelete={() => setFilters({
                  ...filters, 
                  doshaImpact: { vata: false, pitta: false, kapha: false }
                })}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="sort-by-label">Sort by</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                label="Sort by"
                onChange={handleSortChange}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="prepTime">Preparation Time</MenuItem>
                <MenuItem value="ingredients">Ingredients Count</MenuItem>
                <MenuItem value="complexity">Complexity</MenuItem>
                <MenuItem value="mealType">Meal Type</MenuItem>
                <MenuItem value="doshaBalance">Dosha Balance</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="sort-order-label">Order</InputLabel>
              <Select
                labelId="sort-order-label"
                value={sortOrder}
                label="Order"
                onChange={handleSortOrderChange}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ 
              '& .MuiTab-root': { 
                fontWeight: 600,
                py: 1.5,
              }
            }}
          >
            <Tab label={<Badge badgeContent={filteredAndSortedRecipes.length} color="primary">Card View</Badge>} />
            <Tab label={<Badge badgeContent={filteredAndSortedRecipes.length} color="primary">Table View</Badge>} />
          </Tabs>
        </Box>

        <TabPanel value={selectedTab} index={0}>
          <RecipeCardView 
            recipes={filteredAndSortedRecipes} 
            onView={handleOpenDialog} 
            onEdit={handleOpenDialog} 
            onDelete={handleDelete} 
            onFavorite={toggleFavorite}
          />
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <RecipeTableView 
            recipes={filteredAndSortedRecipes} 
            onView={handleOpenDialog} 
            onEdit={handleOpenDialog} 
            onDelete={handleDelete}
            onFavorite={toggleFavorite}
          />
        </TabPanel>

        <RecipeDialog open={openDialog} onClose={handleCloseDialog} recipe={selectedRecipe} />
      </Paper>
    </Container>
  );
};

export default RecipeManager;
