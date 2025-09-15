import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  useTheme,
  Tab,
  Tabs,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import { keyframes } from '@mui/system';
import {
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  Edit,
  Schedule,
  Star,
  VerifiedUser,
  Camera,
  Save,
  Cancel,
  Timeline,
  People,
  Assessment,
  AccountBox,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Profile: React.FC = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  // Mock data - replace with actual user data
  const profile = {
    name: 'Aditya Yadav',
    role: 'Senior Nutritionist',
    email: 'aditya.yadav@nutriveda.com',
    phone: '+91-9876543210',
    location: 'Chennai, Tamil Nadu, India',
    education: 'Ph.D. in Clinical Nutrition',
    experience: '8+ years',
    specializations: ['Sports Nutrition', 'Weight Management', 'Clinical Dietetics'],
    certifications: ['Registered Dietitian (RD)', 'Certified Diabetes Educator (CDE)'],
    stats: {
      patients: 450,
      consultations: 1200,
      successRate: '92%',
    },
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Profile Header with Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            mb: 3,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 100,
              fontSize: '1rem',
            },
          }}
        >
          <Tab 
            icon={<AccountBox sx={{ mb: 0.5 }} />} 
            iconPosition="start" 
            label="Profile" 
          />
          <Tab 
            icon={<Assessment sx={{ mb: 0.5 }} />} 
            iconPosition="start" 
            label="Performance" 
          />
          <Tab 
            icon={<Timeline sx={{ mb: 0.5 }} />} 
            iconPosition="start" 
            label="Activity" 
          />
        </Tabs>
      </Box>

      {/* Profile Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          animation: `${fadeIn} 0.6s ease-out`,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '3rem',
                  border: `4px solid ${theme.palette.background.paper}`,
                  boxShadow: theme.shadows[3],
                }}
              >
                {profile.name.charAt(0)}
              </Avatar>
              <Tooltip title="Change profile picture">
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: -8,
                    bottom: -8,
                    bgcolor: theme.palette.background.paper,
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                  size="small"
                >
                  <Camera fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={12} sm>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                {isEditing ? (
                  <Box>
                    <TextField
                      fullWidth
                      defaultValue={profile.name}
                      variant="outlined"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      defaultValue={profile.role}
                      variant="outlined"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          defaultValue={profile.email}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <Email sx={{ mr: 1, color: theme.palette.text.secondary }} />
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          defaultValue={profile.phone}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <Phone sx={{ mr: 1, color: theme.palette.text.secondary }} />
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {profile.name}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
                      {profile.role}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email sx={{ color: theme.palette.text.secondary }} />
                        <Typography variant="body2" color="text.secondary">
                          {profile.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ color: theme.palette.text.secondary }} />
                        <Typography variant="body2" color="text.secondary">
                          {profile.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={() => setIsEditing(false)}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 3,
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => setIsEditing(false)}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 3,
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      px: 3,
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Professional Info */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, height: '100%', border: `1px solid ${theme.palette.divider}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Professional Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <List disablePadding>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <School sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Education"
                        secondary={profile.education}
                        primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Work sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Experience"
                        secondary={profile.experience}
                        primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <LocationOn sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Location"
                        secondary={profile.location}
                        primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <List disablePadding>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Star sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Specializations"
                        secondary={profile.specializations.join(', ')}
                        primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <VerifiedUser sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Certifications"
                        secondary={profile.certifications.join(', ')}
                        primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, height: '100%', border: `1px solid ${theme.palette.divider}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Performance Statistics
              </Typography>
              <List disablePadding>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Total Patients"
                    secondary={profile.stats.patients}
                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Consultations Done"
                    secondary={profile.stats.consultations}
                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Success Rate"
                    secondary={profile.stats.successRate}
                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'h6', fontWeight: 600, color: 'success.main' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;