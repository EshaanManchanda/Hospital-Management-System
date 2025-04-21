import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";
import { Calendar, Clock, FileText, User, AlertCircle, Loader2 } from "lucide-react";
import { authService, doctorService, appointmentService } from "../../services";
import { toast } from "react-hot-toast";

const NewAppointmentDialog = ({ open, onOpenChange }) => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  
  // Form data
  const [appointmentData, setAppointmentData] = useState({
    doctorId: "",
    date: "",
    time: "",
    type: "consultation",
    description: "",
    symptoms: []
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setAppointmentData({
        doctorId: "",
        date: "",
        time: "",
        type: "consultation",
        description: "",
        symptoms: []
      });
      setError(null);
    }
  }, [open]);

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!open) return;
      
      try {
        setLoading(true);
        console.log("Fetching doctors...");
        const response = await doctorService.getAllDoctors(1, 50); // Get up to 50 doctors
        console.log("Doctors fetched:", response.data);
        setDoctors(response.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again later.");
        toast.error("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, [open]);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!appointmentData.doctorId || !appointmentData.date) return;
      
      try {
        setLoading(true);
        
        // In a real app, you would call the API to get available slots
        const response = await appointmentService.getAvailableTimeSlots(
          appointmentData.doctorId, 
          appointmentData.date
        );
        
        if (response && response.success) {
          setAvailableSlots(response.data || []);
        } else {
          // Fallback to dummy data if API fails
          const dummySlots = [
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
            "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
          ];
          setAvailableSlots(dummySlots);
        }
        
        // Find the selected doctor details
        const doctor = doctors.find(d => d._id === appointmentData.doctorId);
        console.log("Selected doctor:", doctor);
        setSelectedDoctor(doctor);
      } catch (err) {
        console.error("Error fetching available slots:", err);
        // Fallback to dummy data if API fails
        const dummySlots = [
          "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
          "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
          "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
        ];
        setAvailableSlots(dummySlots);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableSlots();
  }, [appointmentData.doctorId, appointmentData.date, doctors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSymptomsChange = (e) => {
    const { value } = e.target;
    const symptomsArray = value.split(',').map(symptom => symptom.trim()).filter(Boolean);
    setAppointmentData(prev => ({
      ...prev,
      symptoms: symptomsArray
    }));
  };

  const handleNextStep = () => {
    if (step === 1 && (!appointmentData.doctorId || !appointmentData.date)) {
      setError("Please select both a doctor and date");
      toast.error("Please select both a doctor and date");
      return;
    }
    
    if (step === 2 && !appointmentData.time) {
      setError("Please select a time slot");
      toast.error("Please select a time slot");
      return;
    }
    
    setError(null);
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!appointmentData.doctorId) {
        throw new Error("Please select a doctor");
      }
      
      if (!appointmentData.date) {
        throw new Error("Please select a date");
      }
      
      if (!appointmentData.time) {
        throw new Error("Please select a time");
      }
      
      // Get patientId from localStorage (or from your auth context if available)
      let patientId = "";
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        patientId = userData?.patientId || "";
      } catch {}
      
      // Create the appointment payload
      const appointmentPayload = {
        patientId, // include patientId if available
        doctorId: appointmentData.doctorId,
        date: appointmentData.date,
        time: appointmentData.time,
        type: appointmentData.type || "consultation",
        description: appointmentData.description || "Regular checkup",
        symptoms: appointmentData.symptoms
      };
      
      console.log("Submitting appointment with data:", appointmentPayload);
      
      // Send the request to create appointment
      const response = await appointmentService.createAppointment(appointmentPayload);
      
      if (response && response.success) {
        console.log("Appointment created successfully:", response);
        toast.success("Appointment booked successfully!");
        
        // Close the dialog and reset form
        onOpenChange(false);
        
        // Refresh the page to show the new appointment
        window.location.reload();
      } else {
        throw new Error(response?.message || "Failed to book appointment");
      }
    } catch (err) {
      console.error("Error creating appointment:", err);
      
      // Handle error message
      let errorMessage = err.message || "Failed to book appointment. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Schedule a visit with one of our healthcare professionals
          </DialogDescription>
        </DialogHeader>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-center text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step indicator */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`h-1 flex-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <div className={`h-1 flex-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Select Doctor & Date</span>
            <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Choose Time</span>
            <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Confirm Details</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Doctor and Date */}
          {step === 1 && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2 text-sm" htmlFor="doctorId">
                  Select Doctor
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    id="doctorId"
                    name="doctorId"
                    value={appointmentData.doctorId}
                    onChange={handleInputChange}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.user?.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2 text-sm" htmlFor="date">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={appointmentData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 2: Select Time Slot */}
          {step === 2 && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Available Time Slots
                </label>
                {loading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setAppointmentData(prev => ({ ...prev, time: slot }))}
                        className={`py-2 px-3 rounded-lg border text-sm ${
                          appointmentData.time === slot
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        } transition-colors`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2 text-sm" htmlFor="type">
                  Appointment Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={appointmentData.type}
                  onChange={handleInputChange}
                  className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="check-up">Regular Check-up</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  variant="outline"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 3: Additional Information and Confirmation */}
          {step === 3 && (
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-500 text-xs">Doctor</p>
                    <p className="font-medium text-sm">{selectedDoctor?.user?.name || "Selected Doctor"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Specialization</p>
                    <p className="font-medium text-sm">{selectedDoctor?.specialization || "Specialist"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Date</p>
                    <p className="font-medium text-sm">{new Date(appointmentData.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Time</p>
                    <p className="font-medium text-sm">{appointmentData.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Type</p>
                    <p className="font-medium text-sm">{appointmentData.type}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2 text-sm" htmlFor="description">
                  Reason for Visit
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    id="description"
                    name="description"
                    value={appointmentData.description}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your reason for this appointment"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
                  ></textarea>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2 text-sm" htmlFor="symptoms">
                  Symptoms (comma separated)
                </label>
                <input
                  type="text"
                  id="symptoms"
                  name="symptoms"
                  value={appointmentData.symptoms.join(', ')}
                  onChange={handleSymptomsChange}
                  placeholder="e.g. Fever, Headache, Cough"
                  className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  variant="outline"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Booking...
                    </>
                  ) : (
                    "Book Appointment"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAppointmentDialog;