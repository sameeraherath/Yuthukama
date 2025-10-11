import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import HomeScreen from "./pages/HomeScreen";
import ExplorePage from "./pages/ExplorePage";
import SavedPage from "./pages/SavedPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import MainLayout from "./layouts/MainLayout.jsx";
import ChatPage from "./pages/ChatPage";
import ModernChatPage from "./pages/ModernChatPage";
import SettingsPage from "./pages/SettingsPage";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { checkUserSession } from "./features/auth/authAPI";

/**
 * Main application component that handles routing and authentication
 * @component
 * @returns {JSX.Element} The main application layout with routes
 * @example
 * // In main.jsx
 * import App from './App';
 *
 * ReactDOM.render(
 *   <Provider store={store}>
 *     <BrowserRouter>
 *       <App />
 *     </BrowserRouter>
 *   </Provider>,
 *   document.getElementById('root')
 * );
 */
const App = () => {
  const dispatch = useDispatch();
  const { sessionChecked } = useSelector((state) => state.auth);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  /**
   * Effect hook to check user session on application load
   * @effect
   * @listens {dispatch} - Redux dispatch function
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("App - Starting session check");
        await dispatch(checkUserSession()).unwrap();
        console.log("App - Session check successful");
      } catch (error) {
        console.log("App - Session check failed:", error);
        // Don't treat this as an error - just means no valid session
      } finally {
        console.log("App - Session check complete, setting initialCheckDone to true");
        setInitialCheckDone(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Show loading screen while checking session
  if (!initialCheckDone || !sessionChecked) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#1DBF73" }} />
      </Box>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
      <Route path="/articles/:id" element={<ArticleDetailPage />} />
      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin={true}>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      {/* Protected User Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HomeScreen />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ExplorePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SavedPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      {/* Modern Chat Routes - Split Screen */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ModernChatPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages/:conversationId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ModernChatPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      {/* Legacy Chat Routes - Full Screen */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ChatPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:conversationId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ChatPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
