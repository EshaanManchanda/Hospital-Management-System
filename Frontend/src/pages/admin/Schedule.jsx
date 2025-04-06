
import React, { useState } from "react";
import { Button } from "@/components/admin/ui/button";
import { 
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Filter,
} from "lucide-react";
import { Calendar } from "@/components/admin/ui/calendar";
import { Badge } from "@/components/admin/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "@/components/admin/ui/use-toast";

// Mock schedule data
const scheduleEvents = [
  {
    id: 1,
    title: "Patient Consultation",
    start: "09:00",
    end: "09:45",
    date: new Date(2024, 3, 3), // April 3, 2024
    patient: "John Smith",
    type: "consultation",
    status: "confirmed",
    location: "Room 101",
  },
  {
    id: 2,
    title: "Surgery - Appendectomy",
    start: "10:30",
    end: "12:30",
    date: new Date(2024, 3, 3), // April 3, 2024
    patient: "Emily Johnson",
    type: "surgery",
    status: "confirmed",
    location: "OR 3",
  },
  {
    id: 3,
    title: "Team Meeting",
    start: "14:00",
    end: "15:00",
    date: new Date(2024, 3, 3), // April 3, 2024
    type: "meeting",
    status: "confirmed",
    location: "Conference Room B",
  },
  {
    id: 4,
    title: "Patient Follow-up",
    start: "11:00",
    end: "11:30",
    date: new Date(2024, 3, 4), // April 4, 2024
    patient: "Michael Brown",
    type: "consultation",
    status: "confirmed",
    location: "Room 105",
  },
  {
    id: 5,
    title: "Radiology Session",
    start: "13:30",
    end: "14:30",
    date: new Date(2024, 3, 4), // April 4, 2024
    patient: "Sarah Williams",
    type: "procedure",
    status: "pending",
    location: "Radiology Dept",
  },
];

// Styling for different event types
const eventTypeStyles = {
  consultation: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  surgery: "bg-red-100 text-red-800 hover:bg-red-100",
  meeting: "bg-green-100 text-green-800 hover:bg-green-100",
  procedure: "bg-purple-100 text-purple-800 hover:bg-purple-100",
};

const Schedule = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState(scheduleEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [filteredEventType, setFilteredEventType] = useState(null);

  // Filter events for the selected date and type
  const filteredEvents = events.filter(event => {
    const sameDate = event.date.toDateString() === date.toDateString();
    const matchesType = filteredEventType ? event.type === filteredEventType : true;
    return sameDate && matchesType;
  });

  // Sort events by start time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return a.start.localeCompare(b.start);
  });

  // Function to display event time range
  const formatTimeRange = (start, end) => {
    return `${start} - ${end}`;
  };

  // Function to handle viewing event details
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setIsViewEventOpen(true);
  };

  // Function to handle creating a new event
  const handleAddEvent = () => {
    // In a real app, this would open a form to create a new event
    setIsAddEventOpen(true);
  };

  // Calculate busy hours for the current date
  const busyHours = filteredEvents.length;
  const totalHours = 8; // Assuming an 8-hour workday
  const busyPercentage = Math.round((busyHours / totalHours) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Schedule</h1>
          <p className="text-gray-600">Manage your appointments and meetings</p>
        </div>
        
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>
                  {filteredEventType 
                    ? filteredEventType.charAt(0).toUpperCase() + filteredEventType.slice(1) 
                    : "All Events"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilteredEventType(null)}>
                All Events
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilteredEventType("consultation")}>
                Consultations
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilteredEventType("surgery")}>
                Surgeries
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilteredEventType("meeting")}>
                Meetings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilteredEventType("procedure")}>
                Procedures
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className="bg-hospital-primary hover:bg-hospital-accent"
            onClick={handleAddEvent}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Calendar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Day Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-base font-medium mb-2">
                  {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                <div className="flex items-center text-sm gap-4">
                  <div>
                    <span className="font-medium">{filteredEvents.length}</span> events
                  </div>
                  <div>
                    <span className="font-medium">{busyHours}</span> busy hours
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Busy day</span>
                  <span className="text-sm text-gray-500">{busyPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-hospital-primary h-2.5 rounded-full" 
                    style={{ width: `${busyPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                <h3 className="text-base font-medium">Event Types</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    Consultation
                  </Badge>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    Surgery
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Meeting
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                    Procedure
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Day schedule */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Daily Schedule</CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => {
                    const prevDay = new Date(date);
                    prevDay.setDate(prevDay.getDate() - 1);
                    setDate(prevDay);
                  }}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => {
                    const nextDay = new Date(date);
                    nextDay.setDate(nextDay.getDate() + 1);
                    setDate(nextDay);
                  }}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedEvents.length > 0 ? (
                  sortedEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleViewEvent(event)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-center min-w-16">
                          <div className="text-sm font-semibold">{event.start}</div>
                          <div className="text-xs text-gray-500">to {event.end}</div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <p className="text-sm text-gray-500">{event.location}</p>
                            </div>
                            <Badge
                              className={cn(
                                "font-normal capitalize",
                                eventTypeStyles[event.type]
                              )}
                            >
                              {event.type}
                            </Badge>
                          </div>
                          
                          {event.patient && (
                            <div className="mt-2 flex items-center text-sm">
                              <User className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{event.patient}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-700">No events scheduled</h3>
                    <p className="text-gray-500 mt-1">Add a new event for this day.</p>
                    <Button 
                      className="mt-4 bg-hospital-primary hover:bg-hospital-accent"
                      onClick={handleAddEvent}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* View Event Dialog */}
      <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                <Badge
                  className={cn(
                    "font-normal capitalize mt-2",
                    eventTypeStyles[selectedEvent.type]
                  )}
                >
                  {selectedEvent.type}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span>{selectedEvent.date.toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{formatTimeRange(selectedEvent.start, selectedEvent.end)}</span>
                </div>
              </div>
              
              {selectedEvent.patient && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Patient: {selectedEvent.patient}</span>
                </div>
              )}
              
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-1">Location</h4>
                <p className="text-sm">{selectedEvent.location}</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsViewEventOpen(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                toast({
                  title: "Edit Event",
                  description: "This would open the event edit form.",
                });
              }}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => {
                setIsViewEventOpen(false);
                toast({
                  title: "Event Deleted",
                  description: "The event has been removed from your schedule.",
                });
              }}>
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event in your schedule.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-center text-gray-500">
              Event creation form would be implemented here
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-hospital-primary" onClick={() => {
              setIsAddEventOpen(false);
              toast({
                title: "Event Created",
                description: "New event has been added to your schedule.",
              });
            }}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
