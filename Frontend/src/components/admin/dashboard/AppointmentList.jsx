import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const statusConfig = {
  "scheduled": { 
    label: "Scheduled", 
    class: "bg-blue-100 text-blue-800 hover:bg-blue-100" 
  },
  "in-progress": { 
    label: "In Progress", 
    class: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" 
  },
  "completed": { 
    label: "Completed", 
    class: "bg-green-100 text-green-800 hover:bg-green-100" 
  },
  "canceled": { 
    label: "Canceled", 
    class: "bg-red-100 text-red-800 hover:bg-red-100" 
  },
  "pending": { 
    label: "Pending", 
    class: "bg-purple-100 text-purple-800 hover:bg-purple-100" 
  },
  "confirmed": { 
    label: "Confirmed", 
    class: "bg-teal-100 text-teal-800 hover:bg-teal-100" 
  },
  "default": { 
    label: "Unknown", 
    class: "bg-gray-100 text-gray-800 hover:bg-gray-100" 
  }
};

const AppointmentList = ({ appointments }) => {
  // Get status config or default if status is not found
  const getStatusConfig = (status) => {
    if (!status) return statusConfig.default;
    
    const normalizedStatus = status.toLowerCase();
    return statusConfig[normalizedStatus] || statusConfig.default;
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Today's Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  {appointment.patientAvatar && (
                    <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                  )}
                  <AvatarFallback className="bg-hospital-secondary text-hospital-primary">
                    {getInitials(appointment.patientName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{appointment.patientName}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>{appointment.time}</span>
                    <span className="text-gray-300">•</span>
                    <span>{appointment.type || "Check-up"}</span>
                  </div>
                  {appointment.doctorName && (
                    <div className="text-xs text-gray-600 mt-1">
                      <span>Dr. {appointment.doctorName}</span>
                      {appointment.specialty && (
                        <span className="text-gray-500"> • {appointment.specialty}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <Badge className={cn("font-normal", getStatusConfig(appointment.status).class)}>
                {getStatusConfig(appointment.status).label}
              </Badge>
            </div>
          ))}
          
          {appointments.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No appointments scheduled for today
            </div>
          )}
          
          {appointments.length > 0 && (
            <Link 
              to="/admin-dashboard/appointments" 
              className="block w-full text-center text-hospital-primary text-sm font-medium hover:text-hospital-accent mt-2 py-2"
            >
              View all appointments
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentList;
