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
  Pill
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "/admin/dashboard",
  },
  {
    title: "Patients",
    icon: <Users className="h-5 w-5" />,
    path: "/admin/patients",
  },
  {
    title: "Doctors",
    icon: <Stethoscope className="h-5 w-5" />,
    path: "/admin/doctors",
  },
  {
    title: "Appointments",
    icon: <CalendarDays className="h-5 w-5" />,
    path: "/admin/appointments",
  },
  {
    title: "Medical Records",
    icon: <FileText className="h-5 w-5" />,
    path: "/admin/records",
  },
  {
    title: "Pharmacy",
    icon: <Pill className="h-5 w-5" />,
    path: "/admin/pharmacy",
  },
  {
    title: "Reports",
    icon: <LineChart className="h-5 w-5" />,
    path: "/admin/reports",
  },
  {
    title: "Schedule",
    icon: <Clock className="h-5 w-5" />,
    path: "/admin/schedule",
  },
  {
    title: "Messages",
    icon: <MessageSquare className="h-5 w-5" />,
    path: "/admin/messages",
  },
  {
    title: "Notifications",
    icon: <BellRing className="h-5 w-5" />,
    path: "/admin/notifications",
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    path: "/admin/settings",
  },
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
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="bg-hospital-primary text-white p-1 rounded">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div className="text-xl font-display font-semibold text-gray-900">MediCore</div>
        </Link>
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold text-gray-400 mb-4 uppercase">Menu</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
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
