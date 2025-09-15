
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  Typography,
  InputBase,
  alpha,
  Button,
  Badge,
  ListItemIcon,
  ListItemText,
  List,
  ListItem,
  Paper,
  ClickAwayListener,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Settings,
  Logout,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Brightness4,
  Brightness7,
  Person,
  RestaurantMenu,
  Fastfood,
  ArrowForward,
} from '@mui/icons-material';
import { useTheme as useAppTheme } from '../../contexts/ThemeContext';
import { mockPatients, mockFoodDatabase } from '../../data/mockData';
import { mockRecipes } from '../../data/mockRecipes';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isSidebarVisible }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (value.length >= 2) {
      setIsSearching(true);
      setShowResults(true);
      
      // Simulate search delay for better UX
      setTimeout(() => {
        const results = performSearch(value);
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };
  
  // Perform search across patients, foods, and recipes
  const performSearch = (query: string): any[] => {
    const lowerQuery = query.toLowerCase();
    
    // Search patients
    const patientResults = mockPatients
      .filter(patient => 
        patient.name.toLowerCase().includes(lowerQuery) || 
        patient.medicalHistory.some(condition => condition.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 3)
      .map(patient => ({
        id: patient.id,
        name: patient.name,
        type: 'patient',
        icon: <Person color="primary" />,
        path: `/patients/${patient.id}`
      }));
    
    // Search food database
    const foodResults = mockFoodDatabase
      .filter(food => 
        food.name.toLowerCase().includes(lowerQuery) || 
        food.category.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 3)
      .map(food => ({
        id: food.id,
        name: food.name,
        type: 'food',
        subtext: food.category,
        icon: <Fastfood color="primary" />,
        path: `/food-database/${food.id}`
      }));
    
    // Search recipes
    const recipeResults = mockRecipes
      .filter(recipe => 
        recipe.name.toLowerCase().includes(lowerQuery) || 
        recipe.description.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 3)
      .map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        type: 'recipe',
        subtext: recipe.mealType,
        icon: <RestaurantMenu color="primary" />,
        path: `/recipe-manager/${recipe.id}`
      }));
    
    // Combine and limit results
    return [...patientResults, ...foodResults, ...recipeResults].slice(0, 8);
  };
  
  // Navigate to the selected result
  const handleResultClick = (path: string) => {
    navigate(path);
    setSearchTerm('');
    setShowResults(false);
  };
  
  // Handle click away from search results
  const handleClickAway = () => {
    setShowResults(false);
  };
  
  // Clear search when Escape key is pressed
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSearchTerm('');
      setShowResults(false);
    }
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(8px)',
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ minHeight: 64, gap: 2, px: { xs: 2, sm: 3 } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuToggle}
          edge="start"
          sx={{ 
            display: { lg: 'none' },
            mr: 1
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: 'auto', sm: 180 } }}>
          <img 
            src="/logo192.png" 
            alt="NutriVeda Logo" 
            style={{ width: 36, height: 36, objectFit: 'contain' }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            NutriVeda
          </Typography>
        </Box>

        {/* Spacer for centering search bar */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' }, maxWidth: '100px' }} />

        {/* Centered Search Bar */}
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box 
            ref={searchRef}
            sx={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center',
              maxWidth: { md: '500px', lg: '600px' },
              position: 'relative',
              zIndex: showResults ? 1400 : 1200,
            }}
          >
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                position: 'relative',
                borderRadius: theme.shape.borderRadius * 3,
                backgroundColor: alpha(theme.palette.common.black, 0.04),
                border: `1px solid ${alpha(theme.palette.common.black, 0.1)}`,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.black, 0.06),
                  borderColor: alpha(theme.palette.common.black, 0.15),
                },
                width: '100%',
                transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow']),
                '&:focus-within': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                }
              }}
            >
              <Box 
                sx={{ 
                  p: '0 12px', 
                  height: '100%', 
                  position: 'absolute', 
                  pointerEvents: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                {isSearching ? (
                  <CircularProgress size={18} color="primary" />
                ) : (
                  <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                )}
              </Box>
              <InputBase
                placeholder="Search patients, recipes, or foods..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                sx={{ 
                  color: 'inherit',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    p: '12px 12px 12px 44px',
                    '&::placeholder': {
                      opacity: 0.7,
                    }
                  }
                }}
              />
            </Box>
            
            {/* Search Results Dropdown */}
            {showResults && (
              <Paper 
                elevation={4}
                sx={{ 
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 0.5,
                  maxHeight: '400px',
                  overflowY: 'auto',
                  borderRadius: 2,
                  zIndex: 1500,
                }}
              >
                {isSearching ? (
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : searchResults.length === 0 && searchTerm.length >= 2 ? (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography color="text.secondary">No results found</Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {searchResults.map((result) => (
                      <React.Fragment key={`${result.type}-${result.id}`}>
                        <ListItem 
                          button 
                          onClick={() => handleResultClick(result.path)}
                          sx={{ 
                            py: 1.5,
                            '&:hover': { 
                              backgroundColor: alpha(theme.palette.primary.main, 0.08) 
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {result.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={result.name} 
                            secondary={result.subtext}
                            primaryTypographyProps={{
                              fontWeight: 500,
                            }}
                          />
                          <ArrowForward fontSize="small" color="action" />
                        </ListItem>
                        <Divider component="li" variant="middle" />
                      </React.Fragment>
                    ))}
                    {searchResults.length > 0 && (
                      <ListItem 
                        button
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                          setSearchTerm('');
                          setShowResults(false);
                        }}
                        sx={{ 
                          py: 1.5, 
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                          '&:hover': { 
                            backgroundColor: alpha(theme.palette.primary.main, 0.08) 
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <SearchIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`View all results for "${searchTerm}"`}
                          primaryTypographyProps={{
                            fontWeight: 500,
                          }}
                        />
                      </ListItem>
                    )}
                  </List>
                )}
              </Paper>
            )}
          </Box>
        </ClickAwayListener>

        {/* Spacer for centering search bar */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' }, maxWidth: '100px' }} />

        {/* Action Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/notifications')}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            onClick={handleProfileMenuOpen}
            color="inherit"
            edge="end"
          >
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: theme.palette.primary.main,
                border: `2px solid ${theme.palette.background.paper}`,
              }}
            >
              <AccountCircle /> 
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ 
            elevation: 0,
            sx: {
              mt: 1.5, 
              minWidth: 200,
              borderRadius: 2,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              }
            }
          }}
        >
          <Box>
            {/* Profile Summary */}
            <Box sx={{ p: 2.5, textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  m: 'auto', 
                  mb: 1.5, 
                  bgcolor: theme.palette.primary.main,
                  border: `3px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 0 0 3px ${theme.palette.background.paper}`,
                }}
              >
                SJ
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Aditya Yadav
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Senior Nutritionist
              </Typography>
            </Box>

            <Divider />

            {/* Menu Items */}
            <Box sx={{ p: 1 }}>
              <MenuItem 
                onClick={() => {
                  handleMenuClose();
                  navigate('/profile');
                }}
                sx={{ borderRadius: 1, py: 1.5 }}
              >
                <ListItemIcon>
                  <AccountCircle fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="My Profile" 
                  secondary="View and edit your profile"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </MenuItem>

              <MenuItem 
                onClick={() => {
                  handleMenuClose();
                  navigate('/settings');
                }}
                sx={{ borderRadius: 1, py: 1.5 }}
              >
                <ListItemIcon>
                  <Settings fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Settings" 
                  secondary="App preferences & security"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </MenuItem>
            </Box>

            <Divider />

            {/* Logout */}
            <Box sx={{ p: 1 }}>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  // Add logout logic here
                }}
                sx={{ 
                  borderRadius: 1, 
                  py: 1.5,
                  color: theme.palette.error.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                  }
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: 'inherit' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  secondary="Sign out of your account"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </MenuItem>
            </Box>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
