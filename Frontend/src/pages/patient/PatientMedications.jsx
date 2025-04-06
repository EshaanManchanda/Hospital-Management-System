import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  AlertCircle, 
  Pill, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  Info, 
  ChevronRight,
  RotateCw, 
  BellRing,
  AlertTriangle,
  Coffee,
  Utensils
} from "lucide-react";
import { authService } from "../../services";

const PatientMedications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        
        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Authentication required");
        }
        
        // In a real application, you would fetch data from your API
        // const response = await medicationService.getPatientMedications(patientId);
        // setMedications(response.data);
        
        // For now, we'll use dummy data
        const dummyMedications = [
          {
            id: "1",
            name: "Amoxicillin",
            dosage: "500mg",
            frequency: "3 times daily",
            startDate: "2023-11-15",
            endDate: "2023-11-30",
            status: "active",
            instructions: "Take with food",
            prescribedBy: "Dr. Sarah Johnson",
            refillsRemaining: 2,
            nextDose: "11:30 AM",
            icon: <Pill className="h-5 w-5" />
          },
          {
            id: "2",
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            startDate: "2023-10-05",
            endDate: "2024-04-05",
            status: "active",
            instructions: "Take in the morning",
            prescribedBy: "Dr. Michael Wong",
            refillsRemaining: 5,
            nextDose: "8:00 AM",
            icon: <Pill className="h-5 w-5" />
          },
          {
            id: "3",
            name: "Ibuprofen",
            dosage: "400mg",
            frequency: "As needed for pain",
            startDate: "2023-11-10",
            endDate: "2023-11-20",
            status: "completed",
            instructions: "Take with food, not more than 3 times daily",
            prescribedBy: "Dr. Sarah Johnson",
            refillsRemaining: 0,
            icon: <Pill className="h-5 w-5" />
          },
          {
            id: "4",
            name: "Cetirizine",
            dosage: "10mg",
            frequency: "Once daily",
            startDate: "2023-11-01",
            endDate: "2023-12-01",
            status: "active",
            instructions: "Take before bed if drowsiness occurs",
            prescribedBy: "Dr. James Davis",
            refillsRemaining: 1,
            nextDose: "10:00 PM",
            icon: <Pill className="h-5 w-5" />
          }
        ];
        
        setMedications(dummyMedications);
      } catch (err) {
        console.error("Error fetching medications:", err);
        setError(err.message || "Failed to load medications");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getInstructionIcon = (instruction) => {
    if (instruction.toLowerCase().includes("food")) {
      return <Utensils className="h-4 w-4 mr-1 text-gray-500" />;
    } else if (instruction.toLowerCase().includes("morning")) {
      return <Coffee className="h-4 w-4 mr-1 text-gray-500" />;
    } else {
      return <Info className="h-4 w-4 mr-1 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your medications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg flex flex-col items-center text-red-700 mb-6 shadow-sm">
        <AlertCircle className="h-10 w-10 mb-3 text-red-500" />
        <h3 className="text-lg font-semibold mb-2">Unable to load medications</h3>
        <p className="text-center mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  const activeMedications = medications.filter(med => med.status === "active");
  const completedMedications = medications.filter(med => med.status === "completed");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">My Medications</h1>
            <p className="text-blue-700 mt-1">Keep track of your prescriptions and dosages</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Request Refill
            </button>
          </div>
        </div>
      </div>
      
      {/* Medication Reminders */}
      {activeMedications.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
            <BellRing className="h-5 w-5 mr-2 text-blue-600" />
            Today's Medication Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeMedications.map((med) => (
              <div key={`reminder-${med.id}`} className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Pill className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{med.name}</h3>
                      <p className="text-blue-700 font-medium">{med.dosage}</p>
                    </div>
                  </div>
                  {getStatusBadge(med.status)}
                </div>
                <div className="mb-3 pb-3 border-b border-blue-50">
                  <p className="text-gray-600 text-sm font-medium">{med.frequency}</p>
                  {med.nextDose && (
                    <div className="mt-2 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700">Next dose: {med.nextDose}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  {getInstructionIcon(med.instructions)}
                  <span>{med.instructions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("current")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "current"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Current Medications
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "history"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              History
            </button>
          </div>
        </div>
        
        {activeTab === "current" && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medication
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosage & Frequency
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Refills
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeMedications.map((medication) => (
                  <tr key={medication.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Pill className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{medication.name}</div>
                          <div className="text-sm text-gray-500">Prescribed by: {medication.prescribedBy}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{medication.dosage}</div>
                      <div className="text-sm text-gray-500">{medication.frequency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-blue-400" />
                          {new Date(medication.startDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        to {new Date(medication.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(medication.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medication.refillsRemaining > 0 ? (
                        <div className="flex items-center">
                          <span className="mr-2">{medication.refillsRemaining} remaining</span>
                          <button className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">No refills</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === "history" && (
          <div className="p-6">
            <div className="space-y-4">
              {completedMedications.length > 0 ? (
                completedMedications.map((med) => (
                  <div 
                    key={`history-${med.id}`} 
                    className="border-l-4 border-blue-300 pl-4 py-3 pr-4 bg-white rounded-r-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{med.name} {med.dosage}</h3>
                        <p className="text-gray-600 text-sm">{med.frequency}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {new Date(med.startDate).toLocaleDateString()} - {new Date(med.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-gray-500 text-xs">Prescribed by: {med.prescribedBy}</p>
                      <div className="flex items-center text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                        <span>View details</span>
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Pill className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-gray-700 font-medium mb-1">No medication history</h3>
                  <p className="text-gray-500 text-sm">Your completed medications will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Medical Information */}
      <div className="bg-yellow-50 rounded-xl p-6 shadow-sm border border-yellow-100">
        <div className="flex items-start">
          <div className="p-2 bg-yellow-100 rounded-lg mr-3">
            <AlertTriangle className="h-5 w-5 text-yellow-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Important Medication Information</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="h-5 w-5 text-yellow-600 mr-2">•</span>
                <span>Always follow the prescribed dosage and schedule</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 text-yellow-600 mr-2">•</span>
                <span>Contact your doctor if you experience any unusual side effects</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 text-yellow-600 mr-2">•</span>
                <span>Request refills at least 7 days before your medication runs out</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientMedications; 