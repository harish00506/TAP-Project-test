import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import { CheckCircleOutline as CheckIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { verifyEmail } from '../store/slices/authSlice';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { user, isLoading, error } = useSelector((state) => state.auth);
    const [verified, setVerified] = useState(false);

    const token = searchParams.get('token');

    useEffect(() => {
        if (token && !verified) {
            dispatch(verifyEmail(token)).then((result) => {
                if (verifyEmail.fulfilled.match(result)) {
                    setVerified(true);
                    setTimeout(() => {
                        if (result.payload.data.user.role === 'manager') {
                            navigate('/manager/dashboard');
                        } else {
                            navigate('/employee/dashboard');
                        }
                    }, 2000);
                }
            });
        }
    }, [token, dispatch, navigate, verified]);

    useEffect(() => {
        if (user && user.isEmailVerified && !token) {
            if (user.role === 'manager') {
                navigate('/manager/dashboard');
            } else {
                navigate('/employee/dashboard');
            }
        }
    }, [user, navigate, token]);

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
                <Paper elevation={3} sx={{ width: '100%', p: 4, textAlign: 'center' }}>
                    {isLoading && (
                        <>
                            <CircularProgress size={60} sx={{ mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Verifying Your Email
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Please wait while we verify your email address...
                            </Typography>
                        </>
                    )}

                    {!isLoading && verified && (
                        <>
                            <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Email Verified Successfully!
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Redirecting you to your dashboard...
                            </Typography>
                        </>
                    )}

                    {!isLoading && error && (
                        <>
                            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Verification Failed
                            </Typography>
                            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                                {error}
                            </Alert>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/login')}
                                sx={{ mt: 2 }}
                            >
                                Back to Login
                            </Button>
                        </>
                    )}

                    {!token && !isLoading && (
                        <>
                            <ErrorIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Email Verification Required
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                                Please check your email for the verification link.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/login')}
                                sx={{ mt: 3 }}
                            >
                                Back to Login
                            </Button>
                        </>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default VerifyEmail;
