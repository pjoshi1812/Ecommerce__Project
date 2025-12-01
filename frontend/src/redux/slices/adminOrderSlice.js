// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchAllOrders = createAsyncThunk(
//   "adminOrders/fetchAllOrders",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error(error);
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const updateOrderStatus = createAsyncThunk(
//   "adminOrders/updateOrderStatus",
//   async ({ id, status }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
//         { status },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error(error);
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const deleteOrder = createAsyncThunk(
//   "adminOrders/deleteOrder",
//   async ({ id }, { rejectWithValue }) => {
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );
//       return id;
//     } catch (error) {
//       console.error(error);
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// const adminOrderSlice = createSlice({
//   name: "adminOrder",
//   initialState: {
//     adminOrders: [],
//     totalOrders: 0,
//     totalSales: 0,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllOrders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.adminOrders = action.payload;
//         state.totalOrders = action.payload.length;
//         state.totalSales = action.payload.reduce(
//           (acc, order) => acc + order.totalPrice,
//           0
//         );
//         state.error = null;
//       })
//       .addCase(fetchAllOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Failed to fetch orders';
//       })
//       .addCase(updateOrderStatus.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateOrderStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         const updatedOrder = action.payload;
//         const orderIndex = state.adminOrders.findIndex(
//           (order) => order._id === updatedOrder._id
//         );
//         if (orderIndex !== -1) {
//           state.adminOrders[orderIndex] = updatedOrder;
//         }
//         state.error = null;
//       })
//       .addCase(updateOrderStatus.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Failed to update order status';
//       })
//       .addCase(deleteOrder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.adminOrders = state.adminOrders.filter(
//           (order) => order._id !== action.payload
//         );
//         state.totalOrders = state.adminOrders.length;
//         state.totalSales = state.adminOrders.reduce(
//           (acc, order) => acc + order.totalPrice,
//           0
//         );
//         state.error = null;
//       })
//       .addCase(deleteOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Failed to delete order';
//       });
//   },
// });

// export default adminOrderSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://suvarnarup-prajakta.imcc.com/api";

// ================================
// Fetch All Orders (Admin)
// ================================
export const fetchAllOrders = createAsyncThunk(
  "adminOrder/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// ================================
// Update Order Status
// ================================
export const updateOrderStatus = createAsyncThunk(
  "adminOrder/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
  }
);

// ================================
// Delete Order
// ================================
export const deleteOrder = createAsyncThunk(
  "adminOrder/deleteOrder",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/admin/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete order");
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState: {
    adminOrders: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.adminOrders = state.adminOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })

      // DELETE
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.adminOrders = state.adminOrders.filter(
          (order) => order._id !== action.payload
        );
      });
  },
});

export default adminOrderSlice.reducer;
