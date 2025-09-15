
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Tooltip,
  IconButton,
  Avatar,
  LinearProgress,
  Checkbox,
  CardHeader,
  CardMedia,
  Divider
} from '@mui/material';
import { FoodItem } from '../../types';
import {
  Edit, 
  Delete, 
  Visibility, 
  Restaurant as FoodIcon,
  LocalFireDepartment as CalorieIcon,
  Egg as ProteinIcon,
  Grain as CarbsIcon,
  Water as FatsIcon,
  Compare as CompareIcon,
  CheckCircle
} from '@mui/icons-material';

interface FoodCardViewProps {
  foods: FoodItem[];
  onView: (food: FoodItem) => void;
  onEdit: (food: FoodItem) => void;
  onDelete: (food: FoodItem) => void;
  compareMode?: boolean;
  foodsToCompare?: FoodItem[];
  onToggleCompare?: (food: FoodItem) => void;
}

const DoshaChip = ({dosha, impact}: {dosha: string, impact: number}) => {
  let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";
  let variant: "filled" | "outlined" = "outlined";
  
  if (impact > 0) {
    color = "success";
    variant = "filled";
  } else if (impact < 0) {
    color = "error";
    variant = "filled";
  }
  
  return (
    <Tooltip title={`${impact > 0 ? 'Pacifies' : impact < 0 ? 'Aggravates' : 'Neutral for'} ${dosha}`}>
      <Chip 
        label={dosha}
        size="small"
        color={color}
        variant={variant}
        sx={{
          mr: 0.5, 
          fontWeight: 500,
          fontSize: '0.7rem',
          height: 22
        }}
      />
    </Tooltip>
  );
};

const NutrientBar = ({ 
  label, 
  value, 
  maxValue, 
  color = "primary",
  icon
}: {
  label: string;
  value: number;
  maxValue: number;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  icon: React.ReactNode;
}) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {value}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={Math.min(percentage, 100)} 
        color={color}
        sx={{ height: 6, borderRadius: 3 }}
      />
    </Box>
  );
};

const FoodCardView: React.FC<FoodCardViewProps> = ({ 
  foods, 
  onView, 
  onEdit, 
  onDelete, 
  compareMode = false,
  foodsToCompare = [],
  onToggleCompare = () => {}
}) => {
  if (foods.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <FoodIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
        <Typography variant="h6" color="text.secondary">No foods found matching your filters</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your search or filter criteria
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {foods.map((food) => {
        const isSelected = foodsToCompare.some(f => f.id === food.id);
        
        return (
          <Grid item key={food.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              position: 'relative',
              boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
              border: isSelected ? '2px solid' : '1px solid',
              borderColor: isSelected ? 'primary.main' : 'divider',
              background: '#fff',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 20px 0 rgba(0,0,0,0.08)',
              },
            }}>
              {compareMode && (
                <Checkbox
                  checked={isSelected}
                  onChange={() => onToggleCompare(food)}
                  disabled={!isSelected && foodsToCompare.length >= 3}
                  sx={{
                    position: 'absolute', 
                    right: 8, 
                    top: 8, 
                    zIndex: 2,
                    '& .MuiSvgIcon-root': { 
                      fontSize: 24,
                    },
                  }}
                  icon={<CompareIcon />}
                  checkedIcon={<CheckCircle color="primary" />}
                />
              )}
              
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <FoodIcon />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    {food.name}
                  </Typography>
                }
                subheader={
                  <Chip 
                    label={food.category} 
                    size="small" 
                    color="default"
                    sx={{ mt: 0.5, fontWeight: 500 }}
                  />
                }
              />
              
              <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                  {food.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <NutrientBar 
                    label="Calories" 
                    value={food.calories} 
                    maxValue={500} 
                    color="error" 
                    icon={<CalorieIcon fontSize="small" color="error" />} 
                  />
                  <NutrientBar 
                    label="Protein" 
                    value={food.protein} 
                    maxValue={50} 
                    color="success" 
                    icon={<ProteinIcon fontSize="small" color="success" />} 
                  />
                  <NutrientBar 
                    label="Carbs" 
                    value={food.carbs} 
                    maxValue={100} 
                    color="warning" 
                    icon={<CarbsIcon fontSize="small" color="warning" />} 
                  />
                  <NutrientBar 
                    label="Fats" 
                    value={food.fats} 
                    maxValue={50} 
                    color="info" 
                    icon={<FatsIcon fontSize="small" color="info" />} 
                  />
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Dosha Impact
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <DoshaChip dosha="Vata" impact={food.ayurvedicProperties.doshaImpact.vata}/>
                  <DoshaChip dosha="Pitta" impact={food.ayurvedicProperties.doshaImpact.pitta}/>
                  <DoshaChip dosha="Kapha" impact={food.ayurvedicProperties.doshaImpact.kapha}/>
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider', p: 1.5 }}>
                <Button 
                  size="small" 
                  startIcon={<Visibility/>} 
                  onClick={() => onView(food)} 
                  variant="text"
                >
                  View
                </Button>
                <Box>
                  <IconButton size="small" onClick={() => onEdit(food)} color="info">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(food)} color="error" sx={{ ml: 1 }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default FoodCardView;
