import React, { useState, useEffect, useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/admin/ui/dialog';
import { Button } from '@/components/admin/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/admin/ui/form';
import { Input } from '@/components/admin/ui/input';
import { Textarea } from '@/components/admin/ui/textarea';
import { ScrollArea } from '@/components/admin/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/admin/ui/select';
import { Checkbox } from "@/components/admin/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { Plus, Trash, Calendar, Clock, Loader2 } from "lucide-react";
import { toast } from "@/components/admin/ui/use-toast";

// Define form schema validation
const doctorFormSchema = z.object({
  // User information
  user: z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    mobile: z.string().min(10, { message: "Please enter a valid phone number." }).optional(),
    gender: z.enum(["male", "female", "other"], { message: "Please select a gender." }),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional()
    }).optional()
  }),
  // Doctor-specific information
  specialization: z.string().min(1, { message: "Specialization is required." }),
  experience: z.coerce.number().min(0, { message: "Experience must be a positive number." }),
  fee: z.coerce.number().min(0, { message: "Fee must be a positive number." }),
  qualifications: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.coerce.number()
    })
  ).optional(),
  workingDays: z.array(z.string()).min(1, { message: "At least one working day is required." }),
  workingHours: z.object({
    start: z.string(),
    end: z.string()
  }),
  about: z.string().min(10, { message: "Please provide a brief description of at least 10 characters." }),
  isAvailable: z.boolean().default(true)
});

const DoctorFormDialog = ({ open, onOpenChange, onClose, doctor, mode = 'add', onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [qualifications, setQualifications] = useState([]);
  const [isOpen, setIsOpen] = useState(open || false);

  // Update internal open state when prop changes
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  // Initialize form with empty values
  const form = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      user: {
        name: doctor?.name || "",
        email: doctor?.email || "",
        mobile: doctor?.mobile || "",
        gender: doctor?.gender || "male",
        address: {
          street: doctor?.address?.street || "",
          city: doctor?.address?.city || "",
          state: doctor?.address?.state || "",
          zipCode: doctor?.address?.zipCode || "",
          country: doctor?.address?.country || "",
        },
      },
      specialization: doctor?.specialization || "",
      experience: doctor?.experience || 0,
      fee: doctor?.fee || 0,
      about: doctor?.about || "",
      isAvailable: doctor?.isAvailable !== undefined ? doctor?.isAvailable : true,
      workingHours: {
        start: doctor?.workingHours?.start || "09:00",
        end: doctor?.workingHours?.end || "17:00",
      },
      workingDays: doctor?.workingDays || [],
      qualifications: doctor?.qualifications || [],
    },
  });

  // Set values from doctor data when it changes
  useEffect(() => {
    if (doctor) {
      console.log("Doctor data for edit mode:", doctor);
      
      // Extract qualifications data first for the state
      const doctorQualifications = doctor.qualifications || [];
      setQualifications(doctorQualifications);

      // Prepare form data with nested structure matching our form schema
      form.reset({
        user: {
          name: doctor.name || "",
          email: doctor.email || "",
          mobile: doctor.mobile || "",
          gender: doctor.gender || "male",
          address: {
            street: doctor.address?.street || "",
            city: doctor.address?.city || "",
            state: doctor.address?.state || "",
            zipCode: doctor.address?.zipCode || "",
            country: doctor.address?.country || "",
          },
        },
        specialization: doctor.specialization || "",
        experience: doctor.experience || 0,
        fee: doctor.fee || 0,
        about: doctor.about || "",
        isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
        workingHours: {
          start: doctor.workingHours?.start || "09:00",
          end: doctor.workingHours?.end || "17:00",
        },
        workingDays: doctor.workingDays || [],
        qualifications: doctorQualifications,
      });
    }
  }, [doctor, form]);

  // Handle add qualification
  const addQualification = () => {
    setQualifications([...qualifications, { degree: "", institution: "", year: new Date().getFullYear() }]);
  };

  // Handle remove qualification
  const removeQualification = (index) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications.splice(index, 1);
    setQualifications(updatedQualifications);
  };

  // Handle qualification change
  const handleQualificationChange = (index, field, value) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications[index][field] = value;
    setQualifications(updatedQualifications);
    form.setValue('qualifications', updatedQualifications);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("Form data before formatting:", data);
      
      // Format data according to API expectations with proper structure
      const formattedData = {
        // For edit mode, preserve the original doctor ID and other fields
        ...(mode === 'edit' && doctor ? { 
          _id: doctor._id,
          userId: doctor.userId,
          googleId: doctor.googleId,
          role: doctor.role,
          isActive: doctor.isActive,
          isVerified: doctor.isVerified
        } : {}),
        
        // Personal information (directly on the doctor object)
        name: data.user.name,
        email: data.user.email,
        mobile: data.user.mobile,
        gender: data.user.gender,
        address: data.user.address || {},
        
        // Professional information
        specialization: data.specialization || "General Physician",
        experience: parseInt(data.experience) || 0,
        fee: parseFloat(data.fee) || 0,
        about: data.about || "",
        
        // Availability 
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        
        // Schedule
        workingDays: data.workingDays || [],
        workingHours: data.workingHours || { start: "09:00", end: "17:00" },
        
        // Qualifications
        qualifications: qualifications.map(q => ({
          ...q,
          degree: q.degree || "",
          institution: q.institution || "",
          year: parseInt(q.year) || new Date().getFullYear()
        }))
      };

      // Log what we're doing
      console.log(`${mode === 'edit' ? 'Updating' : 'Creating'} doctor with formatted data:`, 
        JSON.stringify(formattedData, null, 2));
      
      if (mode === 'edit' && doctor) {
        // For edit mode, onSave expects (id, data)
        const doctorId = doctor._id;
        
        if (!doctorId) {
          throw new Error('Cannot update doctor: Missing ID');
        }
        
        console.log('Updating doctor with ID:', doctorId);
        await onSave(doctorId, formattedData);
      } else {
        // For create mode, onSave expects just (data)
        console.log('Creating new doctor');
        await onSave(formattedData);
      }
      
      // Success messages are handled by the parent component
      handleClose();
    } catch (error) {
      console.error("Error submitting doctor form:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save doctor information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Available specializations
  const specializations = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Obstetrics & Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Urology"
  ];

  // Working days options
  const workingDaysOptions = [
    { id: "Monday", label: "Monday" },
    { id: "Tuesday", label: "Tuesday" },
    { id: "Wednesday", label: "Wednesday" },
    { id: "Thursday", label: "Thursday" },
    { id: "Friday", label: "Friday" },
    { id: "Saturday", label: "Saturday" },
    { id: "Sunday", label: "Sunday" }
  ];

  // Handle closing the dialog
  const handleClose = useCallback(() => {
    // Reset the form with initial values
    form.reset({
      user: {
        name: "",
        email: "",
        mobile: "",
        gender: "male",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
      },
      specialization: "",
      experience: 0,
      fee: 0,
      about: "",
      isAvailable: true,
      workingHours: {
        start: "09:00",
        end: "17:00",
      },
      workingDays: [],
      qualifications: [],
    });
    
    // Reset the state
    setActiveTab("personal");
    setQualifications([]);
    
    // Update internal state
    setIsOpen(false);
    
    // Call the appropriate close handler
    if (typeof onClose === 'function') {
      onClose();
    } 
    
    if (typeof onOpenChange === 'function') {
      onOpenChange(false);
    }
  }, [form, onOpenChange, onClose]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        } else {
          setIsOpen(open);
          if (typeof onOpenChange === 'function') {
            onOpenChange(open);
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
        <DialogHeader className="bg-background z-10 pb-4">
          <DialogTitle>{mode === "edit" ? "Edit" : "Add"} Doctor</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the doctor's information in the system."
              : "Add a new doctor to the system. Fill out all required information."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4 sticky top-0 bg-background z-10">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                </TabsList>

                <div className="relative">
                  <ScrollArea className="h-[calc(60vh-120px)] overflow-y-auto pr-2">
                    {/* Personal Information Tab */}
                    <TabsContent value="personal" className="space-y-4 mt-0">
                      <FormField
                        control={form.control}
                        name="user.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Dr. John Doe" {...field} />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@example.com" {...field} />
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
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(123) 456-7890" {...field} />
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

                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="user.address.street"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main St" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="user.address.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Anytown" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="user.address.state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State/Province</FormLabel>
                                <FormControl>
                                  <Input placeholder="State" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="user.address.zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Zip/Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="12345" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="user.address.country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input placeholder="Country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    {/* Professional Information Tab */}
                    <TabsContent value="professional" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specialization</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select specialization" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {specializations.map((specialization) => (
                                  <SelectItem key={specialization} value={specialization}>
                                    {specialization}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience (years)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="1" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Consultation Fee ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="0.01" 
                                {...field} 
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="about"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Brief description of the doctor's background and expertise"
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isAvailable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Available for appointments</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Doctor is currently accepting new appointments
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    {/* Schedule Tab */}
                    <TabsContent value="schedule" className="space-y-4">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Working Hours</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="workingHours.start"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  Start Time
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="time"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="workingHours.end"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  End Time
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="time"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="workingDays"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Working Days
                              </FormLabel>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {workingDaysOptions.map((day) => (
                                <FormField
                                  key={day.id}
                                  control={form.control}
                                  name="workingDays"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={day.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(day.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, day.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== day.id
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                          {day.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    {/* Qualifications Tab */}
                    <TabsContent value="qualifications" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium">Education & Qualifications</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addQualification}
                            className="flex items-center gap-1"
                          >
                            <Plus className="h-4 w-4" />
                            Add Qualification
                          </Button>
                        </div>

                        {qualifications.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic py-4 text-center">
                            No qualifications added. Click "Add Qualification" to add one.
                          </p>
                        ) : (
                          qualifications.map((qual, index) => (
                            <div key={index} className="border rounded-md p-4 space-y-3 relative">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeQualification(index)}
                                className="absolute top-2 right-2 h-8 w-8 text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <FormLabel htmlFor={`degree-${index}`}>Degree</FormLabel>
                                  <Input
                                    id={`degree-${index}`}
                                    placeholder="MD, MBBS, PhD, etc."
                                    value={qual.degree}
                                    onChange={(e) => handleQualificationChange(index, 'degree', e.target.value)}
                                    className="mt-1"
                                  />
                                </div>

                                <div>
                                  <FormLabel htmlFor={`institution-${index}`}>Institution</FormLabel>
                                  <Input
                                    id={`institution-${index}`}
                                    placeholder="Harvard Medical School"
                                    value={qual.institution}
                                    onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                                    className="mt-1"
                                  />
                                </div>

                                <div>
                                  <FormLabel htmlFor={`year-${index}`}>Year</FormLabel>
                                  <Input
                                    id={`year-${index}`}
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    placeholder={new Date().getFullYear().toString()}
                                    value={qual.year}
                                    onChange={(e) => handleQualificationChange(index, 'year', parseInt(e.target.value, 10) || new Date().getFullYear())}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </div>
              </Tabs>

              <DialogFooter className="bg-background z-10 pt-4 flex flex-col sm:flex-row sm:justify-between gap-2">
                {activeTab !== "personal" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const tabValues = ["personal", "professional", "schedule", "qualifications"];
                      const currentIndex = tabValues.indexOf(activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(tabValues[currentIndex - 1]);
                      }
                    }}
                  >
                    Previous
                  </Button>
                )}

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>

                  {activeTab !== "qualifications" ? (
                    <Button
                      type="button"
                      onClick={() => {
                        const tabValues = ["personal", "professional", "schedule", "qualifications"];
                        const currentIndex = tabValues.indexOf(activeTab);
                        if (currentIndex < tabValues.length - 1) {
                          setActiveTab(tabValues[currentIndex + 1]);
                        }
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : mode === "edit" ? (
                        "Update Doctor"
                      ) : (
                        "Add Doctor"
                      )}
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DoctorFormDialog; 