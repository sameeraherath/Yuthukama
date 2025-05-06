import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/auth/userSlice";
import postsReducer from "../features/posts/postsSlice";
import uiReducer, {
  loadingMiddleware,
  injectStore,
} from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loadingMiddleware),
});

injectStore(store);
