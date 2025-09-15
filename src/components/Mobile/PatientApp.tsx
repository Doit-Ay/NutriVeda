import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material';
import {
  Home,
  Restaurant,
  Assessment,
  Person,
  Notifications,
  CheckCircle,
  WaterDrop,
  FitnessCenter,
  Psychology,
  TrendingUp,
  Add,
  Edit,
  Share,
  Download,
  LocalDining,
  HealthAndSafety,
  Settings,
  Timeline
} from '@mui/icons-material';


interface DietPlan {
  id: string;
  name: string;
  duration: string;
  startDate: string;
  endDate: string;
  meals: Meal[];
  progress: number;
  compliance: number;
}

interface Meal {
  id: string;
  name: string;
  time: string;
  foods: string[];
  calories: number;
  completed: boolean;
  notes?: string;
}

interface WaterIntake {
  date: string;
  amount: number; // in ml
  goal: number;
}

interface ProgressData {
  weight: number;
  energy: number;
  mood: number;
  sleep: number;
  compliance: number;
}

const PatientApp: React.FC = () => {
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [openMealDialog, setOpenMealDialog] = useState(false);
  const [selectedMeal] = useState<Meal | null>(null);
  const [waterIntake, setWaterIntake] = useState<WaterIntake>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    goal: 2500
  });

  const [dietPlans] = useState<DietPlan[]>([
    {
      id: '1',
      name: 'Diabetes Management Plan',
      duration: '30 days',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      progress: 75,
      compliance: 87,
      meals: [
        {
          id: '1',
          name: 'Breakfast',
          time: '7:00 AM',
          foods: ['Oats with berries', 'Almond milk', 'Chia seeds'],
          calories: 350,
          completed: true,
          notes: 'Eat within 1 hour of waking'
        },
        {
          id: '2',
          name: 'Lunch',
          time: '1:00 PM',
          foods: ['Quinoa salad', 'Grilled vegetables', 'Lentil soup'],
          calories: 450,
          completed: false,
          notes: 'Include leafy greens'
        },
        {
          id: '3',
          name: 'Dinner',
          time: '7:00 PM',
          foods: ['Steamed fish', 'Brown rice', 'Steamed broccoli'],
          calories: 400,
          completed: false,
          notes: 'Light and easy to digest'
        }
      ]
    }
  ]);

  const [progressData] = useState<ProgressData>({
    weight: 72,
    energy: 8,
    mood: 7,
    sleep: 6,
    compliance: 87
  });


  const handleBottomNavChange = (event: React.SyntheticEvent, newValue: number) => {
    setBottomNavValue(newValue);
  };

  const handleMealComplete = (mealId: string) => {
    console.log('Meal completed:', mealId);
    // Update meal completion status
  };

  const handleWaterIntake = (amount: number) => {
    setWaterIntake(prev => ({
      ...prev,
      amount: Math.min(prev.amount + amount, prev.goal)
    }));
  };

  const getMealIcon = (mealName: string) => {
    switch (mealName.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'success';
    if (compliance >= 70) return 'warning';
    return 'error';
  };

  const DashboardView = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Welcome back! 👋
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {progressData.compliance}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Diet Compliance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {progressData.weight}kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Weight
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Today's Water Intake
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WaterDrop sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">
              {waterIntake.amount}ml / {waterIntake.goal}ml
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(waterIntake.amount / waterIntake.goal) * 100} 
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => handleWaterIntake(250)}
            >
              +250ml
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => handleWaterIntake(500)}
            >
              +500ml
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Today's Meals
          </Typography>
          {dietPlans[0].meals.map((meal) => (
            <Card key={meal.id} sx={{ mb: 2, bgcolor: meal.completed ? 'success.light' : 'background.paper' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ mr: 1 }}>
                      {getMealIcon(meal.name)}
                    </Typography>
                    <Box>
                      <Typography variant="subtitle1">{meal.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {meal.time} • {meal.calories} cal
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    {meal.completed ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => handleMealComplete(meal.id)}
                      >
                        Mark Done
                      </Button>
                    )}
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {meal.foods.join(', ')}
                </Typography>
                {meal.notes && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    💡 {meal.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </Box>
  );

  const DietPlansView = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        My Diet Plans
      </Typography>
      
      {dietPlans.map((plan) => (
        <Card key={plan.id} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6">{plan.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {plan.duration} • {plan.startDate} to {plan.endDate}
                </Typography>
              </Box>
              <Chip 
                label={`${plan.compliance}% compliance`} 
                color={getComplianceColor(plan.compliance) as any}
                size="small"
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Progress</Typography>
                <Typography variant="body2">{plan.progress}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={plan.progress} />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" startIcon={<Edit />}>
                Edit
              </Button>
              <Button size="small" variant="outlined" startIcon={<Share />}>
                Share
              </Button>
              <Button size="small" variant="outlined" startIcon={<Download />}>
                Export
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const ProgressView = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        My Progress
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {progressData.energy}/10
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Energy Level
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {progressData.mood}/10
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mood
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {progressData.sleep}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sleep
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {progressData.compliance}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compliance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weekly Progress
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Track your daily progress and see how you're improving over time.
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              📊 Progress charts will be displayed here
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const ProfileView = () => (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
              JD
            </Avatar>
            <Box>
              <Typography variant="h6">John Doe</Typography>
              <Typography variant="body2" color="text.secondary">
                Patient ID: P001
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since Jan 2024
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" startIcon={<Edit />}>
              Edit Profile
            </Button>
            <Button size="small" variant="outlined" startIcon={<Settings />}>
              Settings
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Health Information
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><FitnessCenter /></ListItemIcon>
              <ListItemText primary="Weight" secondary="72 kg" />
            </ListItem>
            <ListItem>
              <ListItemIcon><HealthAndSafety /></ListItemIcon>
              <ListItemText primary="Height" secondary="175 cm" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Psychology /></ListItemIcon>
              <ListItemText primary="Dosha Type" secondary="Pitta-Vata" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Assessment /></ListItemIcon>
              <ListItemText primary="BMI" secondary="23.5 (Normal)" />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" startIcon={<Assessment />}>
                Log Symptoms
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" startIcon={<Restaurant />}>
                Log Meal
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" startIcon={<WaterDrop />}>
                Log Water
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" startIcon={<Timeline />}>
                View History
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Mobile Header */}
      <Paper sx={{ position: 'sticky', top: 0, zIndex: 1, borderRadius: 0 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">NutriVeda</Typography>
          <IconButton>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ pb: 8 }}>
        {bottomNavValue === 0 && <DashboardView />}
        {bottomNavValue === 1 && <DietPlansView />}
        {bottomNavValue === 2 && <ProgressView />}
        {bottomNavValue === 3 && <ProfileView />}
      </Box>

      {/* Bottom Navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '100%', 
          maxWidth: 400,
          borderRadius: 0 
        }}
      >
        <BottomNavigation
          value={bottomNavValue}
          onChange={handleBottomNavChange}
          showLabels
        >
          <BottomNavigationAction label="Home" icon={<Home />} />
          <BottomNavigationAction label="Diet Plans" icon={<Restaurant />} />
          <BottomNavigationAction label="Progress" icon={<TrendingUp />} />
          <BottomNavigationAction label="Profile" icon={<Person />} />
        </BottomNavigation>
      </Paper>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ 
          position: 'fixed', 
          bottom: 80, 
          right: 20,
          zIndex: 2
        }}
      >
        <Add />
      </Fab>

      {/* Meal Dialog */}
      <Dialog open={openMealDialog} onClose={() => setOpenMealDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Meal Details</DialogTitle>
        <DialogContent>
          {selectedMeal && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedMeal.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedMeal.time} • {selectedMeal.calories} calories
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Foods:
              </Typography>
              <List dense>
                {selectedMeal.foods.map((food: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <LocalDining />
                    </ListItemIcon>
                    <ListItemText primary={food} />
                  </ListItem>
                ))}
              </List>
              
              {selectedMeal.notes && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {selectedMeal.notes}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMealDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => setOpenMealDialog(false)}>
            Mark as Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientApp;
