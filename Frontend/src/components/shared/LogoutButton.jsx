import React from "react";
import { LogOut } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const LogoutButton = ({ className = "" }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Use the updated auth context logout method 
      // which will handle navigation to the home page
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
    }
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