import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Use relative URLs so Nginx can proxy in production
const API_URL = "http://suvarnarup-prajakta.imcc.com";

// Helper functions
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Fetch the cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ user, guestId }, { rejectWithValue }) => {
    try {
      let config = {};
      if (user && user._id && localStorage.getItem("userToken")) {
        config.headers = {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        };
      } else if (guestId) {
        config.params = { guestId };
      }
      const response = await axios.get(API_URL + "/api/cart", config);
      return response.data || { products: [] };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch cart" }
      );
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, category, collections, guestId, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        API_URL + "/api/cart",
        { productId, quantity, category, collections, guestId, userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add to cart" }
      );
    }
  }
);

// Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    { productId, quantity, guestId, userId, category, collections },
    { rejectWithValue }
  ) => {
    try {
      if (!productId || !category || !collections)
        return rejectWithValue({ message: "Missing required fields" });
      const parsedQuantity = Math.min(Math.max(parseInt(quantity), 0), 99);
      const response = await axios.put(API_URL + "/api/cart", {
        productId,
        quantity: parsedQuantity,
        category,
        collections,
        guestId,
        userId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update cart item" }
      );
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (
    { productId, guestId, userId, category, collections },
    { rejectWithValue, getState }
  ) => {
    try {
      if (!productId || !category || !collections)
        return rejectWithValue({ message: "Missing required fields" });
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        data: { productId, category, collections, guestId, userId },
      };
      const response = await axios.delete(API_URL + "/api/cart", config);
      if (response.data?.cart) {
        saveCartToStorage(response.data.cart);
        return response.data.cart;
      }

      const currentState = getState();
      const updatedProducts = currentState.cart.cart.products.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.category === category &&
            item.collections === collections
          )
      );
      const updatedCart = {
        ...currentState.cart.cart,
        products: updatedProducts,
        totalPrice: updatedProducts.reduce(
          (acc, item) => acc + parseFloat(item.price) * item.quantity,
          0
        ),
      };
      saveCartToStorage(updatedCart);
      return updatedCart;
    } catch (error) {
      const currentState = getState();
      return currentState.cart.cart;
    }
  }
);

// Merge guest cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        API_URL + "/api/cart/merge",
        { guestId, userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to merge cart" }
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: loadCartFromStorage(), loading: false, error: null },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch cart";
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to cart";
      })

      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update item quantity";
      })

      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to remove item from cart";
      })

      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to merge cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
