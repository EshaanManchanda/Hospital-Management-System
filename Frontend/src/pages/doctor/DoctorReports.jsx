import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Calendar, 
  Printer, 
  Download, 
  Edit, 
  FilePlus
} from 'lucide-react';

const DoctorReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Mock data for medical reports
  const reports = [
    {
      id: 'RPT-10023',
      patientName: 'John Smith',
      patientId: 'P-10023',
      title: 'Annual Checkup Report',
      date: '2023-05-10',
      type: 'Checkup',
      summary: 'Patient shows normal vitals with slightly elevated blood pressure (140/85). Recommended lifestyle changes and follow-up in 3 months.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 'RPT-10045',
      patientName: 'Maria Garcia',
      patientId: 'P-10045',
      title: 'Diabetes Management Report',
      date: '2023-06-02',
      type: 'Follow-up',
      summary: 'HbA1c levels decreased to 6.8% (from 7.2%). Current medication regime is effective. Recommended continuing with the same treatment.',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    {
      id: 'RPT-10089',
      patientName: 'Robert Johnson',
      patientId: 'P-10089',
      title: 'Arthritis Evaluation',
      date: '2023-05-15',
      type: 'Specialist',
      summary: 'Moderate osteoarthritis in both knees. Prescribed pain management and physical therapy. Considering steroid injections if pain persists.',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    {
      id: 'RPT-10112',
      patientName: 'Emily Wilson',
      patientId: 'P-10112',
      title: 'Asthma Assessment',
      date: '2023-06-10',
      type: 'Emergency',
      summary: 'Patient experienced moderate asthma attack. Administered nebulizer treatment in office. Adjusted maintenance inhaler dosage and provided action plan.',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg'
    }
  ];

  // Filter reports based on search term and filter
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && report.type.toLowerCase() === filter.toLowerCase();
    }
  });

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'checkup':
        return 'bg-blue-100 text-blue-800';
      case 'follow-up':
        return 'bg-green-100 text-green-800';
      case 'specialist':
        return 'bg-purple-100 text-purple-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Reports</h1>
        <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          <FilePlus className="h-4 w-4 mr-2" />
          New Report
        </button>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports"
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${filter === 'checkup' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setFilter('checkup')}
          >
            Checkup
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${filter === 'follow-up' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setFilter('follow-up')}
          >
            Follow-up
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${filter === 'emergency' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setFilter('emergency')}
          >
            Emergency
          </button>
        </div>
      </div>
      
      {/* Reports list */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b">
              <div className="flex items-center mb-3 md:mb-0">
                <img src={report.avatar} alt={report.patientName} className="h-12 w-12 rounded-full" />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-900">{report.title}</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{report.patientName}</span>
                    <span className="mx-2">•</span>
                    <span>{report.patientId}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                  {report.type}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(report.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-700">{report.summary}</p>
            </div>
            
            <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
              <button className="flex items-center px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-gray-200">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button className="flex items-center px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-gray-200">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </button>
              <button className="flex items-center px-3 py-1 text-sm rounded-md text-blue-600 hover:bg-blue-50">
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredReports.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No reports found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorReports; 