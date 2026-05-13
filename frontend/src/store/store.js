import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import registrationReducer from './slices/registrationSlice';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    registration: registrationReducer,
    auth: authReducer,
    admin: adminReducer,
  },
});
