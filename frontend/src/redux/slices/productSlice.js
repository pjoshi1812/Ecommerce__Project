// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import axios from "axios";

// // Async Thunk to featch products by collection and optional filters
// export const fetchProductsByFilters = createAsyncThunk("products/featchByFilters" , async({
//     price_min, price_max, category, collections, rating, numReviews, weight, name})=>{
//         const query = new URLSearchParams();
//         if(collections) query.append("collections", collections);
//         if(price_max) query.append("maxPrice", price_max);
//         if(price_min) query.append("minPrice", price_min);
//         if(category) query.append("category",category);
//         if(rating) query.append("rating",rating);
//         if(numReviews) query.append("numReviews",numReviews);
//         if(weight) query.append("weight",weight);
//         if(name) query.append("name", name);

//         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`);
//         return response.data;

//     }
// );
// // Ayn thunk to featch a single product by ID
// export const fetchProductDetails = createAsyncThunk("products/fetchProductDetails",async(id)=>{
//     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
//     return response.data;

// });

// // Async Thunck to fetach similer products 
// export const updateProduct = createAsyncThunk("products/updateProduct",async({id,productData})=>{
//     const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,productData,
//         {
//             headers:{
//                 Authorization:`Bearer ${localStorage.getItem("userToken")}`,

//             }
//         }
//     );
//     return response.data;
// });

// // Aysnc thunk to featch similer products 
// export const fetchSimilarProducts = createAsyncThunk("products/fetchSimilarProducts",async({id})=>{
//     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`);
//     return response.data;
// })

// const productSlice = createSlice({
//     name:"products",
//     initialState: {
//         products:[],
//         selectedProducts:null,
//         similarProducts:[],
//         loading:false,
//         error:null,
//         filters:{
//                 minPrice:"",
//                 maxPrice:"",
//                 category:"",
//                 collections:"",
//                 rating:"",
//                 numReviews:"",
//                 weight:""

//         }
//     },
//     reducers:{
//         setFilters:(state,action)=>{
//             state.filters={...state.filters, ...action.payload}
//         },
//         clearFilters:(state)=>{
//             state.filters={
//                 minPrice:"",
//                 maxPrice:"",
//                 category:"",
//                 collections:"",
//                 rating:"",
//                 numReviews:"",
//                 weight:""
//             };
//         },
//     },
//     extraReducers:(builder)=>{
//         builder
//         .addCase(fetchProductsByFilters.pending,(state)=>{
//             state.loading=true;
//             state.error=null;
//         })
//         .addCase(fetchProductsByFilters.fulfilled,(state,action)=>{
//             state.loading=false;
//             state.products=Array.isArray(action.payload)?action.payload:[];
//         })
//         .addCase(fetchProductsByFilters.rejected,(state,action)=>{
//             state.loading=false;
//             state.error=action.error.message;
//         })
//         .addCase(fetchProductDetails.pending,(state)=>{
//             state.loading=true;
//             state.error=null;
//         })
//         .addCase(fetchProductDetails.fulfilled,(state,action)=>{
//             state.loading=false;
//             state.selectedProducts=action.payload;
//         })
//         .addCase(fetchProductDetails.rejected,(state,action)=>{
//             state.loading=false;
//             state.error=action.error.message;
//         })
//         .addCase(updateProduct.pending,(state)=>{
//             state.loading=true;
//             state.error=null;
//         })
//         .addCase(updateProduct.fulfilled,(state,action)=>{
//             state.loading=false;
//             const updateProduct = action.payload;
//             const index= state.products.findIndex(
//                 (product)=>product.id===updateProduct._id
//             );
//             if(index!==-1){
//                 state.products[index]=updateProduct;
//             }
//         })
//         .addCase(updateProduct.rejected,(state,action)=>{
//             state.loading=false;
//             state.error=action.error.message;
//         })
//         .addCase(fetchSimilarProducts.pending,(state)=>{
//             state.loading=true;
//             state.error=null;
//         })
//         .addCase(fetchSimilarProducts.fulfilled,(state,action)=>{
//             state.loading=false;
//             state.products=action.payload;
//         })
//         .addCase(fetchSimilarProducts.rejected,(state,action)=>{
//             state.loading=false;
//             state.error=action.error.message;
//         })
//     }
// })

// export const {setFilters,clearFilters}=productSlice.actions;
// export default productSlice.reducer
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const API_URL = "http://suvarnarup-prajakta.imcc.com/api";

// ===============================
// Fetch All Products
// ===============================
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch products");
    }
  }
);

// ===============================
// Fetch Single Product
// ===============================
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch product");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    singleProduct: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch ALL
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch ONE
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
