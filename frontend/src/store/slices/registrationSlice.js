import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkStatus, registerUser } from '../../api/registration';

// Async thunk for checking status
export const fetchStatus = createAsyncThunk(
    'registration/fetchStatus',
    async (regId, { rejectWithValue }) => {
        try {
            const response = await checkStatus(regId);
            return response.data; // Assuming your checkStatus function returns { data: ... }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

// Async thunk for registering user
export const submitRegistration = createAsyncThunk(
    'registration/submitRegistration',
    async ({ form, files }, { rejectWithValue }) => {
        try {
            const response = await registerUser(form, files);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

const initialState = {
    statusData: null,
    registrationData: null,
    loading: false,
    error: null,
};

const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
        clearRegistrationState: (state) => {
            state.statusData = null;
            state.registrationData = null;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchStatus
            .addCase(fetchStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.statusData = null;
            })
            .addCase(fetchStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.statusData = action.payload;
            })
            .addCase(fetchStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle submitRegistration
            .addCase(submitRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registrationData = null;
            })
            .addCase(submitRegistration.fulfilled, (state, action) => {
                state.loading = false;
                state.registrationData = action.payload;
            })
            .addCase(submitRegistration.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearRegistrationState } = registrationSlice.actions;

export default registrationSlice.reducer;
