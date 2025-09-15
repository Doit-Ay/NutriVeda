import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Divider,
  Badge,
  Tab,
  Tabs,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Schedule,
  Message,
  Update,
  Campaign,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'appointment' | 'message' | 'system' | 'alert';
  title: string;
  description: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

const NotificationCenter: React.FC = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = React.useState(0);
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'Upcoming Appointment',
      description: 'You have an appointment with John Doe at 2:30 PM',
      time: '10 minutes ago',
      read: false,
      priority: 'high',
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      description: 'Sarah Smith has sent you a message regarding her diet plan',
      time: '1 hour ago',
      read: false,
      priority: 'medium',
    },
    {
      id: '3',
      type: 'system',
      title: 'System Update',
      description: 'NutriVeda has been updated to version 2.1.0',
      time: '2 hours ago',
      read: true,
      priority: 'low',
    },
    {
      id: '4',
      type: 'alert',
      title: 'Diet Plan Alert',
      description: 'Patient compliance report is ready for review',
      time: '3 hours ago',
      read: true,
      priority: 'high',
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Schedule sx={{ color: theme.palette.primary.main }} />;
      case 'message':
        return <Message sx={{ color: theme.palette.info.main }} />;
      case 'system':
        return <Update sx={{ color: theme.palette.warning.main }} />;
      case 'alert':
        return <Campaign sx={{ color: theme.palette.error.main }} />;
      default:
        return <NotificationsIcon />;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <WarningIcon fontSize="small" sx={{ color: getPriorityColor(priority) }} />;
      case 'medium':
        return <InfoIcon fontSize="small" sx={{ color: getPriorityColor(priority) }} />;
      case 'low':
        return <CheckCircleIcon fontSize="small" sx={{ color: getPriorityColor(priority) }} />;
      default:
        return null;
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    // Filter by type if selected
    if (selectedType) {
      filtered = filtered.filter(n => n.type === selectedType);
    }

    // Filter by read/unread
    switch (currentTab) {
      case 0: // All
        return filtered;
      case 1: // Unread
        return filtered.filter(n => !n.read);
      default:
        return filtered;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
          Notifications
        </Typography>
        <Badge badgeContent={unreadCount} color="primary" sx={{ mr: 2 }}>
          <NotificationsIcon color="action" />
        </Badge>
      </Box>

      <Card sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        {/* Filter Row */}
        <Box sx={{ p: 2, display: 'flex', gap: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Button
            size="small"
            variant={selectedType === null ? 'contained' : 'outlined'}
            onClick={() => setSelectedType(null)}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              minWidth: 'auto',
            }}
          >
            All
          </Button>
          <Button
            size="small"
            variant={selectedType === 'appointment' ? 'contained' : 'outlined'}
            onClick={() => setSelectedType('appointment')}
            startIcon={<Schedule />}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
            }}
          >
            Appointments
          </Button>
          <Button
            size="small"
            variant={selectedType === 'message' ? 'contained' : 'outlined'}
            onClick={() => setSelectedType('message')}
            startIcon={<Message />}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
            }}
          >
            Messages
          </Button>
          <Button
            size="small"
            variant={selectedType === 'alert' ? 'contained' : 'outlined'}
            onClick={() => setSelectedType('alert')}
            startIcon={<Campaign />}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
            }}
          >
            Alerts
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              px: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 100,
              },
            }}
          >
            <Tab label="All Notifications" />
            <Tab label={`Unread (${unreadCount})`} />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 0 }}>
          <List sx={{ py: 0 }}>
            {filterNotifications().map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    px: 3,
                    py: 2,
                    bgcolor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.04),
                    transition: 'all 0.2s ease-in-out',
                    borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'transparent' }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: notification.read ? 400 : 600 }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {notification.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.time}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Tooltip title={`${notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority`}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                        {getPriorityIcon(notification.priority)}
                      </Box>
                    </Tooltip>
                    {!notification.read && (
                      <IconButton
                        size="small"
                        onClick={() => handleMarkAsRead(notification.id)}
                        sx={{ color: theme.palette.success.main }}
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveNotification(notification.id)}
                      sx={{ color: theme.palette.error.main }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < filterNotifications().length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {filterNotifications().length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No notifications to display
                </Typography>
              </Box>
            )}
          </List>
        </CardContent>
      </Card>

      {notifications.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setNotifications([])}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
            }}
          >
            Clear All Notifications
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default NotificationCenter;