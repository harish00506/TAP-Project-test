import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  EventAvailable as ApprovedIcon,
  Sick as SickIcon,
  BeachAccess as VacationIcon,
  Work as CasualIcon,
} from '@mui/icons-material';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../../components/Layout';
import { getEmployeeDashboard } from '../../store/slices/dashboardSlice';
import { format } from 'date-fns';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { employeeData, isLoading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getEmployeeDashboard());
  }, [dispatch]);

  if (isLoading || !employeeData) {
    return (
      <Layout>
        <Typography>Loading...</Typography>
      </Layout>
    );
  }

  const { leaveBalance, stats, upcomingLeaves, monthlyTrend } = employeeData;

  const leaveBalanceData = [
    { name: 'Sick Leave', value: leaveBalance.sickLeave, icon: <SickIcon /> },
    { name: 'Casual Leave', value: leaveBalance.casualLeave, icon: <CasualIcon /> },
    { name: 'Vacation', value: leaveBalance.vacation, icon: <VacationIcon /> },
  ];

  const leavesTakenData = [
    { name: 'Sick', value: stats.leavesByType.sick },
    { name: 'Casual', value: stats.leavesByType.casual },
    { name: 'Vacation', value: stats.leavesByType.vacation },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Employee Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Leave Balance Cards */}
        {leaveBalanceData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={item.name}>
            <Card sx={{ bgcolor: COLORS[index], color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {item.value}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      days remaining
                    </Typography>
                  </Box>
                  <Box sx={{ fontSize: 50, opacity: 0.3 }}>{item.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Total Leaves Taken */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Leaves Taken by Type
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leavesTakenData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leavesTakenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Monthly Trend */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Monthly Leave Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalDays" fill="#4f46e5" name="Days Taken" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Leave Statistics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Leave Statistics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Total Taken:</Typography>
                <Typography fontWeight="bold">{stats.totalLeavesTaken} days</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Pending:</Typography>
                <Chip label={stats.leavesByStatus.pending} color="warning" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Approved:</Typography>
                <Chip label={stats.leavesByStatus.approved} color="success" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Rejected:</Typography>
                <Chip label={stats.leavesByStatus.rejected} color="error" size="small" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Leaves */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Upcoming Approved Leaves
            </Typography>
            {upcomingLeaves.length === 0 ? (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No upcoming leaves
              </Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                {upcomingLeaves.map((leave) => (
                  <Box
                    key={leave._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      mb: 1,
                      bgcolor: '#f5f5f5',
                      borderRadius: 1,
                    }}
                  >
                    <Box>
                      <Typography fontWeight="bold" textTransform="capitalize">
                        {leave.leaveType} Leave
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(leave.startDate), 'MMM dd, yyyy')} -{' '}
                        {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${leave.totalDays} days`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
