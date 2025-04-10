import React from "react";
import { LogOut } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ className = "", variant = "default" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("LogoutButton: Initiating logout process");
      
      // Use the updated auth context logout method 
      // which will handle navigation to the login page
      await logout();
      
      // In case the navigate in AuthContext doesn't work,
      // provide a fallback navigate here
      navigate("/login");
    } catch (error) {
      console.error("LogoutButton: Logout error:", error);
      toast.error("Error during logout. Please try again.");
      
      // Still try to navigate to login page even if logout fails
      navigate("/login");
    }
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleLogout}
        className={`flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors w-full ${className}`}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    );
  }

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