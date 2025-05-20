import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import MainLayout from "./layouts/MainLayout.jsx";
import ChatPage from "./pages/ChatPage";
import ConversationsPage from "./pages/ConversationsPage";
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

  /**
   * Effect hook to check user session on application load
   * @effect
   * @listens {dispatch} - Redux dispatch function
   */
  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
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
      />{" "}
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
      />{" "}
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
      <Route
        path="/conversations"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ConversationsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
