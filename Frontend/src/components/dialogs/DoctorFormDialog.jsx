import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
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
import { Plus, Trash, Calendar, Clock } from "lucide-react";

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

const DoctorFormDialog = ({ open, onOpenChange, doctor, mode = 'add', onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [qualifications, setQualifications] = useState([]);

  // Initialize form with default values or existing doctor data
  const form = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
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
          country: ""
        }
      },
      specialization: "",
      experience: 0,
      fee: 0,
      qualifications: [],
      workingDays: [],
      workingHours: {
        start: "09:00",
        end: "17:00"
      },
      about: "",
      isAvailable: true
    }
  });

  // Update form when doctor data changes
  useEffect(() => {
    if (doctor && mode === 'edit') {
      const formattedDoctor = {
        user: {
          name: doctor.user?.name || "",
          email: doctor.user?.email || "",
          mobile: doctor.user?.mobile || "",
          gender: doctor.user?.gender || "male",
          address: {
            street: doctor.user?.address?.street || "",
            city: doctor.user?.address?.city || "",
            state: doctor.user?.address?.state || "",
            zipCode: doctor.user?.address?.zipCode || "",
            country: doctor.user?.address?.country || ""
          }
        },
        specialization: doctor.specialization || "",
        experience: doctor.experience || 0,
        fee: doctor.fee || 0,
        qualifications: doctor.qualifications || [],
        workingDays: doctor.workingDays || [],
        workingHours: {
          start: doctor.workingHours?.start || "09:00",
          end: doctor.workingHours?.end || "17:00"
        },
        about: doctor.about || "",
        isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true
      };

      // Reset form with doctor data
      form.reset(formattedDoctor);
      setQualifications(formattedDoctor.qualifications || []);
    }
  }, [doctor, mode, form]);

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
      // Make sure qualifications are included
      data.qualifications = qualifications;
      
      // Call the save function passed from parent
      await onSave(data);
      
      // Close dialog on success
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving doctor:", error);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                </TabsList>

                <ScrollArea className="max-h-[60vh]">
                  {/* Personal Information Tab */}
                  <TabsContent value="personal" className="space-y-4">
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
              </Tabs>

              <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                
                <div className="flex gap-2">
                  {activeTab !== "personal" && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        const tabs = ["personal", "professional", "schedule", "qualifications"];
                        const currentIndex = tabs.indexOf(activeTab);
                        if (currentIndex > 0) {
                          setActiveTab(tabs[currentIndex - 1]);
                        }
                      }}
                    >
                      Previous
                    </Button>
                  )}
                  
                  {activeTab !== "qualifications" ? (
                    <Button
                      type="button"
                      onClick={() => {
                        const tabs = ["personal", "professional", "schedule", "qualifications"];
                        const currentIndex = tabs.indexOf(activeTab);
                        if (currentIndex < tabs.length - 1) {
                          setActiveTab(tabs[currentIndex + 1]);
                        }
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit">
                      {mode === 'edit' ? 'Update Doctor' : 'Add Doctor'}
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