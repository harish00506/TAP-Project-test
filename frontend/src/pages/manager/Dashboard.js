import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import {
    PendingActions as PendingIcon,
    CheckCircle as ApprovedIcon,
    People as PeopleIcon,
    Today as TodayIcon,
} from '@mui/icons-material';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../../components/Layout';
import { getManagerDashboard } from '../../store/slices/dashboardSlice';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
    const dispatch = useDispatch();
    const { managerData, isLoading } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(getManagerDashboard());
    }, [dispatch]);

    if (isLoading || !managerData) {
        return (
            <Layout>
                <Typography>Loading...</Typography>
            </Layout>
        );
    }

    const { stats, leavesByType, leavesByStatus, monthlyTrend } = managerData;

    const statsCards = [
        {
            title: 'Pending Requests',
            value: stats.pendingCount,
            icon: <PendingIcon sx={{ fontSize: 40 }} />,
            color: '#f59e0b',
        },
        {
            title: 'Approved Today',
            value: stats.approvedToday,
            icon: <TodayIcon sx={{ fontSize: 40 }} />,
            color: '#10b981',
        },
        {
            title: 'Approved This Month',
            value: stats.approvedThisMonth,
            icon: <ApprovedIcon sx={{ fontSize: 40 }} />,
            color: '#4f46e5',
        },
        {
            title: 'Total Employees',
            value: stats.totalEmployees,
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            color: '#6366f1',
        },
    ];

    const leaveTypeData = [
        { name: 'Sick', value: leavesByType.sick },
        { name: 'Casual', value: leavesByType.casual },
        { name: 'Vacation', value: leavesByType.vacation },
    ];

    const statusData = [
        { name: 'Pending', value: leavesByStatus.pending },
        { name: 'Approved', value: leavesByStatus.approved },
        { name: 'Rejected', value: leavesByStatus.rejected },
    ];

    return (
        <Layout>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Manager Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Stats Cards */}
                {statsCards.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ bgcolor: stat.color, color: 'white' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {stat.title}
                                        </Typography>
                                        <Typography variant="h3" fontWeight="bold">
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ opacity: 0.3 }}>{stat.icon}</Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {/* Leave Distribution by Type */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Leave Distribution by Type
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={leaveTypeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value} days`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {leaveTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Leave Distribution by Status */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Leave Distribution by Status
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Monthly Team Leave Trend */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Monthly Team Leave Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="totalDays" fill="#4f46e5" name="Total Days" />
                                <Bar dataKey="count" fill="#10b981" name="Number of Requests" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Dashboard;
