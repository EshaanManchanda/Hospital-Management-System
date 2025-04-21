import React, { useState, useEffect } from "react";
import { Download, Upload, FileText, Plus, AlertCircle, Check } from "lucide-react";
import { authService } from "../../services";
import medicalRecordService from "../../services/medicalRecordService";
import MedicalRecordDetailsDialog from "../../components/dialogs/MedicalRecordDetailsDialog";

const MedicalReports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Form state
  const [reportData, setReportData] = useState({
    title: "",
    type: "",
    notes: "",
    file: null
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        const userData = authService.getUserData();
        if (!userData || !userData.patientId) {
          throw new Error("Patient information not found");
        }

        // Fetch reports using medicalRecordService
        const response = await medicalRecordService.getPatientMedicalRecords(userData.patientId);
        if (response.success && response.data && response.data.medicalRecords) {
          setReports(response.data.medicalRecords);
        } else {
          setReports([]);
          setError(response.message || "Failed to load your medical reports");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load your medical reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = (reportUrl, reportTitle) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = reportUrl;
    link.download = reportTitle || 'medical-report';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Medical Reports</h1>
        <p className="text-gray-600 mt-1">View and manage your medical reports</p>
      </div>

      {/* Upload success message */}
      {uploadSuccess && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg flex items-center text-green-700">
          <Check className="h-5 w-5 mr-2" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Error message */}
      {(error || uploadError) && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error || uploadError}</span>
        </div>
      )}

      {/* Upload button and form removed */}

      {/* Reports list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Your Reports</h2>
        </div>
        
        {reports.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {reports.map((report) => (
              <li
                key={report._id}
                className="p-6 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => {
                  setSelectedRecord(report);
                  setDetailsOpen(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{report.title}</h3>
                      <p className="text-sm text-gray-500">
                        {report.type} • {report.date ? new Date(report.date).toLocaleDateString() : "N/A"}
                      </p>
                      {report.notes && (
                        <p className="text-sm text-gray-600 mt-1">{report.notes}</p>
                      )}
                      {/* Removed the View Details button */}
                    </div>
                  </div>
                  {report.file ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(report.file, report.title);
                      }}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  ) : (
                    <span className="text-sm text-red-500">
                      Report is not published. Contact hospital.
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
            <p className="mt-2 text-sm text-gray-500">
              You haven't uploaded any medical reports yet.
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Your First Report
            </button>
          </div>
        )}
      </div>
      {/* Dialog for record details */}
      <MedicalRecordDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        record={selectedRecord}
      />
    </div>
  );
};

export default MedicalReports;