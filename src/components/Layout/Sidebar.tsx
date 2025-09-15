
import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Collapse,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  People,
  RestaurantMenu,
  Assessment,
  Settings,
  ExpandLess,
  ExpandMore,
  Psychology,
  Timeline,
  Book,
  HealthAndSafety,
  Spa,
  Logout,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  width: number;
  isPermanent: boolean;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Patients', icon: <People />, path: '/patients' },
  { text: 'Food Database', icon: <RestaurantMenu />, path: '/food-database' },
  { text: 'Recipe Manager', icon: <Book />, path: '/recipes' },
  { text: 'Patient Assessment', icon: <HealthAndSafety />, path: '/assessment' },
  {
    text: 'AI Diet Engine',
    icon: <Psychology />,
    path: '/ai-diet-engine',
    submenu: [
      { text: 'Generate Diet Plan', path: '/ai-diet-engine/generate' },
      { text: 'Prescription Upload', path: '/ai-diet-engine/upload' },
    ],
  },
  { text: 'Reports & Analytics', icon: <Assessment />, path: '/reports' },
  { text: 'Export Tools', icon: <Timeline />, path: '/export' },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, width, isPermanent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [openSubMenu, setOpenSubMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    const activeMenu = menuItems.find(item => item.submenu && location.pathname.startsWith(item.path));
    if (activeMenu) {
      setOpenSubMenu(activeMenu.text);
    }
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (!isPermanent) {
      onClose();
    }
  };

  const handleSubMenuClick = (text: string) => {
    setOpenSubMenu(openSubMenu === text ? null : text);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isSubMenuActive = (path: string) => {
    return location.pathname.startsWith(path);
  }

  const listItemStyles = (active: boolean) => ({
    margin: theme.spacing(0.75, 2),
    borderRadius: '12px',
    minHeight: 48,
    transition: 'all 0.2s ease-in-out',
    '& .MuiListItemIcon-root': {
      minWidth: 40,
      color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
    },
    ...(active && {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: `0 4px 12px 0 ${theme.palette.primary.main}55`,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    }),
  });

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, height: 64 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              <Spa />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              NutriVeda
          </Typography>
      </Box>
      <Divider sx={{ mx: 2 }} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <List component="nav">
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItemButton
                onClick={() => (item.submenu ? handleSubMenuClick(item.text) : handleNavigation(item.path))}
                sx={listItemStyles(item.submenu ? isSubMenuActive(item.path) && openSubMenu === item.text : isActive(item.path))}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.submenu && (openSubMenu === item.text ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              {item.submenu && (
                <Collapse in={openSubMenu === item.text} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        onClick={() => handleNavigation(subItem.path)}
                        sx={{ ...listItemStyles(isActive(subItem.path)), pl: 5, margin: theme.spacing(0.5, 2) }}
                      >
                        <ListItemText primary={subItem.text} primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <ListItemButton sx={listItemStyles(isActive('/settings'))} onClick={() => handleNavigation('/settings')}>
          <ListItemIcon><Settings /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
        <ListItemButton sx={{ ...listItemStyles(false), '&:hover': { backgroundColor: theme.palette.error.light + '20' } }}>
          <ListItemIcon sx={{ color: theme.palette.error.main + ' !important' }}><Logout /></ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: theme.palette.error.main }}/>
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isPermanent ? 'permanent' : 'temporary'}
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          borderRight: 'none',
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
