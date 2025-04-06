import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  AlertCircle, 
  FileText, 
  Download, 
  Eye, 
  Printer, 
  Clock, 
  CheckCircle, 
  RotateCw,
  Filter,
  Search,
  ChevronRight,
  Pill,
  ClipboardList,
  Info,
  User
} from "lucide-react";
import { authService } from "../../services";

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        
        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Authentication required");
        }
        
        // In a real application, you would fetch data from your API
        // const response = await prescriptionService.getPatientPrescriptions(patientId);
        // setPrescriptions(response.data);
        
        // For now, we'll use dummy data
        const dummyPrescriptions = [
          {
            id: "1",
            date: "2023-11-15",
            doctor: "Dr. Sarah Johnson",
            specialty: "Cardiology",
            status: "active",
            medications: [
              { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days" },
              { name: "Ibuprofen", dosage: "400mg", frequency: "as needed", duration: "5 days" }
            ],
            notes: "Take with food. Complete the full course of antibiotics.",
            attachment: "prescription_doc_1.pdf"
          },
          {
            id: "2",
            date: "2023-10-05",
            doctor: "Dr. Michael Wong",
            specialty: "Internal Medicine",
            status: "active",
            medications: [
              { name: "Lisinopril", dosage: "10mg", frequency: "once daily", duration: "6 months" }
            ],
            notes: "For blood pressure management. Take in the morning.",
            attachment: "prescription_doc_2.pdf"
          },
          {
            id: "3",
            date: "2023-09-20",
            doctor: "Dr. Sarah Johnson",
            specialty: "Cardiology",
            status: "completed",
            medications: [
              { name: "Cetirizine", dosage: "10mg", frequency: "once daily", duration: "14 days" }
            ],
            notes: "For allergy symptoms. May cause drowsiness.",
            attachment: "prescription_doc_3.pdf"
          },
          {
            id: "4",
            date: "2023-08-12",
            doctor: "Dr. James Davis",
            specialty: "Endocrinology",
            status: "completed",
            medications: [
              { name: "Simvastatin", dosage: "20mg", frequency: "once daily", duration: "3 months" }
            ],
            notes: "Take at night. Follow cholesterol-friendly diet.",
            attachment: "prescription_doc_4.pdf"
          }
        ];
        
        setPrescriptions(dummyPrescriptions);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
        setError(err.message || "Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescriptions();
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

  const handleDownload = (id, filename) => {
    // In a real application, this would trigger a file download
    console.log(`Downloading prescription ${id}: ${filename}`);
    alert(`In a real application, this would download the file: ${filename}`);
  };

  const handlePrint = (id) => {
    // In a real application, this would open a print dialog
    console.log(`Printing prescription ${id}`);
    alert(`In a real application, this would open a print dialog for prescription #${id}`);
  };

  const handleView = (prescription) => {
    // Open the prescription details view
    setSelectedPrescription(prescription);
  };

  const closeDetails = () => {
    setSelectedPrescription(null);
  };

  const filteredPrescriptions = prescriptions
    .filter(p => {
      if (filterStatus === "all") return true;
      return p.status === filterStatus;
    })
    .filter(p => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        p.doctor.toLowerCase().includes(searchLower) ||
        p.medications.some(med => med.name.toLowerCase().includes(searchLower))
      );
    });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your prescriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl shadow-sm flex flex-col items-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to Load Prescriptions</h3>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
        >
          <RotateCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">My Prescriptions</h1>
            <p className="text-blue-700 mt-1">View and manage your medical prescriptions</p>
          </div>
        </div>
      </div>
      
      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Prescription Details</h2>
                <button 
                  onClick={closeDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap items-start -mx-3">
                <div className="w-full md:w-7/12 px-3 mb-6">
                  <div className="mb-6">
                    <h3 className="text-gray-500 text-sm mb-1">Prescription ID</h3>
                    <p className="text-lg font-semibold">#{selectedPrescription.id}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-gray-500 text-sm mb-1">Prescribed By</h3>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{selectedPrescription.doctor}</p>
                        <p className="text-sm text-gray-500">{selectedPrescription.specialty}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-gray-500 text-sm mb-1">Date Issued</h3>
                    <p className="flex items-center text-gray-800">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      {new Date(selectedPrescription.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-gray-500 text-sm mb-1">Status</h3>
                    <div>
                      {getStatusBadge(selectedPrescription.status)}
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-5/12 px-3">
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-blue-700 mb-3 flex items-center">
                      <Pill className="h-4 w-4 mr-2" />
                      Medications
                    </h3>
                    <ul className="space-y-3">
                      {selectedPrescription.medications.map((med, index) => (
                        <li key={index} className="bg-white p-3 rounded-md shadow-sm">
                          <p className="font-medium text-gray-800">{med.name}</p>
                          <div className="text-sm text-gray-600 mt-1 space-y-1">
                            <p>Dosage: {med.dosage}</p>
                            <p>Frequency: {med.frequency}</p>
                            <p>Duration: {med.duration}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedPrescription.notes && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h3 className="font-medium text-yellow-700 mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Doctor's Notes
                      </h3>
                      <p className="text-gray-700 text-sm">{selectedPrescription.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <button 
                  onClick={() => handleDownload(selectedPrescription.id, selectedPrescription.attachment)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
                <button 
                  onClick={() => handlePrint(selectedPrescription.id)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 shadow-sm text-sm font-medium rounded-lg text-white hover:bg-blue-700 transition-colors"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search prescriptions by doctor or medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-500 mr-2 whitespace-nowrap flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Filter:
            </span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Prescriptions</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Prescriptions List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <ClipboardList className="h-5 w-5 mr-2 text-blue-500" />
              Prescriptions
            </h2>
            <span className="text-sm text-gray-500">
              {filteredPrescriptions.length} {filteredPrescriptions.length === 1 ? 'prescription' : 'prescriptions'}
            </span>
          </div>
        </div>
        
        {filteredPrescriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-1">No prescriptions found</h3>
            <p className="text-gray-400 text-center max-w-md">
              {searchTerm 
                ? "Try changing your search terms or filters" 
                : "Your prescriptions will appear here once they're issued by your doctor"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPrescriptions.map((prescription) => (
              <div 
                key={prescription.id} 
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleView(prescription)}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          Prescription #{prescription.id}
                        </h3>
                        <p className="text-sm text-gray-500">{prescription.doctor} • {prescription.specialty}</p>
                      </div>
                      {getStatusBadge(prescription.status)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                      <span>{new Date(prescription.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <Pill className="h-4 w-4 mr-1.5 text-gray-400" />
                      <span>{prescription.medications.length} {prescription.medications.length === 1 ? 'medication' : 'medications'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(prescription);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(prescription.id, prescription.attachment);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrint(prescription.id);
                      }}
                      className="hidden md:inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                    <p className="text-sm text-gray-600">{prescription.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptions; 