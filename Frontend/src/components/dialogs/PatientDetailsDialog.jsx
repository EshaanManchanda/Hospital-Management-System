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
  HeartPulse, 
  Pill,
  UserCog, 
  CalendarClock, 
  CreditCard,
  Edit, 
  Trash
} from "lucide-react";
import { cn } from "@/lib/utils";

// Default image to use when no patient image is available
const DEFAULT_PATIENT_IMAGE = "/assets/default-patient.jpg";

const PatientDetailsDialog = ({ open, onOpenChange, patient, onEdit, onDelete }) => {
  if (!patient) return null;

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

  // Get patient age from date of birth
  const getPatientAge = () => {
    if (!patient.user?.dateOfBirth) return "N/A";
    
    const birthDate = new Date(patient.user.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Helper to get patient's image with fallback
  const getPatientImage = () => {
    return patient.user?.profileImage || patient.user?.picture || DEFAULT_PATIENT_IMAGE;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Patient Profile</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4">
                <img 
                  src={getPatientImage()} 
                  alt={patient.user?.name || "Patient"} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_PATIENT_IMAGE;
                  }}
                />
              </div>
              
              <h3 className="text-xl font-semibold text-center">{patient.user?.name || "Unknown Patient"}</h3>
              <p className="text-primary mb-4">Patient ID: {patient._id}</p>
              
              <div className="w-full space-y-2">
                <Badge 
                  className={cn(
                    "w-full flex justify-center py-1",
                    patient.status === "Active" 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : patient.status === "Inactive"
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  )}
                >
                  {patient.status || "Unknown Status"}
                </Badge>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Age: {getPatientAge()}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{patient.user?.gender || "Not specified"}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <HeartPulse className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{patient.bloodType || "Blood Type: Not recorded"}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{patient.user?.email || "No email provided"}</span>
                </div>
                
                {patient.user?.mobile && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{patient.user.mobile}</span>
                  </div>
                )}
                
                {patient.user?.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">
                      {typeof patient.user.address === 'string' 
                        ? patient.user.address 
                        : [
                            patient.user.address.street,
                            patient.user.address.city,
                            patient.user.address.state,
                            patient.user.address.zipCode,
                            patient.user.address.country
                          ].filter(Boolean).join(', ')
                      }
                    </span>
                  </div>
                )}
                
                {patient.emergencyContact && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">Emergency Contact</h4>
                    <div className="text-sm space-y-1">
                      <p>{patient.emergencyContact.name}</p>
                      <p>{patient.emergencyContact.relationship}</p>
                      <p>{patient.emergencyContact.phone}</p>
                    </div>
                  </div>
                )}
                
                {patient.lastVisit && (
                  <div className="flex items-center space-x-2 mt-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Information Tabs */}
            <div className="md:col-span-2">
              <Tabs defaultValue="medical">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="medical">Medical Info</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>
                
                {/* Medical Info Tab */}
                <TabsContent value="medical" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Blood Type</h4>
                    <p className="text-sm">{patient.bloodType || "Not recorded"}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Height</h4>
                    <p className="text-sm">{patient.height ? `${patient.height} cm` : "Not recorded"}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Weight</h4>
                    <p className="text-sm">{patient.weight ? `${patient.weight} kg` : "Not recorded"}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1 flex items-center">
                      <Pill className="h-4 w-4 mr-1 text-muted-foreground" />
                      Allergies
                    </h4>
                    {renderList(patient.allergies, "No allergies recorded")}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1 flex items-center">
                      <HeartPulse className="h-4 w-4 mr-1 text-muted-foreground" />
                      Chronic Conditions
                    </h4>
                    {renderList(patient.chronicConditions, "No chronic conditions recorded")}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1 flex items-center">
                      <Pill className="h-4 w-4 mr-1 text-muted-foreground" />
                      Current Medications
                    </h4>
                    {renderList(patient.medications, "No medications recorded")}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Past Surgeries</h4>
                    {renderList(patient.surgeries, "No surgeries recorded")}
                  </div>
                  
                  {patient.notes && (
                    <div>
                      <h4 className="font-medium mb-1">Medical Notes</h4>
                      <p className="text-sm text-muted-foreground">{patient.notes}</p>
                    </div>
                  )}
                </TabsContent>
                
                {/* Appointments Tab */}
                <TabsContent value="appointments" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Recent Appointments</h4>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <CalendarClock className="h-3 w-3 mr-1" />
                      Schedule New
                    </Button>
                  </div>
                  
                  {patient.appointments && Array.isArray(patient.appointments) && patient.appointments.length > 0 ? (
                    <div className="space-y-3">
                      {patient.appointments.map((appointment, index) => (
                        <div key={index} className="border rounded-md p-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{appointment.type || "Consultation"}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                              </p>
                            </div>
                            <Badge className={
                              appointment.status === "Completed" 
                                ? "bg-green-100 text-green-800" 
                                : appointment.status === "Scheduled" 
                                ? "bg-blue-100 text-blue-800"
                                : appointment.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }>
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <p>Doctor: {appointment.doctor?.name || "Not assigned"}</p>
                            {appointment.notes && <p className="text-muted-foreground">{appointment.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No appointment history found</p>
                  )}
                </TabsContent>
                
                {/* Billing Tab */}
                <TabsContent value="billing" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Billing History</h4>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <CreditCard className="h-3 w-3 mr-1" />
                      New Invoice
                    </Button>
                  </div>
                  
                  {patient.billingHistory && Array.isArray(patient.billingHistory) && patient.billingHistory.length > 0 ? (
                    <div className="space-y-3">
                      {patient.billingHistory.map((billing, index) => (
                        <div key={index} className="border rounded-md p-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Invoice #{billing.invoiceNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(billing.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${billing.amount.toFixed(2)}</p>
                              <Badge className={
                                billing.status === "Paid" 
                                  ? "bg-green-100 text-green-800" 
                                  : billing.status === "Pending" 
                                  ? "bg-amber-100 text-amber-800" 
                                  : "bg-red-100 text-red-800"
                              }>
                                {billing.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm">
                            <p>Service: {billing.serviceDescription}</p>
                            {billing.paymentMethod && (
                              <p className="text-muted-foreground">
                                Payment Method: {billing.paymentMethod}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No billing history found</p>
                  )}
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
              onClick={() => onDelete(patient)}
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

export default PatientDetailsDialog; 