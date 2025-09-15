import React from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountCircle,
  CalendarToday,
  Assessment,
  MoreVert,
  ArrowForward,
} from '@mui/icons-material';
import { Patient } from '../../../types';

interface PatientInsightsProps {
  patients: Patient[];
}

const PatientInsights: React.FC<PatientInsightsProps> = ({ patients }) => {
  const theme = useTheme();

  const calculateDoshaDistribution = () => {
    const distribution: { [key: string]: number } = {};
    patients.forEach(patient => {
      const prakriti = patient.constitutionalAnalysis.prakriti;
      distribution[prakriti] = (distribution[prakriti] || 0) + 1;
    });
    return distribution;
  };

  const calculateAgeGroups = () => {
    const groups = {
      '0-18': 0,
      '19-30': 0,
      '31-50': 0,
      '51-70': 0,
      '70+': 0,
    };

    patients.forEach(patient => {
      if (patient.age <= 18) groups['0-18']++;
      else if (patient.age <= 30) groups['19-30']++;
      else if (patient.age <= 50) groups['31-50']++;
      else if (patient.age <= 70) groups['51-70']++;
      else groups['70+']++;
    });

    return groups;
  };

  const calculateCommonConditions = () => {
    const conditions: { [key: string]: number } = {};
    patients.forEach(patient => {
      patient.medicalHistory.forEach(condition => {
        conditions[condition] = (conditions[condition] || 0) + 1;
      });
    });

    return Object.entries(conditions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const getRecentPatients = () => {
    return [...patients]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const doshaDistribution = calculateDoshaDistribution();
  const ageGroups = calculateAgeGroups();
  const commonConditions = calculateCommonConditions();
  const recentPatients = getRecentPatients();

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <AccountCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {patients.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Patients
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  +12% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <CalendarToday />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    28
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Consultations This Week
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingDown color="error" sx={{ mr: 1 }} />
                <Typography variant="body2" color="error.main">
                  -5% from last week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Assessment />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    85%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Treatment Success Rate
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  +3% improvement
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Distribution Charts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Prakriti Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(doshaDistribution).map(([dosha, count]) => (
                  <Box key={dosha} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{dosha}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round((count / patients.length) * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(count / patients.length) * 100}
                      sx={{ 
                        height: 8,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 1,
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Age Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(ageGroups).map(([range, count]) => (
                  <Box key={range} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{range} years</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round((count / patients.length) * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(count / patients.length) * 100}
                      sx={{ 
                        height: 8,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 1,
                          bgcolor: theme.palette.warning.main,
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Common Conditions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Common Health Conditions
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <List>
                {commonConditions.map(([condition, count], index) => (
                  <ListItem 
                    key={condition}
                    disableGutters
                    sx={{
                      py: 1,
                      borderBottom: index < commonConditions.length - 1 ? 1 : 0,
                      borderColor: 'divider'
                    }}
                  >
                    <ListItemText
                      primary={condition}
                      secondary={`${count} patients`}
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      {Math.round((count / patients.length) * 100)}%
                      <ArrowForward sx={{ ml: 1, fontSize: 16 }} />
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Patients */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Patients
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <List>
                {recentPatients.map((patient, index) => (
                  <ListItem 
                    key={patient.id}
                    disableGutters
                    sx={{
                      py: 1,
                      borderBottom: index < recentPatients.length - 1 ? 1 : 0,
                      borderColor: 'divider'
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 2, 
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.875rem'
                      }}
                    >
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <ListItemText
                      primary={patient.name}
                      secondary={new Date(patient.createdAt).toLocaleDateString()}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      {patient.constitutionalAnalysis.prakriti}
                      <ArrowForward sx={{ ml: 1, fontSize: 16 }} />
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientInsights;