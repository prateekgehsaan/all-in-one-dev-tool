import React, { useState } from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, AppBar, Toolbar, Typography, IconButton, Container, useTheme, useMediaQuery,
  Stack, Tooltip 
} from '@mui/material';

import { 
  Menu as MenuIcon, 
  Home as HomeIcon, 
  TableChart as TableIcon, 
  AutoFixHigh as MagicIcon,
  Code as CodeIcon,
  ChevronLeft as ChevronLeftIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  SyncAlt as SyncIcon, // For Converters
  Security as SecurityIcon ,
  Abc as AbcIcon,
  Build as BuildIcon, 
  Difference as DiffIcon,
} from '@mui/icons-material';
import ConstructionIcon from '@mui/icons-material/Construction';

import WireframeTool from './pages/WireframeTool';
import Beautifier from './pages/Beautifier';
import Transformer from './pages/Transformer';
import Converters from './pages/Converters';
import Utilities from './pages/Utilities';

const drawerWidth = 280;

const MENU_CONFIG = [
  { id: 'welcome', label: 'Dashboard', icon: <HomeIcon />, component: 'welcome' },
  { id: 'wireframe', label: 'Wireframe Tool', icon: <TableIcon />, component: <WireframeTool /> },
  { id: 'beautifier', label: 'Code Beautifier', icon: <MagicIcon />, component: <Beautifier /> },
  {
    id: 'transformer',
    label: 'Data Transformer',
    icon: <SettingsIcon />, // or use a specialized icon
    component: <Transformer />
  },
  {
    id: 'converters',
    label: 'Smart Converters',
    icon: <AbcIcon />, 
    component: <Converters />
  },{
    id: 'utilities',
    label: 'Dev Utilities',
    icon: <ConstructionIcon />,
    component: <Utilities />
  }
];

function App() {
  const [open, setOpen] = useState(true);
  const [activePageId, setActivePageId] = useState('welcome');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const activeContent = MENU_CONFIG.find(item => item.id === activePageId);

  const WelcomePage = () => (
    <Box className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-700">
      <Box sx={{ 
        p: 4, borderRadius: '50%', bgcolor: 'indigo.50', mb: 4,
        boxShadow: '0 20px 50px rgba(79, 70, 229, 0.15)',
        border: '1px solid rgba(79, 70, 229, 0.1)'
      }}>
        <CodeIcon sx={{ fontSize: 100, color: '#4f46e5' }} />
      </Box>
      <Typography variant="h2" sx={{ fontWeight: 900, color: '#0f172a', mb: 2, letterSpacing: '-2px' }}>
        All In <span className="bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600" style={{ color: '#4f46e5' }}>One</span>
      </Typography>
      <Typography variant="h6" sx={{ color: '#64748b', maxWidth: 600, fontWeight: 400 }}>
        The elite workspace for rapid prototyping and code optimization. 
        Select a high-performance tool from the sidebar.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          color: '#234b8a',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center">
            <IconButton onClick={() => setOpen(!open)} edge="start" sx={{ mr: 2, color: '#4f46e5' }}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap sx={{ fontWeight: 900, letterSpacing: '2px' }}>
              All In <span className="text-indigo-600" style={{ color: '#4f46e5' }}>{`One < >`}</span>
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: open ? drawerWidth : 88,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 88,
            boxSizing: 'border-box',
            backgroundColor: '#ecf0ff',
            color: '#fff',
            borderRight: 'none',
            transition: theme.transitions.create('width', { duration: 300 }),
            overflowX: 'hidden'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <List>
            {MENU_CONFIG.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ display: 'block', mb: 1 }}>
                <Tooltip title={!open ? item.label : ""} placement="right">
                  <ListItemButton 
                    onClick={() => { setActivePageId(item.id); if(isMobile) setOpen(false); }}
                    selected={activePageId === item.id}
                    sx={{ 
                      borderRadius: '12px', 
                      minHeight: 54,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      transition: '0.2s',
                      bgcolor: activePageId === item.id ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                      '&.Mui-selected': { 
                        bgcolor: '#4f46e5',
                        '&:hover': { bgcolor: '#4338ca' }
                      },
                      color: activePageId === item.id ? '#fff' : '#94a3b8',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 0, mr: open ? 2 : 'auto', 
                      color: activePageId === item.id ? '#fff' : '#94a3b8' 
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText 
                        primary={item.label} 
                        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: activePageId === item.id ? 700 : 500 }} 
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, minHeight: '100vh', width: '100%' }}>
        <Toolbar />
        <Container maxWidth="2xl" sx={{ p: '0 !important' }}>
          {activeContent?.component === 'welcome' ? <WelcomePage /> : activeContent?.component}
        </Container>
      </Box>
    </Box>
  );
}
export default App;