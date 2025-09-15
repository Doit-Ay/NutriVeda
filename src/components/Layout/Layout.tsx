
import React, { useState } from 'react';
import {
    Box,
    useTheme,
    useMediaQuery,
    CssBaseline,
} from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const drawerWidth = 280;

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
    const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

    const handleMenuToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F8E9' }}>
            <CssBaseline />
            <Header 
                onMenuToggle={handleMenuToggle} 
                isSidebarVisible={sidebarOpen} 
            />
            <Sidebar
                width={drawerWidth}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isPermanent={isDesktop}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3, md: 4 },
                    mt: '64px',
                    overflow: 'auto',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
