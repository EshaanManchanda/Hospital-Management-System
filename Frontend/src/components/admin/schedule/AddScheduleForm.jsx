
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User } from "lucide-react";

const AddScheduleForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    doctorName: "",
    date: "",
    startTime: "",
    endTime: "",
    department: "",
    details: "",
    status: "Available", // Default status
  });

  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a simple ID
    const newSchedule = {
      ...formData,
      id: `sch-${Date.now()}`
    };
    
    onAdd(newSchedule);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Add Doctor Schedule</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="doctorName" className="text-right">
            <User className="h-4 w-4 inline mr-2" />
            Doctor Name
          </Label>
          <Input
            id="doctorName"
            value={formData.doctorName}
            onChange={(e) => handleChange('doctorName', e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">
            <Calendar className="h-4 w-4 inline mr-2" />
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startTime" className="text-right">
            <Clock className="h-4 w-4 inline mr-2" />
            Start Time
          </Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => {
              // Convert 24hr format to 12hr with AM/PM
              const hours = parseInt(e.target.value.split(':')[0]);
              const minutes = e.target.value.split(':')[1];
              const period = hours >= 12 ? 'PM' : 'AM';
              const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
              handleChange('startTime', `${displayHours.toString().padStart(2, '0')}:${minutes} ${period}`);
            }}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="endTime" className="text-right">
            <Clock className="h-4 w-4 inline mr-2" />
            End Time
          </Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => {
              // Convert 24hr format to 12hr with AM/PM
              const hours = parseInt(e.target.value.split(':')[0]);
              const minutes = e.target.value.split(':')[1];
              const period = hours >= 12 ? 'PM' : 'AM';
              const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
              handleChange('endTime', `${displayHours.toString().padStart(2, '0')}:${minutes} ${period}`);
            }}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="department" className="text-right">
            Department
          </Label>
          <Select
            value={formData.department}
            onValueChange={(value) => handleChange('department', value)}
          >
            <SelectTrigger id="department" className="col-span-3">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cardiology">Cardiology</SelectItem>
              <SelectItem value="Neurology">Neurology</SelectItem>
              <SelectItem value="Orthopedics">Orthopedics</SelectItem>
              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
              <SelectItem value="Obstetrics">Obstetrics</SelectItem>
              <SelectItem value="Oncology">Oncology</SelectItem>
              <SelectItem value="Dermatology">Dermatology</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger id="status" className="col-span-3">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Unavailable">Unavailable</SelectItem>
              <SelectItem value="On Call">On Call</SelectItem>
              <SelectItem value="Surgery">Surgery</SelectItem>
              <SelectItem value="Vacation">Vacation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="details" className="text-right pt-2">
            Details
          </Label>
          <Textarea
            id="details"
            value={formData.details}
            onChange={(e) => handleChange('details', e.target.value)}
            className="col-span-3"
            placeholder="Additional details about this schedule"
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Schedule</Button>
      </DialogFooter>
    </form>
  );
};

export default AddScheduleForm;
