// redux/slices/blogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogsApi from "../../../services/api/blogs.api";

const initialState = {
  blogs: [],
  loading: false,
  error: null,
  fetched: false,
};

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async () => {
    const data = await blogsApi.getAll();
    
    // Flatten categories → blogs
    const blogs = data.categories?.flatMap((cat) =>
      cat.blogs.map((b) => b.blog)
    ) || [];

    return blogs;
  },
  {
    condition: (_, { getState }) => {
      const state = getState();
      if (state.blogs.fetched) {
        return false;
      }
    },
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
        state.fetched = true;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default blogSlice.reducer;


