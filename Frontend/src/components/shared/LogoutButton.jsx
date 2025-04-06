import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { authService } from "../../services";

const LogoutButton = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Use the authService logout method
    authService.logout();
    
    // Navigation is handled in the authService.logout method
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors ${className}`}
    >
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton; 