import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
  Badge,
} from '@mui/material';
import {
  Notifications,
  Star,
  FilterList,
  Menu as MenuIcon,
  Close,
  NotificationsActive,
} from '@mui/icons-material';

const NAV_ITEMS = [
  { label: 'All Notifications', path: '/', icon: <Notifications /> },
  { label: 'Priority', path: '/priority', icon: <Star /> },
  { label: 'Filter', path: '/filter', icon: <FilterList /> },
];

const DRAWER_WIDTH = 240;

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ width: DRAWER_WIDTH, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo area */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
            }}
          >
            <NotificationsActive sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.light' }}>
            Notif Hub
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
            <Close />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(108,99,255,0.15)' }} />

      <List sx={{ px: 1.5, pt: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(108,99,255,0.25) 0%, rgba(108,99,255,0.1) 100%)'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
                  '&:hover': {
                    background: 'rgba(108,99,255,0.12)',
                    border: '1px solid rgba(108,99,255,0.2)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'primary.light' : 'text.secondary',
                    },
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      boxShadow: '0 0 6px rgba(108,99,255,0.8)',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(153,153,187,0.5)', fontSize: '0.65rem' }}>
          © 2026 Notif Hub · All rights reserved
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 1.5 }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: 'primary.light' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <NotificationsActive sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.light', flexGrow: 1 }}>
            Notif Hub
          </Typography>

          {/* Desktop nav links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Box
                    key={item.path}
                    component={NavLink}
                    to={item.path}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 2,
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'primary.light' : 'text.secondary',
                      background: isActive ? 'rgba(108,99,255,0.18)' : 'transparent',
                      border: isActive ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        background: 'rgba(108,99,255,0.12)',
                        color: 'primary.light',
                      },
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Box>
                );
              })}
            </Box>
          )}

          <IconButton sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={3} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isMobile && drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
