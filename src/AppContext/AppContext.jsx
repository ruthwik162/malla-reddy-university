import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // 🔁 Replace this with your actual backend URL
  const url = "https://hostel-backend-bsza.onrender.com";

  // Configure axios for cookie support
  axios.defaults.withCredentials = true;

  // Load user from storage on mount (no auto-expiry check)
  useEffect(() => {
    const stored = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setAuthChecked(true);
  }, []);

  // Register User
  const register = async (formData) => {
    try {
      await axios.post(`${url}/user/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Registration successful! Please log in.");
      navigate("/");
      setShowUserLogin(true);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  // Login User
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${url}/user/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const u = response.data.user || response.data;
      if (!u || !u._id) {
        toast.error("Login failed: Invalid user data");
        return;
      }

      const userDetails = {
        id: u._id,
        username: u.username,
        email: u.email,
        mobile: u.mobile,
        gender: u.gender,
        role: u.role,
      };

      localStorage.setItem("user", JSON.stringify(userDetails));
      sessionStorage.setItem("user", JSON.stringify(userDetails));
      setUser(userDetails);

      toast.success("Logged in successfully!");
      navigate(u.role === "admin" ? "/adminhome" : "/");
      setShowUserLogin(false);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  // Logout User
  const logout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // Don't render children until auth check is done
  if (!authChecked) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        showUserLogin,
        setShowUserLogin,
        register,
        login,
        logout,
        navigate,
        url
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useAppContext = () => useContext(AppContext);
