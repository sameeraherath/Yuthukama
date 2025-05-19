/**
 * Main entry point for the React application
 * Sets up the root component with necessary providers and routing
 * @module main
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";

import "./utils/axiosConfig";

/**
 * Renders the root component with all necessary providers
 * @function
 * @returns {void}
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
