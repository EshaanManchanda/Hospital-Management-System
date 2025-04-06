
import React, { useState } from "react";
import { Button } from "@/components/admin/ui/button";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/admin/ui/dropdown-menu";
import { Input } from "@/components/admin/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  Plus,
  FileText, 
  User, 
  Calendar, 
  Activity,
  Pill,
  Stethoscope,
  Clipboard,
  MoreHorizontal 
} from "lucide-react";

const Records = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for medical records
  const [records, setRecords] = useState([
    {
      id: "REC001",
      patientName: "John Smith",
      patientId: "P001",
      recordType: "Lab Results",
      date: "2023-11-28",
      doctor: "Dr. Williams",
      status: "reviewed",
      description: "Complete blood count and metabolic panel",
    },
    {
      id: "REC002",
      patientName: "Emily Johnson",
      patientId: "P002",
      recordType: "Consultation",
      date: "2023-11-27",
      doctor: "Dr. Martinez",
      status: "pending",
      description: "Initial cardiology consultation",
    },
    {
      id: "REC003",
      patientName: "Michael Davis",
      patientId: "P003",
      recordType: "Radiology",
      date: "2023-11-26",
      doctor: "Dr. Thompson",
      status: "reviewed",
      description: "Chest X-ray findings",
    },
    {
      id: "REC004",
      patientName: "Sarah Wilson",
      patientId: "P004",
      recordType: "Prescription",
      date: "2023-11-25",
      doctor: "Dr. Johnson",
      status: "active",
      description: "Medication renewal for hypertension",
    },
    {
      id: "REC005",
      patientName: "Robert Brown",
      patientId: "P005",
      recordType: "Procedure",
      date: "2023-11-24",
      doctor: "Dr. Williams",
      status: "completed",
      description: "Minor surgical procedure report",
    },
    {
      id: "REC006",
      patientName: "Jennifer Lee",
      patientId: "P006",
      recordType: "Lab Results",
      date: "2023-11-23",
      doctor: "Dr. Garcia",
      status: "pending",
      description: "Lipid panel and HbA1c test results",
    },
  ]);

  // Icons for different record types
  const recordTypeIcons = {
    "Lab Results": <Clipboard className="h-4 w-4" />,
    "Consultation": <Stethoscope className="h-4 w-4" />,
    "Radiology": <Activity className="h-4 w-4" />,
    "Prescription": <Pill className="h-4 w-4" />,
    "Procedure": <FileText className="h-4 w-4" />,
  };

  // Color styles for different statuses
  const statusStyles = {
    "reviewed": "bg-green-100 text-green-800",
    "pending": "bg-amber-100 text-amber-800",
    "active": "bg-blue-100 text-blue-800",
    "completed": "bg-purple-100 text-purple-800",
  };

  // Filter records based on search term
  const filteredRecords = records.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Medical Records</h1>
          <p className="text-gray-600">View and manage patient medical records</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search records..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Records</DropdownMenuItem>
              <DropdownMenuItem>Lab Results</DropdownMenuItem>
              <DropdownMenuItem>Consultations</DropdownMenuItem>
              <DropdownMenuItem>Radiology</DropdownMenuItem>
              <DropdownMenuItem>Prescriptions</DropdownMenuItem>
              <DropdownMenuItem>Procedures</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-hospital-primary hover:bg-hospital-accent">
            <Plus className="h-4 w-4 mr-2" />
            New Record
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Records This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-gray-500 mt-1">+5% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500 mt-1">-3% from last week</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <Card key={record.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        {recordTypeIcons[record.recordType] || <FileText className="h-4 w-4" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{record.recordType}</h3>
                        <p className="text-sm text-gray-500">ID: {record.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={statusStyles[record.status]}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Record</DropdownMenuItem>
                          <DropdownMenuItem>Edit Record</DropdownMenuItem>
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                          <DropdownMenuItem>Print Record</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">{record.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Patient</p>
                        <p className="text-sm font-medium">{record.patientName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Doctor</p>
                        <p className="text-sm font-medium">{record.doctor}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-medium">{record.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center sm:justify-end">
                      <Button variant="outline" size="sm" className="h-8">
                        <Download className="h-3 w-3 mr-1" />
                        <span className="text-xs">Download</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Records;
