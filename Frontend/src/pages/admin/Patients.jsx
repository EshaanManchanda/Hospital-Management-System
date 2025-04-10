import React, { useState, useEffect } from "react";
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
import { Skeleton } from '@/components/admin/ui/skeleton';

// Define patientService at component level
let patientService;

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [patientFormOpen, setPatientFormOpen] = useState(false);
  const [viewPatientOpen, setViewPatientOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [medicalRecordsOpen, setMedicalRecordsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load patientService dynamically
  useEffect(() => {
    const loadPatientService = async () => {
      const module = await import('../../services/patientService');
      patientService = module.default;
      fetchPatients();
    };
    
    loadPatientService();
  }, []);

  // Fetch all patients from the API
  const fetchPatients = async () => {
    if (!patientService) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.getAllPatients();
      if (response.success && response.data) {
        setPatients(response.data);
      } else {
        setError(response.message || 'Failed to fetch patients');
        toast({
          title: "Error",
          description: response.message || 'Failed to fetch patients',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Could not load patients. Please try again later.');
      toast({
        title: "Error",
        description: 'Could not load patients. Please try again later.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter patients based on search term and current filter
  const applyFilters = () => {
    let result = [...patients];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (patient) => {
          // Make sure we have user data before trying to access its properties
          const userName = patient.user?.name || "";
          const userEmail = patient.user?.email || "";
          const userMobile = patient.user?.mobile || "";
          
          return userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userMobile.includes(searchTerm);
        }
      );
    }
    
    // Apply category filter
    switch (currentFilter) {
      case "active":
        result = result.filter(patient => patient.status === "Active" || patient.isActive === true);
        break;
      case "inactive":
        result = result.filter(patient => patient.status === "Inactive" || patient.isActive === false);
        break;
      case "recent":
        // For demonstration, consider patients with visits in the last 30 days as recent
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        result = result.filter(patient => {
          if (!patient.lastVisit) return false;
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
  
  const handleSaveMedicalRecords = async (updatedPatient) => {
    if (!patientService) {
      const module = await import('../../services/patientService');
      patientService = module.default;
    }
    
    try {
      setLoading(true);
      
      const response = await patientService.updatePatientMedicalRecords(
        updatedPatient._id, 
        {
          notes: updatedPatient.notes,
          vitalSigns: updatedPatient.vitalSigns
        }
      );
      
      if (response.success) {
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
          description: `Medical records for ${updatedPatient.user?.name || 'the patient'} have been updated.`,
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update medical records",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating medical records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setMedicalRecordsOpen(false);
    }
  };
  
  const confirmDeletePatient = async () => {
    if (!patientService) {
      const module = await import('../../services/patientService');
      patientService = module.default;
    }
    
    try {
      setLoading(true);
      
      const response = await patientService.deletePatient(selectedPatient._id);
      
      if (response.success) {
        // Filter out the deleted patient from the state
        const updatedPatients = patients.filter(patient => patient._id !== selectedPatient._id);
        setPatients(updatedPatients);
        
        toast({
          title: "Patient Deleted",
          description: `${selectedPatient.user?.name || 'The patient'} has been deleted from the system.`,
        });
        
        // Close dialogs
        setDeleteDialogOpen(false);
        setViewPatientOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete patient",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the patient",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSelectedPatient(null);
    }
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleSavePatient = async (patientData, mode) => {
    if (!patientService) {
      const module = await import('../../services/patientService');
      patientService = module.default;
    }
    
    try {
      setLoading(true);
      let response;
      
      if (mode === "add") {
        response = await patientService.createPatient(patientData);
        
        if (response.success) {
          // Add the new patient to the list
          setPatients([...patients, response.patient]);
          
          toast({
            title: "Patient Added",
            description: `${patientData.name} has been added successfully.`,
          });
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to add patient",
            variant: "destructive",
          });
          return; // Don't close the dialog if there was an error
        }
      } else {
        response = await patientService.updatePatient(selectedPatient._id, patientData);
        
        if (response.success) {
          // Update the patient in the list
          const updatedPatients = patients.map(patient => {
            if (patient._id === selectedPatient._id) {
              return response.patient;
            }
            return patient;
          });
          
          setPatients(updatedPatients);
          
          toast({
            title: "Patient Updated",
            description: `${patientData.name}'s information has been updated.`,
          });
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to update patient",
            variant: "destructive",
          });
          return; // Don't close the dialog if there was an error
        }
      }
      
      // Close the form dialog
      setPatientFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  // Get patient status
  const getPatientStatus = (patient) => {
    if (patient.status) return patient.status;
    return patient.isActive ? "Active" : "Inactive";
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
      
      {loading && patients.length === 0 ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : error ? (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
          <p className="font-medium">Error loading patients</p>
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={fetchPatients}
          >
            Retry
          </Button>
        </div>
      ) : (
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
                      <TableCell>{patient.user?.name || "Unknown"}</TableCell>
                      <TableCell>{calculateAge(patient.user?.dateOfBirth)}</TableCell>
                      <TableCell className="capitalize">{patient.user?.gender || "Unknown"}</TableCell>
                      <TableCell className="hidden md:table-cell">{patient.user?.mobile || "None"}</TableCell>
                      <TableCell className="hidden md:table-cell">{patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : "No visits"}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "font-normal",
                            getPatientStatus(patient) === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          )}
                        >
                          {getPatientStatus(patient)}
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
                                description: `Scheduling appointment for ${patient.user?.name || "the patient"}`,
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
                                description: `Contacting ${patient.user?.name || "the patient"} at ${patient.user?.mobile || "no number"}`,
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
                                description: `Viewing billing history for ${patient.user?.name || "the patient"}`,
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
      )}
      
      {/* Patient Form Dialog */}
      <PatientFormDialog 
        open={patientFormOpen} 
        onOpenChange={setPatientFormOpen}
        patient={selectedPatient}
        mode={formMode}
        onSave={(data) => handleSavePatient(data, formMode)}
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
