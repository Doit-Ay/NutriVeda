
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
  Popover,
  Typography,
  Slider,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Add,
  FilterList,
  Clear,
  TrendingUp,
  DateRange,
  Sort,
  Person,
  Tune,
} from '@mui/icons-material';

interface FilterState {
  dosha: string;
  ageRange: [number, number];
  gender: string;
  lastVisit: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface PatientToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterDosha: string;
  onFilterDoshaChange: (dosha: string) => void;
  onAddNew: () => void;
  onFilterChange?: (filters: FilterState) => void;
}

const doshas = ['all', 'Vata', 'Pitta', 'Kapha'];
const genderOptions = ['all', 'male', 'female', 'other'];
const lastVisitOptions = ['all', 'week', 'month', '3months', '6months', 'year'];
const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'age', label: 'Age' },
  { value: 'lastVisit', label: 'Last Visit' },
  { value: 'createdAt', label: 'Registration Date' },
];

const PatientToolbar: React.FC<PatientToolbarProps> = ({ 
    searchTerm, onSearchChange, 
    filterDosha, onFilterDoshaChange, 
    onAddNew,
    onFilterChange 
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState<FilterState>({
    dosha: filterDosha || 'all',
    ageRange: [0, 100],
    gender: 'all',
    lastVisit: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (field: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);

    // Count active filters
    let count = 0;
    if (newFilters.dosha !== 'all') count++;
    if (newFilters.gender !== 'all') count++;
    if (newFilters.lastVisit !== 'all') count++;
    if (newFilters.ageRange[0] !== 0 || newFilters.ageRange[1] !== 100) count++;
    if (newFilters.sortBy !== 'name' || newFilters.sortOrder !== 'asc') count++;
    setActiveFiltersCount(count);
  };

  const handleClearFilters = () => {
    const defaultFilters: FilterState = {
      dosha: 'all',
      ageRange: [0, 100],
      gender: 'all',
      lastVisit: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
    setActiveFiltersCount(0);
  };

  const formatLastVisit = (value: string) => {
    switch (value) {
      case 'week': return 'Last Week';
      case 'month': return 'Last Month';
      case '3months': return 'Last 3 Months';
      case '6months': return 'Last 6 Months';
      case 'year': return 'Last Year';
      default: return 'All Time';
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          backgroundColor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="medium"
              placeholder="Search patients by name, email, or condition..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleFilterClick}
                startIcon={<FilterList />}
                endIcon={activeFiltersCount > 0 && 
                  <Chip 
                    label={activeFiltersCount} 
                    size="small" 
                    color="primary"
                    sx={{ height: 20, minWidth: 20 }}
                  />
                }
                sx={{ 
                  borderRadius: 2,
                  px: 2,
                  height: '100%',
                  borderColor: activeFiltersCount > 0 ? 'primary.main' : 'divider'
                }}
              >
                Filters
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={onAddNew}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Add New Patient
              </Button>
            </Box>
          </Grid>
        </Grid>

        {activeFiltersCount > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Active Filters:
            </Typography>
            {filters.dosha !== 'all' && (
              <Chip 
                label={`Dosha: ${filters.dosha}`}
                onDelete={() => handleFilterChange('dosha', 'all')}
                size="small"
              />
            )}
            {filters.gender !== 'all' && (
              <Chip 
                label={`Gender: ${filters.gender}`}
                onDelete={() => handleFilterChange('gender', 'all')}
                size="small"
              />
            )}
            {filters.lastVisit !== 'all' && (
              <Chip 
                label={`Visit: ${formatLastVisit(filters.lastVisit)}`}
                onDelete={() => handleFilterChange('lastVisit', 'all')}
                size="small"
              />
            )}
            {(filters.ageRange[0] !== 0 || filters.ageRange[1] !== 100) && (
              <Chip 
                label={`Age: ${filters.ageRange[0]}-${filters.ageRange[1]}`}
                onDelete={() => handleFilterChange('ageRange', [0, 100])}
                size="small"
              />
            )}
            <Button 
              size="small" 
              startIcon={<Clear />}
              onClick={handleClearFilters}
              sx={{ ml: 'auto' }}
            >
              Clear All
            </Button>
          </Box>
        )}
      </Paper>

      <Popover
        open={Boolean(filterAnchorEl)}
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
        PaperProps={{
          sx: {
            mt: 1,
            width: 320,
            borderRadius: 2,
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Filter Patients
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Constitutional Type (Prakriti)
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.dosha}
                onChange={(e) => handleFilterChange('dosha', e.target.value)}
              >
                {doshas.map(d => (
                  <MenuItem key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Age Range
            </Typography>
            <Slider
              value={filters.ageRange}
              onChange={(_, value) => handleFilterChange('ageRange', value)}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                0 years
              </Typography>
              <Typography variant="caption" color="text.secondary">
                100 years
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Gender
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
              >
                {genderOptions.map(g => (
                  <MenuItem key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Last Visit
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filters.lastVisit}
                onChange={(e) => handleFilterChange('lastVisit', e.target.value)}
              >
                {lastVisitOptions.map(o => (
                  <MenuItem key={o} value={o}>
                    {formatLastVisit(o)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Sort By
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  {sortOptions.map(o => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton 
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                color={filters.sortOrder === 'desc' ? 'primary' : 'default'}
              >
                <Sort sx={{ 
                  transform: filters.sortOrder === 'desc' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s'
                }} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button 
              variant="outlined" 
              onClick={handleClearFilters}
              startIcon={<Clear />}
            >
              Clear All
            </Button>
            <Button 
              variant="contained" 
              onClick={handleFilterClose}
              startIcon={<Tune />}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default PatientToolbar;
