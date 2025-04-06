
import React from "react";
import { Button } from "@/components/admin/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { Separator } from "@/components/admin/ui/separator";
import { Badge } from "@/components/admin/ui/badge";
import { Calendar, Clock, User, UserPlus, MapPin, Activity } from "lucide-react";

const AppointmentDetails = ({ appointment, isOpen, onClose }) => {
  if (!appointment) return null;

  // Function to get badge color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 hover:bg-green-600";
      case "Scheduled":
        return "bg-blue-500 hover:bg-blue-600";
      case "Canceled":
        return "bg-red-500 hover:bg-red-600";
      case "Pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Appointment Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{appointment.patientName}</h3>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-[20px_1fr] items-start gap-4">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-sm text-muted-foreground">{appointment.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-[20px_1fr] items-start gap-4">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Time</p>
              <p className="text-sm text-muted-foreground">{appointment.time}</p>
            </div>
          </div>

          <div className="grid grid-cols-[20px_1fr] items-start gap-4">
            <UserPlus className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Doctor</p>
              <p className="text-sm text-muted-foreground">{appointment.doctorName}</p>
            </div>
          </div>

          <div className="grid grid-cols-[20px_1fr] items-start gap-4">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-muted-foreground">
                {appointment.location || "Main Hospital, Room 102"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[20px_1fr] items-start gap-4">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Appointment Type</p>
              <p className="text-sm text-muted-foreground">{appointment.type}</p>
            </div>
          </div>

          {appointment.notes && (
            <div className="pt-2">
              <p className="font-medium">Notes</p>
              <p className="text-sm text-muted-foreground">{appointment.notes}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetails;
