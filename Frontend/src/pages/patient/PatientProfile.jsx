import React, { useState, useEffect, useContext } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Loader2 } from "lucide-react";
import { authService } from "../../services";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { FaUser, FaWeight, FaRulerVertical, FaTint } from 'react-icons/fa';
import { AuthContext } from "../../contexts/AuthContext";
import { Skeleton } from "../../components/admin/ui/skeleton";
import { patientService } from '../../services/patientService'; // Add this import

const PatientProfile = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthdate: '',
    gender: '',
    bloodGroup: '',
    height: '',
    weight: '',
    allergies: '',
    chronicDiseases: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const userData = user;
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if this is a setup mode (from Google OAuth)
  const isSetupMode = new URLSearchParams(location.search).get('setup') === 'true';

  console.log("PatientProfile - userData:", userData);
  console.log("PatientProfile - patientId:", userData?.patientId);

const fetchPatientData = async () => {
  console.log("fetchPatientData - Starting to fetch with patientId:", userData?.patientId);
  
  try {
    setLoading(true);
    
    // Get patient ID from either userData or localStorage
    const patientId = userData?.patientId || authService.getUserData()?.patientId;
    
    if (!patientId) {
      console.error("No patientId found");
      setError("Patient profile not found. Please ensure you're logged in as a patient.");
      
      if (isSetupMode) {
        console.log("Setup mode detected, showing empty profile form");
        setProfile({});
        setEditing(true);
      }
      return;
    }

    console.log("Fetching patient data with ID:", patientId);
    
    const response = await patientService.getPatientById(patientId);
    console.log("Patient data response:", response);
    
    if (response.success) {
      setProfile(response.patient);
      setFormData({
        name: response.patient.user?.name || "",
        email: response.patient.user?.email || "",
        phone: response.patient.user?.mobile || "",
        address: `${response.patient.user?.address?.street || ""}, ${response.patient.user?.address?.city || ""}, ${response.patient.user?.address?.state || ""}, ${response.patient.user?.address?.zipCode || ""}, ${response.patient.user?.address?.country || ""}`,
        birthdate: response.patient.user?.dateOfBirth ? new Date(response.patient.user.dateOfBirth).toISOString().split('T')[0] : "",
        gender: response.patient.user?.gender || "",
        bloodGroup: response.patient.bloodGroup || "",
        height: response.patient.height || "",
        weight: response.patient.weight || "",
        allergies: response.patient.allergies?.join(", ") || "",
        chronicDiseases: response.patient.chronicDiseases?.join(", ") || "",
        emergencyContactName: response.patient.emergencyContact?.name || "",
        emergencyContactPhone: response.patient.emergencyContact?.phone || "",
        emergencyContactRelationship: response.patient.emergencyContact?.relationship || "",
        notes: response.patient.notes || ""
      });
      
      if (isSetupMode) {
        setEditing(true);
        toast.info('Please complete your profile information. Required fields are marked with *', { duration: 5000 });
      }
    } else {
      if (isSetupMode) {
        setProfile({});
        setEditing(true);
      } else {
        setError(response.message || "Failed to load profile data");
      }
    }
  } catch (error) {
    console.error("Error in fetchPatientData:", error);
    
    if (isSetupMode) {
      setProfile({});
      setEditing(true);
    } else {
      setError("An unexpected error occurred. Please try again later.");
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (authLoading) {
      console.log("Auth is still loading, waiting...");
      return;
    }
    
    console.log("Auth loading complete, fetching patient data");
    fetchPatientData();
  }, [userData, isSetupMode, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
  
      // Convert comma-separated strings to arrays
      const allergiesArray = formData.allergies ? formData.allergies.split(',').map(item => item.trim()) : [];
      const chronicDiseasesArray = formData.chronicDiseases ? formData.chronicDiseases.split(',').map(item => item.trim()) : [];
  
      // Prepare the updated patient data
      const profileData = {
        user: {
          name: formData.name,
          email: formData.email,
          mobile: formData.phone,
          gender: formData.gender,
          dateOfBirth: formData.birthdate,
          address: {
            street: formData.address.split(",")[0]?.trim() || "",
            city: formData.address.split(",")[1]?.trim() || "",
            state: formData.address.split(",")[2]?.trim() || "",
            zipCode: formData.address.split(",")[3]?.trim() || "",
            country: formData.address.split(",")[4]?.trim() || "",
          }
        },
        bloodGroup: formData.bloodGroup,
        height: parseInt(formData.height) || 0,
        weight: parseInt(formData.weight) || 0,
        allergies: allergiesArray,
        chronicDiseases: chronicDiseasesArray,
        emergencyContact: {
          name: formData.emergencyContactName || "",
          phone: formData.emergencyContactPhone || "",
          relationship: formData.emergencyContactRelationship || "",
        },
        notes: formData.notes || "",
      };
  
      let response;
      if (profile?._id) {
        response = await patientService.updatePatient(profile._id, profileData);
        
        if (response.success) {
          // Update the local profile state with the new data
          setProfile(response.patient);
          
          // Update formData with the new values
          setFormData({
            name: response.patient.user?.name || "",
            email: response.patient.user?.email || "",
            phone: response.patient.user?.mobile || "",
            address: response.patient.user?.address ? 
              `${response.patient.user.address.street}, ${response.patient.user.address.city}, ${response.patient.user.address.state}, ${response.patient.user.address.zipCode}, ${response.patient.user.address.country}`
              : "",
            birthdate: response.patient.user?.dateOfBirth ? 
              new Date(response.patient.user.dateOfBirth).toISOString().split('T')[0] 
              : "",
            gender: response.patient.user?.gender || "",
            bloodGroup: response.patient.bloodGroup || "",
            height: response.patient.height || "",
            weight: response.patient.weight || "",
            allergies: response.patient.allergies?.join(", ") || "",
            chronicDiseases: response.patient.chronicDiseases?.join(", ") || "",
            emergencyContactName: response.patient.emergencyContact?.name || "",
            emergencyContactPhone: response.patient.emergencyContact?.phone || "",
            emergencyContactRelationship: response.patient.emergencyContact?.relationship || "",
            notes: response.patient.notes || ""
          });
  
          toast.success('Profile updated successfully');
          setEditing(false);
  
          // If this was the initial setup, redirect to the dashboard
          if (isSetupMode) {
            navigate('/patient-dashboard');
          }
        } else {
          toast.error(response.message || 'Failed to update profile');
        }
      } else {
        // Handle create new patient case
        response = await patientService.createPatient(profileData);
        if (response.success) {
          setProfile(response.patient);
          toast.success('Profile created successfully');
          setEditing(false);
          if (isSetupMode) {
            navigate('/patient-dashboard');
          }
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };
  

  const handleCancel = () => {
    // Reset form data to current profile values
    if (profile) {
      setFormData({
        name: profile.user?.name || "",
        email: profile.user?.email || "",
        phone: profile.user?.mobile || "",
        address: profile.user?.address ? 
          `${profile.user.address.street}, ${profile.user.address.city}, ${profile.user.address.state}, ${profile.user.address.zipCode}, ${profile.user.address.country}`
          : "",
        birthdate: profile.user?.dateOfBirth ? 
          new Date(profile.user.dateOfBirth).toISOString().split('T')[0] 
          : "",
        gender: profile.user?.gender || "",
        bloodGroup: profile.bloodGroup || "",
        height: profile.height || "",
        weight: profile.weight || "",
        allergies: profile.allergies?.join(", ") || "",
        chronicDiseases: profile.chronicDiseases?.join(", ") || ""
      });
    }
    setEditing(false);
  };

  // If auth is still loading, show a loading indicator
  if (authLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <span className="ml-3 text-lg text-gray-600">Checking authentication...</span>
      </div>
    );
  }

  // If data is loading, show a loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <span className="ml-3 text-lg text-gray-600">Loading profile...</span>
      </div>
    );
  }

  // If there's an error, show it
  if (error && !isSetupMode && !editing) {
    return (
      <div className="bg-red-50 p-6 rounded-xl text-center">
        <X className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => fetchPatientData()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="flex items-center gap-4 mb-4 lg:mb-0">
              <div className="bg-white/20 rounded-full p-3">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {isSetupMode ? 'Complete Your Profile' : 'My Profile'}
                </h1>
                <p className="text-blue-100">Manage your personal and medical information</p>
              </div>
            </div>
            {!editing && !isSetupMode && (
              <button 
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Image and Basic Info */}
              <div className="w-full lg:w-1/3">
                <div className="text-center mb-6">
                  <div className="bg-gray-100 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">{profile?.user?.name || "User"}</h2>
                  <p className="text-gray-500">Patient ID: {profile?._id?.substring(0, 8) || "N/A"}</p>
                </div>
                
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800">{profile?.user?.email || "Not provided"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Phone</p>
                        {editing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2 mt-1"
                            placeholder="Enter phone number"
                          />
                        ) : (
                          <p className="text-gray-800">{profile?.user?.mobile || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                    
                    
                  </div>
                </div>
              </div>
              
              {/* Medical Information */}
              <div className="w-full lg:w-2/3">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Birthdate</p>
                      {editing ? (
                        <input
                          type="date"
                          name="birthdate"
                          value={formData.birthdate}
                          onChange={handleChange}
                          className="w-full border rounded-md p-2"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-500" />
                          <span className="text-gray-800"> {profile?.user?.dateOfBirth ? new Date(profile.user.dateOfBirth).toLocaleDateString() : "Not provided"}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Gender</p>
                      {editing ? (
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full border rounded-md p-2"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-800">{profile?.user?.gender || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Medical Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Blood Group</p>
                      {editing ? (
                        <select
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          className="w-full border rounded-md p-2"
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      ) : (
                        <p className="text-lg font-semibold text-gray-800">{profile?.bloodGroup || "Not provided"}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Height (cm)</p>
                      {editing ? (
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          className="w-full border rounded-md p-2"
                          min="0"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-800">{profile?.height || "Not provided"}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Weight (kg)</p>
                      {editing ? (
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          className="w-full border rounded-md p-2"
                          min="0"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-800">{profile?.weight || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-1">Allergies</p>
                    {editing ? (
                      <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                        placeholder="Enter allergies separated by commas"
                        rows="2"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile?.allergies && profile.allergies.length > 0 ? (
                          profile.allergies.map((allergy, index) => (
                            <span 
                              key={index}
                              className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                            >
                              {allergy}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No known allergies</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Chronic Conditions</p>
                    {editing ? (
                      <textarea
                        name="chronicDiseases"
                        value={formData.chronicDiseases}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                        placeholder="Enter chronic conditions separated by commas"
                        rows="2"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile?.chronicDiseases && profile.chronicDiseases.length > 0 ? (
                          profile.chronicDiseases.map((disease, index) => (
                            <span 
                              key={index}
                              className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                            >
                              {disease}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No chronic conditions listed</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {editing && (
                    <div className="mt-8 flex justify-end gap-4">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={saveLoading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                        disabled={saveLoading}
                      >
                        {saveLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientProfile;