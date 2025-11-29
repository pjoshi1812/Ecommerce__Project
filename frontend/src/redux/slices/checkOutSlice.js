import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create checkout session
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://suvarnarup-prajakta.imcc.com/api/checkout", checkoutData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// Update payment status
export const updatePaymentStatus = createAsyncThunk(
  "checkout/updatePaymentStatus",
  async ({ checkoutId, paymentDetails }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://suvarnarup-prajakta.imcc.com/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "paid", paymentDetails },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update payment status" }
      );
    }
  }
);

// Finalize order
export const finalizeOrder = createAsyncThunk(
  "checkout/finalizeOrder",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://suvarnarup-prajakta.imcc.com/api/checkout/${checkoutId}/finalize`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to finalize order" }
      );
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
    orderStatus: null,
  },
  reducers: {
    resetCheckoutState: (state) => {
      state.checkout = null;
      state.paymentStatus = null;
      state.orderStatus = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createCheckout
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
        state.paymentStatus = "pending";
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Checkout failed";
      })

      // updatePaymentStatus
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload.checkout;
        state.paymentStatus = "paid";
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Payment update failed";
      })

      // finalizeOrder
      .addCase(finalizeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizeOrder.fulfilled, (state) => {
        state.loading = false;
        state.orderStatus = "finalized";
        state.checkout = null;
        state.paymentStatus = null;
      })
      .addCase(finalizeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Order finalization failed";
      });
  },
});

export const { resetCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
