import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Axios instance for API calls
const API = axios.create({
  baseURL:
    (import.meta.env.VITE_BACKEND_URL
      ? `${import.meta.env.VITE_BACKEND_URL}`
      : "") + "/api", // Use relative URL for proper proxy through Nginx
});

// -------------------- Async Thunks --------------------

// Fetch products by filters
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    price_min,
    price_max,
    category,
    collections,
    rating,
    numReviews,
    weight,
    name,
  }) => {
    const query = new URLSearchParams();
    if (collections) query.append("collections", collections);
    if (price_max) query.append("maxPrice", price_max);
    if (price_min) query.append("minPrice", price_min);
    if (category) query.append("category", category);
    if (rating) query.append("rating", rating);
    if (numReviews) query.append("numReviews", numReviews);
    if (weight) query.append("weight", weight);
    if (name) query.append("name", name);

    const response = await API.get(`/products?${query.toString()}`);
    return response.data;
  }
);

// Fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      throw error;
    }
  }
);

// Update a product (admin)
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    try {
      const response = await axios.put(`/api/products/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  }
);

// Fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }) => {
    try {
      const response = await axios.get(`/api/products/similar/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch similar products:", error);
      throw error;
    }
  }
);

// Fetch best-seller product
export const fetchBestSeller = createAsyncThunk(
  "products/fetchBestSeller",
  async () => {
    try {
      const response = await axios.get("/api/products/best-seller");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch best sellers:", error);
      throw error;
    }
  }
);

// Fetch new arrivals
export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async () => {
    try {
      const response = await axios.get("/api/products/new-arrivals");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch new arrivals:", error);
      throw error;
    }
  }
);

// -------------------- Product Slice --------------------

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    bestSeller: null,
    newArrivals: [],
    loading: false,
    error: null,
    filters: {
      minPrice: "",
      maxPrice: "",
      category: "",
      collections: "",
      rating: "",
      numReviews: "",
      weight: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        minPrice: "",
        maxPrice: "",
        category: "",
        collections: "",
        rating: "",
        numReviews: "",
        weight: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetch products by filters ---
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // --- fetch single product ---
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // --- update product ---
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.products.findIndex((p) => p._id === updated._id);
        if (index !== -1) state.products[index] = updated;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // --- fetch similar products ---
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // --- fetch best-seller ---
      .addCase(fetchBestSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.bestSeller = action.payload;
      })
      .addCase(fetchBestSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // --- fetch new arrivals ---
      .addCase(fetchNewArrivals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.newArrivals = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
