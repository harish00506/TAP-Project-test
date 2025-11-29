import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import Layout from '../../components/Layout';
import { applyLeave, getLeaveBalance, clearMessage, clearError } from '../../store/slices/leaveSlice';
import { format } from 'date-fns';

const ApplyLeave = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { balance, isLoading, error, message } = useSelector((state) => state.leave);

  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    isHalfDay: false,
    reason: '',
  });

  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    dispatch(getLeaveBalance());
  }, [dispatch]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(formData.isHalfDay ? 0.5 : diffDays);
    } else {
      setTotalDays(0);
    }
  }, [formData.startDate, formData.endDate, formData.isHalfDay]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(clearMessage());
        navigate('/employee/my-requests');
      }, 2000);
    }
  }, [message, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isHalfDay' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      return;
    }

    await dispatch(
      applyLeave({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays,
        reason: formData.reason,
      })
    );
  };

  const getAvailableBalance = () => {
    if (!balance || !formData.leaveType) return 0;
    const key = `${formData.leaveType}Leave`;
    return balance[key] || 0;
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Apply for Leave
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                  {error}
                </Alert>
              )}
              {message && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}

              <TextField
                select
                fullWidth
                label="Leave Type"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              >
                <MenuItem value="sick">Sick Leave</MenuItem>
                <MenuItem value="casual">Casual Leave</MenuItem>
                <MenuItem value="vacation">Vacation Leave</MenuItem>
              </TextField>

              {formData.leaveType && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Available Balance: {getAvailableBalance()} days
                </Alert>
              )}

              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: format(new Date(), 'yyyy-MM-dd') }}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: formData.startDate || format(new Date(), 'yyyy-MM-dd') }}
                required
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="isHalfDay"
                    checked={formData.isHalfDay}
                    onChange={handleChange}
                  />
                }
                label="Half Day Leave"
                sx={{ mb: 2 }}
              />

              {totalDays > 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Total Days: {totalDays}
                </Alert>
              )}

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Reason for Leave"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                helperText="Please provide a detailed reason (minimum 10 characters)"
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                startIcon={<SendIcon />}
                disabled={isLoading || totalDays === 0}
              >
                {isLoading ? 'Submitting...' : 'Submit Leave Request'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Leave Balance
            </Typography>
            {balance && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Sick Leave:</Typography>
                  <Typography fontWeight="bold">{balance.sickLeave} days</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Casual Leave:</Typography>
                  <Typography fontWeight="bold">{balance.casualLeave} days</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Vacation:</Typography>
                  <Typography fontWeight="bold">{balance.vacation} days</Typography>
                </Box>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Guidelines
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Submit leave requests at least 2 days in advance
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • Half-day leaves count as 0.5 days
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • You can cancel pending requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Approved/rejected requests cannot be modified
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ApplyLeave;
