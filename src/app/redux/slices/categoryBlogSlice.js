// redux/slices/categoryBlogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogsApi from "../../../services/api/blogs.api";

const initialState = {
  blogs: [],
  loading: false,
  error: null,
};

// Fetch blogs from API
export const fetchCategoryBlogs = createAsyncThunk(
  "categoryBlogs/fetchCategoryBlogs",
  async () => {
    const data = await blogsApi.getAll();
    return data.blogs || [];
  }
);

const categoryBlogSlice = createSlice({
  name: "categoryBlogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchCategoryBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default categoryBlogSlice.reducer;


