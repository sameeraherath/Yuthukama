import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: {},
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading[action.payload.actionType] = action.payload.isLoading;
    },
    clearLoading: (state, action) => {
      delete state.loading[action.payload.actionType];
    },
    resetLoading: (state) => {
      state.loading = {};
    },
  },
});

export const { setLoading, clearLoading, resetLoading } = uiSlice.actions;
export default uiSlice.reducer;

export const loadingMiddleware = () => (next) => (action) => {
  if (action.type.endsWith("/pending")) {
    store.dispatch(
      setLoading({
        actionType: action.type.replace("/pending", ""),
        isLoading: true,
      })
    );
  } else if (
    action.type.endsWith("/fulfilled") ||
    action.type.endsWith("/rejected")
  ) {
    const actionType = action.type.replace(/\/(fulfilled|rejected)$/, "");
    store.dispatch(
      setLoading({
        actionType,
        isLoading: false,
      })
    );
  }

  return next(action);
};

let store;
export const injectStore = (_store) => {
  store = _store;
};
