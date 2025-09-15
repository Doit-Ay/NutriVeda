
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  IconButton,
  Popover,
  Typography,
  Slider,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  Search,
  Add,
  FilterAlt,
  Compare,
  RestartAlt,
  ArrowDropDown,
  Check
} from '@mui/icons-material';

interface FoodToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  selectedDosha: string;
  onDoshaChange: (dosha: string) => void;
  doshas: string[];
  onAddNew: () => void;
  compareMode: boolean;
  onToggleCompareMode: () => void;
  nutritionFilter: { [key: string]: [number, number] };
  onNutritionFilterChange: (nutrient: string, range: [number, number]) => void;
}

const FoodToolbar: React.FC<FoodToolbarProps> = ({ 
    searchTerm, onSearchChange, 
    selectedCategory, onCategoryChange, categories, 
    selectedDosha, onDoshaChange, doshas, 
    onAddNew, compareMode, onToggleCompareMode,
    nutritionFilter, onNutritionFilterChange
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openFilterMenu = Boolean(filterAnchorEl);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleResetFilters = () => {
    onCategoryChange('all');
    onDoshaChange('all');
    onSearchChange('');
    onNutritionFilterChange('calories', [0, 1000]);
    onNutritionFilterChange('protein', [0, 100]);
    onNutritionFilterChange('carbs', [0, 100]);
    onNutritionFilterChange('fats', [0, 100]);
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedDosha !== 'all' || 
    searchTerm !== '' ||
    nutritionFilter.calories[0] > 0 ||
    nutritionFilter.calories[1] < 1000 ||
    nutritionFilter.protein[0] > 0 ||
    nutritionFilter.protein[1] < 100 ||
    nutritionFilter.carbs[0] > 0 ||
    nutritionFilter.carbs[1] < 100 ||
    nutritionFilter.fats[0] > 0 ||
    nutritionFilter.fats[1] < 100;

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search foods, ingredients, properties..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <Search />
                        </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => onSearchChange('')}>
                          <RestartAlt fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                }}
                size="medium"
            />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
             <FormControl fullWidth variant="outlined" size="medium">
                <InputLabel>Category</InputLabel>
                <Select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value as string)}
                    label="Category"
                >
                    {categories.map(c => (
                      <MenuItem key={c} value={c}>
                        {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
                      </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined" size="medium">
                <InputLabel>Dosha</InputLabel>
                <Select
                    value={selectedDosha}
                    onChange={(e) => onDoshaChange(e.target.value as string)}
                    label="Dosha"
                >
                   {doshas.map(d => (
                     <MenuItem key={d} value={d}>
                       {d === 'all' ? 'All Doshas' : d}
                     </MenuItem>
                   ))}
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Tooltip title="Advanced Filters">
              <Button
                  variant={hasActiveFilters ? "contained" : "outlined"}
                  color={hasActiveFilters ? "secondary" : "primary"}
                  startIcon={<FilterAlt />}
                  endIcon={<ArrowDropDown />}
                  onClick={handleFilterClick}
                  sx={{ height: '56px' }}
              >
                  Filters {hasActiveFilters && <Chip 
                    label={<Check fontSize="small" />} 
                    color="primary" 
                    size="small" 
                    sx={{ ml: 1, height: 22, width: 22, '& .MuiChip-label': { p: 0 } }}
                  />}
              </Button>
            </Tooltip>
            
            <Tooltip title={compareMode ? "Exit Compare Mode" : "Compare Foods"}>
              <Button
                  variant={compareMode ? "contained" : "outlined"}
                  color={compareMode ? "info" : "primary"}
                  startIcon={<Compare />}
                  onClick={onToggleCompareMode}
                  sx={{ height: '56px', minWidth: '56px', px: { xs: 1, sm: 2 } }}
              >
                  {compareMode ? "Exit Compare" : "Compare"}
              </Button>
            </Tooltip>
            
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={onAddNew}
                sx={{ height: '56px' }}
            >
                Add Food
            </Button>
        </Grid>
      </Grid>

      <Popover
        open={openFilterMenu}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ mt: 1 }}
      >
        <Paper sx={{ p: 3, width: 300, maxWidth: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Advanced Filters</Typography>
            <Button size="small" startIcon={<RestartAlt />} onClick={handleResetFilters}>
              Reset
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>Calories</Typography>
          <Box sx={{ px: 1, mb: 3 }}>
            <Slider
              value={nutritionFilter.calories}
              onChange={(_, newValue) => onNutritionFilterChange('calories', newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              marks={[
                { value: 0, label: '0' },
                { value: 500, label: '500' },
                { value: 1000, label: '1000' }
              ]}
            />
          </Box>

          <Typography variant="subtitle2" gutterBottom>Protein (g)</Typography>
          <Box sx={{ px: 1, mb: 3 }}>
            <Slider
              value={nutritionFilter.protein}
              onChange={(_, newValue) => onNutritionFilterChange('protein', newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              marks={[
                { value: 0, label: '0' },
                { value: 50, label: '50' },
                { value: 100, label: '100' }
              ]}
            />
          </Box>

          <Typography variant="subtitle2" gutterBottom>Carbs (g)</Typography>
          <Box sx={{ px: 1, mb: 3 }}>
            <Slider
              value={nutritionFilter.carbs}
              onChange={(_, newValue) => onNutritionFilterChange('carbs', newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              marks={[
                { value: 0, label: '0' },
                { value: 50, label: '50' },
                { value: 100, label: '100' }
              ]}
            />
          </Box>

          <Typography variant="subtitle2" gutterBottom>Fats (g)</Typography>
          <Box sx={{ px: 1, mb: 3 }}>
            <Slider
              value={nutritionFilter.fats}
              onChange={(_, newValue) => onNutritionFilterChange('fats', newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              marks={[
                { value: 0, label: '0' },
                { value: 50, label: '50' },
                { value: 100, label: '100' }
              ]}
            />
          </Box>
        </Paper>
      </Popover>
    </Box>
  );
};

export default FoodToolbar;
