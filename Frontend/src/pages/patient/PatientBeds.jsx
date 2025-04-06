import React, { useState, useEffect } from "react";
import { 
  BedDouble, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  PlusCircle,
  User,
  MapPin,
  ArrowRight,
  ArrowLeft,
  X,
  RotateCw,
  Info,
  Building
} from "lucide-react";
import { authService } from "../../services";

const PatientBeds = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBed, setCurrentBed] = useState(null);
  const [bedHistory, setBedHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bedType: "",
    ward: "",
    admissionDate: "",
    expectedStay: "",
    reason: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formProgress, setFormProgress] = useState(33);

  useEffect(() => {
    // Simulate fetching bed data
    const fetchBedData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demo purposes
        const mockCurrentBed = {
          id: "bed123",
          bedNumber: "B-104",
          ward: "General Ward",
          bedType: "Semi-Private",
          admissionDate: "2023-11-15",
          expectedDischargeDate: "2023-11-20",
          status: "active",
          doctor: "Dr. Sarah Johnson",
          location: "East Wing, 3rd Floor",
          roommates: 1
        };
        
        const mockBedHistory = [
          {
            id: "bed789",
            bedNumber: "B-210",
            ward: "Surgical Ward",
            bedType: "Private",
            admissionDate: "2023-08-05",
            dischargeDate: "2023-08-12",
            status: "discharged",
            doctor: "Dr. Michael Wong",
            reason: "Appendectomy recovery"
          },
          {
            id: "bed456",
            bedNumber: "B-105",
            ward: "Emergency Ward",
            bedType: "General",
            admissionDate: "2023-05-22",
            dischargeDate: "2023-05-25",
            status: "discharged",
            doctor: "Dr. James Davis",
            reason: "Acute respiratory infection"
          }
        ];
        
        setCurrentBed(mockCurrentBed);
        setBedHistory(mockBedHistory);
      } catch (err) {
        console.error("Error fetching bed data:", err);
        setError("Failed to load bed data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBedData();
  }, []);

  useEffect(() => {
    // Update form progress based on step
    if (formStep === 1) setFormProgress(33);
    else if (formStep === 2) setFormProgress(66);
    else if (formStep === 3) setFormProgress(100);
  }, [formStep]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextFormStep = () => {
    setFormStep(prev => Math.min(prev + 1, 3));
  };

  const prevFormStep = () => {
    setFormStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message or update UI
      setShowForm(false);
      setFormStep(1);
      
      // In a real app, you would update the state with the new request
      // For now, we'll just log the data
      console.log("Bed request submitted:", formData);
      
      // Reset form
      setFormData({
        bedType: "",
        ward: "",
        admissionDate: "",
        expectedStay: "",
        reason: ""
      });
      
      // Show success message (in a real app, you might use a toast notification)
      alert("Bed request submitted successfully! Hospital staff will contact you soon.");
    } catch (err) {
      console.error("Error submitting bed request:", err);
      alert("Failed to submit bed request. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading bed information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-8 rounded-xl shadow-sm flex flex-col items-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-3">Unable to Load Data</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
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
            <h1 className="text-2xl font-bold text-blue-900">Bed Bookings</h1>
            <p className="text-blue-700 mt-1">Manage your hospital stay and bed reservations</p>
          </div>
          {!currentBed && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 md:mt-0 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
            >
              <PlusCircle size={18} />
              <span>Request New Bed</span>
            </button>
          )}
        </div>
      </div>

      {/* Current Bed */}
      {currentBed ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-100 rounded-full">
              <BedDouble className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Current Bed Assignment</h2>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-auto">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </span>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
              <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-sm">
                <div className="text-5xl font-bold text-blue-600 mb-1">{currentBed.bedNumber}</div>
                <div className="text-sm text-gray-500">Bed Number</div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Ward</p>
                  <p className="font-medium text-gray-800 flex items-center">
                    <Building className="h-4 w-4 text-blue-500 mr-1.5" />
                    {currentBed.ward}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Bed Type</p>
                  <p className="font-medium text-gray-800">{currentBed.bedType}</p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Admission Date</p>
                  <p className="font-medium text-gray-800 flex items-center">
                    <Calendar className="h-4 w-4 text-blue-500 mr-1.5" />
                    {new Date(currentBed.admissionDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Expected Discharge</p>
                  <p className="font-medium text-gray-800 flex items-center">
                    <Calendar className="h-4 w-4 text-blue-500 mr-1.5" />
                    {new Date(currentBed.expectedDischargeDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Attending Doctor</p>
                  <p className="font-medium text-gray-800 flex items-center">
                    <User className="h-4 w-4 text-blue-500 mr-1.5" />
                    {currentBed.doctor}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-800 flex items-center">
                    <Clock className="h-4 w-4 text-blue-500 mr-1.5" />
                    {Math.ceil(
                      (new Date(currentBed.expectedDischargeDate) - new Date(currentBed.admissionDate)) / 
                      (1000 * 60 * 60 * 24)
                    )} days
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                Location Details
              </h3>
              <p className="text-gray-600">{currentBed.location}</p>
              <p className="text-gray-500 text-sm mt-2">
                {currentBed.roommates === 0 
                  ? "Private room (no roommates)" 
                  : `Semi-private room (${currentBed.roommates} roommate${currentBed.roommates > 1 ? 's' : ''})`}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                Important Information
              </h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Visiting hours: 9:00 AM - 8:00 PM</li>
                <li>• Nurse call button is located near your bed</li>
                <li>• Meals are served at 8:00 AM, 12:00 PM, and 6:00 PM</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <div className="inline-flex p-3 rounded-full bg-blue-50 mb-4">
            <BedDouble className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Bed Assignment</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You don't have any current bed bookings. Request a bed if you need to be admitted to the hospital.
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Request a Bed
            </button>
          )}
        </div>
      )}

      {/* Bed Request Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-blue-600" />
              Request a Hospital Bed
            </h2>
            <button 
              onClick={() => {
                setShowForm(false);
                setFormStep(1);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {formStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Step 1: Bed Selection</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bed Type
                    </label>
                    <select
                      name="bedType"
                      value={formData.bedType}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Bed Type</option>
                      <option value="General">General</option>
                      <option value="Semi-Private">Semi-Private</option>
                      <option value="Private">Private</option>
                      <option value="ICU">ICU</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ward
                    </label>
                    <select
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Ward</option>
                      <option value="General Ward">General Ward</option>
                      <option value="Emergency Ward">Emergency Ward</option>
                      <option value="Surgical Ward">Surgical Ward</option>
                      <option value="Pediatric Ward">Pediatric Ward</option>
                      <option value="Maternity Ward">Maternity Ward</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {formStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Step 2: Duration Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Admission Date
                    </label>
                    <input
                      type="date"
                      name="admissionDate"
                      value={formData.admissionDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Length of Stay (days)
                    </label>
                    <input
                      type="number"
                      name="expectedStay"
                      value={formData.expectedStay}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {formStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Step 3: Medical Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Admission
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please describe your medical condition or reason for needing a hospital bed..."
                  ></textarea>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4 border-t border-gray-100">
              {formStep > 1 ? (
                <button
                  type="button"
                  onClick={prevFormStep}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              
              {formStep < 3 ? (
                <button
                  type="button"
                  onClick={nextFormStep}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Submit Request
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Bed History */}
      {bedHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Bed History
            </h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {bedHistory.map((bed) => (
              <div key={bed.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <BedDouble className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800">{bed.bedNumber} • {bed.ward}</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {bed.bedType}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{bed.reason}</p>
                      <p className="text-gray-500 text-sm mt-1">Doctor: {bed.doctor}</p>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="text-gray-800 font-medium">
                      {new Date(bed.admissionDate).toLocaleDateString()} - {new Date(bed.dischargeDate).toLocaleDateString()}
                    </div>
                    <p className="text-gray-500 text-sm">
                      {Math.ceil(
                        (new Date(bed.dischargeDate) - new Date(bed.admissionDate)) / 
                        (1000 * 60 * 60 * 24)
                      )} days
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientBeds; 