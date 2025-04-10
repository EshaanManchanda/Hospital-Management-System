import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Menu, 
  Search, 
  Settings,
  User,
  LogOut,
  Shield,
  Users,
  HelpCircle,
  BarChart,
  FileText,
  Calendar,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { SearchCommand } from "./SearchCommand";
import { useToast } from "@/components/admin/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/admin/ui/badge";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const { logout, user } = useAuth();
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [messagesCount, setMessagesCount] = useState(2);
  const [userName, setUserName] = useState("Admin");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get current user data and update username
  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    }
    
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    try {
      // Use the auth context's logout function which will redirect to home
      await logout();
      // No need to show toast or navigate as the AuthContext handles this
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-hospital-primary px-4 md:px-6 text-white">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:bg-hospital-accent"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <div className="hidden md:flex items-center ml-2">
          <Shield className="h-5 w-5 mr-2" />
          <span className="font-semibold">Admin Portal</span>
          <Badge variant="outline" className="ml-3 bg-hospital-accent text-white border-none">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-hospital-accent"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
        
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-hospital-accent"
            onClick={() => handleNavigation("/admin-dashboard/calendar")}
          >
            <Calendar className="h-5 w-5" />
            <span className="sr-only">Calendar</span>
          </Button>
        </div>
        
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-hospital-accent"
            onClick={() => handleNavigation("/admin-dashboard/messages")}
          >
            <MessageSquare className="h-5 w-5" />
            {messagesCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                {messagesCount}
              </span>
            )}
            <span className="sr-only">Messages</span>
          </Button>
        </div>
        
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-hospital-accent"
            onClick={() => handleNavigation("/admin-dashboard/notifications")}
          >
            <Bell className="h-5 w-5" />
            {notificationsCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                {notificationsCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-hospital-accent"
              aria-label="User menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-hospital-accent text-white">
                <span className="text-sm font-medium">{getInitials(userName)}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-hospital-primary text-white mr-2">
                <span className="text-sm font-medium">{getInitials(userName)}</span>
              </div>
              <div>
                <div className="font-medium">{userName}</div>
                <div className="text-xs text-muted-foreground">Administrator</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigation("/admin-dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation("/admin-dashboard/users")}>
              <Users className="mr-2 h-4 w-4" />
              <span>Manage Users</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation("/admin-dashboard/reports")}>
              <BarChart className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation("/admin-dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigation("/admin-dashboard/help")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Documentation</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Navbar;
