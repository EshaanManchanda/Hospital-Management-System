import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authService } from "../../services";

const Appointments = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  useEffect(() => {
    if (isAuthenticated && userRole === "patient") {
      navigate("/patient-dashboard", { state: { activeTab: "appointments" }});
    }
  }, [isAuthenticated, userRole, navigate]);

  // If not authenticated, redirect to the appointments list
  if (!isAuthenticated) {
    return <Navigate to="/appointments" />;
  }

  // For other roles or while redirecting, show loading
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default Appointments; 