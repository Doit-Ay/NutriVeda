
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
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
  Autocomplete,
  Box,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Typography,
} from '@mui/material';
import {
  PersonOutline,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Wc,
  Healing,
  Warning,
  LocalHospital,
  NavigateNext,
  NavigateBefore,
} from '@mui/icons-material';
import { Patient } from '../../types';

interface PatientDialogProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
}

const emptyPatient: Partial<Patient> = {
  name: '',
  email: '',
  age: 0,
  gender: 'other',
  phone: '',
  address: '',
  medicalHistory: [],
  allergies: [],
  dietaryRestrictions: [],
  constitutionalAnalysis: {
    prakriti: 'Vata',
    vikriti: [],
    doshaImbalance: [],
  },
  healthParameters: {
    weight: 0,
    height: 0,
    bloodPressure: '',
    diabetes: false,
    heartCondition: false,
    otherConditions: [],
  },
};

const doshaOptions = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Tridoshic'];

const PatientDialog: React.FC<PatientDialogProps> = ({ open, onClose, patient }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<Partial<Patient>>(emptyPatient);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    } else {
      setFormData(emptyPatient);
    }
    setActiveStep(0);
    setErrors({});
  }, [patient, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value 
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleHealthParametersChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      healthParameters: {
        ...(prev.healthParameters || emptyPatient.healthParameters!),
        [field]: value
      }
    }));
  };

  const handleConstitutionalChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      constitutionalAnalysis: {
        ...(prev.constitutionalAnalysis || emptyPatient.constitutionalAnalysis!),
        [field]: value
      }
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};

    if (step === 0) {
      // Basic info validation
      if (!formData.name?.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
      if (!formData.age || formData.age < 0) {
        newErrors.age = 'Please enter a valid age';
      }
      if (!formData.phone?.trim()) {
        newErrors.phone = 'Phone number is required';
      }
    } else if (step === 1) {
      // Health parameters validation
      if (formData.healthParameters?.weight && formData.healthParameters.weight <= 0) {
        newErrors.weight = 'Weight must be greater than 0';
      }
      if (formData.healthParameters?.height && formData.healthParameters.height <= 0) {
        newErrors.height = 'Height must be greater than 0';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSave = () => {
    if (validateStep(activeStep)) {
      console.log('Saving:', formData);
      onClose();
    }
  };

  const steps = [
    { 
      label: 'Basic Information',
      content: (
        <Grid container spacing={3} sx={{pt: 1}}>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Name" 
              name="name" 
              value={formData.name || ''} 
              onChange={handleChange} 
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Email" 
              name="email" 
              value={formData.email || ''} 
              onChange={handleChange} 
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField 
              label="Age" 
              name="age" 
              type="number" 
              value={formData.age || ''} 
              onChange={handleChange} 
              fullWidth
              error={!!errors.age}
              helperText={errors.age}
              required
              InputProps={{
                inputProps: { min: 0 },
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth required>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender || 'other'}
                onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                label="Gender"
                startAdornment={
                  <InputAdornment position="start">
                    <Wc color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Phone Number" 
              name="phone" 
              value={formData.phone || ''} 
              onChange={handleChange} 
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              label="Address" 
              name="address" 
              value={formData.address || ''} 
              onChange={handleChange} 
              multiline 
              rows={2} 
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Health Parameters',
      content: (
        <Grid container spacing={3} sx={{pt: 1}}>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Weight (kg)" 
              type="number" 
              value={formData.healthParameters?.weight || ''} 
              onChange={(e) => handleHealthParametersChange('weight', e.target.value === '' ? '' : Number(e.target.value))} 
              fullWidth
              error={!!errors.weight}
              helperText={errors.weight}
              InputProps={{
                inputProps: { min: 0, step: 0.1 },
                startAdornment: (
                  <InputAdornment position="start">
                    <Healing color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Height (cm)" 
              type="number" 
              value={formData.healthParameters?.height || ''} 
              onChange={(e) => handleHealthParametersChange('height', e.target.value === '' ? '' : Number(e.target.value))} 
              fullWidth
              error={!!errors.height}
              helperText={errors.height}
              InputProps={{
                inputProps: { min: 0 },
                startAdornment: (
                  <InputAdornment position="start">
                    <Healing color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Blood Pressure" 
              placeholder="e.g. 120/80" 
              value={formData.healthParameters?.bloodPressure || ''} 
              onChange={(e) => handleHealthParametersChange('bloodPressure', e.target.value)} 
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalHospital color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Diabetes</InputLabel>
              <Select
                value={formData.healthParameters?.diabetes ? 'yes' : 'no'}
                onChange={(e) => handleHealthParametersChange('diabetes', e.target.value === 'yes')}
                label="Diabetes"
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Heart Condition</InputLabel>
              <Select
                value={formData.healthParameters?.heartCondition ? 'yes' : 'no'}
                onChange={(e) => handleHealthParametersChange('heartCondition', e.target.value === 'yes')}
                label="Heart Condition"
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={[]}
              freeSolo
              value={formData.healthParameters?.otherConditions || []}
              onChange={(event, newValue) => {
                handleHealthParametersChange('otherConditions', newValue);
              }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Other Health Conditions"
                  placeholder="Add conditions"
                />
              )}
            />
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Ayurvedic Profile',
      content: (
        <Grid container spacing={3} sx={{pt: 1}}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Prakriti (Constitution)</InputLabel>
              <Select 
                value={formData.constitutionalAnalysis?.prakriti || ''}
                onChange={(e) => handleConstitutionalChange('prakriti', e.target.value)}
                label="Prakriti (Constitution)"
              >
                {doshaOptions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Vikriti (Current Imbalance)</InputLabel>
              <Select
                multiple
                value={formData.constitutionalAnalysis?.vikriti || []}
                onChange={(e) => handleConstitutionalChange('vikriti', e.target.value)}
                label="Vikriti (Current Imbalance)"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {doshaOptions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Dosha Imbalance</InputLabel>
              <Select
                multiple
                value={formData.constitutionalAnalysis?.doshaImbalance || []}
                onChange={(e) => handleConstitutionalChange('doshaImbalance', e.target.value)}
                label="Dosha Imbalance"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {doshaOptions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Medical Information',
      content: (
        <Grid container spacing={3} sx={{pt: 1}}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              options={[]}
              freeSolo
              value={formData.medicalHistory || []}
              onChange={(event, newValue) => {
                setFormData({...formData, medicalHistory: newValue});
              }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Medical History"
                  placeholder="Add conditions"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <LocalHospital color="action" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              options={[]}
              freeSolo
              value={formData.allergies || []}
              onChange={(event, newValue) => {
                setFormData({...formData, allergies: newValue});
              }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Allergies"
                  placeholder="Add allergies"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <Warning color="action" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={[]}
              freeSolo
              value={formData.dietaryRestrictions || []}
              onChange={(event, newValue) => {
                setFormData({...formData, dietaryRestrictions: newValue});
              }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Dietary Restrictions"
                  placeholder="Add restrictions"
                />
              )}
            />
          </Grid>
        </Grid>
      )
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        {patient ? 'Edit Patient' : 'New Patient'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', mt: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ mt: 4, mb: 2 }}>
            {steps[activeStep].content}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2, justifyContent: 'space-between' }}>
        <Box>
          <Button 
            onClick={onClose}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
        </Box>
        <Box>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<NavigateBefore />}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSave}
            >
              {patient ? 'Save Changes' : 'Create Patient'}
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleNext}
              endIcon={<NavigateNext />}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default PatientDialog;
