import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab
} from '@mui/material';
import {
  Person,
  Save,
  ArrowForward,
  ArrowBack,
  Assessment,
  FitnessCenter
} from '@mui/icons-material';

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
      id={`assessment-tabpanel-${index}`}
      aria-labelledby={`assessment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface AssessmentData {
  // Basic Information
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  bloodPressure: string;
  
  // Lifestyle
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  sleepHours: number;
  waterIntake: number; // liters per day
  mealFrequency: number; // meals per day
  bowelMovements: number; // per day
  
  // Medical History
  medicalConditions: string[];
  allergies: string[];
  medications: string[];
  surgeries: string[];
  
  // Ayurvedic Assessment
  prakriti: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  vikriti: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  
  // Dosha-specific symptoms
  vataSymptoms: string[];
  pittaSymptoms: string[];
  kaphaSymptoms: string[];
  
  // Dietary Preferences
  dietaryRestrictions: string[];
  foodPreferences: string[];
  cookingMethods: string[];
  
  // Goals
  primaryGoal: string;
  secondaryGoals: string[];
  timeline: string;
  
  // Additional Notes
  notes: string;
}

const PatientAssessment: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    name: '',
    age: 30,
    gender: 'male',
    weight: 70,
    height: 170,
    bloodPressure: '',
    activityLevel: 'moderate',
    sleepHours: 8,
    waterIntake: 2.5,
    mealFrequency: 3,
    bowelMovements: 1,
    medicalConditions: [],
    allergies: [],
    medications: [],
    surgeries: [],
    prakriti: { vata: 0, pitta: 0, kapha: 0 },
    vikriti: { vata: 0, pitta: 0, kapha: 0 },
    vataSymptoms: [],
    pittaSymptoms: [],
    kaphaSymptoms: [],
    dietaryRestrictions: [],
    foodPreferences: [],
    cookingMethods: [],
    primaryGoal: '',
    secondaryGoals: [],
    timeline: '',
    notes: ''
  });

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleInputChange = (field: keyof AssessmentData, value: any) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof AssessmentData, value: string, checked: boolean) => {
    setAssessmentData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleDoshaChange = (dosha: 'vata' | 'pitta' | 'kapha', value: number, type: 'prakriti' | 'vikriti') => {
    setAssessmentData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [dosha]: value
      }
    }));
  };

  const handleNext = () => {
    if (activeStep < 5) {
      setCompletedSteps(prev => [...prev, activeStep]);
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSave = () => {
    console.log('Saving assessment data:', assessmentData);
    // Here you would save to backend
  };

  const calculateDoshaDominance = (dosha: 'vata' | 'pitta' | 'kapha') => {
    const prakriti = assessmentData.prakriti[dosha];
    const vikriti = assessmentData.vikriti[dosha];
    return prakriti + vikriti;
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'Vata': return 'error';
      case 'Pitta': return 'warning';
      case 'Kapha': return 'info';
      default: return 'default';
    }
  };

  const getDoshaIcon = (dosha: string) => {
    switch (dosha) {
      case 'Vata': return '🌪️';
      case 'Pitta': return '🔥';
      case 'Kapha': return '🌊';
      default: return '❓';
    }
  };

  const steps = [
    'Basic Information',
    'Lifestyle & Habits',
    'Medical History',
    'Ayurvedic Assessment',
    'Dietary Preferences',
    'Goals & Timeline'
  ];

  const medicalConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Obesity', 'PCOS',
    'Thyroid Disorders', 'Digestive Issues', 'Arthritis', 'Anemia',
    'High Cholesterol', 'Kidney Disease', 'Liver Disease', 'Cancer',
    'Mental Health Issues', 'Autoimmune Disorders'
  ];

  const commonAllergies = [
    'Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy',
    'Fish', 'Sesame', 'Sulfites', 'Food Additives'
  ];

  const vataSymptoms = [
    'Dry skin', 'Constipation', 'Anxiety', 'Insomnia', 'Joint pain',
    'Cold hands/feet', 'Irregular appetite', 'Gas/bloating', 'Restlessness',
    'Difficulty concentrating', 'Crackling joints', 'Thin build'
  ];

  const pittaSymptoms = [
    'Acid reflux', 'Skin rashes', 'Excessive sweating', 'Irritability',
    'Premature graying', 'Strong appetite', 'Hot flashes', 'Inflammation',
    'Perfectionism', 'Competitive nature', 'Sharp memory'
  ];

  const kaphaSymptoms = [
    'Weight gain', 'Slow digestion', 'Congestion', 'Lethargy',
    'Depression', 'Water retention', 'Oily skin', 'Slow metabolism',
    'Attachment', 'Compassion', 'Stable mood'
  ];

  const dietaryRestrictions = [
    'Vegetarian', 'Vegan', 'Lactose-free', 'Gluten-free', 'Keto',
    'Paleo', 'Low-sodium', 'Low-carb', 'Diabetic-friendly',
    'Anti-inflammatory', 'Ayurvedic', 'Raw food'
  ];

  const cookingMethods = [
    'Steaming', 'Boiling', 'Grilling', 'Baking', 'Sautéing',
    'Stir-frying', 'Pressure cooking', 'Slow cooking', 'Raw',
    'Fermentation', 'Sprouting', 'Traditional Ayurvedic'
  ];

  const BasicInformationStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Basic Patient Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            value={assessmentData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Age"
            type="number"
            value={assessmentData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              value={assessmentData.gender}
              label="Gender"
              onChange={(e) => handleInputChange('gender', e.target.value)}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Weight (kg)"
            type="number"
            value={assessmentData.weight}
            onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Height (cm)"
            type="number"
            value={assessmentData.height}
            onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Blood Pressure"
            placeholder="120/80"
            value={assessmentData.bloodPressure}
            onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const LifestyleStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Lifestyle & Daily Habits
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Activity Level</InputLabel>
            <Select
              value={assessmentData.activityLevel}
              label="Activity Level"
              onChange={(e) => handleInputChange('activityLevel', e.target.value)}
            >
              <MenuItem value="sedentary">Sedentary (Little to no exercise)</MenuItem>
              <MenuItem value="light">Light (Light exercise 1-3 days/week)</MenuItem>
              <MenuItem value="moderate">Moderate (Moderate exercise 3-5 days/week)</MenuItem>
              <MenuItem value="active">Active (Heavy exercise 6-7 days/week)</MenuItem>
              <MenuItem value="very_active">Very Active (Very heavy exercise, physical job)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography gutterBottom>Sleep Hours per Night</Typography>
            <Slider
              value={assessmentData.sleepHours}
              onChange={(e, value) => handleInputChange('sleepHours', value)}
              min={4}
              max={12}
              step={0.5}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box>
            <Typography gutterBottom>Water Intake (Liters/day)</Typography>
            <Slider
              value={assessmentData.waterIntake}
              onChange={(e, value) => handleInputChange('waterIntake', value)}
              min={1}
              max={5}
              step={0.25}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box>
            <Typography gutterBottom>Meal Frequency (per day)</Typography>
            <Slider
              value={assessmentData.mealFrequency}
              onChange={(e, value) => handleInputChange('mealFrequency', value)}
              min={1}
              max={6}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box>
            <Typography gutterBottom>Bowel Movements (per day)</Typography>
            <Slider
              value={assessmentData.bowelMovements}
              onChange={(e, value) => handleInputChange('bowelMovements', value)}
              min={0}
              max={5}
              step={0.5}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const MedicalHistoryStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Medical History & Current Health
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Medical Conditions
          </Typography>
          <FormGroup>
            {medicalConditions.map((condition) => (
              <FormControlLabel
                key={condition}
                control={
                  <Checkbox
                    checked={assessmentData.medicalConditions.includes(condition)}
                    onChange={(e) => handleArrayChange('medicalConditions', condition, e.target.checked)}
                  />
                }
                label={condition}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Allergies
          </Typography>
          <FormGroup>
            {commonAllergies.map((allergy) => (
              <FormControlLabel
                key={allergy}
                control={
                  <Checkbox
                    checked={assessmentData.allergies.includes(allergy)}
                    onChange={(e) => handleArrayChange('allergies', allergy, e.target.checked)}
                  />
                }
                label={allergy}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Current Medications"
            multiline
            rows={3}
            placeholder="List current medications and dosages"
            value={assessmentData.medications.join(', ')}
            onChange={(e) => handleInputChange('medications', e.target.value.split(',').map(m => m.trim()).filter(m => m))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Previous Surgeries"
            multiline
            rows={3}
            placeholder="List any previous surgeries and dates"
            value={assessmentData.surgeries.join(', ')}
            onChange={(e) => handleInputChange('surgeries', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const AyurvedicAssessmentStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ayurvedic Constitutional Assessment
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Rate each dosha from 0-10 based on the patient's natural constitution (Prakriti) and current imbalances (Vikriti)
      </Alert>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                🌪️ Vata Dosha
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Governs movement, circulation, and nervous system
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Prakriti (Natural Constitution)</Typography>
                <Slider
                  value={assessmentData.prakriti.vata}
                  onChange={(e, value) => handleDoshaChange('vata', value as number, 'prakriti')}
                  min={0}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Vikriti (Current Imbalance)</Typography>
                <Slider
                  value={assessmentData.vikriti.vata}
                  onChange={(e, value) => handleDoshaChange('vata', value as number, 'vikriti')}
                  min={0}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Typography variant="subtitle2" gutterBottom>Vata Symptoms</Typography>
              <FormGroup>
                {vataSymptoms.map((symptom) => (
                  <FormControlLabel
                    key={symptom}
                    control={
                      <Checkbox
                        checked={assessmentData.vataSymptoms.includes(symptom)}
                        onChange={(e) => handleArrayChange('vataSymptoms', symptom, e.target.checked)}
                      />
                    }
                    label={symptom}
                  />
                ))}
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="warning.main">
                🔥 Pitta Dosha
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Governs metabolism, digestion, and transformation
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Prakriti (Natural Constitution)</Typography>
                <Slider
                  value={assessmentData.prakriti.pitta}
                  onChange={(e, value) => handleDoshaChange('pitta', value as number, 'prakriti')}
                  min={0}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Vikriti (Current Imbalance)</Typography>
                <Slider
                  value={assessmentData.vikriti.pitta}
                  onChange={(e, value) => handleDoshaChange('pitta', value as number, 'vikriti')}
                  min={0}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Typography variant="subtitle2" gutterBottom>Pitta Symptoms</Typography>
              <FormGroup>
                {pittaSymptoms.map((symptom) => (
                  <FormControlLabel
                    key={symptom}
                    control={
                      <Checkbox
                        checked={assessmentData.pittaSymptoms.includes(symptom)}
                        onChange={(e) => handleArrayChange('pittaSymptoms', symptom, e.target.checked)}
                      />
                    }
                    label={symptom}
                  />
                ))}
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="info.main">
                🌊 Kapha Dosha
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Governs structure, stability, and lubrication
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Prakriti (Natural Constitution)</Typography>
                <Slider
                  value={assessmentData.prakriti.kapha}
                  onChange={(e, value) => handleDoshaChange('kapha', value as number, 'prakriti')}
                  min={0}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Vikriti (Current Imbalance)</Typography>
                <Slider
                  value={assessmentData.vikriti.kapha}
                  onChange={(e, value) => handleDoshaChange('kapha', value as number, 'vikriti')}
                  min={0}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Typography variant="subtitle2" gutterBottom>Kapha Symptoms</Typography>
              <FormGroup>
                {kaphaSymptoms.map((symptom) => (
                  <FormControlLabel
                    key={symptom}
                    control={
                      <Checkbox
                        checked={assessmentData.kaphaSymptoms.includes(symptom)}
                        onChange={(e) => handleArrayChange('kaphaSymptoms', symptom, e.target.checked)}
                      />
                    }
                    label={symptom}
                  />
                ))}
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Dosha Analysis
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="h6" color="error">
                  Vata: {calculateDoshaDominance('vata')}
                </Typography>
                <Typography variant="body2">
                  {calculateDoshaDominance('vata') > 12 ? 'High' : calculateDoshaDominance('vata') > 8 ? 'Moderate' : 'Low'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="h6" color="warning.main">
                  Pitta: {calculateDoshaDominance('pitta')}
                </Typography>
                <Typography variant="body2">
                  {calculateDoshaDominance('pitta') > 12 ? 'High' : calculateDoshaDominance('pitta') > 8 ? 'Moderate' : 'Low'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="h6" color="info.main">
                  Kapha: {calculateDoshaDominance('kapha')}
                </Typography>
                <Typography variant="body2">
                  {calculateDoshaDominance('kapha') > 12 ? 'High' : calculateDoshaDominance('kapha') > 8 ? 'Moderate' : 'Low'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  const DietaryPreferencesStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Dietary Preferences & Restrictions
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Dietary Restrictions
          </Typography>
          <FormGroup>
            {dietaryRestrictions.map((restriction) => (
              <FormControlLabel
                key={restriction}
                control={
                  <Checkbox
                    checked={assessmentData.dietaryRestrictions.includes(restriction)}
                    onChange={(e) => handleArrayChange('dietaryRestrictions', restriction, e.target.checked)}
                  />
                }
                label={restriction}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Preferred Cooking Methods
          </Typography>
          <FormGroup>
            {cookingMethods.map((method) => (
              <FormControlLabel
                key={method}
                control={
                  <Checkbox
                    checked={assessmentData.cookingMethods.includes(method)}
                    onChange={(e) => handleArrayChange('cookingMethods', method, e.target.checked)}
                  />
                }
                label={method}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Food Preferences"
            multiline
            rows={3}
            placeholder="List favorite foods, cuisines, or specific preferences"
            value={assessmentData.foodPreferences.join(', ')}
            onChange={(e) => handleInputChange('foodPreferences', e.target.value.split(',').map(f => f.trim()).filter(f => f))}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const GoalsStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Health Goals & Timeline
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Primary Goal</InputLabel>
            <Select
              value={assessmentData.primaryGoal}
              label="Primary Goal"
              onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
            >
              <MenuItem value="weight_loss">Weight Loss</MenuItem>
              <MenuItem value="weight_gain">Weight Gain</MenuItem>
              <MenuItem value="muscle_building">Muscle Building</MenuItem>
              <MenuItem value="digestive_health">Digestive Health</MenuItem>
              <MenuItem value="energy_improvement">Energy Improvement</MenuItem>
              <MenuItem value="disease_management">Disease Management</MenuItem>
              <MenuItem value="general_wellness">General Wellness</MenuItem>
              <MenuItem value="dosha_balance">Dosha Balance</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Timeline</InputLabel>
            <Select
              value={assessmentData.timeline}
              label="Timeline"
              onChange={(e) => handleInputChange('timeline', e.target.value)}
            >
              <MenuItem value="1_month">1 Month</MenuItem>
              <MenuItem value="3_months">3 Months</MenuItem>
              <MenuItem value="6_months">6 Months</MenuItem>
              <MenuItem value="1_year">1 Year</MenuItem>
              <MenuItem value="ongoing">Ongoing</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Secondary Goals"
            multiline
            rows={3}
            placeholder="List additional goals or specific outcomes desired"
            value={assessmentData.secondaryGoals.join(', ')}
            onChange={(e) => handleInputChange('secondaryGoals', e.target.value.split(',').map(g => g.trim()).filter(g => g))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Notes"
            multiline
            rows={4}
            placeholder="Any additional information, concerns, or specific requirements"
            value={assessmentData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const AssessmentSummary = () => {
    const dominantDosha = Object.entries({
      Vata: calculateDoshaDominance('vata'),
      Pitta: calculateDoshaDominance('pitta'),
      Kapha: calculateDoshaDominance('kapha')
    }).sort(([,a], [,b]) => b - a)[0];

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Assessment Summary
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Patient Profile
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText primary="Name" secondary={assessmentData.name} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText primary="Age" secondary={`${assessmentData.age} years`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText primary="Gender" secondary={assessmentData.gender} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><FitnessCenter /></ListItemIcon>
                    <ListItemText primary="BMI" secondary={(assessmentData.weight / Math.pow(assessmentData.height / 100, 2)).toFixed(1)} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Dominant Dosha
                </Typography>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" gutterBottom>
                    {getDoshaIcon(dominantDosha[0])} {dominantDosha[0]}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Score: {dominantDosha[1]}
                  </Typography>
                  <Chip 
                    label={dominantDosha[1] > 12 ? 'High' : dominantDosha[1] > 8 ? 'Moderate' : 'Low'} 
                    color={getDoshaColor(dominantDosha[0]) as any}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recommended Diet Plan Focus
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Based on the assessment, the patient shows {dominantDosha[0].toLowerCase()} dominance. 
              The diet plan should focus on {dominantDosha[0] === 'Vata' ? 'warming, grounding, and nourishing foods' :
              dominantDosha[0] === 'Pitta' ? 'cooling, calming, and sweet foods' :
              'light, warming, and stimulating foods'} to help balance the doshas.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Patient Assessment
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{ mr: 2 }}
          >
            Save Assessment
          </Button>
          <Button
            variant="contained"
            startIcon={<Assessment />}
            onClick={() => setSelectedTab(1)}
          >
            View Summary
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Assessment Form" />
          <Tab label="Summary" />
        </Tabs>
      </Box>

      <TabPanel value={selectedTab} index={0}>
        <Card>
          <CardContent>
            <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 3 }}>
              {steps.map((label, index) => (
                <Step key={label} completed={completedSteps.includes(index)}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ minHeight: 400 }}>
              {activeStep === 0 && <BasicInformationStep />}
              {activeStep === 1 && <LifestyleStep />}
              {activeStep === 2 && <MedicalHistoryStep />}
              {activeStep === 3 && <AyurvedicAssessmentStep />}
              {activeStep === 4 && <DietaryPreferencesStep />}
              {activeStep === 5 && <GoalsStep />}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBack />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                disabled={activeStep === 5}
              >
                {activeStep === 5 ? 'Complete' : 'Next'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <AssessmentSummary />
      </TabPanel>
    </Box>
  );
};

export default PatientAssessment;
