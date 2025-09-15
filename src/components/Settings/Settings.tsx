
import React from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Switch, FormControlLabel } from '@mui/material';

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#222' }}>
        Settings
      </Typography>
      
      {/* User Profile Section */}
  <Paper sx={{ p: 4, mt: 2, background: '#fff', boxShadow: '0 4px 16px 0 rgba(0,0,0,0.07)', borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom>
          User Profile
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Full Name" defaultValue="Dr. Jane Doe" variant="outlined" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Email" defaultValue="jane.doe@nutriveda.com" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" color="primary">Update Profile</Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Preferences Section */}
  <Paper sx={{ p: 4, mt: 4, background: '#fff', boxShadow: '0 4px 16px 0 rgba(0,0,0,0.07)', borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom>
          Preferences
        </Typography>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Enable Email Notifications"
          />
        </Box>
        <Box sx={{ mt: 1 }}>
          <FormControlLabel
            control={<Switch />}
            label="Enable SMS Notifications"
          />
        </Box>
      </Paper>

      {/* Security Section */}
  <Paper sx={{ p: 4, mt: 4, background: '#fff', boxShadow: '0 4px 16px 0 rgba(0,0,0,0.07)', borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom>
          Security
        </Typography>
        <Box sx={{ mt: 2 }}>
            <Button variant="outlined" color="primary">Change Password</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;
