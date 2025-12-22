import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to create checkout session
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        checkoutdata,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

// Async thunk to update payment status
export const updatePaymentStatus = createAsyncThunk(
  "checkout/updatePaymentStatus",
  async ({ checkoutId, paymentDetails }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || { message: "Failed to update payment status" });
    }
  }
);

// Async thunk to finalize order
export const finalizeOrder = createAsyncThunk(
  "checkout/finalizeOrder",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data || { message: "Failed to finalize order" });
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
    paymentStatus: null,
    orderStatus: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create checkout cases
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
        state.paymentStatus = 'pending';
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Checkout failed";
      })
      // Update payment status cases
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload.checkout;
        state.paymentStatus = 'paid';
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Payment update failed";
      })
      // Finalize order cases
      .addCase(finalizeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderStatus = 'finalized';
        state.checkout = null; // Clear checkout after successful order creation
      })
      .addCase(finalizeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Order finalization failed";
      });
  },
});

export default checkoutSlice.reducer;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = "http://suvarnarup-prajakta.imcc.com/api";

// // ===============================
// // Save Shipping Address (Backend)
// // ===============================
// export const saveShippingAddress = createAsyncThunk(
//   "checkout/saveShippingAddress",
//   async (addressData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/checkout/shipping`,
//         addressData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue("Failed to save shipping address");
//     }
//   }
// );

// // ===============================
// // Save Payment Method (Backend)
// // ===============================
// export const savePaymentMethod = createAsyncThunk(
//   "checkout/savePaymentMethod",
//   async (paymentData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/checkout/payment`,
//         paymentData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue("Failed to save payment method");
//     }
//   }
// );

// const checkOutSlice = createSlice({
//   name: "checkout",
//   initialState: {
//     shippingAddress: JSON.parse(localStorage.getItem("shippingAddress")) || {},
//     paymentMethod: localStorage.getItem("paymentMethod") || "",
//     loading: false,
//     error: null,
//   },

//   reducers: {
//     // LOCAL ONLY (guest users)
//     saveShippingLocal: (state, action) => {
//       state.shippingAddress = action.payload;
//       localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
//     },

//     savePaymentLocal: (state, action) => {
//       state.paymentMethod = action.payload;
//       localStorage.setItem("paymentMethod", action.payload);
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       // SHIPPING
//       .addCase(saveShippingAddress.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(saveShippingAddress.fulfilled, (state, action) => {
//         state.loading = false;
//         state.shippingAddress = action.payload;
//       })
//       .addCase(saveShippingAddress.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // PAYMENT
//       .addCase(savePaymentMethod.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(savePaymentMethod.fulfilled, (state, action) => {
//         state.loading = false;
//         state.paymentMethod = action.payload.method;
//       })
//       .addCase(savePaymentMethod.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { saveShippingLocal, savePaymentLocal } = checkOutSlice.actions;

// export default checkOutSlice.reducer;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = "http://suvarnarup-prajakta.imcc.com/api";

// // ============================================
// // 1. CREATE CHECKOUT  (POST /checkout)
// // ============================================
// export const createCheckout = createAsyncThunk(
//   "checkout/createCheckout",
//   async (checkoutData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${API_URL}/checkout`, checkoutData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//         },
//       });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue("Failed to create checkout");
//     }
//   }
// );

// // ============================================
// // 2. UPDATE PAYMENT STATUS (PUT /checkout/:id/pay)
// // ============================================
// export const updatePaymentStatus = createAsyncThunk(
//   "checkout/updatePaymentStatus",
//   async ({ checkoutId, paymentDetails }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/checkout/${checkoutId}/pay`,
//         paymentDetails,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (err) {
//       return rejectWithValue("Failed to update payment");
//     }
//   }
// );

// // ============================================
// // 3. FINALIZE ORDER (POST /checkout/:id/finalize)
// // ============================================
// export const finalizeOrder = createAsyncThunk(
//   "checkout/finalizeOrder",
//   async (checkoutId, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/checkout/${checkoutId}/finalize`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (err) {
//       return rejectWithValue("Failed to finalize order");
//     }
//   }
// );

// const checkOutSlice = createSlice({
//   name: "checkout",
//   initialState: {
//     loading: false,
//     error: null,
//     checkout: null,
//     paymentStatus: null,
//     orderStatus: null,
//   },
//   reducers: {},

//   extraReducers: (builder) => {
//     builder
//       .addCase(createCheckout.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createCheckout.fulfilled, (state, action) => {
//         state.loading = false;
//         state.checkout = action.payload;
//       })
//       .addCase(createCheckout.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // PAYMENT
//       .addCase(updatePaymentStatus.fulfilled, (state, action) => {
//         state.paymentStatus = action.payload;
//       })

//       // FINALIZE
//       .addCase(finalizeOrder.fulfilled, (state, action) => {
//         state.orderStatus = action.payload;
//       });
//   },
// });

// export default checkOutSlice.reducer;
