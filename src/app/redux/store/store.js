// redux/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "../slices/blogSlice";
import categoryBlogReducer from '../slices/categoryBlogSlice';
import articleCategoryReducer from "../slices/articleCategorySlice";
// import privacyPolicyReducer from "../slices/privacyPolicySlice";

export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    categoryBlogs: categoryBlogReducer,
    articleCategory: articleCategoryReducer,
    // privacyPolicy: privacyPolicyReducer,
  },
});

