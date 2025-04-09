import React, { useState, useEffect } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/admin/ui/dropdown-menu";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { 
  Card, 
  CardContent 
} from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";
import { Search, Filter, ChevronDown, Plus, Edit, Eye } from "lucide-react";
import { useToast } from "@/components/admin/ui/use-toast";
import { Skeleton } from "@/components/admin/ui/skeleton";
import DoctorFormDialog from "@/components/dialogs/DoctorFormDialog";
import DoctorDetailsDialog from "@/components/dialogs/DoctorDetailsDialog";
import DoctorDeleteDialog from "@/components/dialogs/DoctorDeleteDialog";
import axios from "axios";
import { cn } from "@/lib/utils";

// Make sure API URL is correct with the /api path
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// Default doctor image to use when no image is available
const DEFAULT_DOCTOR_IMAGE = "/assets/default-doctor.jpg";

// Create sample mock data for development until the API is available
const MOCK_DOCTORS = [
  {
    _id: "65c8f11a8e85a72b7cf89432",
    user: {
      _id: "65c8f11a8e85a72b7cf89430",
      name: "Dr. Jane Smith",
      email: "jane.smith@hospital.com",
      profileImage: ""
    },
    specialization: "Cardiology",
    experience: 8,
    fee: 150,
    patients: [],
    qualifications: [
      {
        degree: "MD",
        institution: "Harvard Medical School",
        year: 2015
      }
    ],
    about: "Specialist in cardiovascular medicine with focus on preventive care",
    workingHours: {
      start: "09:00",
      end: "17:00"
    },
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    appointments: [],
    ratings: [],
    averageRating: 0,
    isAvailable: true
  },
  {
    _id: "65c8f11a8e85a72b7cf89433",
    user: {
      _id: "65c8f11a8e85a72b7cf89431",
      name: "Dr. John Williams",
      email: "john.williams@hospital.com",
      profileImage: ""
    },
    specialization: "Neurology",
    experience: 12,
    fee: 200,
    patients: [],
    qualifications: [
      {
        degree: "MD",
        institution: "Johns Hopkins University",
        year: 2010
      }
    ],
    about: "Experienced neurologist specializing in advanced diagnostic procedures",
    workingHours: {
      start: "08:00",
      end: "16:00"
    },
    workingDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    appointments: [],
    ratings: [],
    averageRating: 0,
    isAvailable: true
  }
];

const Doctors = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specializations");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState(["All Specializations"]);
  const [useMockData, setUseMockData] = useState(false);

  // Dialogs state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch doctors data
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Apply filters and search when data changes
  useEffect(() => {
    applyFiltersAndSearch();
  }, [doctors, searchTerm, selectedSpecialty]);

  // Calculate pagination when filtered doctors change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredDoctors.length / doctorsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredDoctors, doctorsPerPage]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      // Complete URL including /api path
      const response = await axios.get(`http://localhost:5000/api/doctors/all`);
      
      if (response.data && response.data.success) {
        const doctorsData = response.data.data || [];
        setDoctors(doctorsData);
        setUseMockData(false);
        
        // Extract unique specialties for the filter dropdown
        const uniqueSpecialties = [...new Set(doctorsData.map(doctor => doctor.specialization))];
        setSpecialties(["All Specializations", ...uniqueSpecialties]);
      } else {
        // If API returns error response, fallback to mock data
        fallbackToMockData();
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      // If API call fails (404, 500, etc.), fallback to mock data
      fallbackToMockData();
    } finally {
      setIsLoading(false);
    }
  };
  
  const fallbackToMockData = () => {
    toast({
      title: "Using development data",
      description: "Could not connect to API, using sample data instead",
      variant: "warning",
    });
    
    setUseMockData(true);
    setDoctors(MOCK_DOCTORS);
    
    // Extract unique specialties for the filter dropdown from mock data
    const uniqueSpecialties = [...new Set(MOCK_DOCTORS.map(doctor => doctor.specialization))];
    setSpecialties(["All Specializations", ...uniqueSpecialties]);
  };

  const applyFiltersAndSearch = () => {
    let results = [...doctors];
    
    // Apply specialty filter
    if (selectedSpecialty !== "All Specializations") {
      results = results.filter(doctor => doctor.specialization === selectedSpecialty);
    }
    
    // Apply search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(doctor => 
        (doctor.user?.name || "").toLowerCase().includes(lowercasedSearch) ||
        (doctor.specialization || "").toLowerCase().includes(lowercasedSearch) ||
        (doctor._id || "").toLowerCase().includes(lowercasedSearch) ||
        (doctor.user?.email || "").toLowerCase().includes(lowercasedSearch)
      );
    }
    
    setFilteredDoctors(results);
  };

  const handleFilterChange = (specialty) => {
    setSelectedSpecialty(specialty);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setShowAddDialog(true);
  };

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewDialog(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowEditDialog(true);
  };

  const handleDeleteDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteDialog(true);
  };

  const handleSaveDoctor = async (doctorData) => {
    try {
      setIsLoading(true);
      
      if (useMockData) {
        // If using mock data, just simulate a successful API response
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        if (selectedDoctor && showEditDialog) {
          const updatedDoctors = doctors.map(doc =>
            doc._id === selectedDoctor._id ? { ...doc, ...doctorData } : doc
          );
          setDoctors(updatedDoctors);
          
          toast({
            title: "Success",
            description: "Doctor information updated successfully (mock).",
          });
        } else {
          // Add new doctor to mock data
          const newDoctor = {
            _id: `mock-${Date.now()}`,
            ...doctorData,
            isAvailable: true,
            patients: [],
            appointments: []
          };
          setDoctors([...doctors, newDoctor]);
          
          toast({
            title: "Success",
            description: "New doctor added successfully (mock).",
          });
        }
        
        setShowEditDialog(false);
        setShowAddDialog(false);
        return;
      }
      
      // Not using mock data, proceed with real API calls
      if (selectedDoctor && showEditDialog) {
        // Edit existing doctor - make sure we use the correct API URL 
        const response = await axios.put(`${API_URL}/doctors/${selectedDoctor._id}`, doctorData);
        
        if (response.data && response.data.success) {
          // Refresh doctor list to get updated data
          await fetchDoctors();
          
          toast({
            title: "Success",
            description: "Doctor information updated successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: response.data?.message || "Failed to update doctor information",
            variant: "destructive",
          });
        }
        setShowEditDialog(false);
      } else {
        // Add new doctor - make sure we use the correct API URL
        const response = await axios.post(`${API_URL}/doctors`, doctorData);
        
        if (response.data && response.data.success) {
          // Refresh doctor list to get new data
          await fetchDoctors();
          
          toast({
            title: "Success",
            description: "New doctor added successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: response.data?.message || "Failed to add new doctor",
            variant: "destructive",
          });
        }
        setShowAddDialog(false);
      }
    } catch (error) {
      console.error("Error saving doctor:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred while saving doctor information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedDoctor) {
      try {
        setIsLoading(true);
        
        if (useMockData) {
          // If using mock data, just simulate a successful API response
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
          
          // Remove doctor from mock data
          const updatedDoctors = doctors.filter(doc => doc._id !== selectedDoctor._id);
          setDoctors(updatedDoctors);
          
          toast({
            title: "Success",
            description: "Doctor removed successfully (mock).",
          });
          
          setShowDeleteDialog(false);
          return;
        }
        
        // Not using mock data, proceed with real API call
        const response = await axios.delete(`${API_URL}/doctors/${selectedDoctor._id}`);
        
        if (response.data && response.data.success) {
          // Refresh doctor list after delete
          await fetchDoctors();
          
          toast({
            title: "Success",
            description: "Doctor removed successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: response.data?.message || "Failed to delete doctor",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "An error occurred while deleting the doctor.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setShowDeleteDialog(false);
      }
    }
  };

  // Get current doctors for pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  // Helper to get doctor name from associated user
  const getDoctorName = (doctor) => {
    return doctor.user?.name || "Unknown Doctor";
  };

  // Helper to get doctor availability status
  const getDoctorAvailability = (doctor) => {
    return doctor.isAvailable ? "Available" : "Not Available";
  };

  // Helper to get doctor's image
  const getDoctorImage = (doctor) => {
    return doctor.user?.profileImage || doctor.user?.picture || DEFAULT_DOCTOR_IMAGE;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Doctors</h1>
          <p className="text-gray-600">
            Manage hospital doctors and specialists
            {useMockData && <span className="ml-2 text-amber-600 text-sm font-medium">(Using sample data)</span>}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search doctors..."
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
              {specialties.map((specialty) => (
                <DropdownMenuItem 
                  key={specialty} 
                  onClick={() => handleFilterChange(specialty)}
                  className={selectedSpecialty === specialty ? "bg-slate-100 font-medium" : ""}
                >
                  {specialty}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddDoctor}>
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        // Skeleton loader for doctors
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="pt-6 pb-4 px-6 flex flex-col items-center">
                  <Skeleton className="w-24 h-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-4 w-32" />
                </div>
                
                <div className="border-t border-gray-100 flex divide-x">
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDoctors.length > 0 ? (
              currentDoctors.map((doctor) => (
                <Card key={doctor._id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col">
                      <div className="relative pt-6 pb-4 px-6 flex flex-col items-center">
                        <div className="absolute top-0 right-0 p-3">
                          <Badge className={cn(
                            getDoctorAvailability(doctor) === "Available" 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          )}>
                            {getDoctorAvailability(doctor)}
                          </Badge>
                        </div>
                        
                        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
                          <img 
                            src={getDoctorImage(doctor)} 
                            alt={getDoctorName(doctor)} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_DOCTOR_IMAGE;
                            }}
                          />
                        </div>
                        
                        <h3 className="text-lg font-semibold">{getDoctorName(doctor)}</h3>
                        <p className="text-gray-500">{doctor.specialization}</p>
                        
                        <div className="flex items-center mt-2 text-sm">
                          <span className="text-gray-600">{doctor.experience} years experience</span>
                          <span className="mx-2">•</span>
                          <span className="text-gray-600">{doctor.patients?.length || 0} patients</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 flex divide-x">
                        <button 
                          className="flex-1 py-3 text-sm font-medium text-blue-600 hover:bg-gray-50 flex items-center justify-center"
                          onClick={() => handleViewDoctor(doctor)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Profile
                        </button>
                        <button 
                          className="flex-1 py-3 text-sm font-medium text-blue-600 hover:bg-gray-50 flex items-center justify-center"
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 py-10 text-center">
                <p className="text-gray-500">
                  {doctors.length === 0 ? 
                    "No doctors found. Add your first doctor to get started." : 
                    "No doctors found matching your search criteria."
                  }
                </p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredDoctors.length > doctorsPerPage && (
            <div className="flex items-center justify-center mt-8 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {index + 1}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* Dialogs */}
      <DoctorFormDialog
        open={showAddDialog || showEditDialog}
        onOpenChange={showAddDialog ? setShowAddDialog : setShowEditDialog}
        doctor={showEditDialog ? selectedDoctor : null}
        mode={showEditDialog ? 'edit' : 'add'}
        onSave={handleSaveDoctor}
      />
      
      <DoctorDetailsDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        doctor={selectedDoctor}
        onEdit={() => {
          setShowViewDialog(false);
          setShowEditDialog(true);
        }}
        onDelete={() => {
          setShowViewDialog(false);
          setShowDeleteDialog(true);
        }}
      />
      
      <DoctorDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        doctor={selectedDoctor}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Doctors;
