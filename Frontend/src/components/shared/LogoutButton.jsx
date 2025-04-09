import React from "react";
import { LogOut } from "lucide-react";
import authService from "../../services/authService";
import { toast } from "react-hot-toast";

const LogoutButton = ({ className = "" }) => {
  const handleLogout = async () => {
    try {
      // Use the updated async authService logout method
      await authService.logout();
      // No need to handle navigation as it's done in authService.logout
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