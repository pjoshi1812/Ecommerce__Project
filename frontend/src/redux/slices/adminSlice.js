import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Use relative API URLs for production (Nginx will proxy to backend)
const API_URL = "/api";

// Helper function for auth header
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

// ------------------ Async Thunks ------------------

// Fetch all users (Admin only)
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch users" }
      );
    }
  }
);

// Add a new user
export const addUsers = createAsyncThunk(
  "admin/addUsers",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/admin/create`, userData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add user" }
      );
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/admin/${id}`,
        { name, email, role },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update user" }
      );
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/admin/delete/${id}`, {
        headers: getAuthHeader(),
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete user" }
      );
    }
  }
);

// ------------------ Admin Slice ------------------
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch users";
      })

      // Add
      .addCase(addUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUsers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.user) {
          state.users.push(action.payload.user);
        }
      })
      .addCase(addUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add user";
      })

      // Update
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        const index = state.users.findIndex(
          (user) => user._id === updatedUser._id
        );
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update user";
      })

      // Delete
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete user";
      });
  },
});

export default adminSlice.reducer;
