import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/auth/authSlice';
import dashboardReducer from '../reducers/dashboard/dashboardSlice';
import fulfillmentReducer from '../reducers/fulfillment/fulfillmentSlice';
import inventoryManagementReducer from '../reducers/inventory_management/inventoryManagementSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    fulfillment: fulfillmentReducer,
    inventoryManagement: inventoryManagementReducer,
  },
})

