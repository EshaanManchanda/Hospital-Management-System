import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
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
import { cn } from "@/lib/utils";

const DoctorDetailsDialog = ({ open, onOpenChange, doctor, onEdit, onDelete }) => {
  if (!doctor) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Doctor Profile</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4">
                <img 
                  src={doctor.user?.profileImage || doctor.user?.picture || "/assets/default-doctor.jpg"} 
                  alt={doctor.user?.name || "Doctor"} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/default-doctor.jpg";
                  }}
                />
              </div>
              
              <h3 className="text-xl font-semibold text-center">{doctor.user?.name || "Unknown Doctor"}</h3>
              <p className="text-primary mb-4">{doctor.specialization}</p>
              
              <div className="w-full space-y-2">
                <Badge 
                  className={cn(
                    "w-full flex justify-center py-1",
                    doctor.isAvailable 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                  )}
                >
                  {doctor.isAvailable ? "Available" : "Not Available"}
                </Badge>
                
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{doctor.experience} years experience</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{doctor.patients?.length || 0} patients</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{doctor.user?.email || "No email provided"}</span>
                </div>
                
                {doctor.user?.mobile && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{doctor.user.mobile}</span>
                  </div>
                )}
                
                {doctor.user?.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">
                      {typeof doctor.user.address === 'string' 
                        ? doctor.user.address 
                        : [
                            doctor.user.address.street,
                            doctor.user.address.city,
                            doctor.user.address.state,
                            doctor.user.address.zipCode,
                            doctor.user.address.country
                          ].filter(Boolean).join(', ')
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Information Tabs */}
            <div className="md:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  {doctor.about && (
                    <div>
                      <h4 className="font-medium mb-1">About</h4>
                      <p className="text-sm text-muted-foreground">{doctor.about}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium mb-1">Specialization</h4>
                    <p className="text-sm">{doctor.specialization}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Experience</h4>
                    <p className="text-sm">{doctor.experience} years</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Consultation Fee</h4>
                    <p className="text-sm">${doctor.fee}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Education & Qualifications</h4>
                    {doctor.qualifications && doctor.qualifications.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {doctor.qualifications.map((qual, index) => (
                          <li key={index} className="text-sm">
                            {qual.degree} - {qual.institution}, {qual.year}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No qualifications listed</p>
                    )}
                  </div>
                  
                  {doctor.certifications && doctor.certifications.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-1">Certifications</h4>
                      {renderList(doctor.certifications, "No certifications listed")}
                    </div>
                  )}
                </TabsContent>
                
                {/* Contact Tab */}
                <TabsContent value="contact" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <p className="text-sm">{doctor.user?.email || "No email provided"}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Phone</h4>
                    <p className="text-sm">{doctor.user?.mobile || "No phone provided"}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Address</h4>
                    {doctor.user?.address ? (
                      <p className="text-sm">
                        {typeof doctor.user.address === 'string' 
                          ? doctor.user.address 
                          : [
                              doctor.user.address.street,
                              doctor.user.address.city,
                              doctor.user.address.state,
                              doctor.user.address.zipCode,
                              doctor.user.address.country
                            ].filter(Boolean).join(', ')
                        }
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No address provided</p>
                    )}
                  </div>
                  
                  {doctor.user?.dateOfBirth && (
                    <div>
                      <h4 className="font-medium mb-1">Date of Birth</h4>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(doctor.user.dateOfBirth).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {doctor.user?.gender && (
                    <div>
                      <h4 className="font-medium mb-1">Gender</h4>
                      <p className="text-sm capitalize">{doctor.user.gender}</p>
                    </div>
                  )}
                </TabsContent>
                
                {/* Schedule Tab */}
                <TabsContent value="schedule" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Working Hours</h4>
                    {renderSchedule({
                      workingDays: doctor.workingDays || [],
                      workingHours: doctor.workingHours || {}
                    })}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Availability Status</h4>
                    <Badge 
                      className={cn(
                        "py-1",
                        doctor.isAvailable 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      )}
                    >
                      {doctor.isAvailable ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Current Patient Count</h4>
                    <p className="text-sm">{doctor.patients?.length || 0} patients</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onEdit}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              onClick={onDelete}
              className="flex items-center"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDetailsDialog; 