import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Loader2 } from "lucide-react";
import { authService, patientService } from "../../services";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { FaUser, FaWeight, FaRulerVertical, FaTint } from 'react-icons/fa';

const PatientProfile = () => {
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

  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if this is a setup mode (from Google OAuth)
  const isSetupMode = new URLSearchParams(location.search).get('setup') === 'true';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userData = authService.getUserData();
        
        if (!userData || !userData.patientId) {
          throw new Error("Patient information not found");
        }
        
        const response = await patientService.getPatientById(userData.patientId);
        setProfile(response.data);
        setFormData({
          name: response.data.user?.name || "",
          email: response.data.user?.email || "",
          phone: response.data.contactNumber || "",
          address: response.data.address || "",
          birthdate: response.data.dateOfBirth ? new Date(response.data.dateOfBirth).toISOString().split('T')[0] : "",
          gender: response.data.gender || "",
          bloodGroup: response.data.bloodGroup || "",
          height: response.data.height || "",
          weight: response.data.weight || "",
          allergies: response.data.allergies?.join(", ") || "",
          chronicDiseases: response.data.chronicDiseases?.join(", ") || ""
        });
        
        // If in setup mode, automatically go into editing mode
        if (isSetupMode) {
          setEditing(true);
          toast.info('Please complete your profile information. Required fields are marked with *', { duration: 5000 });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
        
        // If in setup mode, don't show error as the profile doesn't exist yet
        if (!isSetupMode) {
          toast.error('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isSetupMode]);

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
      
      // Create/update profile data
      const profileData = {
        bloodGroup: formData.bloodGroup,
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        allergies: allergiesArray,
        chronicDiseases: chronicDiseasesArray
      };
      
      let response;
      if (profile?._id) {
        // Update existing profile
        response = await api.put('/api/patients/profile', profileData);
      } else {
        // Create new profile
        response = await api.post('/api/patients/profile', profileData);
      }
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setEditing(false);
        fetchProfile();
        
        // If this was the initial setup, redirect to the dashboard
        if (isSetupMode) {
          navigate('/patient-dashboard');
        }
      } else {
        toast.error(response.data.message || 'Failed to update profile');
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
    setFormData({
      name: profile.user?.name || "",
      email: profile.user?.email || "",
      phone: profile.contactNumber || "",
      address: profile.address || "",
      birthdate: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
      gender: profile.gender || "",
      bloodGroup: profile.bloodGroup || "",
      height: profile.height || "",
      weight: profile.weight || "",
      allergies: profile.allergies?.join(", ") || "",
      chronicDiseases: profile.chronicDiseases?.join(", ") || ""
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <span className="ml-3 text-lg text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl text-center">
        <X className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {isSetupMode ? 'Complete Your Profile' : 'Patient Profile'}
            </h1>
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
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image and Basic Info */}
            <div className="w-full md:w-1/3">
              <div className="text-center mb-6">
                <div className="bg-gray-100 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-500" />
                </div>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="text-xl font-semibold text-gray-800 text-center border-b border-gray-300 pb-1 w-full"
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-gray-800">{profile.user?.name}</h2>
                )}
                <p className="text-gray-500">Patient ID: {profile._id?.substring(0, 8)}</p>
              </div>
              
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Email</p>
                      {editing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border-b border-gray-300 pb-1"
                        />
                      ) : (
                        <p className="text-gray-800">{profile.user?.email}</p>
                      )}
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
                          className="w-full border-b border-gray-300 pb-1"
                        />
                      ) : (
                        <p className="text-gray-800">{profile.contactNumber || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Address</p>
                      {editing ? (
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full border rounded-md p-2"
                          rows="3"
                        />
                      ) : (
                        <p className="text-gray-800">{profile.address || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Medical Information */}
            <div className="w-full md:w-2/3">
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
                        <span>{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not provided"}</span>
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
                      <p className="text-gray-800">{profile.gender || "Not provided"}</p>
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
                      <input
                        type="text"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-800">{profile.bloodGroup || "Not provided"}</p>
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
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-800">{profile.height || "Not provided"}</p>
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
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-800">{profile.weight || "Not provided"}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Allergies</p>
                  {editing ? (
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      className="w-full border rounded-md p-2"
                      placeholder="Enter allergies separated by commas"
                      rows="3"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.allergies && profile.allergies.length > 0 ? (
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
                  <p className="text-sm text-gray-500 mb-1">Chronic Diseases</p>
                  {editing ? (
                    <textarea
                      name="chronicDiseases"
                      value={formData.chronicDiseases}
                      onChange={handleChange}
                      className="w-full border rounded-md p-2"
                      placeholder="Enter chronic diseases separated by commas"
                      rows="3"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.chronicDiseases && profile.chronicDiseases.length > 0 ? (
                        profile.chronicDiseases.map((disease, index) => (
                          <span 
                            key={index}
                            className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                          >
                            {disease}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No chronic diseases listed</p>
                      )}
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