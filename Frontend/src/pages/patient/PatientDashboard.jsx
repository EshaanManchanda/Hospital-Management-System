import React, { useState, useEffect } from "react";
import { CalendarCheck, Clock, Activity, Plus, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService, appointmentService, getPatientService } from "../../services";
import { toast } from "react-hot-toast";

// Define patientService at module level
let patientService;

const PatientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  
  // Load patientService
  useEffect(() => {
    const loadPatientService = async () => {
      try {
        // Try first to get it from the getter
        patientService = getPatientService();
        
        // If not available, import directly
        if (!patientService) {
          const module = await import('../../services/patientService');
          patientService = module.default;
        }
      } catch (error) {
        console.error("Error loading patientService:", error);
        setError("Failed to load required services. Please refresh the page.");
      }
    };
    
    loadPatientService();
  }, []);

  useEffect(() => {
    // Check for success message from appointment creation
    if (location.state?.appointmentCreated) {
      const details = location.state.appointmentDetails;
      toast.success(details ? 
        `Appointment booked with ${details.doctor} on ${new Date(details.date).toLocaleDateString()} at ${details.time}` 
        : "Your appointment has been scheduled."
      );
      // Clear location state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No authentication token found in localStorage");
          throw new Error("Authentication token not found. Please login again.");
        }
        
        // Get user data from localStorage
        const userData = authService.getUserData();
        console.log("Retrieved user data from localStorage:", userData);
        
        if (!userData) {
          throw new Error("User information not found");
        }
        
        if (!userData.patientId) {
          console.error("Patient ID is missing from user data:", userData);
          throw new Error("Patient information not found. Missing patient ID.");
        }
        
        // Initialize dashboard data object
        let dashboardInfo = {};
        
        // Make sure patientService is loaded
        if (!patientService) {
          patientService = getPatientService();
          if (!patientService) {
            const module = await import('../../services/patientService');
            patientService = module.default;
          }
        }
        
        try {
          // Get patient profile
          const patientResponse = await patientService.getPatientById(userData.patientId);
          console.log("Patient data response:", patientResponse);
          dashboardInfo.patient = patientResponse.patient;
        } catch (patientError) {
          console.error("Error fetching patient profile:", patientError);
          dashboardInfo.patientError = "Could not retrieve patient profile information";
        }
        
        try {
          // Get patient appointments
          const appointmentsResponse = await appointmentService.getPatientAppointments(userData.patientId);
          console.log("Appointments response:", appointmentsResponse);
          dashboardInfo.appointments = appointmentsResponse.data;
        } catch (appointmentsError) {
          console.error("Error fetching appointments:", appointmentsError);
          dashboardInfo.appointmentsError = "Could not retrieve appointment information";
          dashboardInfo.appointments = { data: [] };
        }
        
        // Set the dashboard data with what we have
        if (Object.keys(dashboardInfo).length > 0) {
          setDashboardData(dashboardInfo);
        } else {
          throw new Error("Could not retrieve any dashboard information");
        }
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCreateAppointment = () => {
    navigate("/patient-dashboard/new-appointment");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg mt-4">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Back to Login
        </button>
      </div>
    );
  }

  // Use placeholder data if API data is not available yet
  const patient = dashboardData?.patient || {
    name: "John Doe",
    bloodGroup: "B+",
    height: 175,
    weight: 70,
    age: 35,
    gender: "Male"
  };

  const upcomingAppointments = (dashboardData?.appointments?.data || [])
    .filter(app => app.status === "scheduled" || app.status === "confirmed")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 2);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
        <p className="text-gray-600">Welcome back, {patient?.firstName || patient?.name || "Patient"}</p>
      </div>
      
      {/* Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-100 rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-medium text-gray-500">Blood Group</h3>
            <div className="p-2 bg-red-200 rounded-full">
              <Activity className="h-4 w-4 text-red-700" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-bold text-red-800">{patient.bloodGroup || "N/A"}</h2>
          </div>
        </div>
        
        <div className="bg-blue-100 rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-medium text-gray-500">Height</h3>
            <div className="p-2 bg-blue-200 rounded-full">
              <Activity className="h-4 w-4 text-blue-700" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-bold text-blue-800">{patient.height || "N/A"} <span className="text-sm font-normal">cm</span></h2>
          </div>
        </div>
        
        <div className="bg-green-100 rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-medium text-gray-500">Weight</h3>
            <div className="p-2 bg-green-200 rounded-full">
              <Activity className="h-4 w-4 text-green-700" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-bold text-green-800">{patient.weight || "N/A"} <span className="text-sm font-normal">kg</span></h2>
          </div>
        </div>
        
        <div className="bg-purple-100 rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-medium text-gray-500">Upcoming Appointments</h3>
            <div className="p-2 bg-purple-200 rounded-full">
              <CalendarCheck className="h-4 w-4 text-purple-700" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-bold text-purple-800">{upcomingAppointments.length}</h2>
          </div>
        </div>
      </div>
      
      {/* Health Information */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Health Information</h2>
          <button 
            onClick={() => navigate('/patient-dashboard/profile')}
            className="text-blue-600 text-sm font-medium hover:underline flex items-center"
          >
            View Complete Profile <Info className="ml-1 h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex items-start space-x-3">
            <div className="text-gray-500">Allergies:</div>
            <div className="font-medium">{patient.allergies?.length > 0 ? patient.allergies.join(", ") : "No known allergies"}</div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-gray-500">Chronic Conditions:</div>
            <div className="font-medium">{patient.chronicConditions?.length > 0 ? patient.chronicConditions.join(", ") : "No chronic conditions recorded"}</div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-gray-500">Age:</div>
            <div className="font-medium">{patient.age || "N/A"} years</div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-gray-500">Gender:</div>
            <div className="font-medium">{patient.gender || "N/A"}</div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/patient-dashboard/appointments')}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              View All
            </button>
            <button 
              onClick={handleCreateAppointment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> New Appointment
            </button>
          </div>
        </div>
        
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <CalendarCheck className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-gray-600 font-medium">No upcoming appointments</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">Schedule your next appointment to see a doctor</p>
            <button 
              onClick={handleCreateAppointment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map(appointment => (
              <div key={appointment._id} className="flex flex-col md:flex-row md:items-center p-4 bg-blue-50 rounded-lg gap-4">
                <div className="md:w-14 md:h-14 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                  <CalendarCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-900">
                    {appointment.doctor?.user?.firstName 
                      ? `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`
                      : appointment.doctor?.user?.name || "Doctor"}
                  </h3>
                  <p className="text-gray-600 text-sm">{appointment.type || "Appointment"}</p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock className="h-4 w-4 mr-1 text-blue-600" />
                    {appointment.time || "N/A"}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    {formatDate(appointment.date)}
                  </div>
                </div>
                <div>
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {appointment.status === "confirmed" ? "Confirmed" : "Scheduled"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard; 