
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  time: string;
  status: "scheduled" | "in-progress" | "completed" | "canceled";
  type: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
}

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
};

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
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
                    {appointment.patientName
                      .split(' ')
                      .map(name => name[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{appointment.patientName}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>{appointment.time}</span>
                    <span className="text-gray-300">•</span>
                    <span>{appointment.type}</span>
                  </div>
                </div>
              </div>
              
              <Badge className={cn("font-normal", statusConfig[appointment.status].class)}>
                {statusConfig[appointment.status].label}
              </Badge>
            </div>
          ))}
          
          {appointments.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No appointments scheduled for today
            </div>
          )}
          
          {appointments.length > 0 && (
            <button className="w-full text-hospital-primary text-sm font-medium hover:text-hospital-accent mt-2">
              View all appointments
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentList;
