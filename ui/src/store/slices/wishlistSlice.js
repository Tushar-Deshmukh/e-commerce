import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { ApiConfig } from "../../config/ApiConfig";
import toast from "react-hot-toast";

export const fetchWishlistedIds = createAsyncThunk(
  "wishlist/fetchWishlistedIds",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(ApiConfig.wishlistedProducts);
      return res.data.data.productIds;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (product_id, { rejectWithValue }) => {
    try {
      const res = await axios.post(ApiConfig.toggleWishlist, { product_id });
      if (res.data.status === "success") {
        toast.success(res.data?.message);
        return { product_id, wishlisted: res.data.data.wishlisted };
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle wishlist"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    productIds: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistedIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistedIds.fulfilled, (state, action) => {
        state.loading = false;
        state.productIds = action.payload;
      })
      .addCase(fetchWishlistedIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { product_id, wishlisted } = action.payload;
        if (wishlisted) {
          state.productIds.push(product_id);
        } else {
          state.productIds = state.productIds.filter((id) => id !== product_id);
        }
      });
  },
});

export default wishlistSlice.reducer;
