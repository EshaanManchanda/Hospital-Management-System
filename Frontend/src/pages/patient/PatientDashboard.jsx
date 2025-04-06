import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { 
  CalendarDays, 
  Clock, 
  FileText, 
  User, 
  Activity, 
  PlusCircle, 
  Calendar,
  ClipboardList,
  CheckCircle,
  Settings,
  LogOut,
  Clipboard,
  Pill,
  BedDouble,
  UserCircle,
  Menu,
  X,
  Home,
  Heart
} from "lucide-react";
import { authService, patientService, appointmentService } from "../../services";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "dashboard");
  
  // Toggle sidebar for mobile responsiveness
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Set active tab from location state if it exists
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    // Check for success message from appointment creation
    if (location.state?.appointmentCreated) {
      const details = location.state.appointmentDetails;
      setSuccessMessage({
        title: "Appointment Booked Successfully!",
        details: details ? `Appointment with ${details.doctor} on ${new Date(details.date).toLocaleDateString()} at ${details.time}` : "Your appointment has been scheduled."
      });
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
        
        // Log the patient ID being used
        console.log("Attempting to fetch patient data with ID:", userData.patientId);
        console.log("Using token:", token.substring(0, 20) + "...");
        
        // Initialize dashboard data object
        let dashboardInfo = {};
        
        try {
          // Get patient profile
          const patientResponse = await patientService.getPatientById(userData.patientId);
          console.log("Patient data response:", patientResponse);
          dashboardInfo.patient = patientResponse.data;
        } catch (patientError) {
          console.error("Error fetching patient profile:", patientError);
          // Don't throw here, continue with what we can get
          dashboardInfo.patientError = "Could not retrieve patient profile information";
        }
        
        try {
          // Get patient appointments
          const appointmentsResponse = await appointmentService.getPatientAppointments(userData.patientId);
          console.log("Appointments response:", appointmentsResponse);
          dashboardInfo.appointments = appointmentsResponse.data;
        } catch (appointmentsError) {
          console.error("Error fetching appointments:", appointmentsError);
          // Log detailed information to help debug the issue
          console.error("Appointments error details:", {
            message: appointmentsError.message,
            status: appointmentsError.response?.status,
            statusText: appointmentsError.response?.statusText,
            data: appointmentsError.response?.data,
          });
          
          // Don't throw here, continue with what we can get
          dashboardInfo.appointmentsError = "Could not retrieve appointment information";
          // Set empty appointments array so the UI doesn't break
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
    navigate("/appointments/new");
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
        <p className="text-red-500">{error}</p>
        
        {/* Debug information */}
        <div className="mt-4 p-4 bg-white rounded border text-left text-xs">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <p>User Data: {JSON.stringify(authService.getUserData(), null, 2)}</p>
        </div>
        
        <button 
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition"
        >
          Back to Login
        </button>
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
      doctor: { user: { name: "Dr. Sarah Johnson" } },
      date: "2023-12-15",
      time: "10:00 AM",
      type: "General Checkup",
      status: "scheduled"
    },
    {
      _id: "2",
      doctor: { user: { name: "Dr. Michael Wong" } },
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
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-md text-gray-700 hover:bg-gray-100 transition"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 z-10 w-64 h-full bg-blue-600 shadow-lg transition-transform duration-300 ease-in-out`}
      >
        <div className="p-5 text-white">
          <p className="text-sm opacity-80">Patient Portal</p>
        </div>
        
        <div className="mt-4 text-white">
          <nav className="space-y-4">
            <div className="flex items-center gap-3 px-6 py-2">
              <div className="p-1">
                <span className="inline-block h-2 w-2 rounded-full bg-white mr-3"></span>
              </div>
              <NavLink 
                to="/patient-dashboard"
                className={({ isActive }) => 
                  `flex items-center text-white ${isActive ? 'font-bold' : 'font-normal'}`
                }
              >
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </NavLink>
            </div>

            <div className="flex items-center gap-3 px-6 py-2">
              <div className="p-1">
                <span className="inline-block h-2 w-2 rounded-full bg-white mr-3"></span>
              </div>
              <NavLink 
                to="/patient-dashboard/appointments"
                className={({ isActive }) => 
                  `flex items-center text-white ${isActive ? 'font-bold' : 'font-normal'}`
                }
              >
                <CalendarDays className="w-5 h-5 mr-3" />
                Appointments
              </NavLink>
            </div>

            <div className="flex items-center gap-3 px-6 py-2">
              <div className="p-1">
                <span className="inline-block h-2 w-2 rounded-full bg-white mr-3"></span>
              </div>
              <NavLink 
                to="/patient-dashboard/reports"
                className={({ isActive }) => 
                  `flex items-center text-white ${isActive ? 'font-bold' : 'font-normal'}`
                }
              >
                <FileText className="w-5 h-5 mr-3" />
                Medical Reports
              </NavLink>
            </div>

            <div className="flex items-center gap-3 px-6 py-2">
              <div className="p-1">
                <span className="inline-block h-2 w-2 rounded-full bg-white mr-3"></span>
              </div>
              <NavLink 
                to="/patient-dashboard/prescriptions"
                className={({ isActive }) => 
                  `flex items-center text-white ${isActive ? 'font-bold' : 'font-normal'}`
                }
              >
                <ClipboardList className="w-5 h-5 mr-3" />
                Prescriptions
              </NavLink>
            </div>

            <div className="flex items-center gap-3 px-6 py-2">
              <div className="p-1">
                <span className="inline-block h-2 w-2 rounded-full bg-white mr-3"></span>
              </div>
              <NavLink 
                to="/patient-dashboard/medications"
                className={({ isActive }) => 
                  `flex items-center text-white ${isActive ? 'font-bold' : 'font-normal'}`
                }
              >
                <Pill className="w-5 h-5 mr-3" />
                Medications
              </NavLink>
            </div>

            <div className="flex items-center gap-3 px-6 py-2">
              <div className="p-1">
                <span className="inline-block h-2 w-2 rounded-full bg-white mr-3"></span>
              </div>
              <NavLink 
                to="/patient-dashboard/beds"
                className={({ isActive }) => 
                  `flex items-center text-white ${isActive ? 'font-bold' : 'font-normal'}`
                }
              >
                <BedDouble className="w-5 h-5 mr-3" />
                Bed Booking
              </NavLink>
            </div>

            <div className="flex items-center gap-3 px-6 py-2">
              <div className="p-1">
                <span className="inline-block h-2 w-2 rounded-full bg-white mr-3"></span>
              </div>
              <NavLink 
                to="/patient-dashboard/profile"
                className={({ isActive }) => 
                  `flex items-center text-white ${isActive ? 'font-bold' : 'font-normal'}`
                }
              >
                <UserCircle className="w-5 h-5 mr-3" />
                My Profile
              </NavLink>
            </div>
          </nav>
          
          <div className="mt-8 px-6 pt-4 border-t border-blue-500/30">
            <div className="flex gap-2 items-center text-white">
              <LogOut className="h-5 w-5" />
              <button 
                onClick={handleLogout}
                className="text-white hover:text-red-200 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 overflow-y-auto pb-12 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
        <div className="sticky top-0 z-5 bg-white shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome back, {dashboardData?.patient?.user?.name || "Patient"}</p>
            </div>
            <button
              onClick={handleCreateAppointment}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <PlusCircle size={16} />
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        <div className="px-6">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-6 flex items-start shadow-sm">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-800">{successMessage.title}</h3>
                <p className="text-green-700 text-sm mt-1">{successMessage.details}</p>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {dashboardData && dashboardData.appointmentsError && (
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6 flex items-start shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-medium text-amber-800">Appointment Data Issue</h3>
                <p className="text-amber-700 text-sm mt-1">We're having trouble retrieving your appointments. This may be temporary. Please try again later.</p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Blood Group</p>
                  <h3 className="text-2xl font-bold mt-1">{dashboardData?.patient?.bloodGroup || "N/A"}</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Height</p>
                  <h3 className="text-2xl font-bold mt-1">{dashboardData?.patient?.height || "N/A"} cm</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Weight</p>
                  <h3 className="text-2xl font-bold mt-1">{dashboardData?.patient?.weight || "N/A"} kg</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Upcoming Appointments</p>
                  <h3 className="text-2xl font-bold mt-1">{upcomingAppointments.length}</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Health Information */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Health Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-700 rounded-full"></span>
                  Allergies
                </h3>
                {dashboardData?.patient?.allergies && dashboardData.patient.allergies.length > 0 ? (
                  <ul className="space-y-2">
                    {dashboardData.patient.allergies.map((allergy, index) => (
                      <li key={index} className="text-gray-700 bg-white p-2 rounded-lg shadow-sm">{allergy}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No known allergies</p>
                )}
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                  Chronic Conditions
                </h3>
                {dashboardData?.patient?.chronicDiseases && dashboardData.patient.chronicDiseases.length > 0 ? (
                  <ul className="space-y-2">
                    {dashboardData.patient.chronicDiseases.map((disease, index) => (
                      <li key={index} className="text-gray-700 bg-white p-2 rounded-lg shadow-sm">{disease}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No chronic conditions recorded</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  Upcoming Appointments
                </h2>
                <Link
                  to="/patient-dashboard/appointments"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                </Link>
              </div>
              
              {dashboardData && dashboardData.appointmentsError ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Unable to load appointment data</p>
                  <p className="text-sm text-gray-400 mb-4">We're having trouble fetching your appointments</p>
                  <button 
                    onClick={handleCreateAppointment} 
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Book an Appointment</span>
                  </button>
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment._id} className="bg-blue-50 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{appointment.doctor.user.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{appointment.type}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                            <CalendarDays className="h-4 w-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No upcoming appointments</p>
                  <button 
                    onClick={handleCreateAppointment} 
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Book an Appointment</span>
                  </button>
                </div>
              )}
            </div>

            {/* Medical History */}
            <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Medical History
                </h2>
                <Link
                  to="/patient-dashboard/medical-history"
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1 transition-colors"
                >
                  <span>View Complete History</span>
                </Link>
              </div>
              
              {dashboardData && dashboardData.appointmentsError ? (
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Unable to load medical history</p>
                  <p className="text-sm text-gray-400">We're having trouble fetching your medical history data</p>
                </div>
              ) : pastAppointments.length > 0 ? (
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <div key={appointment._id} className="bg-purple-50 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{appointment.doctor.user.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{appointment.type}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-purple-600 text-sm font-medium">
                            <CalendarDays className="h-4 w-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No previous appointments found</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Assigned Doctor */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Your Assigned Doctor
            </h2>
            
            {dashboardData?.patient?.assignedDoctor ? (
              <div className="flex items-start gap-4">
                <div className="bg-white p-4 rounded-full shadow-md">
                  <User className="h-12 w-12 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">{dashboardData.patient.assignedDoctor.user?.name || "Dr. Name Not Available"}</h3>
                  <p className="text-indigo-600">{dashboardData.patient.assignedDoctor.specialization || "Specialization Not Available"}</p>
                  <p className="text-gray-500 text-sm mt-1">Experience: {dashboardData.patient.assignedDoctor.experience || "N/A"} years</p>
                  <button 
                    onClick={handleCreateAppointment} 
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Schedule Appointment</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg">
                <User className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No assigned doctor</p>
                <p className="text-sm text-gray-400">You can book an appointment with any available doctor</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard; 