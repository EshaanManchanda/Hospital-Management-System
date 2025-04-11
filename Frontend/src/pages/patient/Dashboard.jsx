import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  CalendarDays, 
  Clock, 
  FileText, 
  User, 
  Activity,
  PlusCircle, 
  CheckCircle,
  Calendar,
  ClipboardList,
  RotateCw,
  AlertTriangle,
  Droplets,
  Ruler,
  Weight,
  Heart,
  Info,
  ChevronRight,
  Bell,
  ArrowRight,
  Pill,
  Shield
} from "lucide-react";
import { authService, appointmentService, getPatientService } from "../../services";

// Define patientService at module level
let patientService;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

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
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Make sure patientService is loaded
        if (!patientService) {
          patientService = getPatientService();
          if (!patientService) {
            const module = await import('../../services/patientService');
            patientService = module.default;
          }
        }
        
        const userData = authService.getUserData();
        
        if (!userData || !userData.patientId) {
          throw new Error("Patient information not found");
        }
        
        // Initialize dashboard data object
        let dashboardInfo = {};
        
        try {
          // Get patient profile
          const patientResponse = await patientService.getPatientById(userData.patientId);
          dashboardInfo.patient = patientResponse.patient;
        } catch (patientError) {
          console.error("Error fetching patient profile:", patientError);
          dashboardInfo.patientError = "Could not retrieve patient profile";
        }
        
        try {
          // Get upcoming appointments
          const appointmentsResponse = await appointmentService.getPatientAppointments(userData.patientId);
          dashboardInfo.appointments = appointmentsResponse.data;
        } catch (appointmentsError) {
          console.error("Error fetching appointments:", appointmentsError);
          dashboardInfo.appointmentsError = "Could not retrieve appointment information";
        }
        
        setDashboardData(dashboardInfo);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl shadow-sm">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Dashboard Unavailable</h2>
          <p className="text-gray-600 mb-5 max-w-md">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use placeholder data if API data is not available yet
  const patient = dashboardData?.patient || {
    name: "John Doe",
    bloodGroup: "O+",
    height: 175,
    weight: 70,
    age: 35,
    gender: "Male"
  };

  const appointments = dashboardData?.appointments?.data || [
    {
      _id: "1",
      doctor: { user: { name: "Dr. Sarah Johnson" }, specialty: "Cardiology" },
      date: "2023-12-15",
      time: "10:00 AM",
      type: "General Checkup",
      status: "scheduled"
    },
    {
      _id: "2",
      doctor: { user: { name: "Dr. Michael Wong" }, specialty: "Neurology" },
      date: "2023-12-20",
      time: "2:30 PM",
      type: "Follow-up",
      status: "scheduled"
    }
  ];

  // Filter for upcoming appointments
  const upcomingAppointments = appointments
    .filter(app => app.status === "scheduled")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // Filter for past appointments
  const pastAppointments = appointments
    .filter(app => app.status === "completed")
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-white">
            <h1 className="text-2xl font-bold">Welcome back, {patient.name?.split(' ')[0] || 'Patient'}!</h1>
            <p className="mt-1 text-blue-100">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link 
            to="/patient-dashboard/appointments"
            className="inline-flex items-center bg-white px-4 py-2 rounded-lg text-blue-600 font-medium shadow-sm hover:bg-blue-50 transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Appointment
          </Link>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-green-800">{successMessage.title}</h3>
              <p className="text-green-700 text-sm mt-1">{successMessage.details}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {dashboardData && dashboardData.appointmentsError && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-amber-800">Appointment Data Issue</h3>
              <p className="text-amber-700 text-sm mt-1">We're having trouble retrieving your appointments. This may be temporary. Please try again later.</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 text-white relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-white/90 text-sm mb-1">Blood Group</p>
                <h3 className="text-3xl font-bold text-white">
                  {dashboardData?.patient?.bloodGroup || "O+"}
                </h3>
              </div>
              <div className="rounded-lg bg-white/20 p-2 flex items-center justify-center">
                <Droplets className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 text-white relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-white/90 text-sm mb-1">Height</p>
                <h3 className="text-3xl font-bold text-white">
                  {dashboardData?.patient?.height || "175"}<span className="text-lg ml-1">cm</span>
                </h3>
              </div>
              <div className="rounded-lg bg-white/20 p-2 flex items-center justify-center">
                <Ruler className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 text-white relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-white/90 text-sm mb-1">Weight</p>
                <h3 className="text-3xl font-bold text-white">
                  {dashboardData?.patient?.weight || "70"}<span className="text-lg ml-1">kg</span>
                </h3>
              </div>
              <div className="rounded-lg bg-white/20 p-2 flex items-center justify-center">
                <Weight className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 text-white relative">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-white/90 text-sm mb-1">Appointments</p>
                <h3 className="text-3xl font-bold text-white">
                  {upcomingAppointments.length}
                </h3>
              </div>
              <div className="rounded-lg bg-white/20 p-2 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-800">Health Information</h2>
            </div>
            <Link 
              to="/patient-dashboard/profile"
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              Update
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-blue-700">Allergies</h3>
              </div>
              <p className="text-gray-700">
                {dashboardData?.patient?.allergies && dashboardData.patient.allergies.length > 0 
                  ? dashboardData.patient.allergies.join(", ")
                  : "No known allergies"}
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-600" />
                <h3 className="font-medium text-green-700">Vital Signs</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Blood Pressure</p>
                  <p className="text-gray-700">{dashboardData?.patient?.bloodPressure || "120/80 mmHg"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Heart Rate</p>
                  <p className="text-gray-700">{dashboardData?.patient?.heartRate || "72 bpm"}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="h-4 w-4 text-purple-600" />
                <h3 className="font-medium text-purple-700">Current Medications</h3>
              </div>
              <div className="space-y-1">
                {dashboardData?.patient?.medications && dashboardData.patient.medications.length > 0 ? (
                  dashboardData.patient.medications.map((med, idx) => (
                    <p key={idx} className="text-gray-700">{med}</p>
                  ))
                ) : (
                  <p className="text-gray-700">No current medications</p>
                )}
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-amber-600" />
                <h3 className="font-medium text-amber-700">Personal Info</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Age</p>
                  <p className="text-gray-700">{dashboardData?.patient?.age || "35"} years</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gender</p>
                  <p className="text-gray-700">{dashboardData?.patient?.gender || "Male"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
            </div>
            <Link 
              to="/patient-dashboard/appointments"
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment._id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-2.5 text-blue-600">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{appointment.doctor.user.name}</p>
                      <p className="text-sm text-gray-500">{appointment.doctor.specialty || "General Medicine"}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        {new Date(appointment.date).toLocaleDateString()}
                        <Clock className="h-3.5 w-3.5 mx-1.5 text-gray-400" />
                        {appointment.time}
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {appointment.type}
                        </span>
                        <Link 
                          to={`/patient-dashboard/appointments/${appointment._id}`} 
                          className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          Details
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 mb-4">No upcoming appointments</p>
              <Link 
                to="/patient-dashboard/appointments/new"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Medical History & Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Medical History */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">Medical History</h2>
            </div>
            <Link 
              to="/patient-dashboard/reports"
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {pastAppointments.length > 0 ? (
            <div className="space-y-3">
              {pastAppointments.map((appointment) => (
                <div key={appointment._id} className="flex items-center gap-3 p-3 border-l-2 border-indigo-500 bg-indigo-50 rounded-r-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{appointment.type}</p>
                    <p className="text-sm text-gray-600">{appointment.doctor.user.name} • {new Date(appointment.date).toLocaleDateString()}</p>
                  </div>
                  <Link 
                    to={`/patient-dashboard/appointments/${appointment._id}`} 
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No medical history</p>
            </div>
          )}
        </div>
        
        {/* Assigned Doctor */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Primary Care Provider</h2>
          </div>
          
          <div className="flex items-center gap-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="h-16 w-16 rounded-full bg-blue-200 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-lg text-gray-800">
                {dashboardData?.patient?.primaryDoctor?.user?.name || "Dr. Sarah Johnson"}
              </h3>
              <p className="text-gray-500">
                {dashboardData?.patient?.primaryDoctor?.specialty || "Family Medicine"}
              </p>
              <div className="mt-2">
                <Link 
                  to="/patient-dashboard/appointments/new" 
                  className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  Schedule Appointment
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notifications */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 shadow-sm border border-amber-100">
        <div className="flex items-start gap-4">
          <div className="bg-amber-100 rounded-full p-3 text-amber-600">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Important Reminders</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                <span>Your annual check-up is due next month</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                <span>Remember to update your medical records if there are any changes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                <span>Follow-up with your doctor after your next appointment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 