import React, { useState, useEffect } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/admin/ui/dropdown-menu";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";
import { Search, Filter, ChevronDown, Plus, Edit, Eye, Link, XCircle, Mail, Phone, MoreHorizontal, Pencil, Trash, AlertCircle } from "lucide-react";
import { useToast } from "@/components/admin/ui/use-toast";
import { Skeleton } from "@/components/admin/ui/skeleton";
import DoctorFormDialog from "@/components/dialogs/DoctorFormDialog";
import DoctorDetailsDialog from "@/components/dialogs/DoctorDetailsDialog";
import DoctorDeleteDialog from "@/components/dialogs/DoctorDeleteDialog";
import doctorService from "@/services/doctorService";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/admin/ui/avatar";
import { ScrollArea } from "@/components/admin/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/admin/ui/select";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/admin/ui/alert-dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/admin/ui/table";

// Default doctor image to use when no image is available
const DEFAULT_DOCTOR_IMAGE = "/assets/default-doctor.jpg";

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

  // View mode state
  const [viewMode, setViewMode] = useState("grid");

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

  // Function to sync local doctor data with latest from backend
  const syncDoctorData = (fetchedDoctors) => {
    try {
      // Get the IDs of all doctors in the backend
      const backendIds = fetchedDoctors.map(doctor => doctor._id);
      
      // Get the IDs of all doctors in our state
      const stateIds = doctors.map(doctor => doctor._id);
      
      // Find doctors that exist in state but not in backend (they were deleted)
      const deletedIds = stateIds.filter(id => !backendIds.includes(id));
      if (deletedIds.length > 0) {
        console.log('Found deleted doctors:', deletedIds);
        
        // Remove deleted doctors from state
        setDoctors(prevDoctors => 
          prevDoctors.filter(doctor => !deletedIds.includes(doctor._id))
        );
        
        // If we're currently viewing/editing a deleted doctor, close dialogs
        if (selectedDoctor && deletedIds.includes(selectedDoctor._id)) {
          toast({
            variant: "warning",
            title: "Doctor Deleted",
            description: "The doctor you were viewing has been deleted from the database."
          });
          handleCloseAllDialogs();
        }
      }
      
      // Find doctors that exist in backend but not in state (they were added)
      const addedIds = backendIds.filter(id => !stateIds.includes(id));
      if (addedIds.length > 0) {
        console.log('Found new doctors:', addedIds);
      }
      
      // Update doctor data
      setDoctors(fetchedDoctors);
    } catch (error) {
      console.error('Error syncing doctor data:', error);
    }
  };

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching doctors from API...');
      const response = await doctorService.getAllDoctors();
      
      // Handle the response regardless of success status
      if (response && response.success && response.data) {
        console.log(`Successfully fetched ${response.data.length} doctors`);
        
        // Log doctors with their IDs for debugging
        response.data.forEach((doctor, index) => {
          console.log(`Doctor ${index + 1}:`, doctor._id, 
            'User:', doctor.user ? {
              name: doctor.user.name,
              email: doctor.user.email,
              _id: doctor.user._id
            } : 'No user data', 
            'Specialization:', doctor.specialization);
        });
        
        // Sync with local state and handle deleted/added doctors
        syncDoctorData(response.data);
        
        // Extract unique specialties for filtering
        const specialtySet = new Set();
        specialtySet.add("All Specializations");
        
        // Add specialties if available
        response.data.forEach(doctor => {
          if (doctor && doctor.specialization) {
            specialtySet.add(doctor.specialization);
          }
        });
        
        // Convert set to array
        setSpecialties(Array.from(specialtySet));
        
        toast({
          title: "Success",
          description: `${response.data.length} doctors loaded successfully`
        });
      } else {
        console.error('Failed to fetch doctors:', response);
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || 'Failed to load doctors'
        });
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to load doctors'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFiltersAndSearch = () => {
    let result = [...doctors];
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(doctor => 
        doctor.user?.name?.toLowerCase().includes(searchLower) ||
        doctor.specialization?.toLowerCase().includes(searchLower) ||
        doctor.user?.email?.toLowerCase().includes(searchLower) ||
        doctor._id?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply specialty filter
    if (selectedSpecialty && selectedSpecialty !== "All Specializations") {
      result = result.filter(doctor => doctor.specialization === selectedSpecialty);
    }
    
    // Apply status filter
    if (selectedSpecialty === "Active") {
      result = result.filter(doctor => doctor.isActive === true);
    } else if (selectedSpecialty === "Not Active") {
      result = result.filter(doctor => doctor.isActive === false);
    }
    
    // Apply availability filter
    if (selectedSpecialty === "Available") {
      result = result.filter(doctor => doctor.isAvailable === true);
    } else if (selectedSpecialty === "Not Available") {
      result = result.filter(doctor => doctor.isAvailable === false);
    }
    
    setFilteredDoctors(result);
    
    // Update pagination
    setTotalPages(Math.ceil(result.length / doctorsPerPage));
    if (currentPage > Math.ceil(result.length / doctorsPerPage)) {
      setCurrentPage(1);
    }
    
    return result;
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
    // Add debug logging to examine the doctor object
    console.log('Selected doctor for editing:', doctor);
    
    // Verify we have a valid ID - doctor._id is the primary ID to use now, based on sample data
    const doctorId = doctor._id;
    
    if (!doctorId) {
      console.error('Doctor object is missing _id:', doctor);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot edit doctor: Missing ID"
      });
      return;
    }
    
    // Set to loading state
    setIsLoading(true);
    
    // Check if doctor exists or can be created
    doctorService.checkDoctorExists(doctorId)
      .then(exists => {
        setIsLoading(false);
        
        if (exists) {
          // Doctor exists or can be created
          setSelectedDoctor(doctor);
          setShowEditDialog(true);
        } else {
          // Doctor doesn't exist and can't be created
          toast({
            variant: "destructive",
            title: "Error",
            description: "This doctor no longer exists in the database. The list will be refreshed."
          });
          
          // Remove doctor from local state
          setDoctors(prevDoctors => prevDoctors.filter(d => d._id !== doctorId));
          
          // Refresh doctors list
          fetchDoctors();
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error('Error checking if doctor exists:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to validate doctor information. Please try again."
        });
      });
  };

  const handleDeleteDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteDialog(true);
  };

  const handleSaveDoctor = async (idOrData, formData) => {
    setIsLoading(true);
    try {
      let response;

      // Check if this is an update (two parameters) or create (one parameter)
      if (formData) {
        // This is an update operation - first parameter is ID, second is data
        console.log('Updating doctor with ID:', idOrData);
        console.log('Form data for update:', formData);
        
        // Format the data based on the expected structure for update
        // The data should be flat without nested user properties
        const formattedData = {
          ...formData,
          // Ensure these required fields have defaults
          specialization: formData.specialization || "General Physician",
          fee: parseFloat(formData.fee) || 0,
          experience: parseInt(formData.experience) || 0,
        };
        
        console.log('Formatted update data:', formattedData);
        response = await doctorService.updateDoctor(idOrData, formattedData);
      } else {
        // This is a create operation - first parameter is data
        console.log('Creating new doctor');
        console.log('Form data for create:', idOrData);
        
        // Format the data for creating a new doctor
        // The data should be flat without nested user properties
        const formattedData = {
          ...idOrData,
          // Ensure these required fields have defaults
          specialization: idOrData.specialization || "General Physician",
          fee: parseFloat(idOrData.fee) || 0,
          experience: parseInt(idOrData.experience) || 0,
        };
        
        console.log('Formatted create data:', formattedData);
        response = await doctorService.createDoctor(formattedData);
      }
      
      if (response.success) {
        toast({
          title: formData ? "Doctor Updated" : "Doctor Added",
          description: formData 
            ? "Doctor information has been updated successfully." 
            : "New doctor has been added successfully.",
        });
        fetchDoctors(); // Refresh the doctor list
        handleCloseAllDialogs();
      } else {
        // Handle errors
        toast({
          variant: "destructive",
          title: formData ? "Update Failed" : "Addition Failed",
          description: response.error 
            ? `${response.message}: ${response.error}` 
            : response.message || "Failed to process doctor information.",
        });
        console.error('Doctor operation error details:', response);
      }
    } catch (error) {
      console.error('Error in handleSaveDoctor:', error);
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: error.message || "An unexpected error occurred."
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
        
        // Not using mock data, proceed with real API call via service
        const response = await doctorService.deleteDoctor(selectedDoctor._id);
        
        if (response && response.success) {
          // Refresh doctor list after delete
          await fetchDoctors();
          
          toast({
            title: "Success",
            description: response.message || "Doctor removed successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to delete doctor",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        toast({
          title: "Error",
          description: error.message || "An error occurred while deleting the doctor.",
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
    // Use name directly from doctor object
    return doctor.name || "Unknown Doctor";
  };

  // Helper to get doctor availability status
  const getDoctorAvailability = (doctor) => {
    return doctor.isAvailable ? "Available" : "Not Available";
  };

  // Helper to get doctor's image
  const getDoctorImage = (doctor) => {
    return doctor.profileImage || doctor.picture || DEFAULT_DOCTOR_IMAGE;
  };

  // Helper to get doctor status
  const getDoctorStatus = (doctor) => {
    return doctor.isActive ? "Active" : "Not Active";
  };

  // Get paginated doctors
  const getPaginatedDoctors = () => {
    const startIndex = (currentPage - 1) * doctorsPerPage;
    const endIndex = startIndex + doctorsPerPage;
    return filteredDoctors.slice(startIndex, endIndex);
  };

  const paginatedDoctors = getPaginatedDoctors();

  // Handle close all dialogs
  const handleCloseAllDialogs = () => {
    // Close all dialogs
    setShowAddDialog(false);
    setShowEditDialog(false);
    setShowViewDialog(false);
    setShowDeleteDialog(false);
    
    // Reset selected doctor
    setSelectedDoctor(null);
    
    // Refresh doctor list to ensure up-to-date data
    fetchDoctors();
  };

  // Render doctor grid
  const renderDoctorGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill().map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredDoctors.length === 0) {
      return (
        <div className="text-center py-12 border border-dashed rounded-lg p-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No doctors found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedDoctors.map((doctor) => (
          <Card key={doctor._id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-6 pb-3">
                <div className="flex justify-between">
                  <Avatar className="h-16 w-16 mb-4">
                    {doctor.profileImage ? (
                      <AvatarImage src={doctor.profileImage} alt={doctor.name} />
                    ) : doctor.picture ? (
                      <AvatarImage src={doctor.picture} alt={doctor.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {doctor.name?.split(' ').map(n => n[0]).join('') || 'DR'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Badge 
                    variant={doctor.isAvailable ? "default" : "secondary"}
                    className="h-fit"
                  >
                    {doctor.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg">
                  Dr. {doctor.name || "Unknown Doctor"}
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {doctor.specialization || "General Physician"}
                </p>
                <p className="text-sm flex items-center gap-2 mb-1">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  {doctor.email || "No email provided"}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {doctor.mobile || "No phone provided"}
                </p>
              </div>
              
              <CardFooter className="border-t p-3 bg-muted/30 flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDoctor(doctor);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditDoctor(doctor);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDoctor(doctor);
                  }}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Render doctor table
  const renderDoctorTable = () => {
    if (isLoading) {
      return (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5).fill().map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-28 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    if (filteredDoctors.length === 0) {
      return (
        <div className="text-center py-12 border border-dashed rounded-lg p-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No doctors found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDoctors.map((doctor) => (
              <TableRow key={doctor._id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      {doctor.profileImage ? (
                        <AvatarImage src={doctor.profileImage} alt={doctor.name} />
                      ) : doctor.picture ? (
                        <AvatarImage src={doctor.picture} alt={doctor.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {doctor.name?.split(' ').map(n => n[0]).join('') || 'DR'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">Dr. {doctor.name || "Unknown Doctor"}</p>
                      <p className="text-xs text-muted-foreground">{doctor._id || "No ID"}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{doctor.specialization || "General Physician"}</TableCell>
                <TableCell>
                  <Badge variant={doctor.isAvailable ? "default" : "secondary"} className="capitalize">
                    {doctor.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {doctor.email || "No email"}
                    </p>
                    <p className="flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      {doctor.mobile || "No phone"}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDoctor(doctor)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditDoctor(doctor)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Doctor
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteDoctor(doctor)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Doctor
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="col-span-2 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <Select
            value={selectedSpecialty === "All Specializations" ? "all" : selectedSpecialty}
            onValueChange={handleFilterChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative">
          <Select
            value={selectedSpecialty === "Active" ? "active" : selectedSpecialty === "Not Active" ? "inactive" : "all"}
            onValueChange={(value) => {
              if (value === "active") {
                handleFilterChange("Active");
              } else if (value === "inactive") {
                handleFilterChange("Not Active");
              } else {
                handleFilterChange("All Specializations");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Not Active</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative">
          <Select
            value={selectedSpecialty === "Available" ? "available" : selectedSpecialty === "Not Available" ? "unavailable" : "all"}
            onValueChange={(value) => {
              if (value === "available") {
                handleFilterChange("Available");
              } else if (value === "unavailable") {
                handleFilterChange("Not Available");
              } else {
                handleFilterChange("All Specializations");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Availability</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Not Available</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative">
          <Select
            value={doctorsPerPage.toString()}
            onValueChange={(value) => {
              setCurrentPage(1);
              setDoctorsPerPage(Number(value));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Doctors per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Display Doctors */}
      <div className="mb-6">
        {viewMode === "grid" ? renderDoctorGrid() : renderDoctorTable()}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min(filteredDoctors.length, 1 + (currentPage - 1) * doctorsPerPage)}-
          {Math.min(currentPage * doctorsPerPage, filteredDoctors.length)} of {filteredDoctors.length} doctors
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      
      {/* Doctor Form Dialog */}
      {(showAddDialog || showEditDialog) && (
        <DoctorFormDialog
          doctor={selectedDoctor}
          mode={showEditDialog ? 'edit' : 'add'}
          open={showAddDialog || showEditDialog}
          onClose={handleCloseAllDialogs}
          onSave={handleSaveDoctor}
          specialties={specialties}
        />
      )}
      
      {/* Doctor View Dialog */}
      {showViewDialog && selectedDoctor && (
        <DoctorDetailsDialog
          doctor={selectedDoctor}
          open={showViewDialog}
          onClose={handleCloseAllDialogs}
          onEdit={() => {
            setShowViewDialog(false);
            setShowEditDialog(true);
          }}
        />
      )}
      
      {/* Doctor Delete Dialog */}
      {showDeleteDialog && selectedDoctor && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this doctor?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete 
                Dr. {selectedDoctor.name || "the doctor"}
                and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseAllDialogs}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Doctors;
