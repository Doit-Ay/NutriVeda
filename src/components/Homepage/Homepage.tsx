import React from 'react';
import { keyframes } from '@mui/system';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { styled, useTheme, Theme } from '@mui/material/styles';
import {
  Healing,
  People,
  MenuBook,
  BarChart,
} from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
}));

const gradient = 'linear-gradient(135deg, #7F7FD5 0%, #86A8E7 50%, #91EAE4 100%)';
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: theme.palette.primary.contrastText,
  background: gradient,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.45)',
    zIndex: 1,
  },
  '& > *': {
    zIndex: 2,
  },
}));

const VideoBackground = styled('video')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 'auto',
  height: 'auto',
  minWidth: '100%',
  minHeight: '100%',
  objectFit: 'cover',
  opacity: 0.5,
  transform: 'translate(-50%, -50%)',
  zIndex: 0,
});
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeroContent = styled(Container)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(8, 2),
  animation: `${fadeIn} 1.2s ease`,
}));

const CtaButton = styled(Button)(({ theme }: { theme: Theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 6),
  borderRadius: theme.shape.borderRadius * 4,
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
    transform: 'scale(1.05)',
  },
}));

const FeaturesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  background: 'linear-gradient(90deg, #e3ffe8 0%, #f9f9f9 100%)',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(4),
  borderRadius: 24,
  boxShadow: '0 8px 32px 0 rgba(127,127,213,0.12)',
  background: 'white',
  transition: 'transform 0.3s, box-shadow 0.3s',
  animation: `${fadeIn} 1.2s ease`,
  '&:hover': {
    transform: 'scale(1.04)',
    boxShadow: theme.shadows[20],
    background: 'linear-gradient(135deg, #86A8E7 0%, #91EAE4 100%)',
    color: 'white',
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  transition: 'color 0.3s',
}));
const Footer = styled(Box)(({ theme }) => ({
  background: gradient,
  color: 'white',
  padding: theme.spacing(4, 0),
  textAlign: 'center',
  marginTop: theme.spacing(8),
  fontWeight: 500,
  letterSpacing: 1,
  fontSize: '1.1rem',
}));

const Homepage: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <Healing />,
      title: 'AI Diet Engine',
      description: 'Generate personalized diet plans from prescriptions.',
    },
    {
      icon: <People />,
      title: 'Patient Management',
      description: 'Track patient information and progress.',
    },
    {
      icon: <MenuBook />,
      title: 'Food Database',
      description: 'Access a comprehensive food and recipe database.',
    },
    {
      icon: <BarChart />,
      title: 'Reporting & Analytics',
      description: 'Monitor patient progress with insightful reports.',
    },
  ];

  return (
    <Box>
      <HeroSection>
        <VideoBackground autoPlay loop muted>
          <source src="https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_25fps.mp4" type="video/mp4" />
        </VideoBackground>
        <HeroContent>
          <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 900, color: 'white', letterSpacing: 2, textShadow: '0 2px 16px #0006' }}>
            NutriVeda
          </Typography>
          <Typography variant="h4" component="p" gutterBottom sx={{ fontWeight: 300, color: 'white', textShadow: '0 1px 8px #0004' }}>
            Intelligent Ayurvedic Nutrition
          </Typography>
          <Typography variant="h6" component="p" sx={{ maxWidth: 600, margin: '0 auto', color: 'white', textShadow: '0 1px 8px #0002' }}>
            Harness the power of AI to create personalized, healthy, and delicious meal plans based on Ayurvedic principles.
          </Typography>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <CtaButton>Explore Dashboard</CtaButton>
          </Link>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 600, marginBottom: theme.spacing(8), letterSpacing: 1 }}>
            Key Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard>
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 500 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </FeaturesSection>

      <Footer>
        NutriVeda &copy; {new Date().getFullYear()} &mdash; Intelligent Ayurvedic Nutrition Platform
      </Footer>
    </Box>
  );
};

export default Homepage;