
import React, { useState, useEffect } from "react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { DialogHeader, DialogFooter, DialogTitle } from "@/components/admin/ui/dialog";
import { Calendar, Clock, UserPlus, Search, Loader2 } from "lucide-react";
import { getPatientService, doctorService } from "@/services";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/admin/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/admin/ui/popover";
import { cn } from "@/lib/utils";

const NewAppointment = ({ onAdd, onCancel }) => {
  // Update initial state
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorName: "",
    date: "",
    time: "",
    type: "consultation",
    status: "scheduled",
    description: "",
    symptoms: "", // Add symptoms field
    notes: "",
  });
  
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [openPatientPopover, setOpenPatientPopover] = useState(false);
  const [openDoctorPopover, setOpenDoctorPopover] = useState(false);

  // Fetch patients and doctors on component mount
  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const [patientService, setPatientService] = useState(null);

  // Add effect to load patientService
  useEffect(() => {
    const loadServices = async () => {
      const service = getPatientService();
      setPatientService(service);
    };
    loadServices();
  }, []);

  const fetchPatients = async () => {
    try {
      setIsLoadingPatients(true);
      if (!patientService) {
        console.warn('Patient service not yet loaded');
        return;
      }
      const response = await patientService.getAllPatients({ limit: 100 });
      if (response.success) {
        setPatients(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  // Update the useEffect that calls fetchPatients to depend on patientService
  useEffect(() => {
    if (patientService) {
      fetchPatients();
    }
  }, [patientService]);

  const fetchDoctors = async () => {
    try {
      setIsLoadingDoctors(true);
      const response = await doctorService.getAllDoctors(1, 100);
      if (response.success) {
        setDoctors(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.patientId || !formData.doctorId || !formData.description) {
        alert("Please fill in all required fields");
        return;
    }
    
    // Prepare appointment data for API
    const appointmentData = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        description: formData.description,
        symptoms: formData.symptoms || "", // Ensure symptoms is always a string
        status: formData.status
    };
    
    onAdd(appointmentData);
  };

  const handlePatientSelect = (patient) => {
    setFormData(prevData => ({
      ...prevData,
      patientId: patient._id,
      patientName: patient.name || patient.user?.name
    }));
    setOpenPatientPopover(false);
  };

  const handleDoctorSelect = (doctor) => {
    setFormData(prevData => ({
      ...prevData,
      doctorId: doctor._id,
      doctorName: doctor.user?.name || doctor.name
    }));
    setOpenDoctorPopover(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>New Appointment</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="patientName" className="text-right">
            Patient Name
          </Label>
          <div className="col-span-3">
            <Popover open={openPatientPopover} onOpenChange={setOpenPatientPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPatientPopover}
                  className="w-full justify-between"
                >
                  {formData.patientName || "Select patient..."}
                  {isLoadingPatients ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search patients..." className="h-9" />
                  <CommandEmpty>No patient found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {patients.map((patient) => (
                      <CommandItem
                        key={patient._id}
                        value={patient.name || patient.user?.name}
                        onSelect={() => handlePatientSelect(patient)}
                      >
                        {patient.name || patient.user?.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="doctorName" className="text-right">
            <UserPlus className="h-4 w-4 inline mr-2" />
            Doctor
          </Label>
          <div className="col-span-3">
            <Popover open={openDoctorPopover} onOpenChange={setOpenDoctorPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openDoctorPopover}
                  className="w-full justify-between"
                >
                  {formData.doctorName || "Select doctor..."}
                  {isLoadingDoctors ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search doctors..." className="h-9" />
                  <CommandEmpty>No doctor found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {doctors.map((doctor) => (
                      <CommandItem
                        key={doctor._id}
                        value={doctor.user?.name || doctor.name}
                        onSelect={() => handleDoctorSelect(doctor)}
                      >
                        {doctor.user?.name || doctor.name}
                        {doctor.specialization && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({doctor.specialization})
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">
            <Calendar className="h-4 w-4 inline mr-2" />
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="time" className="text-right">
            <Clock className="h-4 w-4 inline mr-2" />
            Time
          </Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => {
              // Store the 24-hour format for the input
              handleChange('time', e.target.value);
            }}
            className="col-span-3"
            required
          />
        </div>
        
        {/* Type selection */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <Select
            value={formData.type} 
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger id="type" className="col-span-3">
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="check-up">Check-up</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="surgery">Surgery</SelectItem>
                <SelectItem value="x-ray">X-Ray</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Description field - moved outside of type selection div */}
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
                Description
            </Label>
            <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="col-span-3"
                placeholder="Description of the appointment"
                required
            />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="notes" className="text-right">
            Notes
          </Label>
          <Input
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="col-span-3"
            placeholder="Optional notes about this appointment"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Appointment</Button>
      </DialogFooter>
    </form>
  );
};

export default NewAppointment;
