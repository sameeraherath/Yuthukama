import HomeScreen from "./pages/HomeScreen";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx"; // Import as named export
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/home" element={<HomeScreen />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
