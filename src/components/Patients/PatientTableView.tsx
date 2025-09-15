
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { Patient } from '../../types';

interface PatientTableViewProps {
  patients: Patient[];
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

const getDoshaColor = (dosha: string): 'info' | 'warning' | 'success' | 'default' => {
    if (dosha === 'Vata') return 'info';
    if (dosha === 'Pitta') return 'warning';
    if (dosha === 'Kapha') return 'success';
    return 'default';
}

const PatientTableView: React.FC<PatientTableViewProps> = ({ patients, onView, onEdit, onDelete }) => {
  return (
    <TableContainer 
      component={Paper} 
      sx={{
        borderRadius: 2,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.05)',
        '& .MuiTableCell-root': {
          borderColor: 'rgba(0,0,0,0.06)',
        },
      }}
    >
      <Table sx={{ minWidth: 800 }} aria-label="patients table">
        <TableHead>
          <TableRow>
            <TableCell sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'text.primary',
              backgroundColor: 'background.default',
            }}>
              Patient Information
            </TableCell>
            <TableCell sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'text.primary',
              backgroundColor: 'background.default',
            }}>
              Contact Details
            </TableCell>
            <TableCell sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'text.primary',
              backgroundColor: 'background.default',
            }}>
              Constitutional Analysis
            </TableCell>
            <TableCell sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'text.primary',
              backgroundColor: 'background.default',
            }}>
              Health Status
            </TableCell>
            <TableCell sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'text.primary',
              backgroundColor: 'background.default',
            }}>
              Last Visit
            </TableCell>
            <TableCell align="right" sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'text.primary',
              backgroundColor: 'background.default',
            }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow 
              key={patient.id}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.01)',
                },
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {patient.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {patient.age} years • {patient.gender}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {patient.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {patient.phone || 'No phone'}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Tooltip title="Prakriti (Natural Constitution)">
                    <Chip 
                      label={`Prakriti: ${patient.constitutionalAnalysis.prakriti}`}
                      size="small" 
                      color={getDoshaColor(patient.constitutionalAnalysis.prakriti)}
                      sx={{ fontWeight: 500 }}
                    />
                  </Tooltip>
                  {patient.constitutionalAnalysis.vikriti.length > 0 && (
                    <Tooltip title="Vikriti (Current Imbalance)">
                      <Chip 
                        label={`Vikriti: ${patient.constitutionalAnalysis.vikriti.join(', ')}`}
                        size="small" 
                        variant="outlined"
                        color="warning"
                        sx={{ fontWeight: 500 }}
                      />
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 200 }}>
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
                      label={`+${patient.medicalHistory.length - 2}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {patient.lastVisit 
                    ? new Date(patient.lastVisit).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'No visits yet'
                  }
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small"
                      onClick={() => onView(patient)}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.lighter' }
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Patient">
                    <IconButton 
                      size="small"
                      onClick={() => onEdit(patient)}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Patient">
                    <IconButton 
                      size="small"
                      onClick={() => onDelete(patient)}
                      sx={{
                        color: 'error.main',
                        '&:hover': { backgroundColor: 'error.lighter' }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientTableView;
