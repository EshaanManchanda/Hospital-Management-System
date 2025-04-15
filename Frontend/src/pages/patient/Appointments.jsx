import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  CalendarDays, 
  Clock, 
  User, 
  Check,
  X,
  Loader2,
  Calendar,
  Search,
  Filter,
  PlusCircle,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { authService, appointmentService } from "../../services";
import { toast } from "react-hot-toast";
import NewAppointmentDialog from "../../components/dialogs/NewAppointmentDialog";

const Appointments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, upcoming, past, cancelled
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);

  // Add this near the top of your component, after the useState declarations
// Location is already declared at the top of the component
  
  // Add this in your useEffect
  useEffect(() => {
    // Check if we should open the new appointment dialog
    if (location.state?.openNewAppointmentDialog) {
      setShowNewAppointmentDialog(true);
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
    
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const userData = authService.getUserData();
        
        if (!userData) {
          throw new Error("User information not found");
        }
        
        // We don't need to pass patientId as the backend will use the authenticated user
        const response = await appointmentService.getPatientAppointments();
        
        if (response.success) {
          console.log('Appointments data:', response.data);
          setAppointments(response.data || []);
        } else {
          setError(response.message || "Failed to load appointments");
          toast.error(response.message || "Failed to load appointments");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments data. Please try again later.");
        toast.error("Failed to load appointments data");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleNewAppointment = () => {
    setShowNewAppointmentDialog(true);
  };

  // Filter appointments based on status and search term
  const filteredAppointments = appointments
    .filter(appointment => {
      if (filter === "upcoming") return appointment.status === "scheduled";
      if (filter === "past") return appointment.status === "completed";
      if (filter === "cancelled") return appointment.status === "cancelled";
      return true; // "all" filter
    })
    .filter(appointment => {
      if (!searchTerm) return true;
      const searchValue = searchTerm.toLowerCase();
      return (
        appointment.doctor.user.name.toLowerCase().includes(searchValue) ||
        appointment.type.toLowerCase().includes(searchValue)
      );
    });

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Function to get status text color
  const getStatusTextColor = (status) => {
    switch (status) {
      case "scheduled":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Add these new functions to handle appointment status updates
  const handleConfirmAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await appointmentService.updateAppointment(appointmentId, {
        status: "confirmed"
      });
      
      if (response.success) {
        toast.success("Appointment confirmed successfully");
        // Update the appointment in the local state
        setAppointments(prevAppointments => 
          prevAppointments.map(app => 
            app._id === appointmentId ? { ...app, status: "confirmed" } : app
          )
        );
      } else {
        toast.error(response.message || "Failed to confirm appointment");
      }
    } catch (err) {
      console.error("Error confirming appointment:", err);
      toast.error("Failed to confirm appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await appointmentService.updateAppointment(appointmentId, {
        status: "cancelled"
      });
      
      if (response.success) {
        toast.success("Appointment cancelled successfully");
        // Update the appointment in the local state
        setAppointments(prevAppointments => 
          prevAppointments.map(app => 
            app._id === appointmentId ? { ...app, status: "cancelled" } : app
          )
        );
      } else {
        toast.error(response.message || "Failed to cancel appointment");
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      toast.error("Failed to cancel appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <span className="text-lg text-gray-600">Loading your appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-8 rounded-xl shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Appointments</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>Try Again</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Your Appointments</h1>
          
          <button
            onClick={handleNewAppointment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-medium"
          >
            <PlusCircle size={16} />
            <span>New Appointment</span>
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search bar */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor or appointment type"
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter tabs */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'all' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'upcoming' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'past' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setFilter('past')}
              >
                Past
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'cancelled' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setFilter('cancelled')}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>
        
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="bg-gray-100 p-4 inline-flex rounded-full mb-4">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {filter === 'all' 
                ? "You don't have any appointments scheduled yet." 
                : `You don't have any ${filter} appointments.`}
            </p>
            <button
              onClick={handleNewAppointment}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Schedule an Appointment</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredAppointments.map((appointment) => (
              <div 
                key={appointment._id} 
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row md:items-center gap-4 justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{appointment.doctor.user.name}</h3>
                    <p className="text-gray-600">{appointment.type}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-3 text-gray-600 text-sm">
                        <span className="font-medium">Notes:</span> {appointment.notes}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                  
                  {appointment.status === "scheduled" && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleConfirmAppointment(appointment._id)}
                        className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Confirm</span>
                      </button>
                      <button 
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* New Appointment Dialog */}
      <NewAppointmentDialog 
        open={showNewAppointmentDialog} 
        onOpenChange={setShowNewAppointmentDialog} 
      />
    </div>
  );
};

export default Appointments;