
import React from 'react';
import { keyframes } from '@mui/system';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Tooltip
} from '@mui/material';
import { Patient } from '../../types';
import {
    Edit, 
    Delete, 
    Visibility, 
    Email
} from '@mui/icons-material';

interface PatientCardViewProps {
  patients: Patient[];
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

const getPatientStatus = () => ({
    borderColor: '#e0e0e0',
    color: '#555',
    background: '#fafafa'
});

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PatientCardView: React.FC<PatientCardViewProps> = ({ patients, onView, onEdit, onDelete }) => {
  return (
    <Grid container spacing={3}>
      {patients.map((patient: Patient) => (
        <Grid item key={patient.id} xs={12} sm={6} md={4}>
          <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            animation: `${fadeIn} 1.2s`,
            position: 'relative',
            overflow: 'visible',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px 0 rgba(0,0,0,0.12)',
            },
          }}>
            {/* Status Indicator */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: patient.lastVisit ? 'success.main' : 'warning.main',
                boxShadow: '0 0 0 3px rgba(255,255,255,0.8)',
              }}
            />
            
            <CardContent sx={{flexGrow: 1, pt: 3}}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    mr: 2,
                  }}
                >
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </Box>
                <Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {patient.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {patient.age} years • {patient.gender}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email fontSize="small" sx={{ mr: 1 }} />
                  {patient.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  📱 {patient.phone || 'No phone'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Constitutional Analysis
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Tooltip title="Prakriti (Natural Constitution)">
                    <Chip 
                      label={patient.constitutionalAnalysis.prakriti}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    />
                  </Tooltip>
                  {patient.constitutionalAnalysis.vikriti?.map((dosha, index) => (
                    <Tooltip key={index} title="Vikriti (Current Imbalance)">
                      <Chip 
                        label={dosha}
                        size="small"
                        variant="outlined"
                        color="warning"
                        sx={{ fontWeight: 500 }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>

              {patient.medicalHistory?.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Medical History
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {patient.medicalHistory.slice(0, 2).map((condition, index) => (
                      <Chip
                        key={index}
                        label={condition}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                    {patient.medicalHistory.length > 2 && (
                      <Chip
                        label={`+${patient.medicalHistory.length - 2} more`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </Box>
              )}
            </CardContent>

            <CardActions sx={{ 
              justifyContent: 'flex-end', 
              p: 2, 
              pt: 0,
              gap: 1 
            }}>
              <Button 
                size="small" 
                startIcon={<Visibility/>} 
                onClick={() => onView(patient)} 
                variant="outlined"
                sx={{ 
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                View
              </Button>
              <Button 
                size="small" 
                startIcon={<Edit/>} 
                onClick={() => onEdit(patient)} 
                variant="contained"
                sx={{ 
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Edit
              </Button>
              <Button 
                size="small" 
                startIcon={<Delete/>} 
                onClick={() => onDelete(patient)} 
                variant="outlined"
                color="error"
                sx={{ 
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PatientCardView;
