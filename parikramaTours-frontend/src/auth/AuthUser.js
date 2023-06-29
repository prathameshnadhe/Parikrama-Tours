import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const AuthUser = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    const userData = sessionStorage.getItem("userData");
    console.log("userData auth : ", userData);
    if (userData) {
      setUserData(JSON.parse(userData));
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userData");
    setUserData(null);
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{ userData, handleLoginSuccess, handleLogout }}
    >
      {children}
    </UserContext.Provider>
  );
};
