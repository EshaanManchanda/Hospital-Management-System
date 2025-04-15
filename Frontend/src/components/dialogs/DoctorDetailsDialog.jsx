import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";
import { ScrollArea } from "@/components/admin/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { Badge } from "@/components/admin/ui/badge";
import { 
  Calendar, 
  Mail, 
  Phone, 
  MapPin,
  Briefcase, 
  Clock, 
  Users, 
  Award, 
  Edit, 
  Trash
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/admin/ui/avatar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/admin/ui/separator";

const DoctorDetailsDialog = ({ open, onOpenChange, onClose, doctor, onEdit, onDelete }) => {
  if (!doctor) return null;

  // Add debugging log to see the doctor data structure
  console.log("Doctor data in details dialog:", doctor);

  // Helper function to render safe items as a list
  const renderList = (items, emptyMessage) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <p className="text-sm text-muted-foreground italic">{emptyMessage}</p>;
    }
    
    return (
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  // Helper function to render schedule
  const renderSchedule = (schedule) => {
    if (!schedule || !Array.isArray(schedule.workingDays) || schedule.workingDays.length === 0) {
      return <p className="text-sm text-muted-foreground italic">No schedule information</p>;
    }
    
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {schedule.workingHours?.start || "??:??"} - {schedule.workingHours?.end || "??:??"}
          </span>
        </div>
        <div>
          <span className="text-sm font-medium">Working Days:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {schedule.workingDays.map((day, index) => (
              <Badge key={index} variant="outline">
                {day}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen && typeof onClose === "function") {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Dr. {doctor?.name || "Unknown Doctor"}
          </DialogTitle>
          <DialogDescription>
            {doctor?.specialization || "General Physician"} 
            {doctor?.experience > 0 && ` • ${doctor.experience} years of experience`}
          </DialogDescription>
        </DialogHeader>
        
        {/* Doctor Details Content */}
        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4">
                {doctor?.profileImage ? (
                  <AvatarImage src={doctor.profileImage} alt={doctor?.name} />
                ) : doctor?.picture ? (
                  <AvatarImage src={doctor.picture} alt={doctor?.name} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                    {doctor?.name?.split(' ').map(n => n[0]).join('') || 'DR'}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <Badge className="mb-2" variant={doctor?.isAvailable ? "default" : "secondary"}>
                {doctor?.isAvailable ? "Available" : "Not Available"}
              </Badge>
              
              <div className="text-center mt-2">
                <p className="text-sm flex items-center justify-center gap-2 mb-1">
                  <Mail className="h-4 w-4" />
                  {doctor?.email || "No email provided"}
                </p>
                <p className="text-sm flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  {doctor?.mobile || "No phone provided"}
                </p>
              </div>
            </div>
            
            <div className="md:w-2/3 space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">About</h3>
                <p className="text-muted-foreground">
                  {doctor?.about || "No information provided."}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-sm font-medium">Email</h4>
                    <p className="text-muted-foreground">{doctor?.email || "Not provided"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Phone</h4>
                    <p className="text-muted-foreground">{doctor?.mobile || "Not provided"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Gender</h4>
                    <p className="text-muted-foreground capitalize">{doctor?.gender || "Not specified"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Consultation Fee</h4>
                    <p className="text-muted-foreground">${doctor?.fee || "0"}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Address</h3>
                <p className="text-muted-foreground">
                  {doctor?.address?.street ? (
                    <>
                      {doctor.address.street}, {doctor.address.city}, {doctor.address.state}, {doctor.address.zipCode}, {doctor.address.country}
                    </>
                  ) : (
                    "No address provided"
                  )}
                </p>
              </div>
            </div>
          </div>
          
          {/* Professional Information */}
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Professional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Working Hours</h4>
                <p className="text-muted-foreground">
                  {doctor?.workingHours?.start && doctor?.workingHours?.end ? (
                    `${doctor.workingHours.start} - ${doctor.workingHours.end}`
                  ) : (
                    "Not specified"
                  )}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Working Days</h4>
                <div className="flex flex-wrap gap-1">
                  {doctor?.workingDays && doctor.workingDays.length > 0 ? (
                    doctor.workingDays.map(day => (
                      <Badge key={day} variant="outline">{day}</Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Not specified</p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Qualifications</h4>
              {doctor?.qualifications && doctor.qualifications.length > 0 ? (
                <div className="space-y-2">
                  {doctor.qualifications.map((qual, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <p className="font-medium">{qual.degree}</p>
                      <p className="text-sm text-muted-foreground">{qual.institution}, {qual.year}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No qualifications listed</p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={onEdit}>Edit Doctor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDetailsDialog; 