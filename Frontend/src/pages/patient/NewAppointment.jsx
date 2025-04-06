import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, FileText, User, AlertCircle } from "lucide-react";
import { authService, doctorService, appointmentService } from "../../services";

const NewAppointment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
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

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        console.log("Fetching doctors...");
        const response = await doctorService.getAllDoctors(1, 50); // Get up to 50 doctors
        console.log("Doctors fetched:", response.data);
        setDoctors(response.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!appointmentData.doctorId || !appointmentData.date) return;
      
      try {
        setLoading(true);
        // This is a placeholder - in a real app, you would call an API endpoint
        // that returns available time slots for the selected doctor on the selected date
        // const response = await appointmentService.getAvailableSlots(appointmentData.doctorId, appointmentData.date);
        
        // For now, we'll use dummy data
        const dummySlots = [
          "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
          "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
          "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
        ];
        
        setAvailableSlots(dummySlots);
        
        // Find the selected doctor details
        const doctor = doctors.find(d => d._id === appointmentData.doctorId);
        console.log("Selected doctor:", doctor);
        setSelectedDoctor(doctor);
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setError("Failed to load available time slots. Please try again later.");
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
    
    if (name === "doctorId") {
      console.log("Doctor ID selected:", value);
    }
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
      return;
    }
    
    if (step === 2 && !appointmentData.time) {
      setError("Please select a time slot");
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
    setDebugInfo(null);
    
    try {
      const userData = authService.getUserData();
      
      if (!userData || !userData.patientId) {
        throw new Error("Patient information not found");
      }
      
      // Debug logging
      const appointmentPayload = {
        doctorId: appointmentData.doctorId,
        patientId: userData.patientId,
        date: appointmentData.date,
        time: appointmentData.time,
        type: appointmentData.type,
        description: appointmentData.description || "Regular checkup",
        symptoms: appointmentData.symptoms
      };
      
      console.log("Submitting appointment with data:", appointmentPayload);
      setDebugInfo(JSON.stringify(appointmentPayload, null, 2));
      
      // Validate doctor ID
      if (!appointmentData.doctorId || appointmentData.doctorId.trim() === "") {
        throw new Error("Doctor ID is required");
      }
      
      // Additional validation
      if (!appointmentData.date) {
        throw new Error("Appointment date is required");
      }
      
      if (!appointmentData.time) {
        throw new Error("Appointment time is required");
      }
      
      // Create the appointment
      const response = await appointmentService.createAppointment(appointmentPayload);
      
      console.log("Appointment created successfully:", response);
      
      // Redirect to appointments page
      const formattedDate = new Date(appointmentData.date).toLocaleDateString();
      const formattedTime = appointmentData.time;
      navigate("/patient-dashboard", {
        state: { 
          appointmentCreated: true,
          appointmentDetails: {
            doctor: selectedDoctor.name,
            date: formattedDate,
            time: formattedTime
          }
        }
      });
    } catch (err) {
      console.error("Error creating appointment:", err);
      // More detailed error handling based on the error response
      let errorMessage = "Failed to book appointment. Please try again.";
      
      if (err.response) {
        console.log("Error response:", err.response.data);
        
        // Check for specific error messages
        if (err.response.data.message === "Doctor not found") {
          errorMessage = "The selected doctor could not be found. Please select another doctor.";
          
          // Add doctor ID to debug info
          setDebugInfo(prev => {
            const debug = prev ? JSON.parse(prev) : {};
            return JSON.stringify({
              ...debug,
              error: "Doctor not found",
              doctorIdUsed: appointmentData.doctorId,
              availableDoctors: doctors.map(d => ({ id: d._id, name: d.user?.name }))
            }, null, 2);
          });
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && doctors.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Book an Appointment</h1>
        <p className="text-gray-600 mt-1">Schedule a visit with one of our healthcare professionals</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Debug info */}
      {debugInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <details>
            <summary className="font-medium text-gray-700 cursor-pointer">Debug Information</summary>
            <pre className="mt-2 text-xs overflow-auto">{debugInfo}</pre>
          </details>
        </div>
      )}

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between w-full mb-4">
          <div className={`flex-1 h-2 ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-2 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        </div>
        <div className="flex justify-between">
          <div className="text-sm font-medium text-gray-500">Select Doctor & Date</div>
          <div className="text-sm font-medium text-gray-500">Choose Time</div>
          <div className="text-sm font-medium text-gray-500">Appointment Details</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Doctor & Date */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Select a Doctor & Date</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                <select
                  name="doctorId"
                  value={appointmentData.doctorId}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                >
                  <option value="">Select a Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.user?.name || "Unknown Doctor"} - {doctor.specialization || "General"}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={appointmentData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              {/* Doctor details if selected */}
              {selectedDoctor && (
                <div className="p-4 border rounded-md bg-blue-50 mb-6">
                  <h3 className="font-medium text-blue-800 mb-2">Selected Doctor Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedDoctor.user?.name || "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">Specialization:</span> {selectedDoctor.specialization || "General"}
                    </div>
                    <div>
                      <span className="font-medium">Experience:</span> {selectedDoctor.experience || "N/A"} years
                    </div>
                    <div>
                      <span className="font-medium">Doctor ID:</span> {selectedDoctor._id}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Note:</span> This doctor is available for appointments.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Choose Time Slot */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Choose a Time Slot</h2>
              
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <p className="text-sm font-medium text-gray-700">
                    Available time slots for {new Date(appointmentData.date).toLocaleDateString()} with {selectedDoctor?.user?.name}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setAppointmentData(prev => ({ ...prev, time: slot }))}
                      className={`py-2 px-4 rounded-md text-center ${
                        appointmentData.time === slot
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Appointment Details */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Appointment Details</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
                <select
                  name="type"
                  value={appointmentData.type}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="consultation">Consultation</option>
                  <option value="followUp">Follow-up</option>
                  <option value="emergency">Emergency</option>
                  <option value="preventive">Preventive Check-up</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={appointmentData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the reason for your visit"
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-24"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms (comma-separated)</label>
                <div className="relative">
                  <textarea
                    value={appointmentData.symptoms.join(', ')}
                    onChange={handleSymptomsChange}
                    placeholder="Fever, headache, etc."
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-16"
                  ></textarea>
                  <FileText className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg mb-6">
                <h3 className="font-medium text-blue-800 mb-2">Appointment Summary</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li><span className="font-medium">Doctor:</span> {selectedDoctor?.user?.name} ({selectedDoctor?.specialization})</li>
                  <li><span className="font-medium">Date:</span> {new Date(appointmentData.date).toLocaleDateString()}</li>
                  <li><span className="font-medium">Time:</span> {appointmentData.time}</li>
                  <li><span className="font-medium">Type:</span> {appointmentData.type}</li>
                  <li><span className="font-medium">Fee:</span> ₹{selectedDoctor?.fee}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className={`flex ${step === 1 ? 'justify-end' : 'justify-between'} mt-8`}>
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-gray-100 py-2 px-6 rounded-md text-gray-800 font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              >
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-primary py-2 px-6 rounded-md text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary py-2 px-6 rounded-md text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointment; 