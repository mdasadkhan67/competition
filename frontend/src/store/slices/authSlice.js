import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/admin';

export const adminLogin = createAsyncThunk(
    'auth/adminLogin',
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await API.post('/admin/login', credentials);
            // The backend returns { success, message, data: { token, admin } }
            const { token, admin } = res.data.data;
            localStorage.setItem('token', token);
            return { token, user: admin };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
