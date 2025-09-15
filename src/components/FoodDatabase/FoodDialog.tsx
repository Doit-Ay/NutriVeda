import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Slider,
  Typography,
  Autocomplete,
  Tab,
  Tabs,
  Paper,
  InputAdornment,
  Alert,
  Divider,
  IconButton,
  Rating,
  Tooltip,
  Stack
} from '@mui/material';
import {
  LocalFireDepartment as CalorieIcon,
  Egg as ProteinIcon,
  Grain as CarbsIcon,
  Water as FatsIcon,
  Restaurant as FoodIcon,
  Save,
  HelpOutline,
  InfoOutlined
} from '@mui/icons-material';
import { FoodItem, DoshaImpact, AyurvedicProperties } from '../../types';

interface FoodDialogProps {
  open: boolean;
  onClose: () => void;
  food: FoodItem | null;
  categories: string[];
  onSave?: (newFood: FoodItem) => void;
}

const emptyFood: Partial<FoodItem> = {
  name: '',
  description: '',
  category: '',
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,
  ayurvedicProperties: {
    rasa: [],
    guna: [], // Corrected from gunas
    virya: 'Heating',
    vipaka: 'Sweet',
    doshaImpact: {
      vata: 0,
      pitta: 0,
      kapha: 0,
    },
  },
  benefits: [],
  contraindications: [],
  bestTimeToEat: [],
  preparation: '',
};

const allRasas = ['Sweet', 'Sour', 'Salty', 'Pungent', 'Bitter', 'Astringent'];
const allGunas = ['Light', 'Heavy', 'Dry', 'Oily', 'Hot', 'Cold', 'Sharp', 'Slow'];

const FoodDialog: React.FC<FoodDialogProps> = ({ open, onClose, food, categories, onSave }) => {
  const [formData, setFormData] = useState<Partial<FoodItem>>(emptyFood);
  const [tabValue, setTabValue] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (food) {
      setFormData(food);
    } else {
      setFormData(emptyFood);
    }
  }, [food, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value 
    }));
  };

  const handleAyurvedicChange = (field: keyof AyurvedicProperties, value: any) => {
    setFormData(prev => ({
      ...prev,
      ayurvedicProperties: {
        ...(prev.ayurvedicProperties || emptyFood.ayurvedicProperties!),
        [field]: value
      }
    }));
  };

  const handleDoshaChange = (dosha: keyof DoshaImpact, value: number) => {
    setFormData(prev => ({
      ...prev,
      ayurvedicProperties: {
        ...(prev.ayurvedicProperties || emptyFood.ayurvedicProperties!),
        doshaImpact: {
          ...(prev.ayurvedicProperties?.doshaImpact || emptyFood.ayurvedicProperties!.doshaImpact),
          [dosha]: value
        }
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.category?.trim()) newErrors.category = 'Category is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    
    // Nutritional values validation
    if (formData.calories! < 0) newErrors.calories = 'Cannot be negative';
    if (formData.protein! < 0) newErrors.protein = 'Cannot be negative';
    if (formData.carbs! < 0) newErrors.carbs = 'Cannot be negative';
    if (formData.fats! < 0) newErrors.fats = 'Cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Here you would typically save the data
      console.log('Saving:', formData);
      
      // If onSave prop exists, call it with the form data
      if (onSave && formData.id) {
        onSave(formData as FoodItem);
      }
      
      onClose();
    } else {
      // Focus the tab with errors
      if (errors.name || errors.category || errors.description) {
        setTabValue(0);
      } else if (errors.calories || errors.protein || errors.carbs || errors.fats) {
        setTabValue(1);
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
        style={{ padding: '20px 0' }}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, display: 'flex', alignItems: 'center' }}>
        <FoodIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {food ? 'Edit Food Item' : 'Add New Food Item'}
        </Typography>
        {food && (
          <Chip 
            label={food.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{ ml: 2 }} 
          />
        )}
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable" 
          scrollButtons="auto"
          sx={{ px: 2 }}
        >
          <Tab label="Basic Info" />
          <Tab label="Nutritional Values" />
          <Tab label="Ayurvedic Properties" />
          <Tab label="Health & Usage" />
        </Tabs>
      </Box>

      <DialogContent dividers sx={{ p: 3 }}>
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <TextField 
                label="Name" 
                name="name" 
                value={formData.name || ''} 
                onChange={handleChange} 
                fullWidth 
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={!!errors.category} required>
                <InputLabel>Category</InputLabel>
                <Select 
                  name="category" 
                  value={formData.category || ''} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                  label="Category"
                >
                  {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
                {errors.category && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Description" 
                name="description" 
                value={formData.description || ''} 
                onChange={handleChange} 
                multiline 
                rows={3} 
                fullWidth 
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CalorieIcon sx={{ mr: 1, color: 'error.main' }} />
                Nutritional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField 
                label="Calories" 
                name="calories" 
                type="number" 
                value={formData.calories || 0} 
                onChange={handleChange} 
                fullWidth 
                error={!!errors.calories}
                helperText={errors.calories}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><CalorieIcon color="error" fontSize="small" /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField 
                label="Protein (g)" 
                name="protein" 
                type="number" 
                value={formData.protein || 0} 
                onChange={handleChange} 
                fullWidth 
                error={!!errors.protein}
                helperText={errors.protein}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><ProteinIcon color="success" fontSize="small" /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField 
                label="Carbs (g)" 
                name="carbs" 
                type="number" 
                value={formData.carbs || 0} 
                onChange={handleChange} 
                fullWidth 
                error={!!errors.carbs}
                helperText={errors.carbs}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><CarbsIcon color="warning" fontSize="small" /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField 
                label="Fats (g)" 
                name="fats" 
                type="number" 
                value={formData.fats || 0} 
                onChange={handleChange} 
                fullWidth 
                error={!!errors.fats}
                helperText={errors.fats}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><FatsIcon color="info" fontSize="small" /></InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={6} sm={4}>
              <TextField 
                label="Fiber (g)" 
                name="fiber" 
                type="number" 
                value={formData.fiber || 0} 
                onChange={handleChange} 
                fullWidth 
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField 
                label="Sugar (g)" 
                name="sugar" 
                type="number" 
                value={formData.sugar || 0} 
                onChange={handleChange} 
                fullWidth 
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField 
                label="Sodium (mg)" 
                name="sodium" 
                type="number" 
                value={formData.sodium || 0} 
                onChange={handleChange} 
                fullWidth 
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoOutlined sx={{ mr: 1, color: 'primary.main' }} />
                Ayurvedic Properties
                <Tooltip title="These properties determine how the food affects different body constitutions according to Ayurveda">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Taste (Rasa)</InputLabel>
                <Select
                  multiple
                  value={formData.ayurvedicProperties?.rasa || []}
                  onChange={(e) => handleAyurvedicChange('rasa', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {allRasas.map((rasa) => (
                    <MenuItem key={rasa} value={rasa}>
                      {rasa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Qualities (Guna)</InputLabel>
                <Select
                  multiple
                  value={formData.ayurvedicProperties?.guna || []}
                  onChange={(e) => handleAyurvedicChange('guna', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {allGunas.map((guna) => (
                    <MenuItem key={guna} value={guna}>
                      {guna}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Energy (Virya)</InputLabel>
                <Select 
                  label="Energy (Virya)" 
                  value={formData.ayurvedicProperties?.virya || 'Heating'} 
                  onChange={(e) => handleAyurvedicChange('virya', e.target.value)}
                >
                  <MenuItem value="Heating">Heating</MenuItem>
                  <MenuItem value="Cooling">Cooling</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Post-Digestive (Vipaka)</InputLabel>
                <Select 
                  label="Post-Digestive (Vipaka)" 
                  value={formData.ayurvedicProperties?.vipaka || 'Sweet'} 
                  onChange={(e) => handleAyurvedicChange('vipaka', e.target.value)}
                >
                  <MenuItem value="Sweet">Sweet</MenuItem>
                  <MenuItem value="Sour">Sour</MenuItem>
                  <MenuItem value="Pungent">Pungent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Dosha Impact
              </Typography>
              <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Typography gutterBottom>Vata</Typography>
                    <Slider 
                      value={formData.ayurvedicProperties?.doshaImpact?.vata || 0} 
                      onChange={(_, v) => handleDoshaChange('vata', v as number)} 
                      min={-2} 
                      max={2} 
                      step={1} 
                      marks={[
                        {value: -2, label: 'Aggravates'}, 
                        {value: 0, label: 'Neutral'}, 
                        {value: 2, label: 'Pacifies'}
                      ]} 
                      color={formData.ayurvedicProperties?.doshaImpact?.vata! < 0 ? "error" : "success"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography gutterBottom>Pitta</Typography>
                    <Slider 
                      value={formData.ayurvedicProperties?.doshaImpact?.pitta || 0} 
                      onChange={(_, v) => handleDoshaChange('pitta', v as number)} 
                      min={-2} 
                      max={2} 
                      step={1} 
                      marks={[
                        {value: -2, label: 'Aggravates'}, 
                        {value: 0, label: 'Neutral'}, 
                        {value: 2, label: 'Pacifies'}
                      ]} 
                      color={formData.ayurvedicProperties?.doshaImpact?.pitta! < 0 ? "error" : "success"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography gutterBottom>Kapha</Typography>
                    <Slider 
                      value={formData.ayurvedicProperties?.doshaImpact?.kapha || 0} 
                      onChange={(_, v) => handleDoshaChange('kapha', v as number)} 
                      min={-2} 
                      max={2} 
                      step={1} 
                      marks={[
                        {value: -2, label: 'Aggravates'}, 
                        {value: 0, label: 'Neutral'}, 
                        {value: 2, label: 'Pacifies'}
                      ]} 
                      color={formData.ayurvedicProperties?.doshaImpact?.kapha! < 0 ? "error" : "success"}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Health Benefits & Usage
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={[]}
                freeSolo
                value={formData.benefits || []}
                onChange={(event, newValue) => {
                  setFormData({...formData, benefits: newValue});
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip 
                      variant="outlined" 
                      label={option} 
                      size="small"
                      color="success"
                      {...getTagProps({ index })} 
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Health Benefits"
                    placeholder="Add benefits"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={[]}
                freeSolo
                value={formData.contraindications || []}
                onChange={(event, newValue) => {
                  setFormData({...formData, contraindications: newValue});
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip 
                      variant="outlined" 
                      label={option} 
                      size="small"
                      color="error"
                      {...getTagProps({ index })} 
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Contraindications"
                    placeholder="Add contraindications"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={['Morning', 'Afternoon', 'Evening', 'Before meals', 'After meals', 'With meals']}
                freeSolo
                value={formData.bestTimeToEat || []}
                onChange={(event, newValue) => {
                  setFormData({...formData, bestTimeToEat: newValue});
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip 
                      variant="outlined" 
                      label={option} 
                      size="small"
                      color="info"
                      {...getTagProps({ index })} 
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Best Time to Eat"
                    placeholder="Add time recommendations"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Preparation Notes"
                name="preparation"
                value={formData.preparation || ''}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                placeholder="Add preparation methods and tips..."
              />
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary" 
          startIcon={<Save />}
        >
          {food ? 'Save Changes' : 'Create Food Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FoodDialog;