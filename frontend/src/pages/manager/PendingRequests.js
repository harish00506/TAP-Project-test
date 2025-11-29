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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import {
  getPendingRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
  clearMessage,
} from '../../store/slices/leaveSlice';
import { format } from 'date-fns';

const PendingRequests = () => {
  const dispatch = useDispatch();
  const { requests, pagination, isLoading, message } = useSelector((state) => state.leave);

  const [filters, setFilters] = useState({
    employeeName: '',
    leaveType: '',
    page: 1,
    limit: 10,
  });

  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: '',
    requestId: null,
    comment: '',
  });

  useEffect(() => {
    dispatch(getPendingRequests(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(clearMessage());
        dispatch(getPendingRequests(filters));
      }, 2000);
    }
  }, [message, dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handlePageChange = (event, newPage) => {
    setFilters({ ...filters, page: newPage + 1 });
  };

  const handleRowsPerPageChange = (event) => {
    setFilters({ ...filters, limit: parseInt(event.target.value, 10), page: 1 });
  };

  const handleActionClick = (type, requestId) => {
    setActionDialog({ open: true, type, requestId, comment: '' });
  };

  const handleActionConfirm = async () => {
    if (!actionDialog.comment.trim()) {
      alert('Please provide a comment');
      return;
    }

    const { type, requestId, comment } = actionDialog;

    if (type === 'approve') {
      await dispatch(approveLeaveRequest({ id: requestId, managerComment: comment }));
    } else if (type === 'reject') {
      await dispatch(rejectLeaveRequest({ id: requestId, managerComment: comment }));
    }

    setActionDialog({ open: false, type: '', requestId: null, comment: '' });
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Pending Leave Requests
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Employee Name"
            name="employeeName"
            value={filters.employeeName}
            onChange={handleFilterChange}
            sx={{ minWidth: 200 }}
            size="small"
          />

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
            onClick={() => dispatch(getPendingRequests(filters))}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Employee</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Leave Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Start Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>End Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Days</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reason</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Requested On</TableCell>
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
                  No pending requests
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {request.userId?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.userId?.email}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{request.leaveType}</TableCell>
                  <TableCell>{format(new Date(request.startDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(request.endDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{request.totalDays}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>{request.reason}</TableCell>
                  <TableCell>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<ApproveIcon />}
                        onClick={() => handleActionClick('approve', request._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<RejectIcon />}
                        onClick={() => handleActionClick('reject', request._id)}
                      >
                        Reject
                      </Button>
                    </Box>
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

      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, type: '', requestId: null, comment: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionDialog.type === 'approve' ? 'Approve' : 'Reject'} Leave Request
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Manager Comment"
            value={actionDialog.comment}
            onChange={(e) => setActionDialog({ ...actionDialog, comment: e.target.value })}
            required
            helperText="Please provide a comment (required)"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setActionDialog({ open: false, type: '', requestId: null, comment: '' })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={handleActionConfirm}
            variant="contained"
            color={actionDialog.type === 'approve' ? 'success' : 'error'}
            disabled={!actionDialog.comment.trim()}
          >
            {actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default PendingRequests;
