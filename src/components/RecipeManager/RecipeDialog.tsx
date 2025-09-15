
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    Box,
    Typography,
    IconButton,
    Chip,
    Checkbox,
    ListItemText,
    OutlinedInput,
    Divider,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Switch,
    Paper,
    Stack,
    Avatar,
    Tooltip,
    Card,
    CardContent,
    Autocomplete,
    ToggleButtonGroup,
    ToggleButton,
    LinearProgress,
    SelectChangeEvent,
} from '@mui/material';
import {
    AddCircleOutline,
    RemoveCircleOutline,
    AccessTime,
    PeopleOutline,
    Photo,
    RestaurantMenu,
    LocalDining,
    Timer,
    BakeryDining,
    HealthAndSafety,
    Close,
    Save,
    Add
} from '@mui/icons-material';
import { Recipe, FoodItem, Ingredient, AyurvedicProperties, MealType, DoshaImpact } from '../../types';
import { mockFoodDatabase } from '../../data/mockData'; // In a real app, this would be fetched

interface RecipeDialogProps {
    open: boolean;
    onClose: () => void;
    onSave?: (recipe: Recipe) => void;
    recipe: Recipe | null;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div hidden={value !== index} {...other}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

const RecipeDialog: React.FC<RecipeDialogProps> = ({ open, onClose, onSave, recipe }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [foods] = useState<FoodItem[]>(mockFoodDatabase);
    const isNew = recipe === null;

    // Form state for a new recipe
    // Define types for form data
    type FormDataType = {
        name: string;
        description: string;
        mealType: MealType;
        servings: number;
        prepTime: number;
        cookTime: number;
        instructions: string[];
        ingredients: Ingredient[];
        healthBenefits: string[];
        ayurvedicDosha: {
            vata: boolean;
            pitta: boolean;
            kapha: boolean;
        };
        ayurvedicProperties: AyurvedicProperties;
    };

    const [formData, setFormData] = useState<FormDataType>({
        name: recipe?.name || '',
        description: recipe?.description || '',
        mealType: recipe?.mealType || 'Lunch',
        servings: recipe?.servings || 2,
        prepTime: recipe?.prepTime || 15,
        cookTime: recipe?.cookTime || 20,
        instructions: recipe?.instructions || [''],
        ingredients: recipe?.ingredients || [],
        healthBenefits: recipe?.healthBenefits || [''],
        ayurvedicDosha: recipe?.ayurvedicDosha || {
            vata: false,
            pitta: false,
            kapha: false
        },
        ayurvedicProperties: recipe?.ayurvedicProperties || {
            rasa: [] as string[],
            guna: [] as string[],
            virya: 'Heating',
            vipaka: 'Sweet',
            doshaImpact: { vata: 0, pitta: 0, kapha: 0 }
        }
    });

    // Initialize form data when recipe changes
    React.useEffect(() => {
        if (recipe) {
            setFormData({
                name: recipe.name,
                description: recipe.description,
                mealType: recipe.mealType,
                servings: recipe.servings,
                prepTime: recipe.prepTime,
                cookTime: recipe.cookTime,
                instructions: [...recipe.instructions],
                ingredients: [...recipe.ingredients],
                healthBenefits: [...recipe.healthBenefits],
                ayurvedicDosha: { ...recipe.ayurvedicDosha },
                ayurvedicProperties: {
                    ...recipe.ayurvedicProperties,
                    rasa: [...recipe.ayurvedicProperties.rasa],
                    guna: [...recipe.ayurvedicProperties.guna],
                    doshaImpact: { ...recipe.ayurvedicProperties.doshaImpact }
                }
            });
        }
    }, [recipe]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle select changes
    const handleSelectChange = (e: SelectChangeEvent, child: React.ReactNode) => {
        const name = e.target.name as string;
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [name]: value }));
    };    // Handle dosha toggle
    const handleDoshaChange = (dosha: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            ayurvedicDosha: {
                ...prev.ayurvedicDosha,
                [dosha]: checked
            }
        }));
    };

    // Add a new instruction step
    const addInstruction = () => {
        setFormData(prev => ({
            ...prev,
            instructions: [...prev.instructions, '']
        }));
    };

    // Update an instruction step
    const updateInstruction = (index: number, value: string) => {
        const updatedInstructions = [...formData.instructions];
        updatedInstructions[index] = value;
        setFormData(prev => ({
            ...prev,
            instructions: updatedInstructions
        }));
    };

    // Remove an instruction step
    const removeInstruction = (index: number) => {
        const updatedInstructions = formData.instructions.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            instructions: updatedInstructions
        }));
    };

    // Add a new health benefit
    const addHealthBenefit = () => {
        setFormData(prev => ({
            ...prev,
            healthBenefits: [...prev.healthBenefits, '']
        }));
    };

    // Update a health benefit
    const updateHealthBenefit = (index: number, value: string) => {
        const updatedBenefits = [...formData.healthBenefits];
        updatedBenefits[index] = value;
        setFormData(prev => ({
            ...prev,
            healthBenefits: updatedBenefits
        }));
    };

    // Remove a health benefit
    const removeHealthBenefit = (index: number) => {
        const updatedBenefits = formData.healthBenefits.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            healthBenefits: updatedBenefits
        }));
    };

    // Add a new ingredient
    const addIngredient = () => {
        if (foods.length > 0) {
            const newIngredient = {
                foodId: foods[0].id,
                quantity: 1,
                unit: 'cup'
            };
            setFormData(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, newIngredient]
            }));
        }
    };

    // Update an ingredient
    const updateIngredient = (index: number, field: string, value: any) => {
        const updatedIngredients = [...formData.ingredients];
        updatedIngredients[index] = { 
            ...updatedIngredients[index], 
            [field]: value 
        };
        setFormData(prev => ({
            ...prev,
            ingredients: updatedIngredients
        }));
    };

    // Remove an ingredient
    const removeIngredient = (index: number) => {
        const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            ingredients: updatedIngredients
        }));
    };

    // Handle save
    const handleSave = () => {
        // In a real app, you would save the form data to the backend
        console.log('Saving recipe:', formData);
        if (onSave) {
            onSave(formData as Recipe);
        }
        onClose();
    };

    // Get meal type color
    const getMealTypeColor = (mealType: string) => {
        switch(mealType.toLowerCase()) {
            case 'breakfast': return 'info';
            case 'lunch': return 'warning';
            case 'dinner': return 'secondary';
            case 'snack': return 'success';
            default: return 'default';
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="lg" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 3,
                bgcolor: 'background.default'
            }}>
                {isNew ? (
                    <Typography variant="h5" component="div" fontWeight={600}>Add New Recipe</Typography>
                ) : (
                    <Typography variant="h5" component="div" fontWeight={600}>{recipe?.name}</Typography>
                )}
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ p: 0, bgcolor: 'background.default' }}>
                {isNew ? (
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={8}>
                                <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>Basic Information</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField 
                                                fullWidth 
                                                label="Recipe Name" 
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField 
                                                fullWidth 
                                                label="Description" 
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                multiline 
                                                rows={3}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Meal Type</InputLabel>
                                                <Select
                                                    label="Meal Type"
                                                    name="mealType"
                                                    value={formData.mealType}
                                                    onChange={handleSelectChange}
                                                >
                                                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                                                    <MenuItem value="Lunch">Lunch</MenuItem>
                                                    <MenuItem value="Dinner">Dinner</MenuItem>
                                                    <MenuItem value="Snack">Snack</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                fullWidth 
                                                label="Servings" 
                                                type="number"
                                                name="servings"
                                                value={formData.servings}
                                                onChange={handleInputChange}
                                                InputProps={{ inputProps: { min: 1, max: 20 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField 
                                                fullWidth 
                                                label="Prep Time (min)" 
                                                type="number"
                                                name="prepTime"
                                                value={formData.prepTime}
                                                onChange={handleInputChange}
                                                InputProps={{ 
                                                    inputProps: { min: 0 },
                                                    startAdornment: (
                                                        <Timer fontSize="small" color="action" sx={{ mr: 1 }} />
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField 
                                                fullWidth 
                                                label="Cook Time (min)" 
                                                type="number"
                                                name="cookTime"
                                                value={formData.cookTime}
                                                onChange={handleInputChange}
                                                InputProps={{ 
                                                    inputProps: { min: 0 },
                                                    startAdornment: (
                                                        <BakeryDining fontSize="small" color="action" sx={{ mr: 1 }} />
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                                <Paper sx={{ p: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom>Ayurvedic Properties</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <FormLabel component="legend" sx={{ mb: 1 }}>Dosha Balance</FormLabel>
                                    <FormGroup row sx={{ mb: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch 
                                                    checked={formData.ayurvedicDosha.vata}
                                                    onChange={(e) => handleDoshaChange('vata', e.target.checked)}
                                                    color="info"
                                                />
                                            }
                                            label="Vata"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch 
                                                    checked={formData.ayurvedicDosha.pitta}
                                                    onChange={(e) => handleDoshaChange('pitta', e.target.checked)}
                                                    color="warning"
                                                />
                                            }
                                            label="Pitta"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch 
                                                    checked={formData.ayurvedicDosha.kapha}
                                                    onChange={(e) => handleDoshaChange('kapha', e.target.checked)}
                                                    color="success"
                                                />
                                            }
                                            label="Kapha"
                                        />
                                    </FormGroup>
                                    
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel>Taste (Rasa)</InputLabel>
                                        <Select
                                            multiple
                                            value={formData.ayurvedicProperties.rasa}
                                            onChange={(e: SelectChangeEvent<string[]>) => {
                                                const value = e.target.value as unknown as string[];
                                                setFormData(prev => ({
                                                    ...prev,
                                                    ayurvedicProperties: {
                                                        ...prev.ayurvedicProperties,
                                                        rasa: value
                                                    }
                                                }));
                                            }}
                                            input={<OutlinedInput label="Taste (Rasa)" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} size="small" />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {['Sweet', 'Sour', 'Salty', 'Pungent', 'Bitter', 'Astringent'].map((taste) => (
                                                <MenuItem key={taste} value={taste}>
                                                    <Checkbox checked={formData.ayurvedicProperties.rasa.indexOf(taste) > -1} />
                                                    <ListItemText primary={taste} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel>Quality (Guna)</InputLabel>
                                        <Select
                                            multiple
                                            value={formData.ayurvedicProperties.guna}
                                            onChange={(e: SelectChangeEvent<string[]>) => {
                                                const value = e.target.value as unknown as string[];
                                                setFormData(prev => ({
                                                    ...prev,
                                                    ayurvedicProperties: {
                                                        ...prev.ayurvedicProperties,
                                                        guna: value
                                                    }
                                                }));
                                            }}
                                            input={<OutlinedInput label="Quality (Guna)" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} size="small" />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {['Light', 'Heavy', 'Oily', 'Dry', 'Hot', 'Cold'].map((quality) => (
                                                <MenuItem key={quality} value={quality}>
                                                    <Checkbox checked={formData.ayurvedicProperties.guna.indexOf(quality) > -1} />
                                                    <ListItemText primary={quality} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Energy (Virya)</InputLabel>
                                                <Select
                                                    label="Energy (Virya)"
                                                    value={formData.ayurvedicProperties.virya}
                                                    onChange={(e: SelectChangeEvent) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            ayurvedicProperties: {
                                                                ...prev.ayurvedicProperties,
                                                                virya: e.target.value as 'Heating' | 'Cooling'
                                                            }
                                                        }));
                                                    }}
                                                >
                                                    <MenuItem value="Heating">Heating</MenuItem>
                                                    <MenuItem value="Cooling">Cooling</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Post-Digestive (Vipaka)</InputLabel>
                                                <Select
                                                    label="Post-Digestive (Vipaka)"
                                                    value={formData.ayurvedicProperties.vipaka}
                                                    onChange={(e: SelectChangeEvent) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            ayurvedicProperties: {
                                                                ...prev.ayurvedicProperties,
                                                                vipaka: e.target.value as 'Sweet' | 'Sour' | 'Pungent'
                                                            }
                                                        }));
                                                    }}
                                                >
                                                    <MenuItem value="Sweet">Sweet</MenuItem>
                                                    <MenuItem value="Sour">Sour</MenuItem>
                                                    <MenuItem value="Pungent">Pungent</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Paper sx={{ p: 3, borderRadius: 2 }}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 1 }}>
                                            <Tab label="Instructions" />
                                            <Tab label="Ingredients" />
                                            <Tab label="Health Benefits" />
                                        </Tabs>
                                    </Box>
                                    
                                    <TabPanel value={selectedTab} index={0}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Recipe Instructions
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                Add step-by-step instructions for preparing the recipe.
                                            </Typography>
                                            
                                            {formData.instructions.map((instruction, index) => (
                                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar 
                                                        sx={{ 
                                                            mr: 2, 
                                                            bgcolor: 'primary.main',
                                                            width: 28,
                                                            height: 28,
                                                            fontSize: 14
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Avatar>
                                                    <TextField
                                                        fullWidth
                                                        value={instruction}
                                                        onChange={(e) => updateInstruction(index, e.target.value)}
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder={`Step ${index + 1}`}
                                                    />
                                                    <IconButton 
                                                        onClick={() => removeInstruction(index)}
                                                        disabled={formData.instructions.length <= 1}
                                                        sx={{ ml: 1 }}
                                                    >
                                                        <RemoveCircleOutline />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                            
                                            <Button 
                                                startIcon={<AddCircleOutline />}
                                                onClick={addInstruction}
                                                variant="text"
                                                sx={{ mt: 1 }}
                                            >
                                                Add Step
                                            </Button>
                                        </Box>
                                    </TabPanel>
                                    
                                    <TabPanel value={selectedTab} index={1}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Recipe Ingredients
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                Add ingredients required for this recipe.
                                            </Typography>
                                            
                                            {formData.ingredients.map((ingredient, index) => {
                                                const food = foods.find(f => f.id === ingredient.foodId);
                                                return (
                                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <FormControl sx={{ mr: 1, minWidth: 200 }}>
                                                            <InputLabel>Food Item</InputLabel>
                                                            <Select
                                                                value={ingredient.foodId}
                                                                onChange={(e) => updateIngredient(index, 'foodId', e.target.value)}
                                                                input={<OutlinedInput label="Food Item" />}
                                                                size="small"
                                                            >
                                                                {foods.map((food) => (
                                                                    <MenuItem key={food.id} value={food.id}>{food.name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        
                                                        <TextField
                                                            label="Quantity"
                                                            type="number"
                                                            value={ingredient.quantity}
                                                            onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value))}
                                                            InputProps={{ inputProps: { min: 0, step: 0.25 } }}
                                                            size="small"
                                                            sx={{ mr: 1, width: 120 }}
                                                        />
                                                        
                                                        <FormControl sx={{ width: 120 }}>
                                                            <InputLabel>Unit</InputLabel>
                                                            <Select
                                                                value={ingredient.unit}
                                                                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                                                                input={<OutlinedInput label="Unit" />}
                                                                size="small"
                                                            >
                                                                <MenuItem value="cup">cup</MenuItem>
                                                                <MenuItem value="tbsp">tbsp</MenuItem>
                                                                <MenuItem value="tsp">tsp</MenuItem>
                                                                <MenuItem value="g">g</MenuItem>
                                                                <MenuItem value="ml">ml</MenuItem>
                                                                <MenuItem value="piece">piece</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        
                                                        <IconButton 
                                                            onClick={() => removeIngredient(index)}
                                                            disabled={formData.ingredients.length <= 1}
                                                            sx={{ ml: 1 }}
                                                        >
                                                            <RemoveCircleOutline />
                                                        </IconButton>
                                                    </Box>
                                                );
                                            })}
                                            
                                            <Button 
                                                startIcon={<AddCircleOutline />}
                                                onClick={addIngredient}
                                                variant="text"
                                                sx={{ mt: 1 }}
                                            >
                                                Add Ingredient
                                            </Button>
                                        </Box>
                                    </TabPanel>
                                    
                                    <TabPanel value={selectedTab} index={2}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Health Benefits
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                List the health benefits associated with this recipe.
                                            </Typography>
                                            
                                            {formData.healthBenefits.map((benefit, index) => (
                                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <HealthAndSafety color="success" sx={{ mr: 2 }} />
                                                    <TextField
                                                        fullWidth
                                                        value={benefit}
                                                        onChange={(e) => updateHealthBenefit(index, e.target.value)}
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder="Enter health benefit"
                                                    />
                                                    <IconButton 
                                                        onClick={() => removeHealthBenefit(index)}
                                                        disabled={formData.healthBenefits.length <= 1}
                                                        sx={{ ml: 1 }}
                                                    >
                                                        <RemoveCircleOutline />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                            
                                            <Button 
                                                startIcon={<AddCircleOutline />}
                                                onClick={addHealthBenefit}
                                                variant="text"
                                                sx={{ mt: 1 }}
                                            >
                                                Add Health Benefit
                                            </Button>
                                        </Box>
                                    </TabPanel>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            p: 4,
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://source.unsplash.com/random/1200x300/?food,${recipe?.name})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            color: 'white',
                            position: 'relative'
                        }}>
                            <Typography variant="overline" sx={{ fontWeight: 600, letterSpacing: 1 }}>
                                {recipe?.mealType}
                            </Typography>
                            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                                {recipe?.name}
                            </Typography>
                            <Typography variant="subtitle1">
                                {recipe?.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', mt: 2, gap: 3 }}>
                                <Chip 
                                    icon={<AccessTime sx={{ color: 'white !important' }} />}
                                    label={`${recipe?.prepTime + recipe?.cookTime} min total`}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)' }}
                                />
                                <Chip 
                                    icon={<PeopleOutline sx={{ color: 'white !important' }} />}
                                    label={`${recipe?.servings} servings`}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)' }}
                                />
                            </Box>
                            
                            <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                                {recipe?.ayurvedicDosha.vata && 
                                    <Chip label="Vata" size="small" sx={{ bgcolor: 'info.main', color: 'white' }} />}
                                {recipe?.ayurvedicDosha.pitta && 
                                    <Chip label="Pitta" size="small" sx={{ bgcolor: 'warning.main', color: 'white' }} />}
                                {recipe?.ayurvedicDosha.kapha && 
                                    <Chip label="Kapha" size="small" sx={{ bgcolor: 'success.main', color: 'white' }} />}
                            </Box>
                        </Box>
                            
                        <Box sx={{ p: 3 }}>
                            <Tabs 
                                value={selectedTab} 
                                onChange={handleTabChange} 
                                variant="fullWidth"
                                sx={{ 
                                    mb: 3,
                                    '& .MuiTab-root': {
                                        fontWeight: 600,
                                    }
                                }}
                            >
                                <Tab label="Instructions" />
                                <Tab label="Ingredients" />
                                <Tab label="Health Benefits" />
                                <Tab label="Ayurvedic Properties" />
                            </Tabs>

                            <TabPanel value={selectedTab} index={0}>
                                <Typography variant="h6" gutterBottom>Instructions</Typography>
                                <Box component="ol" sx={{ pl: 2 }}>
                                    {recipe?.instructions.map((step: string, index: number) => (
                                        <Box 
                                            component="li" 
                                            key={index} 
                                            sx={{ 
                                                mb: 2,
                                                pl: 1
                                            }}
                                        >
                                            <Typography variant="body1">{step}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </TabPanel>

                            <TabPanel value={selectedTab} index={1}>
                                <Typography variant="h6" gutterBottom>Ingredients</Typography>
                                <Grid container spacing={2}>
                                    {recipe?.ingredients.map((ing: Ingredient, index: number) => {
                                        const food = foods.find(f => f.id === ing.foodId);
                                        return (
                                            <Grid item xs={12} sm={6} md={4} key={index}>
                                                <Paper 
                                                    elevation={0} 
                                                    variant="outlined"
                                                    sx={{ 
                                                        p: 2, 
                                                        borderRadius: 2,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <LocalDining sx={{ mr: 2, color: 'text.secondary' }} />
                                                    <Box>
                                                        <Typography variant="body1" fontWeight={500}>{food?.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {ing.quantity} {ing.unit}
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </TabPanel>

                            <TabPanel value={selectedTab} index={2}>
                                <Typography variant="h6" gutterBottom>Health Benefits</Typography>
                                <Grid container spacing={2}>
                                    {recipe?.healthBenefits.map((benefit: string, index: number) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Paper 
                                                elevation={0}
                                                variant="outlined"
                                                sx={{ 
                                                    p: 2, 
                                                    borderRadius: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    height: '100%'
                                                }}
                                            >
                                                <HealthAndSafety sx={{ mr: 2, color: 'success.main' }} />
                                                <Typography variant="body1">{benefit}</Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </TabPanel>
                            
                            <TabPanel value={selectedTab} index={3}>
                                <Typography variant="h6" gutterBottom>Ayurvedic Properties</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Paper 
                                            elevation={0}
                                            variant="outlined"
                                            sx={{ p: 3, borderRadius: 2 }}
                                        >
                                            <Typography variant="subtitle1" gutterBottom color="text.secondary">
                                                Taste & Properties
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">Taste (Rasa)</Typography>
                                                    <Typography variant="body1">
                                                        {recipe?.ayurvedicProperties.rasa.join(', ')}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">Qualities (Guna)</Typography>
                                                    <Typography variant="body1">
                                                        {recipe?.ayurvedicProperties.guna.join(', ')}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">Energy (Virya)</Typography>
                                                    <Typography variant="body1">{recipe?.ayurvedicProperties.virya}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">Post-Digestive (Vipaka)</Typography>
                                                    <Typography variant="body1">{recipe?.ayurvedicProperties.vipaka}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Paper 
                                            elevation={0}
                                            variant="outlined"
                                            sx={{ p: 3, borderRadius: 2, height: '100%' }}
                                        >
                                            <Typography variant="subtitle1" gutterBottom color="text.secondary">
                                                Dosha Impact
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={3}>
                                                        <Typography variant="body2">Vata</Typography>
                                                    </Grid>
                                                    <Grid item xs={9}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={(recipe?.ayurvedicProperties.doshaImpact.vata + 1) * 50}
                                                                    color="info"
                                                                    sx={{ height: 10, borderRadius: 5 }}
                                                                />
                                                            </Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {recipe?.ayurvedicProperties.doshaImpact.vata > 0 ? '+' : ''}
                                                                {recipe?.ayurvedicProperties.doshaImpact.vata}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    
                                                    <Grid item xs={3}>
                                                        <Typography variant="body2">Pitta</Typography>
                                                    </Grid>
                                                    <Grid item xs={9}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={(recipe?.ayurvedicProperties.doshaImpact.pitta + 1) * 50}
                                                                    color="warning"
                                                                    sx={{ height: 10, borderRadius: 5 }}
                                                                />
                                                            </Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {recipe?.ayurvedicProperties.doshaImpact.pitta > 0 ? '+' : ''}
                                                                {recipe?.ayurvedicProperties.doshaImpact.pitta}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    
                                                    <Grid item xs={3}>
                                                        <Typography variant="body2">Kapha</Typography>
                                                    </Grid>
                                                    <Grid item xs={9}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={(recipe?.ayurvedicProperties.doshaImpact.kapha + 1) * 50}
                                                                    color="success"
                                                                    sx={{ height: 10, borderRadius: 5 }}
                                                                />
                                                            </Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {recipe?.ayurvedicProperties.doshaImpact.kapha > 0 ? '+' : ''}
                                                                {recipe?.ayurvedicProperties.doshaImpact.kapha}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        </Box>
                    </>
                )}
            </DialogContent>
            
            <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                >
                    Cancel
                </Button>
                {isNew && (
                    <Button 
                        variant="contained" 
                        onClick={handleSave}
                        startIcon={<Save />}
                    >
                        Save Recipe
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default RecipeDialog;
