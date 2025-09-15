
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import {
  AddCircleOutline,
  EditCalendar,
  Summarize,
  ContactMailOutlined,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const actions = [
    {
      icon: <AddCircleOutline fontSize="large" />,
      label: 'New Patient',
      onClick: () => navigate('/patients/new'),
      description: 'Add a new patient to your practice',
    },
    {
      icon: <EditCalendar fontSize="large" />,
      label: 'Schedule',
      onClick: () => navigate('/appointments'),
      description: 'View and manage appointments',
    },
    {
      icon: <Summarize fontSize="large" />,
      label: 'Generate Report',
      onClick: () => navigate('/reports'),
      description: 'Create patient reports',
    },
    {
      icon: <ContactMailOutlined fontSize="large" />,
      label: 'Send Follow-up',
      onClick: () => navigate('/patients'),
      description: 'Send follow-up messages',
    },
  ];

  return (
    <Card 
      sx={{ 
        borderRadius: 2, 
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.05)', 
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 3
          }}
        >
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {actions.map((action) => (
            <Grid item xs={6} key={action.label}>
              <Paper
                onClick={action.onClick}
                sx={{
                  p: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%',
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: theme.palette.primary.main,
                    bgcolor: theme.palette.action.hover,
                    '& .actionIcon': {
                      color: theme.palette.primary.main,
                      transform: 'scale(1.1)',
                    },
                    '& .actionLabel': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <Box 
                  className="actionIcon"
                  sx={{ 
                    mb: 1.5,
                    color: theme.palette.text.secondary,
                    transition: 'all 0.2s ease-in-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {React.cloneElement(action.icon, { 
                    sx: { fontSize: 32 } 
                  })}
                </Box>
                <Typography 
                  className="actionLabel"
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    transition: 'color 0.2s ease-in-out',
                    textAlign: 'center',
                    mb: 0.5
                  }}
                >
                  {action.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}
                >
                  {action.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
