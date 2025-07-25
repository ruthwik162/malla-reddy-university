import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);

  // Load user on mount from sessionStorage or localStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Register User
  const register = async (formData) => {
    try {
      await axios.post("http://localhost:8087/user/register", formData, {
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
    const response = await axios.post("http://localhost:8087/user/login", {
      email,
      password,
    }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    console.log("Login response:", response.data); // helpful for debugging

    // ✅ Fix: fallback to raw response if `user` is not wrapped
    const user = response.data.user || response.data;

    if (!user || !user._id) {
      toast.error("Login failed: Invalid user data");
      return;
    }

    const userDetails = {
      id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      gender: user.gender,
    };

    localStorage.setItem("user", JSON.stringify(userDetails));
    sessionStorage.setItem("user", JSON.stringify(userDetails));
    setUser(userDetails);

    toast.success("Logged in successfully!");
    navigate(user.role === "admin" ? "/adminhome" : "/");
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useAppContext = () => useContext(AppContext);
