import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Search,
  Check,
  X,
  FileText
} from 'lucide-react';

const DoctorAppointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('today'); // 'today', 'upcoming', 'past'
  
  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      patientName: 'John Smith',
      patientId: 'P-10023',
      time: '09:00 AM',
      date: '2023-06-15',
      status: 'confirmed',
      reason: 'Annual checkup',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      patientName: 'Maria Garcia',
      patientId: 'P-10045',
      time: '10:30 AM',
      date: '2023-06-15',
      status: 'confirmed',
      reason: 'Follow-up appointment',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      patientId: 'P-10089',
      time: '02:00 PM',
      date: '2023-06-15',
      status: 'cancelled',
      reason: 'Chest pain',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    {
      id: 4,
      patientName: 'Emily Wilson',
      patientId: 'P-10112',
      time: '03:30 PM',
      date: '2023-06-15',
      status: 'completed',
      reason: 'Prescription renewal',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg'
    }
  ];

  // Filter appointments based on search term and view
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter based on view
    if (view === 'today') {
      return matchesSearch; // In a real app, you'd filter by today's date
    } else if (view === 'upcoming') {
      return matchesSearch; // In a real app, you'd filter by future dates
    } else {
      return matchesSearch; // In a real app, you'd filter by past dates
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients"
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${view === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setView('today')}
          >
            Today
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${view === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setView('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${view === 'past' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setView('past')}
          >
            Past
          </button>
        </div>
      </div>
      
      {/* Date navigation */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-600" />
          <span className="font-medium">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        
        <button className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      {/* Appointments list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={appointment.avatar} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                      <div className="text-sm text-gray-500">{appointment.patientId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{appointment.time}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.reason}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <FileText className="h-5 w-5" />
                    </button>
                    {appointment.status === 'confirmed' && (
                      <>
                        <button className="text-green-600 hover:text-green-900">
                          <Check className="h-5 w-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointments; 