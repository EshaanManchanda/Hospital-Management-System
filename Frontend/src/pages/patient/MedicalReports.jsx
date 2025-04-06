import React, { useState, useEffect } from "react";
import { Download, Upload, FileText, Plus, AlertCircle, Check } from "lucide-react";
import { authService, patientService } from "../../services";

const MedicalReports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
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
        
        const response = await patientService.getPatientReports(userData.patientId);
        setReports(response.data || []);
      } catch (err) {
        console.error("Error fetching medical reports:", err);
        setError(err.message || "Failed to load medical reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setReportData(prev => ({
      ...prev,
      file
    }));
  };

  const handleUploadReport = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null);
    
    try {
      const userData = authService.getUserData();
      
      if (!userData || !userData.patientId) {
        throw new Error("Patient information not found");
      }
      
      if (!reportData.file) {
        throw new Error("Please select a file to upload");
      }
      
      const formData = {
        title: reportData.title,
        type: reportData.type,
        notes: reportData.notes,
        file: reportData.file
      };
      
      const response = await patientService.uploadPatientReport(userData.patientId, formData);
      
      // Add the new report to the list
      setReports(prev => [response.data, ...prev]);
      
      // Reset form
      setReportData({
        title: "",
        type: "",
        notes: "",
        file: null
      });
      
      setUploadSuccess(true);
      setShowUploadForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error uploading report:", err);
      setUploadError(err.message || "Failed to upload report");
    } finally {
      setIsUploading(false);
    }
  };

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
          <span>Report uploaded successfully!</span>
        </div>
      )}

      {/* Error message */}
      {(error || uploadError) && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error || uploadError}</span>
        </div>
      )}

      {/* Upload button */}
      <div className="mb-6">
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition flex items-center"
        >
          {showUploadForm ? (
            <>
              <span>Cancel Upload</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              <span>Upload New Report</span>
            </>
          )}
        </button>
      </div>

      {/* Upload form */}
      {showUploadForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Medical Report</h2>
          
          <form onSubmit={handleUploadReport}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Report Title</label>
                <input
                  type="text"
                  name="title"
                  value={reportData.title}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Report Type</label>
                <select
                  name="type"
                  value={reportData.type}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="MRI">MRI</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="ECG">ECG</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={reportData.notes}
                onChange={handleInputChange}
                rows="3"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Add any additional notes or context for this report"
              ></textarea>
            </div>
            
            <div className="mb-6 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload File</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, JPG, PNG up to 10MB
                    </p>
                    {reportData.file && (
                      <p className="text-sm text-primary mt-2">
                        {reportData.file.name}
                      </p>
                    )}
                  </div>
                  <input 
                    type="file" 
                    name="file" 
                    className="hidden" 
                    onChange={handleFileChange} 
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading || !reportData.file}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reports list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Your Reports</h2>
        </div>
        
        {reports.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {reports.map((report) => (
              <li key={report._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{report.title}</h3>
                      <p className="text-sm text-gray-500">
                        {report.type} • {new Date(report.uploadedDate).toLocaleDateString()}
                      </p>
                      {report.notes && (
                        <p className="text-sm text-gray-600 mt-1">{report.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(report.file, report.title)}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
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
    </div>
  );
};

export default MedicalReports; 