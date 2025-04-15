import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarDays, 
  FileText, 
  PlusCircle, 
  ClipboardList,
  Pill,
  BedDouble,
  UserCircle,
  Menu,
  X,
  Home,
  Heart,
  LogOut,
  Bell,
  Search,
  Settings,
  ChevronRight
} from "lucide-react";
import { authService } from "../services";
import { useAuth } from "../contexts/AuthContext";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Logo from '@/assets/logo.svg';
import { toast } from "react-hot-toast";
import NewAppointmentDialog from "../components/dialogs/NewAppointmentDialog";

const PatientLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const [userData, setUserData] = useState({
    name: "Patient",
    email: "",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg"
  });
  
  // Load user data on mount
  useEffect(() => {
    const fetchUserData = () => {
      try {
        // Get user data from localStorage
        const storedUserData = authService.getUserData();
        if (storedUserData) {
          setUserData({
            name: storedUserData.name || storedUserData.firstName || "Patient",
            email: storedUserData.email || "",
            avatar: storedUserData.profileImage || storedUserData.avatar || "https://randomuser.me/api/portraits/men/75.jpg"
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
    
    // On small screens, default to closed sidebar
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Initial check
    handleResize();
    
    // Listen for window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Toggle sidebar for mobile responsiveness
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on mobile after navigation
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("PatientLayout: Logging out user");
      await logout();
      toast.success("You have been logged out successfully");
      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");
      // Still try to navigate to login page
      navigate("/login");
    }
  };

  const navItems = [
    { 
      title: "Dashboard", 
      path: "/patient-dashboard", 
      icon: <Home className="w-5 h-5" />,
      exact: true
    },
    { 
      title: "Appointments", 
      path: "/patient-dashboard/appointments", 
      icon: <CalendarDays className="w-5 h-5" /> 
    },
    { 
      title: "Medical Records", 
      path: "/patient-dashboard/medical-records", 
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      title: "Prescriptions", 
      path: "/patient-dashboard/prescriptions", 
      icon: <ClipboardList className="w-5 h-5" /> 
    },
    { 
      title: "Medications", 
      path: "/patient-dashboard/medications", 
      icon: <Pill className="w-5 h-5" /> 
    },
    { 
      title: "Bed Booking", 
      path: "/patient-dashboard/beds", 
      icon: <BedDouble className="w-5 h-5" /> 
    },
    { 
      title: "My Profile", 
      path: "/patient-dashboard/profile", 
      icon: <UserCircle className="w-5 h-5" /> 
    }
  ];

  const handleCreateAppointment = () => {
    // Show the dialog directly instead of navigating
    setShowNewAppointmentDialog(true);
    closeSidebarOnMobile();
  };

  const socialLinks = [
    { 
      icon: <FaTwitter className="h-4 w-4" />, 
      href: "#", 
      bgColor: "bg-blue-500" 
    },
    { 
      icon: <FaFacebookF className="h-4 w-4" />, 
      href: "#", 
      bgColor: "bg-blue-700" 
    },
    { 
      icon: <FaInstagram className="h-4 w-4" />, 
      href: "#", 
      bgColor: "bg-pink-600" 
    },
    { 
      icon: <FaLinkedinIn className="h-4 w-4" />, 
      href: "#", 
      bgColor: "bg-blue-500" 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none lg:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center ml-3 lg:ml-0">
              <img src={Logo} alt="Health Nest Logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-blue-700 hidden md:block">Health Nest</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                placeholder="Search in dashboard..." 
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
              <Bell size={20} />
              {notificationsCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notificationsCount}
                </span>
              )}
            </button>
            <div className="relative group">
              <button className="flex items-center space-x-1">
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200">
                  <img 
                    src={userData.avatar}
                    alt="User Avatar" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(userData.name);
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">{userData.name}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 h-screen">
        {/* Sidebar Backdrop (Mobile) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ 
            width: sidebarOpen ? "250px" : "0px",
            opacity: sidebarOpen ? 1 : 0
          }}
          className="fixed top-16 bottom-0 left-0 z-30 bg-white border-r border-gray-200 shadow-lg overflow-y-auto lg:translate-x-0 h-[calc(100vh-4rem)]"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {sidebarOpen && (
            <div className="flex flex-col h-full">
              {/* User Profile Section */}
              <div className="py-3 px-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-blue-100">
                    <img 
                      src={userData.avatar}
                      alt="User Avatar" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(userData.name);
                      }}
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="text-base font-semibold text-gray-800 truncate">{userData.name}</h2>
                    <p className="text-xs text-gray-500 truncate">{userData.email || "Patient"}</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button 
                    onClick={() => {
                      navigate("/patient-dashboard/profile");
                      closeSidebarOnMobile();
                    }}
                    className="flex-1 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-md transition"
                  >
                    View Profile
                  </button>
                  <button className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition">
                    <Settings size={16} />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map(item => (
                  <NavLink 
                    key={item.path} 
                    to={item.path}
                    end={item.exact}
                    onClick={closeSidebarOnMobile}
                    className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.title}
                  </NavLink>
                ))}
                
                <button 
                  onClick={handleCreateAppointment}
                  className="w-full flex items-center px-3 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                  <PlusCircle className="w-5 h-5 mr-3" />
                  New Appointment
                </button>
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 w-full text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </motion.aside>

        {/* Main Content */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 ${sidebarOpen ? 'ml-[250px]' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* New Appointment Dialog */}
      <NewAppointmentDialog 
        open={showNewAppointmentDialog} 
        onOpenChange={setShowNewAppointmentDialog} 
      />
    </div>
  );
};

export default PatientLayout;