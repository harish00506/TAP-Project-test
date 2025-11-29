import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Badge,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    ExitToApp as LogoutIcon,
    Person as PersonIcon,
    Assignment as AssignmentIcon,
    AddCircleOutline as AddIcon,
    Notifications as NotificationsIcon,
    PendingActions as PendingIcon,
    ListAlt as ListIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => state.notification);

    const [anchorElUser, setAnchorElUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const employeeMenuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/employee/dashboard' },
        { text: 'Apply Leave', icon: <AddIcon />, path: '/employee/apply-leave' },
        { text: 'My Requests', icon: <AssignmentIcon />, path: '/employee/my-requests' },
        { text: 'Profile', icon: <PersonIcon />, path: '/employee/profile' },
    ];

    const managerMenuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/manager/dashboard' },
        { text: 'Pending Requests', icon: <PendingIcon />, path: '/manager/pending-requests' },
        { text: 'All Requests', icon: <ListIcon />, path: '/manager/all-requests' },
    ];

    const menuItems = user?.role === 'manager' ? managerMenuItems : employeeMenuItems;

    const drawer = (
        <Box sx={{ width: 250 }} role="presentation">
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6">ELS</Typography>
                <Typography variant="caption">{user?.role?.toUpperCase()}</Typography>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => {
                                navigate(item.path);
                                setMobileOpen(false);
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography
                            variant="h6"
                            noWrap
                            component={RouterLink}
                            to={user?.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard'}
                            sx={{
                                mr: 2,
                                display: { xs: 'none', sm: 'flex' },
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Employee Leave System
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
                            {menuItems.map((item) => (
                                <Button
                                    key={item.text}
                                    onClick={() => navigate(item.path)}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                    startIcon={item.icon}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton color="inherit">
                                <Badge badgeContent={unreadCount} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={user?.name} src="/static/images/avatar/2.jpg">
                                        {user?.name?.charAt(0)}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem disabled>
                                    <Typography textAlign="center">{user?.name}</Typography>
                                </MenuItem>
                                <MenuItem disabled>
                                    <Typography textAlign="center" variant="caption">
                                        {user?.email}
                                    </Typography>
                                </MenuItem>
                                <Divider />
                                {user?.role === 'employee' && (
                                    <MenuItem
                                        onClick={() => {
                                            navigate('/employee/profile');
                                            handleCloseUserMenu();
                                        }}
                                    >
                                        <ListItemIcon>
                                            <PersonIcon fontSize="small" />
                                        </ListItemIcon>
                                        Profile
                                    </MenuItem>
                                )}
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <LogoutIcon fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawer}
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Container maxWidth="xl">{children}</Container>
            </Box>
        </Box>
    );
};

export default Layout;
