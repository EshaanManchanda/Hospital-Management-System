import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const DoctorPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch patients data from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await doctorService.getDoctorPatients();
        
        if (response.success) {
          console.log('Patients data:', response.data);
          setPatients(response.data || []);
        } else {
          setError(response.message || 'Failed to load patients');
          toast.error(response.message || 'Failed to load patients');
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients');
        toast.error('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search term and filter
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') {
      return matchesSearch;
    } else if (selectedFilter === 'upcoming') {
      // Check for upcoming appointments
      return matchesSearch && patient.nextAppointment && new Date(patient.nextAppointment) > new Date();
    } else if (selectedFilter === 'recent') {
      // Check for recent visits (within last month)
      if (!patient.lastVisit) return false;
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return matchesSearch && new Date(patient.lastVisit) > oneMonthAgo;
    }
    
    return matchesSearch;
  });

  // Handle view patient details
  const handleViewPatient = (patientId) => {
    navigate(`/doctor/patients/${patientId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading patients...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Patients</h1>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name, ID, or diagnosis"
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${selectedFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedFilter('all')}
          >
            All Patients
          </button>
          <button
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${selectedFilter === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedFilter('upcoming')}
          >
            Upcoming Appointments
          </button>
          <button
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${selectedFilter === 'recent' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedFilter('recent')}
          >
            Recent Visits
          </button>
        </div>
      </div>
      
      {/* Error state */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Error loading patients</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {/* Patient cards */}
      {patients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.id || patient._id || patient.patientId} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <img 
                    src={patient.avatar || patient.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`} 
                    alt={patient.name} 
                    className="h-12 w-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`;
                    }}
                  />
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">{patient.name}</h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span>
                        {patient.id || patient.patientId || patient._id} • 
                        {patient.age ? ` ${patient.age} yrs •` : ''} 
                        {patient.gender ? ` ${patient.gender}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-2">
                  {patient.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{patient.email}</span>
                    </div>
                  )}
                  {patient.lastVisit && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                    </div>
                  )}
                  {patient.diagnosis && (
                    <div className="flex items-center text-sm">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Diagnosis: {patient.diagnosis}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t">
                <button 
                  className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800"
                  onClick={() => handleViewPatient(patient.id || patient._id || patient.patientId)}
                >
                  <span>View Patient Details</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && !error ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">You don't have any patients yet.</p>
        </div>
      ) : null}
      
      {/* Empty search results */}
      {patients.length > 0 && filteredPatients.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No patients found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;