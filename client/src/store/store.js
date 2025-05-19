/**
 * Redux store configuration
 * @module store
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/auth/userSlice";
import postsReducer from "../features/posts/postsSlice";
import uiReducer, {
  loadingMiddleware,
  injectStore,
} from "../features/ui/uiSlice";
import chatReducer from "../features/chat/chatSlice";

/**
 * Configured Redux store instance
 * @type {import('@reduxjs/toolkit').Store}
 * @property {Object} reducer - Combined reducers
 * @property {Function} reducer.auth - Authentication state reducer
 * @property {Function} reducer.user - User state reducer
 * @property {Function} reducer.posts - Posts state reducer
 * @property {Function} reducer.ui - UI state reducer
 * @property {Function} reducer.chat - Chat state reducer
 * @property {Function} middleware - Custom middleware configuration
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postsReducer,
    ui: uiReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loadingMiddleware),
});

injectStore(store);
