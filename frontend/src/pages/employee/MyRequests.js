import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  MenuItem,
  Box,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import Layout from '../../components/Layout';
import { getMyRequests, cancelLeaveRequest, clearMessage } from '../../store/slices/leaveSlice';
import { format } from 'date-fns';

const MyRequests = () => {
  const dispatch = useDispatch();
  const { requests, pagination, isLoading, message } = useSelector((state) => state.leave);

  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    page: 1,
    limit: 10,
  });

  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => {
    dispatch(getMyRequests(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (message) {
      setTimeout(() => dispatch(clearMessage()), 3000);
    }
  }, [message, dispatch]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handlePageChange = (event, newPage) => {
    setFilters({ ...filters, page: newPage + 1 });
  };

  const handleRowsPerPageChange = (event) => {
    setFilters({ ...filters, limit: parseInt(event.target.value, 10), page: 1 });
  };

  const handleCancelClick = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleCancelConfirm = async () => {
    if (deleteDialog.id) {
      await dispatch(cancelLeaveRequest(deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
      dispatch(getMyRequests(filters));
    }
  };

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
        My Leave Requests
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>

          <TextField
            select
            label="Leave Type"
            name="leaveType"
            value={filters.leaveType}
            onChange={handleFilterChange}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="sick">Sick</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="vacation">Vacation</MenuItem>
          </TextField>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => dispatch(getMyRequests(filters))}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Leave Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Start Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>End Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Days</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reason</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Manager Comment</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No leave requests found
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request._id} hover>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{request.leaveType}</TableCell>
                  <TableCell>{format(new Date(request.startDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(request.endDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{request.totalDays}</TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={getStatusColor(request.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{request.managerComment || '-'}</TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleCancelClick(request._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {pagination && (
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25]}
          />
        )}
      </TableContainer>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Cancel Leave Request</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel this leave request? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>No, Keep It</Button>
          <Button onClick={handleCancelConfirm} color="error" variant="contained">
            Yes, Cancel Request
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default MyRequests;
