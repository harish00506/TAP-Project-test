import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Apply for leave
export const applyLeave = createAsyncThunk(
  'leave/applyLeave',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/leaves', leaveData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to apply leave' });
    }
  }
);

// Get my requests
export const getMyRequests = createAsyncThunk(
  'leave/getMyRequests',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('/leaves/my-requests', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch requests' });
    }
  }
);

// Cancel leave request
export const cancelLeaveRequest = createAsyncThunk(
  'leave/cancelLeaveRequest',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/leaves/${id}`);
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to cancel request' });
    }
  }
);

// Get leave balance
export const getLeaveBalance = createAsyncThunk(
  'leave/getLeaveBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/leaves/balance');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch balance' });
    }
  }
);

// Get all requests (Manager)
export const getAllRequests = createAsyncThunk(
  'leave/getAllRequests',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('/leaves/all', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch requests' });
    }
  }
);

// Get pending requests (Manager)
export const getPendingRequests = createAsyncThunk(
  'leave/getPendingRequests',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('/leaves/pending', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch requests' });
    }
  }
);

// Approve leave request (Manager)
export const approveLeaveRequest = createAsyncThunk(
  'leave/approveLeaveRequest',
  async ({ id, managerComment }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/leaves/${id}/approve`, { managerComment });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to approve request' });
    }
  }
);

// Reject leave request (Manager)
export const rejectLeaveRequest = createAsyncThunk(
  'leave/rejectLeaveRequest',
  async ({ id, managerComment }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/leaves/${id}/reject`, { managerComment });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to reject request' });
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState: {
    requests: [],
    balance: null,
    pagination: null,
    isLoading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply Leave
      .addCase(applyLeave.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to apply leave';
      })
      // Get My Requests
      .addCase(getMyRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload.data.leaveRequests;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getMyRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch requests';
      })
      // Cancel Leave Request
      .addCase(cancelLeaveRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelLeaveRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = state.requests.filter(req => req._id !== action.payload.id);
        state.message = action.payload.message;
      })
      .addCase(cancelLeaveRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to cancel request';
      })
      // Get Leave Balance
      .addCase(getLeaveBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLeaveBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.data.leaveBalance;
      })
      .addCase(getLeaveBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })
      // Get All Requests (Manager)
      .addCase(getAllRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload.data.leaveRequests;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch requests';
      })
      // Get Pending Requests (Manager)
      .addCase(getPendingRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPendingRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload.data.leaveRequests;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getPendingRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch requests';
      })
      // Approve Leave Request
      .addCase(approveLeaveRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveLeaveRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(approveLeaveRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to approve request';
      })
      // Reject Leave Request
      .addCase(rejectLeaveRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectLeaveRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(rejectLeaveRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to reject request';
      });
  },
});

export const { clearError, clearMessage } = leaveSlice.actions;
export default leaveSlice.reducer;
