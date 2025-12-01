// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Async Thunk to featch users order 
// export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders",
//     async(_,{rejectWithValue})=>{
//         try {
//          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`, 
//             {
//                 headers: {
//                 Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    
//                 }
//             });
//         return response.data;

            
//         } catch (error) {
//             console.error(error);
//             return rejectWithValue(error.response.data);
//         }
//     }
// )

// // Async thunk to featch the details  by ID
// export const fetchOrdersDetails = createAsyncThunk("orders/fetchOrderDetails",
//     async(orderId,{rejectWithValue})=>{
//         try {
//          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
//             {
//                 headers: {
//                 Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    
//                 }
//             });
//         return response.data;

            
//         } catch (error) {
//             console.error(error);
//             return rejectWithValue(error.response.data);
//         }
//     }
// )

// const orderSlice = createSlice({
//     name:"orders",
//     initialState:{
//         orders:[],
//         totalOrders:0,
//         orderDetails:null,
//         loading:false,
//         error:null,
//     },
//     reducers:{},
//     extraReducers:(builder)=>{
//         builder
//         .addCase(fetchUserOrders.pending,(state)=>{
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(fetchUserOrders.fulfilled,(state,action)=>{
//             state.loading = false;
//             state.orders = action.payload;
//             state.error = null;
//         })
//         .addCase(fetchUserOrders.rejected,(state,action)=>{
//             state.loading = false;
//             state.error = action.payload.message;
//         })

//         .addCase(fetchOrdersDetails.pending,(state)=>{
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(fetchOrdersDetails.fulfilled,(state,action)=>{
//             state.loading = false;
//             state.orderDetails = action.payload;
//             state.error = null;
//         })
//         .addCase(fetchOrdersDetails.rejected,(state,action)=>{
//             state.loading = false;
//             state.error = action.payload.message;
//         })
//     }
// })
// export default orderSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://suvarnarup-prajakta.imcc.com/api";

// =================================
// Create Order (User checkout)
// =================================
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/order`, orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

// =================================
// Get User Orders
// =================================
export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/order/myorders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user orders"
      );
    }
  }
);

// =================================
// Get Single Order Details
// =================================
export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/order/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    orderDetails: null,
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    resetOrderState: (state) => {
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE ORDER
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // USER ORDERS
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ORDER DETAILS
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;

export default orderSlice.reducer;
