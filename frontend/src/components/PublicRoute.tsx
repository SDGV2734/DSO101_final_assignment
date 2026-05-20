import { Navigate, Outlet } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";
import { useAuth } from "../context/AuthContext";

export const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
