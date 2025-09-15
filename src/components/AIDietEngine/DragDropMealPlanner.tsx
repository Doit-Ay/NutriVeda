import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Restaurant,
  Edit,
  Delete,
  AddCircleOutline,
  DragIndicator,
  WaterDrop,
  LocalFireDepartment,
  Spa
} from '@mui/icons-material';
import { Meal, FoodItem } from '../../types';

interface MealsByType {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
  snacks: Meal[];
}

interface DragDropMealPlannerProps {
  meals: MealsByType;
  onMealsChange: (meals: MealsByType) => void;
  onEditMeal: (meal: Meal, mealType: string) => void;
}

const DragDropMealPlanner: React.FC<DragDropMealPlannerProps> = ({
  meals,
  onMealsChange,
  onEditMeal
}) => {
  const theme = useTheme();

  // Get meal type color
  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return theme.palette.mode === 'dark' ? '#388e3c' : '#4caf50';
      case 'lunch':
        return theme.palette.mode === 'dark' ? '#ef6c00' : '#ff9800';
      case 'dinner':
        return theme.palette.mode === 'dark' ? '#1976d2' : '#2196f3';
      case 'snacks':
        return theme.palette.mode === 'dark' ? '#7b1fa2' : '#9c27b0';
      default:
        return theme.palette.text.secondary;
    }
  };

  // Handle drag end event
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    
    // Dropped outside a valid area
    if (!destination) return;
    
    // Same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Get source and destination meal types
    const sourceType = source.droppableId as keyof MealsByType;
    const destType = destination.droppableId as keyof MealsByType;
    
    // Create new meals object
    const newMeals = { ...meals };
    
    // Move within the same list
    if (sourceType === destType) {
      const [removed] = newMeals[sourceType].splice(source.index, 1);
      newMeals[sourceType].splice(destination.index, 0, removed);
    } 
    // Move between lists
    else {
      const [removed] = newMeals[sourceType].splice(source.index, 1);
      newMeals[destType].splice(destination.index, 0, removed);
    }
    
    onMealsChange(newMeals);
  };

  const renderMealCard = (meal: Meal, index: number, mealType: string) => (
    <Draggable key={meal.id} draggableId={meal.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            mb: 2,
            borderLeft: `4px solid ${getMealTypeColor(mealType)}`,
            boxShadow: snapshot.isDragging ? 8 : 1,
            opacity: snapshot.isDragging ? 0.8 : 1
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }} {...provided.dragHandleProps}>
                <DragIndicator sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2">{meal.name}</Typography>
              </Box>
              <Box>
                <Tooltip title="Edit Meal">
                  <IconButton 
                    size="small" 
                    onClick={() => onEditMeal(meal, mealType)}
                    sx={{ mr: 0.5 }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Chip 
                  label={`${meal.totalCalories} cal`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
            </Box>
            
            <List dense disablePadding>
              {meal.foods.slice(0, 2).map((food: FoodItem, index: number) => (
                <ListItem key={index} sx={{ py: 0.25, px: 0 }} dense disablePadding>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Restaurant fontSize="small" sx={{ fontSize: '0.9rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {food.name}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              {meal.foods.length > 2 && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 3.5 }}>
                  +{meal.foods.length - 2} more items
                </Typography>
              )}
            </List>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Grid container spacing={2}>
        {(['breakfast', 'lunch', 'dinner', 'snacks'] as (keyof MealsByType)[]).map((mealType) => (
          <Grid item xs={12} md={3} key={mealType}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', 
                borderRadius: 2,
                height: '100%'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2,
                pb: 1,
                borderBottom: `2px solid ${getMealTypeColor(mealType)}`
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    textTransform: 'capitalize',
                    fontWeight: 500,
                    color: getMealTypeColor(mealType)
                  }}
                >
                  {mealType}
                </Typography>
                <Tooltip title={`Add ${mealType}`}>
                  <IconButton size="small">
                    <AddCircleOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Droppable droppableId={mealType}>
                {(provided: DroppableProvided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ minHeight: 200 }}
                  >
                    {meals[mealType].map((meal, index) => renderMealCard(meal, index, mealType))}
                    {provided.placeholder}
                    
                    {meals[mealType].length === 0 && (
                      <Box 
                        sx={{ 
                          height: 100, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          border: '1px dashed',
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: 'background.paper'
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Drop meals here
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Droppable>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </DragDropContext>
  );
};

export default DragDropMealPlanner;