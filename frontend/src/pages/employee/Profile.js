import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import Layout from '../../components/Layout';
import { updateProfile, clearMessage, clearError } from '../../store/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error, message } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.leave);

  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  useEffect(() => {
    if (message) {
      setTimeout(() => dispatch(clearMessage()), 3000);
    }
  }, [message, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    dispatch(clearError());

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setFormError('Current password is required to change password');
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        setFormError('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        setFormError('Password must be at least 6 characters');
        return;
      }
    }

    const updateData = { name: formData.name };
    if (formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }

    const result = await dispatch(updateProfile(updateData));
    if (updateProfile.fulfilled.match(result)) {
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        My Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Profile Information
            </Typography>

            {(error || formError) && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => {
                  setFormError('');
                  dispatch(clearError());
                }}
              >
                {error || formError}
              </Alert>
            )}
            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email"
                value={user?.email}
                disabled
                helperText="Email cannot be changed"
                sx={{ mb: 3 }}
              />

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>

              <TextField
                fullWidth
                type="password"
                label="Current Password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                type="password"
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                helperText="Minimum 6 characters"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Account Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Email Verified:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    {user?.isEmailVerified ? 'Yes' : 'No'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Role:</Typography>
                  <Typography variant="body2" fontWeight="bold" textTransform="capitalize">
                    {user?.role}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Leave Balance
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Sick Leave:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {user?.leaveBalance?.sickLeave || 0} days
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Casual Leave:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {user?.leaveBalance?.casualLeave || 0} days
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Vacation:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {user?.leaveBalance?.vacation || 0} days
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Profile;
