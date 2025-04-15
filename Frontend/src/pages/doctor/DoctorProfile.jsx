import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Award, 
  Briefcase, 
  Calendar, 
  Clock,
  Edit,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { authService } from '../../services/authService';
import { doctorService } from '../../services/doctorService';
import { toast } from 'react-hot-toast';

const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getDoctorProfile();
        
        if (response.success) {
          // Transform API data to match component structure
          const doctor = response.doctor;
          console.log('Doctor data from API:', doctor); // Debug log
          
          // Create a more comprehensive mapping from API response to component data
          const formattedData = {
            id: doctor.doctorId || doctor._id || doctor.id || '',
            name: doctor.user?.name || doctor.name || 'Doctor',
            email: doctor.user?.email || doctor.email || '',
            gender: doctor.user?.gender || doctor.gender || '',
            phone: doctor.user?.mobile || doctor.mobile || doctor.phone || '',
            specialty: doctor.specialization || doctor.specialty || '',
            experience: typeof doctor.experience === 'number' ? `${doctor.experience} years` : doctor.experience || '0 years',
            education: Array.isArray(doctor.qualifications) ? doctor.qualifications : [],
            certifications: Array.isArray(doctor.certifications) ? doctor.certifications : [],
            // Map working days and hours to schedule format
            schedule: Array.isArray(doctor.workingDays) ? 
              doctor.workingDays.reduce((acc, day) => {
                acc[day] = doctor.workingHours ? 
                  `${doctor.workingHours.start || '09:00'} - ${doctor.workingHours.end || '17:00'}` : 
                  '09:00 - 17:00';
                return acc;
              }, {
                Monday: 'Not set',
                Tuesday: 'Not set',
                Wednesday: 'Not set',
                Thursday: 'Not set',
                Friday: 'Not set',
                Saturday: 'Not set',
                Sunday: 'Not set'
              }) : 
              {
                Monday: 'Not set',
                Tuesday: 'Not set',
                Wednesday: 'Not set',
                Thursday: 'Not set',
                Friday: 'Not set',
                Saturday: 'Not set',
                Sunday: 'Not set'
              },
            bio: doctor.about || doctor.bio || 'No bio available',
            avatar: doctor.user?.profileImage || doctor.profileImage || doctor.avatar || 
                   `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || doctor.name || 'Doctor')}&background=random`,
            fee: doctor.fee || 0,
            isAvailable: doctor.isAvailable !== undefined ? doctor.isAvailable : true,
            averageRating: doctor.averageRating || 0,
            patients: Array.isArray(doctor.patients) ? doctor.patients.length : 0
          };
          
          console.log('Formatted doctor data:', formattedData); // Debug log
          setDoctorData(formattedData);
          setEditedData(formattedData);
        } else {
          setError(response.message || 'Failed to load doctor profile');
          // Set default data if API fails
          const userData = authService.getUserData();
          const defaultData = {
            id: userData?.doctorId || 'D-00000',
            name: userData?.name || 'Doctor',
            email: userData?.email || '',
            phone: userData?.mobile || '',
            specialty: userData?.specialization || 'Not specified',
            experience: userData?.experience || '0 years',
            education: [],
            certifications: [],
            schedule: {
              Monday: 'Not set',
              Tuesday: 'Not set',
              Wednesday: 'Not set',
              Thursday: 'Not set',
              Friday: 'Not set',
              Saturday: 'Not set',
              Sunday: 'Not set'
            },
            bio: userData?.about || 'No bio available',
            avatar: userData?.profileImage || 
                   `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'Doctor')}&background=random`,
            fee: 0,
            isAvailable: true,
            averageRating: 0,
            patients: 0
          };
          setDoctorData(defaultData);
          setEditedData(defaultData);
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        setError('Failed to load doctor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value
    });
  };
  
  const handleScheduleChange = (day, value) => {
    setEditedData({
      ...editedData,
      schedule: {
        ...editedData.schedule,
        [day]: value
      }
    });
  };
  
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Transform the edited data back to the format expected by the API
      const updateData = {
        specialization: editedData.specialty,
        experience: parseInt(editedData.experience) || 0,
        fee: parseInt(editedData.fee) || 0,
        about: editedData.bio,
        isAvailable: editedData.isAvailable,
        // Add user data that might need updating
        user: {
          name: editedData.name,
          email: editedData.email,
          mobile: editedData.phone,
          gender: editedData.gender
        }
      };
      
      // Call the API to update the doctor profile
      const response = await doctorService.updateDoctor(doctorData.id, updateData);
      
      if (response.success) {
        // Update the local state with the edited data
        setDoctorData(editedData);
        setIsEditing(false);
        
        // Cache the updated profile in localStorage
        localStorage.setItem('doctorProfile', JSON.stringify(editedData));
        
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setEditedData({ ...doctorData });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error && !doctorData) {
    return (
      <div className="p-6 bg-red-50 rounded-lg text-center">
        <X className="h-12 w-12 text-red-500 mx-auto mb-2" />
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Profile</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctor Profile</h1>
        {!isEditing ? (
          <button 
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button 
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>
            <button 
              className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 text-center border-b">
              <img 
                src={doctorData.avatar} 
                alt={doctorData.name} 
                className="h-32 w-32 rounded-full mx-auto mb-4 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(doctorData.name);
                }}
              />
              <h2 className="text-xl font-semibold">{doctorData.name}</h2>
              <p className="text-gray-600">{doctorData.specialty}</p>
              <p className="text-gray-500 text-sm">{doctorData.id}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded"
                  />
                ) : (
                  <span>{doctorData.email}</span>
                )}
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={editedData.phone}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded"
                  />
                ) : (
                  <span>{doctorData.phone || 'Not provided'}</span>
                )}
              </div>
              
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                {isEditing ? (
                  <input
                    type="text"
                    name="experience"
                    value={editedData.experience}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded"
                  />
                ) : (
                  <span>Experience: {doctorData.experience}</span>
                )}
              </div>
              
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <span>Gender: {doctorData.gender || 'Not specified'}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <span>Consultation Fee: ₹{doctorData.fee}</span>
              </div>
              
              {doctorData.patients > 0 && (
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span>Patients: {doctorData.patients}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={editedData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 border rounded"
              />
            ) : (
              <p className="text-gray-700">{doctorData.bio}</p>
            )}
          </div>
          
          {/* Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Award className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold">Education</h3>
              </div>
              
              <ul className="space-y-2">
                {doctorData.education && doctorData.education.length > 0 ? (
                  doctorData.education.map((edu, index) => (
                    <li key={index} className="text-gray-700">{edu}</li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No education information available</li>
                )}
              </ul>
            </div>
            
            {/* Certifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Award className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold">Certifications</h3>
              </div>
              
              <ul className="space-y-2">
                {doctorData.certifications && doctorData.certifications.length > 0 ? (
                  doctorData.certifications.map((cert, index) => (
                    <li key={index} className="text-gray-700">{cert}</li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No certification information available</li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Schedule */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold">Working Hours</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctorData.schedule && Object.entries(doctorData.schedule).map(([day, hours], index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">{day}</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.schedule[day]}
                      onChange={(e) => handleScheduleChange(day, e.target.value)}
                      className="p-1 border rounded text-sm"
                    />
                  ) : (
                    <span className="text-gray-600">{hours}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;