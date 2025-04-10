import React, { useState, useEffect } from "react";
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
  MoreHorizontal,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/admin/ui/use-toast";
import { medicalRecordService } from "@/services";

const Records = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    pending: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("All Records");

  // Fetch medical records from the API
  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setIsLoading(true);
        const response = await medicalRecordService.getAllMedicalRecords();
        
        // If API returns formatted data, use it directly
        if (response && response.records) {
          setRecords(response.records);
          
          // Update stats if available in response
          if (response.stats) {
            setStats({
              total: response.stats.total || 0,
              thisWeek: response.stats.thisWeek || 0,
              pending: response.stats.pending || 0
            });
          }
        } else {
          // Fallback to our mock data if API doesn't return expected format
          console.warn("API response format unexpected, using fallback data");
          // Keep the existing mock data
        }
      } catch (error) {
        console.error("Error fetching medical records:", error);
        toast({
          title: "Error",
          description: "Failed to load medical records. Using sample data instead.",
          variant: "destructive"
        });
        
        // Fallback to mock data on error
        setRecords([
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
        
        // Set default stats for fallback data
        setStats({
          total: 1248,
          thisWeek: 87,
          pending: 24
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [toast]);

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

  // Filter records based on search term and selected filter
  const filteredRecords = records.filter(record => {
    // Search filter
    const matchesSearch = 
      record.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recordType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = 
      currentFilter === "All Records" || 
      record.recordType === currentFilter;
    
    return matchesSearch && matchesType;
  });

  // Handle creating a new medical record
  const handleCreateRecord = async () => {
    toast({
      title: "Create Record",
      description: "This functionality will be implemented soon."
    });
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

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
                <span className="hidden sm:inline">Filter: {currentFilter}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilterChange("All Records")}>All Records</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("Lab Results")}>Lab Results</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("Consultation")}>Consultations</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("Radiology")}>Radiology</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("Prescription")}>Prescriptions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("Procedure")}>Procedures</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className="bg-hospital-primary hover:bg-hospital-accent"
            onClick={handleCreateRecord}
          >
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
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Records This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
            <p className="text-xs text-gray-500 mt-1">+5% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-gray-500 mt-1">-3% from last week</p>
          </CardContent>
        </Card>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-hospital-primary" />
          <span className="ml-2">Loading records...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map(record => (
              <Card key={record.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{record.patientName}</h3>
                          <div className="text-sm text-gray-500 mt-1">
                            ID: {record.patientId}
                          </div>
                        </div>
                        <Badge className={statusStyles[record.status] || "bg-gray-100"}>
                          {record.status}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                          {recordTypeIcons[record.recordType] || <FileText className="h-4 w-4 text-gray-500" />}
                          <span className="text-sm ml-1.5">{record.recordType}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm ml-1.5">{record.doctor}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm ml-1.5">{record.date}</span>
                        </div>
                      </div>
                      
                      <p className="mt-2 text-sm">{record.description}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 flex sm:flex-col justify-end items-center gap-2 sm:w-20">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center p-8">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium">No records found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm ? "Try adjusting your search or filters" : "Start by adding a new medical record"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Records;
