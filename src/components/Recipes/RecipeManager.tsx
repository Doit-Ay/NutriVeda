import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  ExpandMore,
  Restaurant,
  Add,
  Edit,
  Delete,
  Visibility,
  Kitchen,
  Timer,
  People,
  Scale
} from '@mui/icons-material';
import { FoodItem } from '../../types';
import { mockFoodDatabase } from '../../data/mockData';

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
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
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface RecipeIngredient {
  foodItem: FoodItem;
  quantity: number;
  unit: string;
  notes?: string;
}

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const RecipeManager: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Mock recipes data
  const [recipes] = useState<Recipe[]>([
    {
      id: '1',
      name: 'Khichdi (Ayurvedic Rice & Lentil Porridge)',
      description: 'A complete, easily digestible meal that balances all three doshas',
      category: 'Main Course',
      cuisine: 'Indian',
      difficulty: 'Easy',
      prepTime: 10,
      cookTime: 30,
      servings: 4,
      ingredients: [
        { foodItem: mockFoodDatabase[0], quantity: 1, unit: 'cup', notes: 'Basmati rice' },
        { foodItem: mockFoodDatabase[7], quantity: 0.5, unit: 'cup', notes: 'Mung dal' },
        { foodItem: mockFoodDatabase[4], quantity: 2, unit: 'tbsp', notes: 'Ghee' },
        { foodItem: mockFoodDatabase[10], quantity: 1, unit: 'tsp', notes: 'Cumin seeds' },
        { foodItem: mockFoodDatabase[11], quantity: 1, unit: 'inch', notes: 'Fresh ginger' },
        { foodItem: mockFoodDatabase[12], quantity: 0.5, unit: 'tsp', notes: 'Turmeric powder' }
      ],
      instructions: [
        'Wash rice and dal together until water runs clear',
        'Soak for 30 minutes, then drain',
        'Heat ghee in a pressure cooker',
        'Add cumin seeds and let them splutter',
        'Add ginger and turmeric, sauté for 30 seconds',
        'Add rice and dal, mix well',
        'Add 4 cups water and salt to taste',
        'Pressure cook for 3 whistles',
        'Let pressure release naturally',
        'Serve hot with ghee on top'
      ],
      nutritionalInfo: {
        calories: 320,
        protein: 12,
        carbs: 55,
        fats: 8,
        fiber: 6,
        sugar: 2,
        sodium: 400
      },
      ayurvedicProperties: {
        rasa: ['Sweet', 'Astringent'],
        guna: ['Heavy', 'Cool'],
        virya: 'Cool',
        vipaka: 'Sweet',
        doshaImpact: { vata: -1, pitta: -1, kapha: 0 }
      },
      benefits: ['Easy to digest', 'Balances all doshas', 'Detoxifying', 'Nourishing'],
      contraindications: ['High kapha', 'Cold conditions'],
      bestTimeToEat: ['Lunch', 'Dinner'],
      tags: ['detox', 'digestive', 'comfort-food'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Golden Milk (Turmeric Latte)',
      description: 'Anti-inflammatory drink perfect for evening consumption',
      category: 'Beverage',
      cuisine: 'Indian',
      difficulty: 'Easy',
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      ingredients: [
        { foodItem: mockFoodDatabase[5], quantity: 2, unit: 'cups', notes: 'Fresh milk' },
        { foodItem: mockFoodDatabase[10], quantity: 0.5, unit: 'tsp', notes: 'Turmeric powder' },
        { foodItem: mockFoodDatabase[4], quantity: 1, unit: 'tsp', notes: 'Ghee' },
        { foodItem: mockFoodDatabase[13], quantity: 2, unit: 'pods', notes: 'Cardamom' },
        { foodItem: mockFoodDatabase[11], quantity: 0.25, unit: 'tsp', notes: 'Ginger powder' }
      ],
      instructions: [
        'Heat milk in a saucepan over medium heat',
        'Add turmeric, ginger, and cardamom',
        'Whisk continuously to prevent lumps',
        'Add ghee and mix well',
        'Simmer for 5-7 minutes',
        'Strain and serve warm'
      ],
      nutritionalInfo: {
        calories: 120,
        protein: 6,
        carbs: 12,
        fats: 6,
        fiber: 1,
        sugar: 10,
        sodium: 100
      },
      ayurvedicProperties: {
        rasa: ['Sweet', 'Pungent'],
        guna: ['Heavy', 'Warm'],
        virya: 'Warm',
        vipaka: 'Sweet',
        doshaImpact: { vata: -1, pitta: 1, kapha: 1 }
      },
      benefits: ['Anti-inflammatory', 'Sleep aid', 'Digestive', 'Immunity booster'],
      contraindications: ['Pitta imbalance', 'Lactose intolerance'],
      bestTimeToEat: ['Evening'],
      tags: ['anti-inflammatory', 'bedtime', 'immunity'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const categories = ['all', ...Array.from(new Set(recipes.map(r => r.category)))];
  const cuisines = ['all', ...Array.from(new Set(recipes.map(r => r.cuisine)))];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesCuisine = selectedCuisine === 'all' || recipe.cuisine === selectedCuisine;
    return matchesSearch && matchesCategory && matchesCuisine;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = (recipe?: Recipe) => {
    setSelectedRecipe(recipe || null);
    setOpenDialog(true);
    if (!recipe) {
      setActiveStep(0);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecipe(null);
    setActiveStep(0);
  };

  const getDoshaImpactColor = (impact: number) => {
    if (impact < 0) return 'success.main';
    if (impact > 0) return 'error.main';
    return 'text.secondary';
  };

  const getDoshaImpactText = (impact: number) => {
    if (impact < 0) return 'Pacifies';
    if (impact > 0) return 'Aggravates';
    return 'Neutral';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {recipe.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={recipe.category} size="small" color="primary" variant="outlined" />
            <Chip label={recipe.difficulty} size="small" color={getDifficultyColor(recipe.difficulty) as any} />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {recipe.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Timer sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {recipe.prepTime + recipe.cookTime} min
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <People sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {recipe.servings} servings
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Restaurant sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {recipe.cuisine}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Nutritional Value (per serving)
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2">Calories: {recipe.nutritionalInfo.calories}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Protein: {recipe.nutritionalInfo.protein}g</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Carbs: {recipe.nutritionalInfo.carbs}g</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Fats: {recipe.nutritionalInfo.fats}g</Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Ayurvedic Properties
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {recipe.ayurvedicProperties.rasa.map((rasa, index) => (
              <Chip key={index} label={rasa} size="small" variant="outlined" />
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Virya: {recipe.ayurvedicProperties.virya} • Vipaka: {recipe.ayurvedicProperties.vipaka}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <Chip key={index} label={tag} size="small" variant="outlined" />
            ))}
            {recipe.tags.length > 3 && (
              <Chip label={`+${recipe.tags.length - 3}`} size="small" />
            )}
          </Box>
          <Box>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => handleOpenDialog(recipe)}>
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => handleOpenDialog(recipe)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error">
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const RecipeTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Recipe</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Servings</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell>Ayurvedic Properties</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRecipes.map((recipe) => (
            <TableRow key={recipe.id} hover>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2">{recipe.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {recipe.description}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip label={recipe.category} size="small" color="primary" variant="outlined" />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{recipe.prepTime + recipe.cookTime} min</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{recipe.servings}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{recipe.nutritionalInfo.calories}</Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {recipe.ayurvedicProperties.rasa.map((rasa, index) => (
                    <Chip key={index} label={rasa} size="small" />
                  ))}
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => handleOpenDialog(recipe)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleOpenDialog(recipe)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const steps = [
    'Basic Information',
    'Ingredients',
    'Instructions',
    'Nutritional Analysis',
    'Ayurvedic Properties',
    'Review & Save'
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recipe Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Add New Recipe
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search recipes, ingredients, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ flexGrow: 1, minWidth: 300 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Cuisine</InputLabel>
          <Select
            value={selectedCuisine}
            label="Cuisine"
            onChange={(e) => setSelectedCuisine(e.target.value)}
          >
            {cuisines.map(cuisine => (
              <MenuItem key={cuisine} value={cuisine}>
                {cuisine === 'all' ? 'All Cuisines' : cuisine}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" startIcon={<FilterList />}>
          Advanced Filters
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label={`Card View (${filteredRecipes.length})`} />
          <Tab label={`Table View (${filteredRecipes.length})`} />
          <Tab label="Recipe Builder" />
        </Tabs>
      </Box>

      <TabPanel value={selectedTab} index={0}>
        <Grid container spacing={3}>
          {filteredRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <RecipeTable />
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recipe Builder
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create new recipes with automated nutritional analysis and Ayurvedic validation
            </Typography>
            
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    <Typography>
                      Step {index + 1} content will be implemented here
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(activeStep + 1)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={() => setActiveStep(activeStep - 1)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      </TabPanel>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedRecipe ? 'Recipe Details' : 'Add New Recipe'}
        </DialogTitle>
        <DialogContent>
          {selectedRecipe ? (
            <Box>
              <Typography variant="h5" gutterBottom>{selectedRecipe.name}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {selectedRecipe.description}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Recipe Information</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><Kitchen /></ListItemIcon>
                          <ListItemText primary="Category" secondary={selectedRecipe.category} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Restaurant /></ListItemIcon>
                          <ListItemText primary="Cuisine" secondary={selectedRecipe.cuisine} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Timer /></ListItemIcon>
                          <ListItemText primary="Prep Time" secondary={`${selectedRecipe.prepTime} minutes`} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Timer /></ListItemIcon>
                          <ListItemText primary="Cook Time" secondary={`${selectedRecipe.cookTime} minutes`} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><People /></ListItemIcon>
                          <ListItemText primary="Servings" secondary={selectedRecipe.servings} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><Scale /></ListItemIcon>
                          <ListItemText primary="Difficulty" secondary={selectedRecipe.difficulty} />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Nutritional Information</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Calories</Typography>
                          <Typography variant="h6">{selectedRecipe.nutritionalInfo.calories}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Protein</Typography>
                          <Typography variant="h6">{selectedRecipe.nutritionalInfo.protein}g</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Carbs</Typography>
                          <Typography variant="h6">{selectedRecipe.nutritionalInfo.carbs}g</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Fats</Typography>
                          <Typography variant="h6">{selectedRecipe.nutritionalInfo.fats}g</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Fiber</Typography>
                          <Typography variant="h6">{selectedRecipe.nutritionalInfo.fiber}g</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Sodium</Typography>
                          <Typography variant="h6">{selectedRecipe.nutritionalInfo.sodium}mg</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Ingredients</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <ListItem key={index}>
                        <ListItemIcon><Restaurant /></ListItemIcon>
                        <ListItemText
                          primary={`${ingredient.quantity} ${ingredient.unit} ${ingredient.foodItem.name}`}
                          secondary={ingredient.notes}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Instructions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                            {index + 1}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText primary={instruction} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Ayurvedic Properties</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>Rasa (Taste)</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedRecipe.ayurvedicProperties.rasa.map((rasa, index) => (
                          <Chip key={index} label={rasa} size="small" />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>Guna (Quality)</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedRecipe.ayurvedicProperties.guna.map((guna, index) => (
                          <Chip key={index} label={guna} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>Virya (Potency)</Typography>
                      <Chip 
                        label={selectedRecipe.ayurvedicProperties.virya} 
                        color={selectedRecipe.ayurvedicProperties.virya === 'Hot' ? 'error' : 'info'}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom>Vipaka (Post-digestive)</Typography>
                      <Chip label={selectedRecipe.ayurvedicProperties.vipaka} />
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>Dosha Impact</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="h6" color={getDoshaImpactColor(selectedRecipe.ayurvedicProperties.doshaImpact.vata)}>
                          Vata
                        </Typography>
                        <Typography variant="body2">
                          {getDoshaImpactText(selectedRecipe.ayurvedicProperties.doshaImpact.vata)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="h6" color={getDoshaImpactColor(selectedRecipe.ayurvedicProperties.doshaImpact.pitta)}>
                          Pitta
                        </Typography>
                        <Typography variant="body2">
                          {getDoshaImpactText(selectedRecipe.ayurvedicProperties.doshaImpact.pitta)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="h6" color={getDoshaImpactColor(selectedRecipe.ayurvedicProperties.doshaImpact.kapha)}>
                          Kapha
                        </Typography>
                        <Typography variant="body2">
                          {getDoshaImpactText(selectedRecipe.ayurvedicProperties.doshaImpact.kapha)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Benefits & Guidelines</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom color="success.main">
                        Benefits
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedRecipe.benefits.map((benefit, index) => (
                          <Chip key={index} label={benefit} size="small" color="success" variant="outlined" />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom color="error.main">
                        Contraindications
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedRecipe.contraindications.map((contraindication, index) => (
                          <Chip key={index} label={contraindication} size="small" color="error" variant="outlined" />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Best Time to Eat
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedRecipe.bestTimeToEat.map((time, index) => (
                          <Chip key={index} label={time} size="small" />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Create New Recipe
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Use the recipe builder to create new recipes with automated nutritional analysis and Ayurvedic validation.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setSelectedTab(2)}
                sx={{ mr: 2 }}
              >
                Open Recipe Builder
              </Button>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setSelectedTab(2)}
              >
                Quick Add
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {!selectedRecipe && (
            <Button variant="contained" onClick={handleCloseDialog}>
              Create Recipe
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeManager;
