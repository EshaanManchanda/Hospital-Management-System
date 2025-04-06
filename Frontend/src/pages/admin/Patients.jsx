
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/admin/ui/table";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { Badge } from "@/components/admin/ui/badge";
import { toast } from "@/components/admin/ui/use-toast";
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  Filter, 
  ChevronDown,
  FileText,
  Calendar,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

// Remove TypeScript interfaces and type annotations

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock patients data (would come from an API in a real app)
  const [patients, setPatients] = useState([
    {
      id: "P001",
      name: "John Smith",
      age: 45,
      gender: "Male",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, CA",
      lastVisit: "2023-11-28",
      status: "Active",
    },
    {
      id: "P002",
      name: "Emily Johnson",
      age: 32,
      gender: "Female",
      phone: "(555) 987-6543",
      address: "456 Oak Ave, Somewhere, CA",
      lastVisit: "2023-11-15",
      status: "Active",
    },
    {
      id: "P003",
      name: "Michael Brown",
      age: 58,
      gender: "Male",
      phone: "(555) 456-7890",
      address: "789 Pine Rd, Elsewhere, CA",
      lastVisit: "2023-10-20",
      status: "Inactive",
    },
    {
      id: "P004",
      name: "Sarah Williams",
      age: 29,
      gender: "Female",
      phone: "(555) 789-0123",
      address: "321 Cedar Ln, Nowhere, CA",
      lastVisit: "2023-11-25",
      status: "Active",
    },
    {
      id: "P005",
      name: "David Miller",
      age: 67,
      gender: "Male",
      phone: "(555) 234-5678",
      address: "654 Birch St, Anywhere, CA",
      lastVisit: "2023-09-10",
      status: "Inactive",
    },
  ]);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = () => {
    // In a real application, this would open a modal or navigate to a form
    toast({
      title: "Add Patient",
      description: "This would open a patient registration form.",
    });
  };

  const handleViewPatient = (patientId) => {
    // In a real application, this would navigate to the patient details page
    toast({
      title: "View Patient",
      description: `Viewing patient with ID: ${patientId}`,
    });
  };

  const handleEditPatient = (patientId) => {
    // In a real application, this would open a modal or navigate to a form
    toast({
      title: "Edit Patient",
      description: `Editing patient with ID: ${patientId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Patients</h1>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
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
              <DropdownMenuItem>All Patients</DropdownMenuItem>
              <DropdownMenuItem>Active Patients</DropdownMenuItem>
              <DropdownMenuItem>Inactive Patients</DropdownMenuItem>
              <DropdownMenuItem>Recent Visits</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className="bg-hospital-primary hover:bg-hospital-accent"
            onClick={handleAddPatient}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Last Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.phone}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.lastVisit}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-normal",
                          patient.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        )}
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewPatient(patient.id)}
                          title="View Patient"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toast({
                            title: "Schedule Appointment",
                            description: `Scheduling appointment for ${patient.name}`,
                          })}
                          title="Schedule Appointment"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toast({
                            title: "Contact Patient",
                            description: `Contacting ${patient.name} at ${patient.phone}`,
                          })}
                          title="Contact Patient"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditPatient(patient.id)}>
                              Edit Patient
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({
                              title: "View Medical Records",
                              description: `Viewing medical records for ${patient.name}`,
                            })}>
                              Medical Records
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({
                              title: "View Billing History",
                              description: `Viewing billing history for ${patient.name}`,
                            })}>
                              Billing History
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No patients found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Patients;
