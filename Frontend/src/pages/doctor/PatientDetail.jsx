import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Clock, 
  Heart, 
  Activity,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { toast } from 'react-hot-toast';

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setLoading(true);
        const response = await doctorService.getPatientDetails(patientId);
        
        if (response.success) {
          console.log('Patient details:', response.data);
          setPatient(response.data);
        } else {
          setError(response.message || 'Failed to load patient details');
          toast.error(response.message || 'Failed to load patient details');
        }
      } catch (err) {
        console.error('Error fetching patient details:', err);
        setError('Failed to load patient details');
        toast.error('Failed to load patient details');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading patient details...</span>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-6">
        <button 
          onClick={() => navigate('/doctor/patients')}
          className="flex items-center text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Patients
        </button>
        
        <div className="bg-red-50 p-6 rounded-lg shadow text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Patient</h2>
          <p className="text-red-600 mb-4">{error || 'Patient not found'}</p>
          <button 
            onClick={() => navigate('/doctor/patients')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Return to Patients List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button 
        onClick={() => navigate('/doctor/patients')}
        className="flex items-center text-blue-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Patients
      </button>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center">
            <img 
              src={patient.avatar || patient.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`} 
              alt={patient.name} 
              className="h-24 w-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`;
              }}
            />
            <div>
              <h1 className="text-2xl font-bold">{patient.name}</h1>
              <p className="text-gray-600">
                Patient ID: {patient.id || patient.patientId || patient._id}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {patient.age && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    Age: {patient.age}
                  </span>
                )}
                {patient.gender && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                    {patient.gender}
                  </span>
                )}
                {patient.bloodGroup && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    Blood: {patient.bloodGroup}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              {patient.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{patient.phone}</span>
                </div>
              )}
              {patient.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{patient.email}</span>
                </div>
              )}
              {patient.address && (
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <span>{patient.address}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Medical Information</h2>
            <div className="space-y-3">
              {patient.diagnosis && (
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <span>Diagnosis: {patient.diagnosis}</span>
                </div>
              )}
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <span className="font-medium">Allergies:</span>
                    <ul className="list-disc list-inside ml-2">
                      {patient.allergies.map((allergy, index) => (
                        <li key={index}>{allergy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {patient.medicalHistory && (
                <div className="flex items-start">
                  <Activity className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <span className="font-medium">Medical History:</span>
                    <p className="text-gray-700">{patient.medicalHistory}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Appointments Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 bg-blue-50 border-b">
          <h2 className="text-lg font-semibold text-blue-800">Appointment History</h2>
        </div>
        
        <div className="p-6">
          {patient.appointments && patient.appointments.length > 0 ? (
            <div className="space-y-4">
              {patient.appointments.map((appointment, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time || ''}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {appointment.reason || appointment.purpose || 'Regular checkup'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status || 'scheduled'}
                    </span>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No appointment history available.</p>
          )}
        </div>
      </div>
      
      {/* Medical Records Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-blue-50 border-b">
          <h2 className="text-lg font-semibold text-blue-800">Medical Records</h2>
        </div>
        
        <div className="p-6">
          {patient.medicalRecords && patient.medicalRecords.length > 0 ? (
            <div className="space-y-4">
              {patient.medicalRecords.map((record, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{record.title || 'Medical Record'}</h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                    <a 
                      href={record.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                    >
                      View
                    </a>
                  </div>
                  
                  {record.description && (
                    <div className="mt-2 text-sm">
                      {record.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No medical records available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;