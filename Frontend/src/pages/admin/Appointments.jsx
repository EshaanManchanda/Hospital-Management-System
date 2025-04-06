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

// Mock appointment data
const appointments = [
  {
    id: "A001",
    patientName: "Sarah Johnson",
    doctorName: "Dr. James Wilson",
    date: "2023-12-22",
    time: "09:00 AM",
    type: "Consultation",
    status: "scheduled",
  },
  {
    id: "A002",
    patientName: "Mike Peterson",
    doctorName: "Dr. Sarah Parker",
    date: "2023-12-22",
    time: "10:30 AM",
    type: "Follow-up",
    status: "completed",
  },
  {
    id: "A003",
    patientName: "Emily Williams",
    doctorName: "Dr. Michael Chen",
    date: "2023-12-22",
    time: "11:45 AM",
    type: "Emergency",
    status: "scheduled",
  },
  {
    id: "A004",
    patientName: "Robert Thompson",
    doctorName: "Dr. Elizabeth Taylor",
    date: "2023-12-23",
    time: "09:15 AM",
    type: "Consultation",
    status: "cancelled",
  },
  {
    id: "A005",
    patientName: "Linda Garcia",
    doctorName: "Dr. Robert Johnson",
    date: "2023-12-23",
    time: "02:00 PM",
    type: "Follow-up",
    status: "scheduled",
  },
];

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
  const [appointmentsData, setAppointmentsData] = useState(appointments);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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

  const handleStatusChange = (appointmentId, newStatus) => {
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
  };

  const handleMarkComplete = () => {
    if (!selectedAppointmentId) return;
    
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
  };

  const handleCancelAppointment = () => {
    if (!selectedAppointmentId) return;
    
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
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
  };

  const handleUpdateAppointment = (updatedAppointment) => {
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
  };

  const handleAddAppointment = (newAppointment) => {
    setAppointmentsData(prev => [
      ...prev,
      { ...newAppointment, id: `A00${prev.length + 1}`, status: "scheduled" }
    ]);
    setIsNewAppointmentModalOpen(false);
    
    toast({
      title: "Appointment Created",
      description: "New appointment has been created successfully.",
    });
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
              {filteredAppointments.length > 0 ? (
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

      {/* View Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedAppointment && (
            <AppointmentDetails 
              appointment={selectedAppointment} 
              onClose={() => setIsDetailsModalOpen(false)} 
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
