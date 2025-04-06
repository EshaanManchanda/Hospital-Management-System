import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  FileText, 
  Stethoscope,
  Settings,
  MessageSquare,
  LineChart,
  Clock,
  BellRing,
  HeartPulse,
  Pill,
  Home,
  UserCheck,
  PlusCircle,
  DollarSign,
  BedDouble,
  BarChart2,
  Calendar,
  Bell
} from "lucide-react";
import logo from '@/assets/logo.svg';

const menuItems = [
  { title: "Dashboard", path: "/admin-dashboard", icon: <Home className="mr-2 h-5 w-5" /> },
  { title: "Patients", path: "/admin-dashboard/patients", icon: <Users className="mr-2 h-5 w-5" /> },
  { title: "Doctors", path: "/admin-dashboard/doctors", icon: <UserCheck className="mr-2 h-5 w-5" /> },
  { title: "Appointments", path: "/admin-dashboard/appointments", icon: <Calendar className="mr-2 h-5 w-5" /> },
  { title: "Medical Records", path: "/admin-dashboard/medical-records", icon: <FileText className="mr-2 h-5 w-5" /> },
  { title: "Pharmacy", path: "/admin-dashboard/pharmacy", icon: <PlusCircle className="mr-2 h-5 w-5" /> },
  { title: "Revenue", path: "/admin-dashboard/revenue", icon: <DollarSign className="mr-2 h-5 w-5" /> },
  { title: "Book Bed", path: "/admin-dashboard/book-bed", icon: <BedDouble className="mr-2 h-5 w-5" /> },
  { title: "Messages", path: "/admin-dashboard/messages", icon: <MessageSquare className="mr-2 h-5 w-5" /> },
  { title: "Schedule", path: "/admin-dashboard/schedule", icon: <Clock className="mr-2 h-5 w-5" /> },
  { title: "Notifications", path: "/admin-dashboard/notifications", icon: <Bell className="mr-2 h-5 w-5" /> },
  { title: "Reports", path: "/admin-dashboard/reports", icon: <BarChart2 className="mr-2 h-5 w-5" /> },
  { title: "Settings", path: "/admin-dashboard/settings", icon: <Settings className="mr-2 h-5 w-5" /> },
];

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "w-64 lg:w-64"
      )}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <Link to="/admin-dashboard" className="flex items-center gap-2">
          <img src={logo} alt="Hospital Logo" className="h-8" />
          <span className="text-lg font-semibold text-hospital-primary">Hospital Manager</span>
        </Link>
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold text-gray-400 mb-4 uppercase">Menu</p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.title} 
              to={item.path} 
              className={cn(
                "hospitalNav",
                location.pathname === item.path && "active"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
