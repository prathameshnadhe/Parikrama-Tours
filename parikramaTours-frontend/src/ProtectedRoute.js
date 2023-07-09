import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ Component, adminOnly, ...rest }) => {
  const user = useSelector((state) => state.user);

  const isAuthenticated = user !== null;
  const isAdminOrLeadGuide =
    user && (user.role === "admin" || user.role === "lead-guide");

  if (adminOnly && (!isAuthenticated || !isAdminOrLeadGuide)) {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default ProtectedRoute;
