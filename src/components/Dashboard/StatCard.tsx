
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: string;
  trend: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  const theme = useTheme();
  const TrendIcon = trend >= 0 ? ArrowUpward : ArrowDownward;
  const trendColor = trend >= 0 ? theme.palette.success.main : theme.palette.error.main;
  const isLightMode = theme.palette.mode === 'light';

  return (
    <Card sx={{ 
      height: '100%', 
      borderRadius: 2,
      bgcolor: isLightMode ? theme.palette.background.paper : theme.palette.grey[800],
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease-in-out',
      border: `1px solid ${theme.palette.divider}`,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
        borderColor: theme.palette.primary.main,
      }
    }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                mb: 1,
                fontWeight: 500,
                textTransform: 'uppercase',
                fontSize: '0.875rem',
                letterSpacing: '0.5px'
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: '-0.5px'
              }}
            >
              {value}
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{
              backgroundColor: isLightMode ? `${color}15` : `${color}30`,
              color: color,
              borderRadius: '12px',
              width: 56,
              height: 56,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              }
            }}>
              {icon}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TrendIcon sx={{ color: trendColor, fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2" sx={{ color: trendColor, fontWeight: 'medium' }}>
            {Math.abs(trend)}%
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            since last month
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default StatCard;
