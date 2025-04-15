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
  HeartPulse, 
  Pill,
  UserCog, 
  CalendarClock, 
  CreditCard,
  Edit, 
  Trash,
  UserRound,
  AlertTriangle,
  Contact,
  DollarSign,
  CalendarDays,
  SquareStack,
  Shield,
  ClipboardList,
  Activity,
  User2,
  Ruler,
  Scale,
  FileText,
  StickyNote,
  CalendarPlus,
  Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar";

// Default images to use when no patient image is available
import DEFAULT_PATIENT_Male from "@/assets/Man.jpg";
import DEFAULT_PATIENT_Female from "@/assets/Woman.jpg";
import DEFAULT_PATIENT_IMAGE from "@/assets/Man.jpg";

const PatientDetailsDialog = ({ open, onOpenChange, patient, onEdit, onDelete }) => {
  if (!patient) return null;



  // Helper function to render safe items as a list
  const renderList = (items, emptyMessage = "None") => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <p className="text-gray-500 italic">{emptyMessage}</p>;
    }
    
    return (
      <ul className="space-y-1 list-disc list-inside text-sm">
        {items.map((item, index) => (
          <li key={index}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
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
    if (patient.user?.gender === "Male") {
      return DEFAULT_PATIENT_Male;
    } else if (patient.user?.gender === "Female") {
      return DEFAULT_PATIENT_Female;
    } else {
      return DEFAULT_PATIENT_Male;
    }
  };

  // Helper to get patient status
  const getPatientStatus = () => {
    if (patient.status) return patient.status;
    return patient.isActive ? "Active" : "Inactive";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Patient Profile</DialogTitle>
          <DialogDescription>
            View detailed patient information and medical history
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(90vh-12rem)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
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
                      getPatientStatus() === "Active" 
                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                        : getPatientStatus() === "Inactive"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    )}
                  >
                    {getPatientStatus()}
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
                    <span className="text-sm">{patient.bloodGroup || "Blood Type: Not recorded"}</span>
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
                      <div className="text-sm space-y-1">
                        {typeof patient.user.address === 'string' ? (
                          <span>{patient.user.address}</span>
                        ) : (
                          <>
                            {patient.user.address.street && <div>{patient.user.address.street}</div>}
                            {(patient.user.address.city || patient.user.address.state || patient.user.address.zipCode) && (
                              <div>
                                {patient.user.address.city && `${patient.user.address.city}, `}
                                {patient.user.address.state} {patient.user.address.zipCode}
                              </div>
                            )}
                            {patient.user.address.country && <div>{patient.user.address.country}</div>}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {patient.emergencyContact && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Contact className="h-4 w-4 text-red-500" />
                        Emergency Contact
                      </h4>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <User2 className="h-4 w-4 text-gray-500" />
                          <p>{patient.emergencyContact.name || "Not specified"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserRound className="h-4 w-4 text-gray-500" />
                          <p>{patient.emergencyContact.relationship || "Not specified"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <p>{patient.emergencyContact.phone || "Not specified"}</p>
                        </div>
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
                    <TabsTrigger value="medical" className="flex items-center gap-1">
                      <HeartPulse className="h-4 w-4" />
                      <span className="hidden sm:inline">Medical Info</span>
                    </TabsTrigger>
                    <TabsTrigger value="appointments" className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span className="hidden sm:inline">Appointments</span>
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="hidden sm:inline">Billing</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Medical Info Tab */}
                  <TabsContent value="medical" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-blue-500" />
                          Height
                        </h4>
                        <p className="text-sm">{patient.height ? `${patient.height} cm` : "Not recorded"}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          <Scale className="h-4 w-4 text-blue-500" />
                          Weight
                        </h4>
                        <p className="text-sm">{patient.weight ? `${patient.weight} kg` : "Not recorded"}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Allergies
                        </h4>
                        {renderList(patient.allergies, "No allergies recorded")}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-red-500" />
                          Chronic Conditions
                        </h4>
                        {renderList(patient.chronicDiseases, "No chronic conditions recorded")}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          <Pill className="h-4 w-4 text-blue-500" />
                          Current Medications
                        </h4>
                        {renderList(patient.medications, "No medications recorded")}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-purple-500" />
                          Medical History
                        </h4>
                        {renderList(patient.medicalHistory, "No medical history recorded")}
                      </div>
                      
                      {patient.notes && (
                        <div className="space-y-2">
                          <h4 className="font-medium mb-1 flex items-center gap-2">
                            <StickyNote className="h-4 w-4 text-gray-500" />
                            Medical Notes
                          </h4>
                          <p className="text-sm whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100">
                            {patient.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Appointments Tab */}
                  <TabsContent value="appointments" className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                        Recent Appointments
                      </h4>
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        <CalendarPlus className="h-3 w-3 mr-1" />
                        Schedule New
                      </Button>
                    </div>
                    
                    {patient.appointments && Array.isArray(patient.appointments) && patient.appointments.length > 0 ? (
                      <div className="space-y-4">
                        {patient.appointments.map((appointment, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <span className="font-medium text-sm">
                                  {new Date(appointment.date).toLocaleDateString()}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {appointment.time}
                                </span>
                              </div>
                              <Badge className={cn(
                                "px-2 py-1",
                                appointment.status === "Completed" 
                                  ? "bg-green-100 text-green-800 border-green-200" 
                                  : appointment.status === "Scheduled" 
                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                    : appointment.status === "Cancelled"
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : "bg-amber-100 text-amber-800 border-amber-200"
                              )}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="pl-6 text-sm space-y-1">
                              <p className="font-medium">{appointment.type || "General Checkup"}</p>
                              {appointment.doctor && (
                                <p className="text-gray-600 flex items-center gap-2">
                                  <User2 className="h-3 w-3" />
                                  Dr. {appointment.doctor.user?.name || "Unknown"}
                                  {appointment.doctor.specialization && ` (${appointment.doctor.specialization})`}
                                </p>
                              )}
                              {appointment.description && (
                                <p className="text-gray-600 mt-2">{appointment.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="italic">No appointment history found</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Billing Tab */}
                  <TabsContent value="billing" className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-blue-500" />
                        Billing History
                      </h4>
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        <FileText className="h-3 w-3 mr-1" />
                        New Invoice
                      </Button>
                    </div>
                    
                    {patient.billingHistory && Array.isArray(patient.billingHistory) && patient.billingHistory.length > 0 ? (
                      <div className="space-y-4">
                        {patient.billingHistory.map((bill, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-blue-500" />
                                <span className="font-medium text-sm">
                                  {new Date(bill.date).toLocaleDateString()}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Invoice #{bill.invoiceNumber || index + 1}
                                </span>
                              </div>
                              <Badge className={cn(
                                "px-2 py-1",
                                bill.status === "Paid" 
                                  ? "bg-green-100 text-green-800 border-green-200" 
                                  : bill.status === "Pending" 
                                    ? "bg-amber-100 text-amber-800 border-amber-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                              )}>
                                {bill.status}
                              </Badge>
                            </div>
                            <div className="pl-6 text-sm space-y-2">
                              <p className="font-medium">{bill.description || "Medical Service"}</p>
                              <div className="space-y-1 bg-white p-3 rounded-md border border-gray-100">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Amount:</span>
                                  <span className="font-medium">${bill.amount.toFixed(2)}</span>
                                </div>
                                {bill.insurance && (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Insurance Coverage:</span>
                                      <span className="font-medium text-green-600">-${bill.insurance.coverage.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t">
                                      <span className="font-medium">Total Due:</span>
                                      <span className="font-medium">${(bill.amount - bill.insurance.coverage).toFixed(2)}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="italic">No billing history found</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                onOpenChange(false);
                onEdit(patient);
              }}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onOpenChange(false);
                onDelete(patient);
              }}
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