import React, { useState } from 'react';
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
  X
} from 'lucide-react';

const DoctorProfile = () => {
  // Mock doctor data
  const [doctorData, setDoctorData] = useState({
    id: 'D-10023',
    name: 'Dr. William Chen',
    email: 'william.chen@hospital.com',
    phone: '(555) 123-4567',
    specialty: 'Cardiology',
    experience: '12 years',
    education: [
      'MD, Harvard Medical School, 2010',
      'Residency, Massachusetts General Hospital, 2014',
      'Fellowship in Cardiology, Mayo Clinic, 2016'
    ],
    certifications: [
      'American Board of Internal Medicine',
      'American College of Cardiology',
      'Advanced Cardiac Life Support (ACLS)'
    ],
    schedule: {
      Monday: '9:00 AM - 5:00 PM',
      Tuesday: '9:00 AM - 5:00 PM',
      Wednesday: '9:00 AM - 1:00 PM',
      Thursday: '9:00 AM - 5:00 PM',
      Friday: '9:00 AM - 5:00 PM',
      Saturday: 'Off',
      Sunday: 'Off'
    },
    bio: 'Dr. William Chen is a board-certified cardiologist with over 12 years of experience in diagnosing and treating heart conditions. He specializes in interventional cardiology, heart failure management, and preventive cardiology.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...doctorData });
  
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
  
  const handleSave = () => {
    setDoctorData(editedData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedData({ ...doctorData });
    setIsEditing(false);
  };

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
                className="h-32 w-32 rounded-full mx-auto mb-4"
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
                  <span>{doctorData.phone}</span>
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
                {doctorData.education.map((edu, index) => (
                  <li key={index} className="text-gray-700">{edu}</li>
                ))}
              </ul>
            </div>
            
            {/* Certifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Award className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold">Certifications</h3>
              </div>
              
              <ul className="space-y-2">
                {doctorData.certifications.map((cert, index) => (
                  <li key={index} className="text-gray-700">{cert}</li>
                ))}
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
              {Object.entries(doctorData.schedule).map(([day, hours], index) => (
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