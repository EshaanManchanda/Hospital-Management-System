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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/admin/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { Badge } from "@/components/admin/ui/badge";
import { useToast } from "@/components/admin/ui/use-toast";
import { 
  Search, 
  MoreHorizontal,
  Plus, 
  FileEdit, 
  Trash2,
  Filter,
  ChevronDown,
  ShoppingCart,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddMedicationForm from "@/components/admin/pharmacy/AddMedicationForm";
import { pharmacyService } from "@/services";

// Mock pharmacy inventory data for fallback
const fallbackMedications = [
  {
    id: "M001",
    name: "Amoxicillin",
    category: "Antibiotics",
    stock: 250,
    price: "$8.99",
    supplier: "PharmaCorp",
    status: "in-stock",
  },
  {
    id: "M002",
    name: "Lisinopril",
    category: "Blood Pressure",
    stock: 120,
    price: "$12.50",
    supplier: "MediSupply",
    status: "in-stock",
  },
  {
    id: "M003",
    name: "Atorvastatin",
    category: "Cholesterol",
    stock: 75,
    price: "$15.25",
    supplier: "HealthPharm",
    status: "low-stock",
  },
  {
    id: "M004",
    name: "Albuterol Inhaler",
    category: "Respiratory",
    stock: 30,
    price: "$25.99",
    supplier: "MediSupply",
    status: "low-stock",
  },
  {
    id: "M005",
    name: "Metformin",
    category: "Diabetes",
    stock: 200,
    price: "$7.49",
    supplier: "PharmaCorp",
    status: "in-stock",
  },
  {
    id: "M006",
    name: "Lorazepam",
    category: "Anxiety",
    stock: 0,
    price: "$18.75",
    supplier: "HealthPharm",
    status: "out-of-stock",
  },
];

const statusStyles = {
  "in-stock": "bg-green-100 text-green-800 hover:bg-green-100",
  "low-stock": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "out-of-stock": "bg-red-100 text-red-800 hover:bg-red-100",
};

const Pharmacy = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [medicationsData, setMedicationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0
  });

  // Fetch medications from API
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setIsLoading(true);
        const response = await pharmacyService.getAllMedicines();
        
        if (response && response.medicines) {
          // Format the data if needed
          const formattedData = response.medicines.map(med => ({
            id: med._id || med.id,
            name: med.name,
            category: med.category,
            stock: med.stock,
            price: typeof med.price === 'number' ? `$${med.price.toFixed(2)}` : med.price,
            supplier: med.supplier,
            status: determineStockStatus(med.stock, med.lowStockThreshold || 50)
          }));
          
          setMedicationsData(formattedData);
          
          // Update stats if available
          if (response.stats) {
            setStats({
              totalItems: response.stats.totalItems || 0,
              lowStock: response.stats.lowStock || 0,
              outOfStock: response.stats.outOfStock || 0
            });
          } else {
            // Calculate stats from the data
            calculateStats(formattedData);
          }
        } else {
          console.warn("API response format unexpected, using fallback data");
          // Fallback to mock data
          setMedicationsData(fallbackMedications);
          calculateStats(fallbackMedications);
        }
      } catch (error) {
        console.error("Error fetching medications:", error);
        toast({
          title: "Error",
          description: "Failed to load medications. Using sample data instead.",
          variant: "destructive"
        });
        
        // Fallback to mock data on error
        setMedicationsData(fallbackMedications);
        calculateStats(fallbackMedications);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();
  }, [toast]);

  // Determine stock status based on quantity
  const determineStockStatus = (stock, threshold) => {
    if (stock <= 0) return "out-of-stock";
    if (stock < threshold) return "low-stock";
    return "in-stock";
  };

  // Calculate inventory statistics
  const calculateStats = (medications) => {
    const total = medications.length;
    const lowStock = medications.filter(med => med.status === "low-stock").length;
    const outOfStock = medications.filter(med => med.status === "out-of-stock").length;
    
    setStats({
      totalItems: total,
      lowStock,
      outOfStock
    });
  };

  // Filter medications based on search term and status filter
  const filteredMedications = medicationsData.filter(
    (medication) => {
      const matchesSearch = 
        medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medication.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medication.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || medication.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    }
  );

  const handleStatusChange = async (medicationId, newStatus) => {
    try {
      // First update UI optimistically
      setMedicationsData(prevData => 
        prevData.map(medication => 
          medication.id === medicationId 
            ? { ...medication, status: newStatus } 
            : medication
        )
      );
      
      // Then call the API
      await pharmacyService.updateMedicine(medicationId, { status: newStatus });
      
      toast({
        title: "Status Updated",
        description: "Medication status has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating medication status:", error);
      
      // Revert the optimistic update on error
      toast({
        title: "Update Failed",
        description: "Failed to update medication status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStock = (medication) => {
    setSelectedMedication(medication);
    setIsViewModalOpen(true);
  };

  const handleEditDetails = (medication) => {
    setSelectedMedication(medication);
    setIsEditModalOpen(true);
  };

  const handleDeleteMedication = async () => {
    if (!selectedMedicationId) return;
    
    try {
      // Call the API to delete the medication
      await pharmacyService.deleteMedicine(selectedMedicationId);
      
      // Update the UI after successful deletion
      setMedicationsData(prevData => 
        prevData.filter(medication => medication.id !== selectedMedicationId)
      );
      
      setIsDeleteDialogOpen(false);
      setSelectedMedicationId(null);
      
      toast({
        title: "Medication Deleted",
        description: "The medication has been deleted successfully.",
      });
      
      // Recalculate statistics
      calculateStats(
        medicationsData.filter(medication => medication.id !== selectedMedicationId)
      );
    } catch (error) {
      console.error("Error deleting medication:", error);
      
      toast({
        title: "Delete Failed",
        description: "Failed to delete medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddMedication = async (newMedication) => {
    try {
      // Call the API to add the medication
      const response = await pharmacyService.createMedicine(newMedication);
      
      // Update the UI with the new medication from the API response
      if (response && response.medicine) {
        // Format the new medication data
        const formattedMedication = {
          id: response.medicine._id || response.medicine.id,
          name: response.medicine.name,
          category: response.medicine.category,
          stock: response.medicine.stock,
          price: typeof response.medicine.price === 'number' 
            ? `$${response.medicine.price.toFixed(2)}` 
            : response.medicine.price,
          supplier: response.medicine.supplier,
          status: determineStockStatus(
            response.medicine.stock, 
            response.medicine.lowStockThreshold || 50
          )
        };
        
        setMedicationsData(prev => [...prev, formattedMedication]);
      } else {
        // Fallback if API doesn't return the expected format
        setMedicationsData(prev => [
          ...prev,
          { 
            ...newMedication, 
            id: `M00${prev.length + 1}`,
            status: determineStockStatus(newMedication.stock, 50)
          }
        ]);
      }
      
      setIsAddModalOpen(false);
      
      toast({
        title: "Medication Added",
        description: "New medication has been added successfully.",
      });
      
      // Recalculate statistics
      calculateStats([...medicationsData, newMedication]);
    } catch (error) {
      console.error("Error adding medication:", error);
      
      toast({
        title: "Add Failed",
        description: "Failed to add medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMedication = async (updatedMedication) => {
    try {
      // Call the API to update the medication
      await pharmacyService.updateMedicine(
        updatedMedication.id, 
        updatedMedication
      );
      
      // Update the UI after successful update
      setMedicationsData(prevData => 
        prevData.map(medication => 
          medication.id === updatedMedication.id 
            ? updatedMedication 
            : medication
        )
      );
      
      setIsEditModalOpen(false);
      
      toast({
        title: "Medication Updated",
        description: "Medication details have been updated successfully.",
      });
      
      // Recalculate statistics
      calculateStats(
        medicationsData.map(medication => 
          medication.id === updatedMedication.id ? updatedMedication : medication
        )
      );
    } catch (error) {
      console.error("Error updating medication:", error);
      
      toast({
        title: "Update Failed",
        description: "Failed to update medication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStockUpdate = async (id, quantity) => {
    try {
      // Call the API to update the stock
      await pharmacyService.updateStock(id, quantity);
      
      // Update the UI with the new stock level
      setMedicationsData(prevData => 
        prevData.map(medication => 
          medication.id === id 
            ? { 
                ...medication, 
                stock: medication.stock + quantity,
                status: determineStockStatus(medication.stock + quantity, 50)
              } 
            : medication
        )
      );
      
      setIsViewModalOpen(false);
      
      toast({
        title: "Stock Updated",
        description: `Stock has been ${quantity >= 0 ? "increased" : "decreased"} successfully.`,
      });
      
      // Recalculate statistics
      calculateStats(
        medicationsData.map(medication => 
          medication.id === id 
            ? { 
                ...medication, 
                stock: medication.stock + quantity,
                status: determineStockStatus(medication.stock + quantity, 50)
              } 
            : medication
        )
      );
    } catch (error) {
      console.error("Error updating stock:", error);
      
      toast({
        title: "Stock Update Failed",
        description: "Failed to update stock. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Pharmacy</h1>
          <p className="text-gray-600">Manage medication inventory</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search medications..."
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
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Medications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("in-stock")}>
                In Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("low-stock")}>
                Low Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("out-of-stock")}>
                Out of Stock
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className="bg-hospital-primary hover:bg-hospital-accent"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedications.length > 0 ? (
                filteredMedications.map((medication) => (
                  <TableRow key={medication.id}>
                    <TableCell className="font-medium">{medication.id}</TableCell>
                    <TableCell>{medication.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{medication.category}</TableCell>
                    <TableCell>{medication.stock}</TableCell>
                    <TableCell className="hidden md:table-cell">{medication.price}</TableCell>
                    <TableCell className="hidden md:table-cell">{medication.supplier}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={medication.status}
                        onValueChange={(value) => handleStatusChange(medication.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <Badge
                            className={cn(
                              "font-normal capitalize",
                              statusStyles[medication.status]
                            )}
                          >
                            {medication.status.replace('-', ' ')}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-stock">In Stock</SelectItem>
                          <SelectItem value="low-stock">Low Stock</SelectItem>
                          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleUpdateStock(medication)}
                          title="Update Stock"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditDetails(medication)}
                          title="Edit Details"
                        >
                          <FileEdit className="h-4 w-4" />
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
                            <DropdownMenuItem onClick={() => handleEditDetails(medication)}>
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStock(medication)}>
                              Update Stock
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedMedicationId(medication.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              Delete
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
                    No medications found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Medication</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medication? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMedication}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Medication Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <AddMedicationForm 
            onAdd={handleAddMedication}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pharmacy;
