import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Axios instance with backend URL from .env
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
});

// Add interceptor to include token dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Async thunks
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/orders");
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/orders/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async ({ id }, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/orders/${id}`);
      return id;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

// Slice
const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState: {
    adminOrders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload;
        state.totalOrders = action.payload.length;
        state.totalSales = action.payload.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const idx = state.adminOrders.findIndex(o => o._id === updatedOrder._id);
        if (idx !== -1) state.adminOrders[idx] = updatedOrder;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.adminOrders = state.adminOrders.filter(o => o._id !== action.payload);
        state.totalOrders = state.adminOrders.length;
        state.totalSales = state.adminOrders.reduce((acc, o) => acc + o.totalPrice, 0);
      });
  },
});

export default adminOrderSlice.reducer;
