import React, { useState } from "react";
import { Button } from "@/components/admin/ui/button";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/admin/ui/dropdown-menu";
import { Badge } from "@/components/admin/ui/badge";
import { 
  Bell, 
  Calendar,
  User,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle,
  MoreHorizontal,
  Filter,
  ChevronDown,
  Trash2,
  CheckCheck
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar";
import { cn } from "@/lib/utils";

// Mock notifications data
const notifications = [
  {
    id: "N001",
    title: "New Appointment Scheduled",
    description: "Appointment with Sarah Johnson has been scheduled for tomorrow at 10:00 AM.",
    time: "5 minutes ago",
    type: "appointment",
    read: false,
  },
  {
    id: "N002",
    title: "Lab Results Available",
    description: "Lab results for patient Mike Peterson are now available for review.",
    time: "30 minutes ago",
    type: "medical",
    read: false,
  },
  {
    id: "N003",
    title: "Staff Meeting Reminder",
    description: "Reminder: Monthly staff meeting today at 2:00 PM in Conference Room A.",
    time: "1 hour ago",
    type: "alert",
    read: true,
  },
  {
    id: "N004",
    title: "New Patient Registration",
    description: "Emily Williams has registered as a new patient. Please review her information.",
    time: "2 hours ago",
    type: "user",
    read: true,
  },
  {
    id: "N005",
    title: "Inventory Alert",
    description: "Low stock alert: Amoxicillin medication needs to be restocked.",
    time: "3 hours ago",
    type: "alert",
    read: true,
  },
  {
    id: "N006",
    title: "System Update Scheduled",
    description: "System will be down for maintenance on Saturday from 12:00 AM to 2:00 AM.",
    time: "1 day ago",
    type: "system",
    read: true,
  },
  {
    id: "N007",
    title: "Dr. Wilson Away Notice",
    description: "Dr. James Wilson will be away on vacation from July 15-22.",
    time: "1 day ago",
    type: "user",
    read: true,
  },
];

const typeIcons = {
  appointment: <Calendar className="h-5 w-5" />,
  medical: <FileText className="h-5 w-5" />,
  alert: <AlertTriangle className="h-5 w-5" />,
  user: <User className="h-5 w-5" />,
  system: <Info className="h-5 w-5" />,
};

const typeColors = {
  appointment: "text-blue-600 bg-blue-100",
  medical: "text-green-600 bg-green-100",
  alert: "text-amber-600 bg-amber-100",
  user: "text-purple-600 bg-purple-100",
  system: "text-gray-600 bg-gray-100",
};

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [notificationItems, setNotificationItems] = useState(notifications);

  const markAllAsRead = () => {
    setNotificationItems(notificationItems.map(n => ({...n, read: true})));
  };

  const markAsRead = (id) => {
    setNotificationItems(notificationItems.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  const deleteNotification = (id) => {
    setNotificationItems(notificationItems.filter(n => n.id !== id));
  };

  const filteredNotifications = activeFilter 
    ? notificationItems.filter(n => n.type === activeFilter)
    : notificationItems;

  const unreadCount = notificationItems.filter(n => !n.read).length;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
          <p className="text-gray-600">Stay updated with hospital activities</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {activeFilter ? activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1) : "All Notifications"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setActiveFilter(null)}>
                All Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("appointment")}>
                Appointments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("medical")}>
                Medical Records
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("user")}>
                User Updates
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("alert")}>
                Alerts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4" />
              <span>Mark All as Read</span>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-hospital-primary" />
            <h2 className="font-medium">
              {activeFilter ? `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Notifications` : "All Notifications"}
            </h2>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-hospital-primary hover:bg-hospital-accent">{unreadCount} New</Badge>
          )}
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No notifications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeFilter ? "There are no notifications of this type." : "Your notification list is empty."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`relative bg-white p-4 rounded-lg shadow flex gap-4 border-l-4 ${
                notification.read ? 'border-gray-200' : 'border-hospital-primary'
              }`}
            >
              <div className={`rounded-full p-2 ${typeColors[notification.type]} flex items-center justify-center w-10 h-10`}>
                {typeIcons[notification.type]}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${!notification.read && 'text-hospital-primary'}`}>
                    {notification.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{notification.time}</span>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-hospital-primary"></div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.description}
                </p>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    {notification.type === 'user' && (
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px]">
                          {notification.type === 'user' && notification.description.includes('Wilson') ? 'JW' : 'EW'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <span className="capitalize">{notification.type}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => notification.read ? {} : markAsRead(notification.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Mark as read</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
