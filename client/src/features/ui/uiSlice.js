import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for the UI slice
 * @type {Object}
 * @property {Object} loading - Map of action types to their loading states
 */
const initialState = {
  loading: {},
};

/**
 * Redux slice for managing UI state
 * @type {Object}
 */
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    /**
     * Sets the loading state for a specific action type
     * @param {Object} state - Current state
     * @param {Object} action - Action object
     * @param {string} action.payload.actionType - Type of the action
     * @param {boolean} action.payload.isLoading - Whether the action is loading
     */
    setLoading: (state, action) => {
      state.loading[action.payload.actionType] = action.payload.isLoading;
    },
    /**
     * Clears the loading state for a specific action type
     * @param {Object} state - Current state
     * @param {Object} action - Action object
     * @param {string} action.payload.actionType - Type of the action to clear
     */
    clearLoading: (state, action) => {
      delete state.loading[action.payload.actionType];
    },
    /**
     * Resets all loading states
     * @param {Object} state - Current state
     */
    resetLoading: (state) => {
      state.loading = {};
    },
  },
});

export const { setLoading, clearLoading, resetLoading } = uiSlice.actions;
export default uiSlice.reducer;

/**
 * Middleware for automatically managing loading states based on action types
 * @function loadingMiddleware
 * @returns {Function} Redux middleware
 */
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

/**
 * Store instance for middleware
 * @type {Object}
 */
let store;

/**
 * Injects the Redux store instance into the middleware
 * @function injectStore
 * @param {Object} _store - Redux store instance
 */
export const injectStore = (_store) => {
  store = _store;
};
