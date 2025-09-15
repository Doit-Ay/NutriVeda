import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  IconButton,
  Button,
  Breadcrumbs,
  Link,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Edit as EditIcon,
  Timer as TimerIcon,
  Restaurant as RestaurantIcon,
  VerifiedUser as VerifiedUserIcon,
  EmojiObjects as EmojiObjectsIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Recipe, FoodItem } from '../../types';
import RecipeDataVisualizations from './RecipeDataVisualizations';
import { mockRecipes } from '../../data/mockRecipes';
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
      style={{ paddingTop: 20 }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `recipe-tab-${index}`,
    'aria-controls': `recipe-tabpanel-${index}`,
  };
}

export const RecipeDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      // In a real app, you would fetch the recipe from an API
      const foundRecipe = mockRecipes.find(r => r.id === id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
        setIsFavorite(foundRecipe.favorite || false);
      }
    }
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFavoriteToggle = () => {
    if (recipe) {
      const updatedRecipe = { ...recipe, favorite: !isFavorite };
      setRecipe(updatedRecipe);
      setIsFavorite(!isFavorite);
      // In a real app, you would update this in the backend
    }
  };

  const handleEditClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleRecipeSave = (updatedRecipe: Recipe) => {
    setRecipe(updatedRecipe);
    setDialogOpen(false);
    // In a real app, you would update this in the backend
  };

  if (!recipe) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Recipe not found</Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/recipes')}
          sx={{ mt: 2 }}
        >
          Back to Recipes
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          color="inherit" 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            navigate('/recipes');
          }}
        >
          Recipes
        </Link>
        <Typography color="text.primary">{recipe.name}</Typography>
      </Breadcrumbs>

      {/* Header Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          background: recipe.ayurvedicDosha.vata && recipe.ayurvedicDosha.pitta && recipe.ayurvedicDosha.kapha ? 
            'linear-gradient(135deg, rgba(77,171,245,0.15) 0%, rgba(255,152,0,0.15) 50%, rgba(102,187,106,0.15) 100%)' :
            recipe.ayurvedicDosha.vata && recipe.ayurvedicDosha.pitta ? 
            'linear-gradient(135deg, rgba(77,171,245,0.2) 0%, rgba(255,152,0,0.2) 100%)' :
            recipe.ayurvedicDosha.vata && recipe.ayurvedicDosha.kapha ? 
            'linear-gradient(135deg, rgba(77,171,245,0.2) 0%, rgba(102,187,106,0.2) 100%)' :
            recipe.ayurvedicDosha.pitta && recipe.ayurvedicDosha.kapha ? 
            'linear-gradient(135deg, rgba(255,152,0,0.2) 0%, rgba(102,187,106,0.2) 100%)' :
            recipe.ayurvedicDosha.vata ? 'rgba(77,171,245,0.15)' :
            recipe.ayurvedicDosha.pitta ? 'rgba(255,152,0,0.15)' :
            recipe.ayurvedicDosha.kapha ? 'rgba(102,187,106,0.15)' : '#f5f5f5',
          borderTop: recipe.ayurvedicDosha.vata ? '4px solid #4dabf5' : 
                   recipe.ayurvedicDosha.pitta ? '4px solid #ff9800' : 
                   recipe.ayurvedicDosha.kapha ? '4px solid #66bb6a' : 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Box>
            <Button 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/recipes')}
              sx={{ mb: 2 }}
              variant="outlined"
              size="small"
            >
              Back
            </Button>
            <Typography variant="h4" component="h1" gutterBottom>
              {recipe.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<RestaurantIcon />} 
                label={recipe.mealType}
                size="small" 
                color="primary"
              />
              <Chip 
                icon={<TimerIcon />} 
                label={`${recipe.prepTime + recipe.cookTime} min`}
                size="small"
              />
              {recipe.isVeg && (
                <Chip 
                  icon={<VerifiedUserIcon style={{ color: 'green' }} />} 
                  label="Vegetarian"
                  size="small"
                  color="success"
                />
              )}
              {recipe.ayurvedicDosha.vata && <Chip label="Vata" size="small" color="info" />}
              {recipe.ayurvedicDosha.pitta && <Chip label="Pitta" size="small" color="warning" />}
              {recipe.ayurvedicDosha.kapha && <Chip label="Kapha" size="small" color="success" />}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleFavoriteToggle}>
              {isFavorite ? 
                <FavoriteIcon color="error" /> : 
                <FavoriteBorderIcon />
              }
            </IconButton>
            <IconButton>
              <PrintIcon />
            </IconButton>
            <IconButton>
              <ShareIcon />
            </IconButton>
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              Edit Recipe
            </Button>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
          {recipe.description}
        </Typography>
      </Paper>

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="recipe detail tabs"
        >
          <Tab label="Recipe Details" {...a11yProps(0)} />
          <Tab label="Nutrition & Ayurvedic Properties" {...a11yProps(1)} />
          <Tab label="Cooking Instructions" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {/* Recipe Details Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ingredients
                </Typography>
                <List>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListItem key={index} divider={index < recipe.ingredients.length - 1}>
                      <ListItemText 
                        primary={ingredient.name} 
                        secondary={`${ingredient.quantity} ${ingredient.unit}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Preparation Time
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">
                    Prep: {recipe.prepTime} minutes
                  </Typography>
                  <Typography variant="body1">
                    Cook: {recipe.cookTime} minutes
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Serving Details
                </Typography>
                <Typography variant="body1">
                  Serves {recipe.servings} people
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Health Benefits & Ayurvedic Effects
                </Typography>
                <Typography variant="body1" paragraph>
                  {recipe.healthBenefits}
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiObjectsIcon color="warning" /> Ayurvedic Tips
                  </Typography>
                  <Typography variant="body1">
                    {recipe.ayurvedicTips || "This recipe supports balance through its combination of ingredients and preparation methods."}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Nutrition & Ayurvedic Properties Tab */}
      <TabPanel value={tabValue} index={1}>
        <RecipeDataVisualizations recipe={recipe} />
      </TabPanel>

      {/* Cooking Instructions Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Step-by-Step Instructions
            </Typography>
            <List>
              {recipe.instructions.map((instruction, index) => (
                <ListItem key={index} alignItems="flex-start" divider={index < recipe.instructions.length - 1}>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Step {index + 1}
                      </Typography>
                    }
                    secondary={instruction}
                    secondaryTypographyProps={{ 
                      sx: { color: 'text.primary', mt: 0.5 }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Edit Recipe Dialog */}
      {dialogOpen && recipe && (
        <RecipeDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onSave={handleRecipeSave}
          recipe={recipe}
        />
      )}
    </Box>
  );
};

export default RecipeDetailsPage;