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
  Phone,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PatientFormDialog from "@/components/dialogs/PatientFormDialog";
import ViewPatientDialog from "@/components/dialogs/PatientDetailsDialog";
import PatientDeleteDialog from "@/components/dialogs/PatientDeleteDialog";
import PatientMedicalRecordsDialog from "@/components/dialogs/PatientMedicalRecordsDialog";

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [patientFormOpen, setPatientFormOpen] = useState(false);
  const [viewPatientOpen, setViewPatientOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [medicalRecordsOpen, setMedicalRecordsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  
  // Mock patients data (would come from an API in a real app)
  const [patients, setPatients] = useState([
    {
      _id: "P001",
      user: {
        name: "John Smith",
        email: "john.smith@example.com",
        mobile: "(555) 123-4567",
        gender: "male",
        dateOfBirth: "1978-05-12",
        address: "123 Main St, Anytown, CA"
      },
      bloodType: "O+",
      height: 175,
      weight: 80,
      lastVisit: "2023-11-28",
      status: "Active",
      allergies: ["Penicillin"],
      chronicConditions: ["Hypertension", "Diabetes Type 2"],
      medications: ["Metformin", "Lisinopril"],
      surgeries: ["Appendectomy (2010)"],
      vitalSigns: {
        bloodPressure: "130/85 mmHg",
        heartRate: "72 bpm",
        temperature: "98.6 °F",
        respiratoryRate: "16 breaths/min",
        oxygenSaturation: "98%"
      },
      emergencyContact: {
        name: "Jane Smith",
        relationship: "Spouse",
        phone: "(555) 987-1234"
      },
      notes: "Patient has been managing diabetes well with current medication regimen.",
      appointments: [
        {
          date: "2023-11-28",
          time: "14:30",
          type: "Regular Checkup",
          status: "Completed",
          doctor: { name: "Dr. Johnson" },
          notes: "Blood pressure within normal range."
        }
      ],
      billingHistory: [
        {
          invoiceNumber: "INV-2023-1234",
          date: "2023-11-28",
          amount: 150.00,
          status: "Paid",
          serviceDescription: "Regular Checkup",
          paymentMethod: "Credit Card"
        }
      ]
    },
    {
      _id: "P002",
      user: {
        name: "Emily Johnson",
        email: "emily.johnson@example.com",
        mobile: "(555) 987-6543",
        gender: "female",
        dateOfBirth: "1991-08-24",
        address: "456 Oak Ave, Somewhere, CA"
      },
      bloodType: "A+",
      height: 165,
      weight: 65,
      lastVisit: "2023-11-15",
      status: "Active",
      allergies: [],
      chronicConditions: ["Asthma"],
      medications: ["Albuterol inhaler"],
      surgeries: [],
      vitalSigns: {
        bloodPressure: "120/78 mmHg",
        heartRate: "68 bpm",
        temperature: "98.2 °F",
        respiratoryRate: "14 breaths/min",
        oxygenSaturation: "99%"
      },
      emergencyContact: {
        name: "Robert Johnson",
        relationship: "Father",
        phone: "(555) 765-4321"
      },
      notes: "Asthma well-controlled with current medication.",
      appointments: [],
      billingHistory: []
    },
    {
      _id: "P003",
      user: {
        name: "Michael Brown",
        email: "michael.brown@example.com",
        mobile: "(555) 456-7890",
        gender: "male",
        dateOfBirth: "1965-12-10",
        address: "789 Pine Rd, Elsewhere, CA"
      },
      bloodType: "B-",
      height: 180,
      weight: 90,
      lastVisit: "2023-10-20",
      status: "Inactive",
      allergies: ["Sulfa drugs"],
      chronicConditions: ["Coronary artery disease", "High cholesterol"],
      medications: ["Atorvastatin", "Aspirin (low-dose)"],
      surgeries: ["Coronary bypass (2018)"],
      vitalSigns: {
        bloodPressure: "145/90 mmHg",
        heartRate: "78 bpm",
        temperature: "98.4 °F",
        respiratoryRate: "18 breaths/min",
        oxygenSaturation: "96%"
      },
      emergencyContact: {
        name: "Sarah Brown",
        relationship: "Daughter",
        phone: "(555) 321-0987"
      },
      notes: "Regular cardiology follow-ups required.",
      appointments: [],
      billingHistory: []
    }
  ]);

  // Filter patients based on search term and current filter
  const applyFilters = () => {
    let result = [...patients];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (patient) =>
          patient.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.user.mobile.includes(searchTerm)
      );
    }
    
    // Apply category filter
    switch (currentFilter) {
      case "active":
        result = result.filter(patient => patient.status === "Active");
        break;
      case "inactive":
        result = result.filter(patient => patient.status === "Inactive");
        break;
      case "recent":
        // For demonstration, consider patients with visits in the last 30 days as recent
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        result = result.filter(patient => {
          const visitDate = new Date(patient.lastVisit);
          return visitDate >= thirtyDaysAgo;
        });
        break;
      default:
        // "all" - no additional filtering
        break;
    }
    
    return result;
  };

  const filteredPatients = applyFilters();

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setFormMode("add");
    setPatientFormOpen(true);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setViewPatientOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setFormMode("edit");
    setPatientFormOpen(true);
  };
  
  const handleDeletePatient = (patient) => {
    setSelectedPatient(patient);
    setDeleteDialogOpen(true);
  };
  
  const handleViewMedicalRecords = (patient) => {
    setSelectedPatient(patient);
    setMedicalRecordsOpen(true);
  };
  
  const handleSaveMedicalRecords = (updatedPatient) => {
    // Update patient in the patients list
    const updatedPatients = patients.map(patient => {
      if (patient._id === updatedPatient._id) {
        return {
          ...patient,
          notes: updatedPatient.notes,
          vitalSigns: updatedPatient.vitalSigns
        };
      }
      return patient;
    });
    
    setPatients(updatedPatients);
    
    toast({
      title: "Medical Records Updated",
      description: `Medical records for ${updatedPatient.user.name} have been updated.`,
    });
  };
  
  const confirmDeletePatient = () => {
    if (selectedPatient) {
      // Filter out the patient to be deleted
      const updatedPatients = patients.filter(patient => patient._id !== selectedPatient._id);
      setPatients(updatedPatients);
      
      toast({
        title: "Patient Deleted",
        description: `${selectedPatient.user.name} has been deleted from the system.`,
      });
      
      // Close dialogs
      setDeleteDialogOpen(false);
      setViewPatientOpen(false);
    }
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleSavePatient = (patientData) => {
    if (formMode === "add") {
      // Generate a new ID (in a real app, this would be handled by the backend)
      const newId = `P${String(patients.length + 1).padStart(3, '0')}`;
      
      // Create a new patient object with the correct structure
      const newPatient = {
        _id: newId,
        user: {
          name: patientData.user.name,
          email: patientData.user.email,
          mobile: patientData.user.mobile,
          gender: patientData.user.gender,
          dateOfBirth: patientData.user.dateOfBirth,
          address: patientData.user.address
        },
        bloodType: patientData.bloodType,
        height: patientData.height,
        weight: patientData.weight,
        lastVisit: new Date().toISOString().split('T')[0], // Today's date as last visit for new patients
        status: patientData.status,
        allergies: patientData.allergies || [],
        chronicConditions: patientData.chronicConditions || [],
        medications: patientData.medications || [],
        surgeries: patientData.surgeries || [],
        vitalSigns: {},
        emergencyContact: patientData.emergencyContact,
        notes: patientData.notes,
        appointments: [],
        billingHistory: []
      };
      
      // Add the new patient to the list
      setPatients([...patients, newPatient]);
      
      toast({
        title: "Patient Added",
        description: `${patientData.user.name} has been added successfully.`,
      });
    } else {
      // Update existing patient
      const updatedPatients = patients.map(patient => {
        if (patient._id === selectedPatient._id) {
          return {
            ...patient,
            user: {
              ...patient.user,
              name: patientData.user.name,
              email: patientData.user.email,
              mobile: patientData.user.mobile,
              gender: patientData.user.gender,
              dateOfBirth: patientData.user.dateOfBirth,
              address: patientData.user.address
            },
            bloodType: patientData.bloodType,
            height: patientData.height,
            weight: patientData.weight,
            status: patientData.status,
            allergies: patientData.allergies || [],
            chronicConditions: patientData.chronicConditions || [],
            medications: patientData.medications || [],
            surgeries: patientData.surgeries || [],
            emergencyContact: patientData.emergencyContact,
            notes: patientData.notes
          };
        }
        return patient;
      });
      
      setPatients(updatedPatients);
      
      toast({
        title: "Patient Updated",
        description: `${patientData.user.name}'s information has been updated.`,
      });
    }
    
    // Close the form dialog
    setPatientFormOpen(false);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
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
                <span className="hidden sm:inline">
                  {currentFilter === 'all' 
                    ? 'All Patients' 
                    : `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Patients`}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilterChange('all')}>
                All Patients
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('active')}>
                Active Patients
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('inactive')}>
                Inactive Patients
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('recent')}>
                Recent Visits
              </DropdownMenuItem>
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
                  <TableRow key={patient._id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewPatient(patient)}>
                    <TableCell className="font-medium">{patient._id}</TableCell>
                    <TableCell>{patient.user.name}</TableCell>
                    <TableCell>{calculateAge(patient.user.dateOfBirth)}</TableCell>
                    <TableCell className="capitalize">{patient.user.gender}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.user.mobile}</TableCell>
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
                      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPatient(patient);
                          }}
                          title="View Patient"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "Schedule Appointment",
                              description: `Scheduling appointment for ${patient.user.name}`,
                            });
                          }}
                          title="Schedule Appointment"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "Contact Patient",
                              description: `Contacting ${patient.user.name} at ${patient.user.mobile}`,
                            });
                          }}
                          title="Contact Patient"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="ghost" 
                              size="icon"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditPatient(patient)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Patient
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewMedicalRecords(patient)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Medical Records
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({
                              title: "View Billing History",
                              description: `Viewing billing history for ${patient.user.name}`,
                            })}>
                              <FileText className="h-4 w-4 mr-2" />
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
      
      {/* Patient Form Dialog */}
      <PatientFormDialog 
        open={patientFormOpen} 
        onOpenChange={setPatientFormOpen}
        patient={selectedPatient}
        mode={formMode}
        onSave={handleSavePatient}
      />
      
      {/* View Patient Dialog */}
      <ViewPatientDialog 
        open={viewPatientOpen} 
        onOpenChange={setViewPatientOpen}
        patient={selectedPatient}
        onEdit={() => {
          setViewPatientOpen(false);
          handleEditPatient(selectedPatient);
        }}
        onDelete={handleDeletePatient}
      />
      
      {/* Delete Patient Dialog */}
      <PatientDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        patient={selectedPatient}
        onConfirm={confirmDeletePatient}
      />
      
      {/* Medical Records Dialog */}
      <PatientMedicalRecordsDialog
        open={medicalRecordsOpen}
        onOpenChange={setMedicalRecordsOpen}
        patient={selectedPatient}
        onSave={handleSaveMedicalRecords}
      />
    </div>
  );
};

export default Patients;
