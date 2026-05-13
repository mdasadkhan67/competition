import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/admin';

export const fetchStats = createAsyncThunk(
    'admin/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get('/admin/registrations/stats');
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
        }
    }
);

export const fetchUsers = createAsyncThunk(
    'admin/fetchUsers',
    async (filter = '', { rejectWithValue }) => {
        try {
            const res = await API.get(`/admin/registrations${filter ? `?group=${filter}` : ''}`);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const updateUserStatus = createAsyncThunk(
    'admin/updateUserStatus',
    async ({ id, status, reason }, { rejectWithValue }) => {
        try {
            const body = { status };
            if (reason) body.reason = reason;
            await API.put(`/admin/registrations/${id}/paymentStatus`, body);
            // We just return success, and we'll re-fetch in the component or update state locally
            return { id, status };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await API.delete(`/admin/registrations/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

const initialState = {
    stats: {},
    users: [],
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Stats
            .addCase(fetchStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update User
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                const { id, status } = action.payload;
                const userIndex = state.users.findIndex(u => u._id === id);
                if (userIndex !== -1) {
                    state.users[userIndex].payment.status = status;
                }
            })
            // Delete User
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
            });
    },
});

export default adminSlice.reducer;
