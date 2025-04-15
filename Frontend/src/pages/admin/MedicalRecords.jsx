import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import medicalRecordService from "../../services/medicalRecordService";
import { toast } from "react-hot-toast";
import MedicalRecordDialog from "../../components/dialogs/MedicalRecordDialog";

const MedicalRecords = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });
  // Add state for dialog
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchMedicalRecords();
  }, [currentPage]);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const response = await medicalRecordService.getAllMedicalRecords(currentPage, 10);
      
      if (response.success) {
        setRecords(response.data.medicalRecords || []);
        setPagination(response.data.pagination || { total: 0, page: 1, pages: 1 });
      } else {
        setError(response.message || "Failed to load medical records");
        toast.error(response.message || "Failed to load medical records");
      }
    } catch (err) {
      console.error("Error fetching medical records:", err);
      setError("Failed to load medical records data");
      toast.error("Failed to load medical records data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateRecord = () => {
    // Instead of navigating, open the dialog
    setSelectedRecord(null); // Ensure we're creating a new record
    setShowRecordDialog(true);
  };

  const handleEditRecord = (id) => {
    // Find the record to edit
    const recordToEdit = records.find(record => record._id === id);
    if (recordToEdit) {
      setSelectedRecord(recordToEdit);
      setShowRecordDialog(true);
    } else {
      toast.error("Record not found");
    }
  };

  // Handle successful record creation/update
  const handleRecordSuccess = (newRecord) => {
    if (selectedRecord) {
      // Update existing record in the list
      setRecords(records.map(record => 
        record._id === newRecord._id ? newRecord : record
      ));
    } else {
      // Add new record to the list
      setRecords([newRecord, ...records]);
    }
    // Refresh the records list to ensure we have the latest data
    fetchMedicalRecords();
  };

  const handleViewRecord = (id) => {
    navigate(`/admin-dashboard/medical-records/view/${id}`);
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm("Are you sure you want to delete this medical record?")) {
      try {
        const response = await medicalRecordService.deleteMedicalRecord(id);
        
        if (response.success) {
          toast.success("Medical record deleted successfully");
          // Remove the deleted record from the state
          setRecords(records.filter(record => record._id !== id));
        } else {
          toast.error(response.message || "Failed to delete medical record");
        }
      } catch (err) {
        console.error("Error deleting medical record:", err);
        toast.error("Failed to delete medical record");
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter records based on search term
  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (record.diagnosis && record.diagnosis.toLowerCase().includes(searchLower)) ||
      (record.patient && record.patient.name && record.patient.name.toLowerCase().includes(searchLower)) ||
      (record.doctor && record.doctor.name && record.doctor.name.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <span className="ml-3 text-lg text-gray-600">Loading medical records...</span>
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Medical Records</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => fetchMedicalRecords()}
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
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Medical Records</h1>
          <p className="text-gray-600 mt-1">Manage all patient medical records</p>
        </div>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            setSelectedRecord(null);
            setShowRecordDialog(true);
          }}
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          <span>Create New Record</span>
        </button>
      </div>
      
      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name, doctor, or diagnosis..."
            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {/* Records table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.patient ? record.patient.name : "Unknown Patient"}
                          </div>
                          {record.patient && record.patient.contactNumber && (
                            <div className="text-sm text-gray-500">
                              {record.patient.contactNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.doctor ? record.doctor.name : "Not Assigned"}
                      </div>
                      {record.doctor && record.doctor.specialization && (
                        <div className="text-sm text-gray-500">
                          {record.doctor.specialization}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.diagnosis || "No diagnosis"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewRecord(record._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => handleEditRecord(record._id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No records found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {searchTerm ? "No records match your search criteria." : "There are no medical records in the system yet."}
                    </p>
                    <button
                      onClick={handleCreateRecord}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Record
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(pagination.page - 1) * 10 + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(pagination.page * 10, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Medical Record Dialog */}
      <MedicalRecordDialog
        open={showRecordDialog}
        onOpenChange={setShowRecordDialog}
        record={selectedRecord}
        onSuccess={handleRecordSuccess}
      />
    </div>
  );
};

export default MedicalRecords;