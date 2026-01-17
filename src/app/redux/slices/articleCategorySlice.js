// redux/slices/articleCategorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogsApi from "../../../services/api/blogs.api";
import { CONFIG } from "../../../config/constants.js";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

// Thunk to fetch category by ID
export const fetchArticleCategory = createAsyncThunk(
  "articleCategory/fetch",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}/blogs/article-categories/${id}`);
      if (!response.ok) throw new Error('Failed to fetch category');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch category");
    }
  }
);

const articleCategorySlice = createSlice({
  name: "articleCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticleCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchArticleCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default articleCategorySlice.reducer;


