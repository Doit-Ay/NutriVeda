
import React, { useState } from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Typography,
    Drawer,
    Divider,
    Slider,
    Chip,
    IconButton,
    Checkbox,
    FormGroup,
    FormControlLabel,
    OutlinedInput,
    InputAdornment,
    Tooltip,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Search,
    FilterList,
    Add,
    Close,
    RestaurantMenu,
    Timer,
    ClearAll,
} from '@mui/icons-material';

interface RecipeToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onAddNew: () => void;
    filters?: RecipeFilters;
    onFiltersChange?: (filters: RecipeFilters) => void;
}

export interface RecipeFilters {
    mealType?: string[];
    maxPrepTime?: number;
    doshaImpact?: {
        vata?: boolean;
        pitta?: boolean;
        kapha?: boolean;
    };
    tags?: string[];
    dietaryType?: string[];
    cookingMethod?: string[];
    cuisineType?: string[];
    prepDifficulty?: string;
}

const RecipeToolbar: React.FC<RecipeToolbarProps> = ({
    searchTerm,
    onSearchChange,
    onAddNew,
    filters = {
        mealType: [],
        maxPrepTime: 120,
        doshaImpact: { vata: false, pitta: false, kapha: false },
        tags: []
    },
    onFiltersChange = () => {}
}) => {
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState<RecipeFilters>(filters);
    const [activeFilterTab, setActiveFilterTab] = useState(0);

    // Meal type options
    const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
    
    // Dietary type options
    const dietaryTypes = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", "High-Protein"];
    
    // Cooking method options
    const cookingMethods = ["Baking", "Grilling", "Steaming", "Boiling", "Frying", "Raw", "Slow Cooking"];
    
    // Cuisine type options
    const cuisineTypes = ["Indian", "Mediterranean", "Asian", "European", "American", "Middle Eastern", "African"];
    
    // Difficulty level options
    const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

    const handleFilterChange = (newFilters: Partial<RecipeFilters>) => {
        const updatedFilters = { ...localFilters, ...newFilters };
        setLocalFilters(updatedFilters);
    };

    const applyFilters = () => {
        onFiltersChange(localFilters);
        setFilterDrawerOpen(false);
    };

    const resetFilters = () => {
        const emptyFilters = {
            mealType: [],
            maxPrepTime: 120,
            doshaImpact: { vata: false, pitta: false, kapha: false },
            tags: [],
            dietaryType: [],
            cookingMethod: [],
            cuisineType: [],
            prepDifficulty: ''
        };
        setLocalFilters(emptyFilters);
        onFiltersChange(emptyFilters);
    };

    const toggleDrawer = (open: boolean) => {
        setFilterDrawerOpen(open);
    };

    // Count active filters
    const activeFilterCount = (
        (localFilters.mealType?.length || 0) + 
        (localFilters.doshaImpact?.vata ? 1 : 0) +
        (localFilters.doshaImpact?.pitta ? 1 : 0) +
        (localFilters.doshaImpact?.kapha ? 1 : 0) +
        (localFilters.maxPrepTime !== 120 ? 1 : 0) +
        (localFilters.tags?.length || 0) +
        (localFilters.dietaryType?.length || 0) +
        (localFilters.cookingMethod?.length || 0) +
        (localFilters.cuisineType?.length || 0) +
        (localFilters.prepDifficulty ? 1 : 0)
    );
    
    // Handle tab change
    const handleFilterTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveFilterTab(newValue);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" component="h1">Recipe Manager</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAddNew}
                    color="primary"
                    sx={{ fontWeight: 600, borderRadius: 2 }}
                >
                    Add New Recipe
                </Button>
            </Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={9}>
                    <TextField
                        fullWidth
                        placeholder="Search recipes by name or ingredient..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button 
                        variant="outlined" 
                        startIcon={<FilterList />} 
                        endIcon={activeFilterCount > 0 && <Chip size="small" label={activeFilterCount} color="primary" />}
                        fullWidth 
                        sx={{
                            height: '100%',
                            borderRadius: 2,
                            borderWidth: activeFilterCount > 0 ? 2 : 1,
                            borderColor: activeFilterCount > 0 ? 'primary.main' : 'inherit'
                        }}
                        onClick={() => toggleDrawer(true)}
                    >
                        Filters
                    </Button>
                </Grid>
            </Grid>

            {/* Filter Drawer */}
            <Drawer
                anchor="right"
                open={filterDrawerOpen}
                onClose={() => toggleDrawer(false)}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 }, padding: 3 } }}
            >
                <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Filter Recipes</Typography>
                        <IconButton onClick={() => toggleDrawer(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Tabs 
                        value={activeFilterTab} 
                        onChange={handleFilterTabChange} 
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ mb: 3 }}
                    >
                        <Tab label="Basic" />
                        <Tab label="Dietary" />
                        <Tab label="Cooking" />
                        <Tab label="Ayurvedic" />
                    </Tabs>
                    
                    {/* Basic Filters - Tab 0 */}
                    {activeFilterTab === 0 && (
                        <>
                            {/* Meal Type Filter */}
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                                <RestaurantMenu sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                                Meal Type
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                {mealTypes.map((type) => (
                                    <Chip
                                        key={type}
                                        label={type}
                                        clickable
                                        color={localFilters.mealType?.includes(type) ? "primary" : "default"}
                                        onClick={() => {
                                            const updatedMealTypes = localFilters.mealType?.includes(type)
                                                ? localFilters.mealType.filter(t => t !== type)
                                                : [...(localFilters.mealType || []), type];
                                            handleFilterChange({ mealType: updatedMealTypes });
                                        }}
                                        sx={{ borderRadius: 1.5 }}
                                    />
                                ))}
                            </Box>

                            {/* Prep Time Filter */}
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                <Timer sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                                Maximum Preparation Time
                            </Typography>
                            <Box sx={{ px: 1, mb: 3 }}>
                                <Slider
                                    value={localFilters.maxPrepTime || 120}
                                    min={10}
                                    max={120}
                                    step={5}
                                    onChange={(_, value) => handleFilterChange({ maxPrepTime: value as number })}
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={(value) => `${value} min`}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="text.secondary">10 min</Typography>
                                    <Typography variant="caption" color="text.secondary">120 min</Typography>
                                </Box>
                            </Box>

                            {/* Difficulty level */}
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                Difficulty Level
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                {difficultyLevels.map((level) => (
                                    <Chip
                                        key={level}
                                        label={level}
                                        clickable
                                        color={localFilters.prepDifficulty === level ? "primary" : "default"}
                                        onClick={() => {
                                            handleFilterChange({ 
                                                prepDifficulty: localFilters.prepDifficulty === level ? '' : level 
                                            });
                                        }}
                                        sx={{ borderRadius: 1.5 }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}
                    
                    {/* Dietary Filters - Tab 1 */}
                    {activeFilterTab === 1 && (
                        <>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                                Dietary Preferences
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                {dietaryTypes.map((type) => (
                                    <Chip
                                        key={type}
                                        label={type}
                                        clickable
                                        color={localFilters.dietaryType?.includes(type) ? "primary" : "default"}
                                        onClick={() => {
                                            const updated = localFilters.dietaryType?.includes(type)
                                                ? localFilters.dietaryType.filter(t => t !== type)
                                                : [...(localFilters.dietaryType || []), type];
                                            handleFilterChange({ dietaryType: updated });
                                        }}
                                        sx={{ borderRadius: 1.5 }}
                                    />
                                ))}
                            </Box>
                            
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                Cuisine Types
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                {cuisineTypes.map((type) => (
                                    <Chip
                                        key={type}
                                        label={type}
                                        clickable
                                        color={localFilters.cuisineType?.includes(type) ? "primary" : "default"}
                                        onClick={() => {
                                            const updated = localFilters.cuisineType?.includes(type)
                                                ? localFilters.cuisineType.filter(t => t !== type)
                                                : [...(localFilters.cuisineType || []), type];
                                            handleFilterChange({ cuisineType: updated });
                                        }}
                                        sx={{ borderRadius: 1.5 }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}
                    
                    {/* Cooking Filters - Tab 2 */}
                    {activeFilterTab === 2 && (
                        <>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                                Cooking Methods
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                {cookingMethods.map((method) => (
                                    <Chip
                                        key={method}
                                        label={method}
                                        clickable
                                        color={localFilters.cookingMethod?.includes(method) ? "primary" : "default"}
                                        onClick={() => {
                                            const updated = localFilters.cookingMethod?.includes(method)
                                                ? localFilters.cookingMethod.filter(m => m !== method)
                                                : [...(localFilters.cookingMethod || []), method];
                                            handleFilterChange({ cookingMethod: updated });
                                        }}
                                        sx={{ borderRadius: 1.5 }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}
                    
                    {/* Ayurvedic Filters - Tab 3 */}
                    {activeFilterTab === 3 && (
                        <>
                            {/* Dosha Impact Filter */}
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                                Dosha Impact
                            </Typography>
                            <FormGroup row sx={{ mb: 3 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                            checked={localFilters.doshaImpact?.vata || false}
                                            onChange={(e) => handleFilterChange({
                                                doshaImpact: { ...localFilters.doshaImpact, vata: e.target.checked }
                                            })}
                                            color="info"
                                        />
                                    }
                                    label="Vata"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                            checked={localFilters.doshaImpact?.pitta || false}
                                            onChange={(e) => handleFilterChange({
                                                doshaImpact: { ...localFilters.doshaImpact, pitta: e.target.checked }
                                            })}
                                            color="warning"
                                        />
                                    }
                                    label="Pitta"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                            checked={localFilters.doshaImpact?.kapha || false}
                                            onChange={(e) => handleFilterChange({
                                                doshaImpact: { ...localFilters.doshaImpact, kapha: e.target.checked }
                                            })}
                                            color="success"
                                        />
                                    }
                                    label="Kapha"
                                />
                            </FormGroup>
                            
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                Taste (Rasa)
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                {["Sweet", "Sour", "Salty", "Pungent", "Bitter", "Astringent"].map((taste) => (
                                    <Chip
                                        key={taste}
                                        label={taste}
                                        clickable
                                        color="default"
                                        sx={{ borderRadius: 1.5 }}
                                    />
                                ))}
                            </Box>
                            
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                Energy (Virya)
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                {["Heating", "Cooling"].map((energy) => (
                                    <Chip
                                        key={energy}
                                        label={energy}
                                        clickable
                                        color="default"
                                        sx={{ borderRadius: 1.5 }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}

                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                        <Button 
                            onClick={resetFilters} 
                            startIcon={<ClearAll />}
                            color="inherit"
                        >
                            Reset Filters
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={applyFilters}
                        >
                            Apply Filters
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
};

export default RecipeToolbar;
