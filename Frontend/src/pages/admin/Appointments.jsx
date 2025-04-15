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
import { toast } from "@/components/admin/ui/use-toast";
import { 
  Search, 
  MoreHorizontal,
  Plus, 
  FileEdit, 
  Trash2,
  Calendar,
  Filter,
  ChevronDown,
  CalendarCheck,
  X,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppointmentDetails from "@/components/admin/appointments/AppointmentDetails";
import RescheduleAppointment from "@/components/admin/appointments/RescheduleAppointment";
import NewAppointment from "@/components/admin/appointments/NewAppointment";

import appointmentService from "@/services/appointmentService";

const statusStyles = {
  scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
};

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMarkCompleteDialogOpen, setIsMarkCompleteDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, [page, limit]);
  
  // Function to fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await appointmentService.getAllAppointments(page, limit);
      
      if (response && response.success) {
        // Format the appointments data to match the expected structure
        const formattedAppointments = response.data.map(appointment => ({
          id: appointment._id,
          patientName: appointment.patient?.name || 'Unknown Patient',
          doctorName: appointment.doctor?.user?.name || 'Unknown Doctor',
          date: new Date(appointment.date).toISOString().split('T')[0],
          time: appointment.time,
          type: appointment.type,
          status: appointment.status,
          // Store the original appointment data for reference
          originalData: appointment
        }));
        
        setAppointmentsData(formattedAppointments);
        setTotalCount(response.count || 0);
      } else {
        setError(response?.message || 'Failed to fetch appointments');
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter appointments based on search term and status filter
  const filteredAppointments = appointmentsData.filter(
    (appointment) => {
      const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || appointment.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    }
  );

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      // Find the appointment to update
      const appointmentToUpdate = appointmentsData.find(app => app.id === appointmentId);
      if (!appointmentToUpdate) return;
      
      // Call API to update appointment status
      const response = await appointmentService.updateAppointment(appointmentId, {
        status: newStatus
      });
      
      if (response && response.success) {
        // Update local state
        setAppointmentsData(prevData => 
          prevData.map(appointment => 
            appointment.id === appointmentId 
              ? { ...appointment, status: newStatus } 
              : appointment
          )
        );
        
        toast({
          title: "Status Updated",
          description: "Appointment status has been updated successfully.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: response?.message || "Failed to update appointment status.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the appointment status.",
        variant: "destructive"
      });
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedAppointmentId) return;
    
    try {
      // Call API to update appointment status
      const response = await appointmentService.updateAppointment(selectedAppointmentId, {
        status: "completed"
      });
      
      if (response && response.success) {
        // Update local state
        setAppointmentsData(prevData => 
          prevData.map(appointment => 
            appointment.id === selectedAppointmentId 
              ? { ...appointment, status: "completed" } 
              : appointment
          )
        );
        
        setIsMarkCompleteDialogOpen(false);
        setSelectedAppointmentId(null);
        
        toast({
          title: "Appointment Completed",
          description: "The appointment has been marked as completed.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: response?.message || "Failed to mark appointment as completed.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error marking appointment as completed:', err);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the appointment.",
        variant: "destructive"
      });
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointmentId) return;
    
    try {
      // Call API to update appointment status
      const response = await appointmentService.updateAppointment(selectedAppointmentId, {
        status: "cancelled"
      });
      
      if (response && response.success) {
        // Update local state
        setAppointmentsData(prevData => 
          prevData.map(appointment => 
            appointment.id === selectedAppointmentId 
              ? { ...appointment, status: "cancelled" } 
              : appointment
          )
        );
        
        setIsDeleteDialogOpen(false);
        setSelectedAppointmentId(null);
        
        toast({
          title: "Appointment Cancelled",
          description: "The appointment has been cancelled successfully.",
        });
      } else {
        toast({
          title: "Cancellation Failed",
          description: response?.message || "Failed to cancel the appointment.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      toast({
        title: "Cancellation Failed",
        description: "An error occurred while cancelling the appointment.",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
  };

  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      // Prepare data for API
      const appointmentData = {
        date: updatedAppointment.date,
        time: updatedAppointment.time,
        type: updatedAppointment.type,
        // Include any other fields that might have been updated
      };
      
      // Call API to update appointment
      const response = await appointmentService.updateAppointment(updatedAppointment.id, appointmentData);
      
      if (response && response.success) {
        // Update local state
        setAppointmentsData(prevData => 
          prevData.map(appointment => 
            appointment.id === updatedAppointment.id 
              ? updatedAppointment 
              : appointment
          )
        );
        setIsRescheduleModalOpen(false);
        
        toast({
          title: "Appointment Updated",
          description: "The appointment has been rescheduled successfully.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: response?.message || "Failed to update the appointment.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error updating appointment:', err);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the appointment.",
        variant: "destructive"
      });
    }
  };

  const handleAddAppointment = async (newAppointment) => {
    try {
      // Call API to create appointment
      const response = await appointmentService.createAppointment({
        patientId: newAppointment.patientId,
        doctorId: newAppointment.doctorId,
        date: newAppointment.date,
        time: newAppointment.time,
        type: newAppointment.type,
        description: newAppointment.description || '',
        symptoms: newAppointment.symptoms || ''
      });
      
      if (response && response.success) {
        // Refresh the appointments list
        fetchAppointments();
        setIsNewAppointmentModalOpen(false);
        
        toast({
          title: "Appointment Created",
          description: "New appointment has been created successfully.",
        });
      } else {
        toast({
          title: "Creation Failed",
          description: response?.message || "Failed to create the appointment.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error creating appointment:', err);
      toast({
        title: "Creation Failed",
        description: "An error occurred while creating the appointment.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Appointments</h1>
          <p className="text-gray-600">Manage patient appointments and scheduling</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search appointments..."
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
                All Appointments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("scheduled")}>
                Scheduled
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className="bg-hospital-primary hover:bg-hospital-accent"
            onClick={() => setIsNewAppointmentModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden md:table-cell">Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden md:table-cell">Time</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hospital-primary"></div>
                      <span className="ml-2">Loading appointments...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-red-500">
                    {error}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-4"
                      onClick={fetchAppointments}
                    >
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.id}</TableCell>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell className="hidden md:table-cell">{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell className="hidden md:table-cell">{appointment.time}</TableCell>
                    <TableCell className="hidden md:table-cell">{appointment.type}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={appointment.status}
                        onValueChange={(value) => handleStatusChange(appointment.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <Badge
                            className={cn(
                              "font-normal capitalize",
                              statusStyles[appointment.status]
                            )}
                          >
                            {appointment.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(appointment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReschedule(appointment)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            <span>Reschedule</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedAppointmentId(appointment.id);
                              setIsMarkCompleteDialogOpen(true);
                            }}
                            disabled={appointment.status === "completed" || appointment.status === "cancelled"}
                          >
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            <span>Mark as Complete</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => {
                              setSelectedAppointmentId(appointment.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            disabled={appointment.status === "cancelled"}
                          >
                            <X className="mr-2 h-4 w-4" />
                            <span>Cancel Appointment</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No appointments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && !error && totalCount > 0 && (
        <div className="flex justify-between items-center mt-4 px-2">
          <div className="text-sm text-gray-500">
            Showing {appointmentsData.length} of {totalCount} appointments
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(prev => prev + 1)}
              disabled={page * limit >= totalCount}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedAppointment && (
            <AppointmentDetails 
              appointment={selectedAppointment} 
              onClose={() => setIsDetailsModalOpen(false)} 
              // Pass the original data from API for complete details
              originalData={selectedAppointment.originalData}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedAppointment && (
            <RescheduleAppointment 
              appointment={selectedAppointment} 
              onReschedule={handleUpdateAppointment}
              onCancel={() => setIsRescheduleModalOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* New Appointment Modal */}
      <Dialog open={isNewAppointmentModalOpen} onOpenChange={setIsNewAppointmentModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <NewAppointment 
            onAdd={handleAddAppointment}
            onCancel={() => setIsNewAppointmentModalOpen(false)} 
            // Refresh function to update the list after adding
            onSuccess={() => fetchAppointments()}
          />
        </DialogContent>
      </Dialog>

      {/* Mark Complete Confirmation Dialog */}
      <Dialog open={isMarkCompleteDialogOpen} onOpenChange={setIsMarkCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Completion</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this appointment as completed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMarkCompleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMarkComplete}
            >
              Mark as Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Keep Appointment
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelAppointment}
            >
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
