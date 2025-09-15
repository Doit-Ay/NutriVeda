
import React from 'react';
import { keyframes } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  Paper,
} from '@mui/material';
import {
  People,
  Restaurant,
  Assessment,
  TrendingUp,
} from '@mui/icons-material';
import { mockDashboardStats } from '../../data/mockData';
import StatCard from './StatCard';
import ActivityItem from './ActivityItem';
import AIDietEngineStatus from './AIDietEngineStatus';
import QuickActions from './QuickActions';
import { useTheme } from '@mui/material/styles';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;
  const theme = useTheme();

  return (
    <Box sx={{
      minHeight: '100vh',
      p: { xs: 2, sm: 3, md: 4 },
      bgcolor: theme.palette.background.default,
    }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4, 
          animation: `${fadeIn} 1.2s`,
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
        }}
      >
        <Avatar 
          src="/logo192.png"
          sx={{ 
            width: 64, 
            height: 64, 
            mr: 3,
            bgcolor: theme.palette.primary.light,
            border: `2px solid ${theme.palette.primary.main}`,
            padding: 1,
          }} 
        />
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              letterSpacing: '-0.5px',
              color: theme.palette.text.primary,
              mb: 0.5
            }}
          >
            Welcome to NutriVeda
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500
            }}
          >
            Here's a snapshot of your practice today.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ animation: `${fadeIn} 1.2s` }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<People sx={{ fontSize: 40 }} />}
            color={theme.palette.primary.main}
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Diet Plans"
            value={stats.activeDietPlans}
            icon={<Restaurant sx={{ fontSize: 40 }} />}
            color={theme.palette.success.main}
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Consultations"
            value={stats.completedConsultations}
            icon={<Assessment sx={{ fontSize: 40 }} />}
            color={theme.palette.info.main}
            trend={15}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Compliance Rate"
            value={`${stats.averageCompliance}%`}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
            color={theme.palette.warning.main}
            trend={-5}
          />
        </Grid>

        <Grid item xs={12} lg={8}>
          <Box sx={{ animation: `${fadeIn} 1.4s` }}>
            <AIDietEngineStatus />
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box sx={{ animation: `${fadeIn} 1.6s` }}>
                <QuickActions />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(127,127,213,0.08)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, letterSpacing: 1 }}>
                    Recent Activity
                  </Typography>
                  <List sx={{ maxHeight: 380, overflow: 'auto', pr: 1 }}>
                    {stats.recentActivity.map((activity: any) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
