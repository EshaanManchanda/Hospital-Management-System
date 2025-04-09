import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  Pill, 
  Clock, 
  FilePlus, 
  Edit,
  Trash,
  Download
} from 'lucide-react';

const DoctorPrescriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('active');
  
  // Mock prescription data
  const prescriptions = [
    {
      id: 'RX-10023',
      patientName: 'John Smith',
      patientId: 'P-10023',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: '2023-05-10',
      endDate: '2023-08-10',
      status: 'active',
      instructions: 'Take with food in the morning',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 'RX-10045',
      patientName: 'Maria Garcia',
      patientId: 'P-10045',
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2023-05-15',
      endDate: '2023-11-15',
      status: 'active',
      instructions: 'Take with meals',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    {
      id: 'RX-10089',
      patientName: 'Robert Johnson',
      patientId: 'P-10089',
      medication: 'Ibuprofen',
      dosage: '400mg',
      frequency: 'Three times daily',
      startDate: '2023-04-20',
      endDate: '2023-05-20',
      status: 'expired',
      instructions: 'Take with food as needed for pain',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    {
      id: 'RX-10112',
      patientName: 'Emily Wilson',
      patientId: 'P-10112',
      medication: 'Albuterol',
      dosage: '90mcg',
      frequency: 'As needed',
      startDate: '2023-06-01',
      endDate: '2024-06-01',
      status: 'active',
      instructions: 'Use inhaler for shortness of breath',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg'
    }
  ];

  // Filter prescriptions based on search term and selected filter
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && prescription.status === selectedFilter;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          <FilePlus className="h-4 w-4 mr-2" />
          New Prescription
        </button>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search prescriptions"
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
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${selectedFilter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedFilter('active')}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${selectedFilter === 'expired' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedFilter('expired')}
          >
            Expired
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${selectedFilter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedFilter('pending')}
          >
            Pending
          </button>
        </div>
      </div>
      
      {/* Prescription cards */}
      <div className="space-y-4">
        {filteredPrescriptions.map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <img src={prescription.avatar} alt={prescription.patientName} className="h-12 w-12 rounded-full" />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-900">{prescription.patientName}</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{prescription.patientId}</span>
                    <span className="mx-2">•</span>
                    <span className={`px-2 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-1 rounded-full text-blue-500 hover:bg-blue-50">
                  <Edit className="h-5 w-5" />
                </button>
                <button className="p-1 rounded-full text-red-500 hover:bg-red-50">
                  <Trash className="h-5 w-5" />
                </button>
                <button className="p-1 rounded-full text-green-500 hover:bg-green-50">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Pill className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Medication</span>
                  </div>
                  <p className="text-sm font-medium">{prescription.medication} - {prescription.dosage}</p>
                </div>
                
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Frequency</span>
                  </div>
                  <p className="text-sm font-medium">{prescription.frequency}</p>
                </div>
                
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Start Date</span>
                  </div>
                  <p className="text-sm font-medium">{new Date(prescription.startDate).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>End Date</span>
                  </div>
                  <p className="text-sm font-medium">{new Date(prescription.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <span>Instructions</span>
                </div>
                <p className="text-sm">{prescription.instructions}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredPrescriptions.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No prescriptions found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptions; 