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
import medicineService from "../../services/medicineService";
import MedicineDetailsDialog from "../../components/dialogs/MedicineDetailsDialog";
import { useNavigate } from "react-router-dom";

const PatientMedications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("current");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        // Remove direct patientId check; let the service handle it
        const response = await medicineService.getMedicationsByPatient();
        if (response.success) {
          setMedications(response.data);
        } else {
          setError(response.message || "Failed to load medications");
        }
      } catch (err) {
        setError(err.message || "Failed to load medications");
      } finally {
        setLoading(false);
      }
    };
    fetchMedications();
  }, []);

  const handleRequestRefill = async (prescriptionId, medicineId) => {
    try {
      setLoading(true);
      const response = await medicineService.requestRefill(prescriptionId, medicineId);
      alert(response.message || "Refill requested!");
    } catch (err) {
      alert(err.message || "Failed to request refill");
    } finally {
      setLoading(false);
    }
  };

  const openMedicineDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setDetailsOpen(true);
  };

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
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm"
              onClick={() => {
                activeMedications.forEach(med =>
                  handleRequestRefill(med.prescriptionId, med._id)
                );
              }}
            >
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
              <div
                key={`reminder-${med._id}`}
                className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 shadow-sm border border-blue-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openMedicineDetails(med)}
              >
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
                  <th>Medication</th>
                  <th>Dosage & Frequency</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Refills</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeMedications.map((medication) => (
                  <tr
                    key={medication._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openMedicineDetails(medication)}
                  >
                    <td>
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
                    <td>
                      <div className="text-sm font-medium text-gray-900">{medication.dosage}</div>
                      <div className="text-sm text-gray-500">{medication.frequency}</div>
                    </td>
                    <td>
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
                    <td>{getStatusBadge(medication.status)}</td>
                    <td>
                      {medication.refillsRemaining > 0 ? (
                        <div className="flex items-center">
                          <span className="mr-2">{medication.refillsRemaining} remaining</span>
                          <button
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                            onClick={e => {
                              e.stopPropagation();
                              handleRequestRefill(medication.prescriptionId, medication._id);
                            }}
                          >
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
                    key={`history-${med._id}`}
                    className="border-l-4 border-blue-300 pl-4 py-3 pr-4 bg-white rounded-r-lg hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => openMedicineDetails(med)}
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
      
      {/* Medicine Details Dialog */}
      <MedicineDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        medicine={selectedMedicine}
      />
    </div>
  );
};

export default PatientMedications;