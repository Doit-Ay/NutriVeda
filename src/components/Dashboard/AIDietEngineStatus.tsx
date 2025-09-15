
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Cached,
  Error,
  ArrowForward,
  Sync,
  ModelTraining,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const AIDietEngineStatus: React.FC = () => {
  const theme = useTheme();
  const status = 'active'; // This could be dynamic: active, processing, error
  const lastRun = '5 minutes ago';
  const plansGenerated = 12;
  const processingSpeed = 85; // Example percentage

  const statusInfo = {
    active: {
      icon: <CheckCircle color="success" sx={{ fontSize: 28 }} />,
      text: 'Active & Monitoring',
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light + '30',
    },
    processing: {
      icon: <Cached color="info" sx={{ fontSize: 28 }} />,
      text: 'Processing Updates',
      color: theme.palette.info.main,
      bgColor: theme.palette.info.light + '30',
    },
    error: {
      icon: <Error color="error" sx={{ fontSize: 28 }} />,
      text: 'Error Detected',
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light + '30',
    },
  };

  const currentStatus = statusInfo[status];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              AI Diet Engine Status
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Real-time analysis and diet plan generation.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
            <Chip
              icon={currentStatus.icon}
              label={currentStatus.text}
              sx={{
                backgroundColor: currentStatus.bgColor,
                color: currentStatus.color,
                fontWeight: 'medium',
                borderRadius: '8px',
                p: 1,
                '& .MuiChip-icon': {
                  color: currentStatus.color,
                },
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ my: 3 }}>
          <Typography variant="body1" gutterBottom>
            Today's Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ModelTraining sx={{ mr: 1.5, color: 'text.secondary' }} />
            <Typography variant="body2">
              <strong>{plansGenerated}</strong> diet plans generated.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Sync sx={{ mr: 1.5, color: 'text.secondary' }} />
            <Typography variant="body2">
              Last run: <strong>{lastRun}</strong>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Engine Processing Speed
          </Typography>
          <LinearProgress
            variant="determinate"
            value={processingSpeed}
            sx={{
              height: 10,
              borderRadius: 5,
              [`& .MuiLinearProgress-bar`]: {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />
        </Box>

        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForward />}
            sx={{ borderRadius: 2 }}
            onClick={() => console.log('View Detailed Logs clicked')}
          >
            View Detailed Logs
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AIDietEngineStatus;
