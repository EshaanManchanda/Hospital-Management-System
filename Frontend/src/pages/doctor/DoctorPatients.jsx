import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  ChevronRight 
} from 'lucide-react';

const DoctorPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for patients
  const patients = [
    {
      id: 'P-10023',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      phone: '(555) 123-4567',
      email: 'john.smith@example.com',
      lastVisit: '2023-05-20',
      nextAppointment: '2023-06-25',
      diagnosis: 'Hypertension',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 'P-10045',
      name: 'Maria Garcia',
      age: 38,
      gender: 'Female',
      phone: '(555) 987-6543',
      email: 'maria.garcia@example.com',
      lastVisit: '2023-06-02',
      nextAppointment: '2023-07-10',
      diagnosis: 'Type 2 Diabetes',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    {
      id: 'P-10089',
      name: 'Robert Johnson',
      age: 62,
      gender: 'Male',
      phone: '(555) 456-7890',
      email: 'robert.johnson@example.com',
      lastVisit: '2023-05-15',
      nextAppointment: '2023-07-05',
      diagnosis: 'Arthritis',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    {
      id: 'P-10112',
      name: 'Emily Wilson',
      age: 29,
      gender: 'Female',
      phone: '(555) 234-5678',
      email: 'emily.wilson@example.com',
      lastVisit: '2023-06-10',
      nextAppointment: '2023-06-30',
      diagnosis: 'Asthma',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg'
    }
  ];

  // Filter patients based on search term and filter
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') {
      return matchesSearch;
    } else if (selectedFilter === 'upcoming') {
      // In a real app, you would use a proper date comparison
      return matchesSearch && new Date(patient.nextAppointment) > new Date();
    } else if (selectedFilter === 'recent') {
      // In a real app, you would use a proper date comparison
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return matchesSearch && new Date(patient.lastVisit) > oneMonthAgo;
    }
    
    return matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patients</h1>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name or ID"
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${selectedFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedFilter('all')}
          >
            All Patients
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${selectedFilter === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedFilter('upcoming')}
          >
            Upcoming Appointments
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${selectedFilter === 'recent' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedFilter('recent')}
          >
            Recent Visits
          </button>
        </div>
      </div>
      
      {/* Patient cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <img src={patient.avatar} alt={patient.name} className="h-12 w-12 rounded-full" />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-900">{patient.name}</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span>{patient.id} • {patient.age} yrs • {patient.gender}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Diagnosis: {patient.diagnosis}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t">
              <button className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800">
                <span>View Patient Details</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredPatients.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No patients found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients; 