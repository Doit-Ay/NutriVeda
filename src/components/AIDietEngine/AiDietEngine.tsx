
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CardMedia,
  CardActionArea,
  CardActions,
  Divider,
  Chip,
  Paper,
  useTheme
} from '@mui/material';
import { 
  Psychology, 
  PostAdd, 
  Analytics, 
  ContentPaste, 
  RestaurantMenu, 
  MedicalInformation,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AiDietEngine: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Navigation functions
  const navigateToDietGenerator = () => {
    navigate('/ai-diet-engine/generate');
  };

  const navigateToPrescriptionUpload = () => {
    navigate('/ai-diet-engine/upload');
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>AI Diet Engine</Typography>
        <Typography variant="body1" color="text.secondary">
          Generate personalized Ayurvedic diet plans using our advanced AI algorithms. 
          Tailored to individual dosha types and health conditions.
        </Typography>
      </Box>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          color: 'white'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Create Personalized Diet Plans
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              Our AI-powered diet generator combines traditional Ayurvedic principles with modern nutritional science
              to create balanced meal plans for your patients' unique needs.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              onClick={navigateToDietGenerator}
              sx={{ 
                bgcolor: 'white', 
                color: '#3b82f6',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
              endIcon={<ArrowForward />}
            >
              Create Diet Plan
            </Button>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box 
              component="img"
              src="/images/diet-plan-illustration.png" 
              alt="Diet Plan Illustration"
              sx={{ 
                maxWidth: '100%', 
                maxHeight: 200,
                display: 'block',
                mx: 'auto',
                filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))'
              }}
              onError={(e: any) => {
                e.target.style.display = 'none';
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardActionArea onClick={navigateToDietGenerator}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <RestaurantMenu sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Diet Plan Generator</Typography>
              </Box>
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Create customized diet plans based on patient's dosha type, health conditions, 
                  and nutritional requirements. Includes Ayurvedic food recommendations.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" endIcon={<ArrowForward />}>
                  Create Plan
                </Button>
              </CardActions>
            </CardActionArea>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardActionArea onClick={navigateToPrescriptionUpload}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <MedicalInformation sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Prescription Upload</Typography>
              </Box>
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Upload medical prescriptions and health reports to automatically generate 
                  diet plans based on patient diagnosis, medications, and health parameters.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" endIcon={<ArrowForward />}>
                  Upload Prescription
                </Button>
              </CardActions>
            </CardActionArea>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardActionArea>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Analytics sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">Diet Analytics</Typography>
                <Chip 
                  label="Coming Soon" 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 'auto' }} 
                />
              </Box>
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Analyze diet plans for nutritional adequacy, Ayurvedic compliance, 
                  and alignment with patient health goals. Track progress and outcomes.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" disabled endIcon={<ArrowForward />}>
                  View Analytics
                </Button>
              </CardActions>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Recent Diet Plans</Typography>
      
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card variant="outlined">
              <CardContent sx={{ pb: 1 }}>
                <Typography variant="subtitle1" noWrap>
                  {item === 1 ? 'Weekly Plan - Rajesh Kumar' :
                   item === 2 ? 'Monthly Plan - Priya Sharma' :
                   item === 3 ? 'Diabetes Diet - Anita Patel' :
                   'Weight Loss Plan - Vijay Mehta'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(Date.now() - item * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">View</Button>
                <Button size="small">Edit</Button>
                <Button size="small" color="error">Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AiDietEngine;
