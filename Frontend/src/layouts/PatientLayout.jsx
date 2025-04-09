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

const PatientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [userName, setUserName] = useState("Patient");
  const [userAvatar, setUserAvatar] = useState("https://randomuser.me/api/portraits/men/75.jpg");
  
  useEffect(() => {
    // Set user data
    const userData = authService.getUserData();
    if (userData?.name) {
      setUserName(userData.name);
    }
    
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

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation is handled in the AuthContext
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { 
      title: "Dashboard", 
      path: "/patient-dashboard", 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      title: "Appointments", 
      path: "/patient-dashboard/appointments", 
      icon: <CalendarDays className="w-5 h-5" /> 
    },
    { 
      title: "Medical Reports", 
      path: "/patient-dashboard/reports", 
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
    navigate("/appointments/new");
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
              <Menu size={20} />
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
                    src={userAvatar}
                    alt="User Avatar" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">{userName}</span>
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
          className={`fixed bottom-0 left-0 z-30 bg-white border-r border-gray-200 shadow-lg overflow-y-auto lg:relative lg:translate-x-0`}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {sidebarOpen && (
            <div className="flex flex-col h-full">
              {/* User Profile Section */}
              <div className="py-3 px-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-blue-100">
                    <img 
                      src={userAvatar}
                      alt="User Avatar" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-800">{userName}</h2>
                    <p className="text-xs text-gray-500">Patient</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button 
                    onClick={() => navigate("/patient-dashboard/profile")}
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
              <div className="py-3 flex-1">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Main Navigation
                </h3>
                <nav className="space-y-0.5">
                  {navItems.map((item, index) => (
                    <NavLink 
                      key={index}
                      to={item.path}
                      className={({ isActive }) => 
                        `flex items-center px-4 py-2 text-sm font-medium transition-all ${
                          isActive 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                      end={item.path === "/patient-dashboard"}
                    >
                      <span className={`p-1 rounded-md mr-3 ${
                        location.pathname === item.path || 
                        (item.path === "/patient-dashboard" && location.pathname === "/patient-dashboard") 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                      {location.pathname === item.path && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
              
              {/* Quick Actions */}
              <div className="px-4 py-3 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Quick Actions
                </h3>
                <button
                  onClick={handleCreateAppointment}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <PlusCircle size={16} />
                  <span>New Appointment</span>
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="mt-2 w-full px-3 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
              
              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 mt-auto">
                <p className="text-xs text-gray-500 mb-2">Health Nest • Patient Portal</p>
                <div className="flex space-x-2">
                  {socialLinks.map((link, index) => (
                    <a 
                      key={index}
                      href={link.href} 
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Social media link"
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.aside>

        {/* Main Content */}
        <motion.main 
          className="flex-1 overflow-y-auto"
          initial={false}
          animate={{ 
            marginLeft: sidebarOpen && window.innerWidth >= 1024 ? "0" : "0" 
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Dashboard Header */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-gray-800">
                  {navItems.find(item => location.pathname === item.path || 
                    (item.path === "/patient-dashboard" && location.pathname === "/patient-dashboard"))?.title || "Dashboard"}
                </h1>
                <p className="text-gray-500 text-sm">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCreateAppointment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 shadow-sm text-sm"
                >
                  <PlusCircle size={16} />
                  <span>New Appointment</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default PatientLayout; 