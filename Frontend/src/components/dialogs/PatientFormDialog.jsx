import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/admin/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/admin/ui/form";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { Textarea } from "@/components/admin/ui/textarea";
import { ScrollArea } from "@/components/admin/ui/scroll-area";
import { Switch } from "@/components/admin/ui/switch";
import { Loader2, Plus, X } from "lucide-react";

// Form validation schema
const patientSchema = z.object({
  // User information
  user: z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    mobile: z.string().min(10, { message: "Please enter a valid phone number." }).optional(),
    gender: z.string().min(1, { message: "Please select a gender." }),
    dateOfBirth: z.string().min(1, { message: "Please enter date of birth." }),
    address: z.string().optional(),
  }),
  // Patient specific information
  bloodType: z.string().min(1, { message: "Please select a blood type." }).optional(),
  height: z.coerce.number().min(1).optional(),
  weight: z.coerce.number().min(1).optional(),
  emergencyContact: z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }).optional(),
    relationship: z.string().min(2, { message: "Relationship must be at least 2 characters." }).optional(),
    phone: z.string().min(10, { message: "Please enter a valid phone number." }).optional(),
  }).optional(),
  // Other patient fields
  notes: z.string().optional(),
  status: z.string().min(1, { message: "Please select a status." }),
});

const PatientFormDialog = ({ open, onOpenChange, patient, mode = "add", onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  // Arrays for form fields
  const [allergies, setAllergies] = useState([]);
  const [chronicConditions, setChronicConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  
  // New item inputs
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newSurgery, setNewSurgery] = useState("");

  // Create form
  const form = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      user: {
        name: "",
        email: "",
        mobile: "",
        gender: "",
        dateOfBirth: "",
        address: "",
      },
      bloodType: "",
      height: "",
      weight: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      notes: "",
      status: "Active",
    },
  });

  // Populate form with patient data when editing
  useEffect(() => {
    if (patient && mode === "edit") {
      // Reset form with patient data
      form.reset({
        user: {
          name: patient.user?.name || "",
          email: patient.user?.email || "",
          mobile: patient.user?.mobile || "",
          gender: patient.user?.gender || "",
          dateOfBirth: patient.user?.dateOfBirth ? new Date(patient.user.dateOfBirth).toISOString().split('T')[0] : "",
          address: typeof patient.user?.address === 'string' 
            ? patient.user.address 
            : patient.user?.address 
              ? [
                  patient.user.address.street,
                  patient.user.address.city,
                  patient.user.address.state,
                  patient.user.address.zipCode,
                  patient.user.address.country
                ].filter(Boolean).join(', ')
              : "",
        },
        bloodType: patient.bloodType || "",
        height: patient.height || "",
        weight: patient.weight || "",
        emergencyContact: patient.emergencyContact 
          ? {
              name: patient.emergencyContact.name || "",
              relationship: patient.emergencyContact.relationship || "",
              phone: patient.emergencyContact.phone || "",
            }
          : {
              name: "",
              relationship: "",
              phone: "",
            },
        notes: patient.notes || "",
        status: patient.status || "Active",
      });
      
      // Set array fields
      setAllergies(Array.isArray(patient.allergies) ? [...patient.allergies] : []);
      setChronicConditions(Array.isArray(patient.chronicConditions) ? [...patient.chronicConditions] : []);
      setMedications(Array.isArray(patient.medications) ? [...patient.medications] : []);
      setSurgeries(Array.isArray(patient.surgeries) ? [...patient.surgeries] : []);
    }
  }, [patient, mode, form]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Add array fields to form data
      const patientData = {
        ...data,
        allergies,
        chronicConditions,
        medications,
        surgeries
      };
      
      // Call parent save handler
      await onSave(patientData);
      
      // Reset form
      form.reset();
      setAllergies([]);
      setChronicConditions([]);
      setMedications([]);
      setSurgeries([]);
      setActiveTab("personal");
      
    } catch (error) {
      console.error("Error saving patient:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding new items to array fields
  const addAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setChronicConditions([...chronicConditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setMedications([...medications, newMedication.trim()]);
      setNewMedication("");
    }
  };

  const addSurgery = () => {
    if (newSurgery.trim()) {
      setSurgeries([...surgeries, newSurgery.trim()]);
      setNewSurgery("");
    }
  };

  // Handle removing items from array fields
  const removeAllergy = (index) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const removeCondition = (index) => {
    setChronicConditions(chronicConditions.filter((_, i) => i !== index));
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const removeSurgery = (index) => {
    setSurgeries(surgeries.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Patient" : "Add New Patient"}</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Edit the details of the patient" : "Add a new patient to the system"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 pr-4">
                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-4 min-h-[50vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="user.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="user.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john.doe@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="user.mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="user.dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="user.gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="user.address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="123 Main St, City, State 12345" 
                              {...field} 
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                {/* Medical Information Tab */}
                <TabsContent value="medical" className="space-y-4 min-h-[50vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <FormLabel className="block mb-2">Allergies</FormLabel>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input 
                            placeholder="Add allergy"
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                          />
                          <Button type="button" size="icon" onClick={addAllergy}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {allergies.map((allergy, index) => (
                            <div key={index} className="flex items-center bg-slate-100 rounded-md px-3 py-1 text-sm">
                              <span>{allergy}</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 ml-1 p-0"
                                onClick={() => removeAllergy(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <FormLabel className="block mb-2">Chronic Conditions</FormLabel>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input 
                            placeholder="Add chronic condition"
                            value={newCondition}
                            onChange={(e) => setNewCondition(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                          />
                          <Button type="button" size="icon" onClick={addCondition}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {chronicConditions.map((condition, index) => (
                            <div key={index} className="flex items-center bg-slate-100 rounded-md px-3 py-1 text-sm">
                              <span>{condition}</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 ml-1 p-0"
                                onClick={() => removeCondition(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <FormLabel className="block mb-2">Current Medications</FormLabel>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input 
                            placeholder="Add medication"
                            value={newMedication}
                            onChange={(e) => setNewMedication(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
                          />
                          <Button type="button" size="icon" onClick={addMedication}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {medications.map((medication, index) => (
                            <div key={index} className="flex items-center bg-slate-100 rounded-md px-3 py-1 text-sm">
                              <span>{medication}</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 ml-1 p-0"
                                onClick={() => removeMedication(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <FormLabel className="block mb-2">Past Surgeries</FormLabel>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input 
                            placeholder="Add surgery"
                            value={newSurgery}
                            onChange={(e) => setNewSurgery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSurgery())}
                          />
                          <Button type="button" size="icon" onClick={addSurgery}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {surgeries.map((surgery, index) => (
                            <div key={index} className="flex items-center bg-slate-100 rounded-md px-3 py-1 text-sm">
                              <span>{surgery}</span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 ml-1 p-0"
                                onClick={() => removeSurgery(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Medical Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add any additional medical notes here" 
                              {...field} 
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                {/* Emergency Contact Tab */}
                <TabsContent value="emergency" className="space-y-4 min-h-[50vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="emergencyContact.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Emergency contact name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="emergencyContact.relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <FormControl>
                            <Input placeholder="Spouse, Parent, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="emergencyContact.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                {/* Status Tab */}
                <TabsContent value="status" className="space-y-4 min-h-[50vh]">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                              <SelectItem value="Deceased">Deceased</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "edit" ? "Update Patient" : "Add Patient"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientFormDialog; 