import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Get notifications
export const getNotifications = createAsyncThunk(
    'notification/getNotifications',
    async (params, { rejectWithValue }) => {
        try {
            const response = await axios.get('/notifications', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch notifications' });
        }
    }
);

// Mark as read
export const markAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/notifications/${id}/read`);
            return { ...response.data, id };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to mark as read' });
        }
    }
);

// Mark all as read
export const markAllAsRead = createAsyncThunk(
    'notification/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.put('/notifications/mark-all-read');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to mark all as read' });
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notifications: [],
        unreadCount: 0,
        pagination: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Notifications
            .addCase(getNotifications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.notifications = action.payload.data.notifications;
                state.unreadCount = action.payload.data.unreadCount;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to fetch notifications';
            })
            // Mark as Read
            .addCase(markAsRead.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                state.isLoading = false;
                const notification = state.notifications.find(n => n._id === action.payload.id);
                if (notification) {
                    notification.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAsRead.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message;
            })
            // Mark All as Read
            .addCase(markAllAsRead.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.isLoading = false;
                state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
                state.unreadCount = 0;
            })
            .addCase(markAllAsRead.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message;
            });
    },
});

export const { clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
