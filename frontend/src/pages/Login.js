import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    CircularProgress,
    Tab,
    Tabs,
} from '@mui/material';
import { login, register, clearError, clearMessage } from '../store/slices/authSlice';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, error, message } = useSelector((state) => state.auth);

    const [tabValue, setTabValue] = useState(0);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (user) {
            // Allow login even without email verification
            if (user.role === 'manager') {
                navigate('/manager/dashboard');
            } else {
                navigate('/employee/dashboard');
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearMessage());
        };
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setFormError('');
        dispatch(clearError());
        dispatch(clearMessage());
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!loginData.email || !loginData.password) {
            setFormError('Please fill in all fields');
            return;
        }

        try {
            const result = await dispatch(login(loginData));
            console.log('Login result:', result);
            
            if (login.fulfilled.match(result)) {
                // Direct redirect after successful login
                const loggedInUser = result.payload?.data?.user;
                console.log('Logged in user:', loggedInUser);
                
                if (loggedInUser) {
                    if (loggedInUser.role === 'manager') {
                        navigate('/manager/dashboard', { replace: true });
                    } else {
                        navigate('/employee/dashboard', { replace: true });
                    }
                }
            } else if (login.rejected.match(result)) {
                // Show error message
                setFormError(result.payload?.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setFormError('An error occurred during login. Please try again.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!registerData.name || !registerData.email || !registerData.password) {
            setFormError('Please fill in all fields');
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        if (registerData.password.length < 6) {
            setFormError('Password must be at least 6 characters');
            return;
        }

        const result = await dispatch(
            register({
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
            })
        );

        if (register.fulfilled.match(result)) {
            setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
            setTabValue(0);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
                    <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, textAlign: 'center' }}>
                        <Typography component="h1" variant="h4" fontWeight="bold">
                            Employee Leave System
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Manage your leave requests efficiently
                        </Typography>
                    </Box>

                    <Tabs value={tabValue} onChange={handleTabChange} centered>
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>

                    {(error || formError || message) && (
                        <Box sx={{ px: 3, pt: 2 }}>
                            {(error || formError) && (
                                <Alert severity="error" onClose={() => {
                                    setFormError('');
                                    dispatch(clearError());
                                }}>
                                    {error || formError}
                                </Alert>
                            )}
                            {message && (
                                <Alert severity="success" onClose={() => dispatch(clearMessage())}>
                                    {message}
                                </Alert>
                            )}
                        </Box>
                    )}

                    <TabPanel value={tabValue} index={0}>
                        <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={loginData.email}
                                onChange={handleLoginChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
                            </Button>
                        </Box>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Box component="form" onSubmit={handleRegisterSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Full Name"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                value={registerData.name}
                                onChange={handleRegisterChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="register-email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="register-password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                helperText="Minimum 6 characters"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirm-password"
                                value={registerData.confirmPassword}
                                onChange={handleRegisterChange}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
                            </Button>
                        </Box>
                    </TabPanel>
                </Paper>

                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
                    © 2025 Employee Leave System. All rights reserved.
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
