import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import {
  PersonAdd,
  AssignmentTurnedIn,
  RestaurantMenu,
  Warning,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface ActivityItemProps {
  activity: {
    id: string;
    type: string;
    description: string;
    timestamp: Date;
    patientName: string;
  };
}

// Helper function to format time since the event
const timeSince = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const theme = useTheme();

  const activityIcons: { [key: string]: React.ReactNode } = {
    patient_added: <PersonAdd />,
    diet_created: <RestaurantMenu />,
    consultation_completed: <AssignmentTurnedIn />,
    prescription_processed: <Warning />,
  };

  const activityColors: { [key: string]: string } = {
    patient_added: theme.palette.primary.main,
    diet_created: theme.palette.success.main,
    consultation_completed: theme.palette.info.main,
    prescription_processed: theme.palette.warning.main,
  };

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        mb: 1.5,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: activityColors[activity.type] || theme.palette.grey[500] }}>
          {activityIcons[activity.type] || <Warning />}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant="body1" sx={{ fontWeight: 'medium' }}>{activity.description}</Typography>}
        secondary={
          <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
            <Typography component="span" variant="body2" color="text.primary">
              {activity.patientName}
            </Typography>
            <Typography component="span" variant="caption" color="text.secondary">
              {timeSince(new Date(activity.timestamp))}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
};

export default ActivityItem;
