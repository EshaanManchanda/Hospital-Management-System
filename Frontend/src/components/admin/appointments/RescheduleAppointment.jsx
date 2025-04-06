
import React, { useState } from "react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { DialogHeader, DialogFooter, DialogTitle } from "@/components/admin/ui/dialog";
import { Calendar, Clock } from "lucide-react";

const RescheduleAppointment = ({ 
  appointment, 
  onReschedule, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    ...appointment
  });

  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onReschedule(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Reschedule Appointment</DialogTitle>
      </DialogHeader>

      <div className="space-y-6 py-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">{formData.patientName}</h3>
            <p className="text-gray-600">
              Current appointment with {formData.doctorName} on {formData.date} at {formData.time}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">
            <Calendar className="h-4 w-4 inline mr-2" />
            New Date
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
          <Label htmlFor="time" className="text-right">
            <Clock className="h-4 w-4 inline mr-2" />
            New Time
          </Label>
          <Input
            id="time"
            type="time"
            value={formData.time.replace(' AM', '').replace(' PM', '')}
            onChange={(e) => {
              // Convert 24hr format to 12hr with AM/PM
              const hours = parseInt(e.target.value.split(':')[0]);
              const minutes = e.target.value.split(':')[1];
              const period = hours >= 12 ? 'PM' : 'AM';
              const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
              handleChange('time', `${displayHours.toString().padStart(2, '0')}:${minutes} ${period}`);
            }}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger id="type" className="col-span-3">
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Consultation">Consultation</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
              <SelectItem value="Check-up">Check-up</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
              <SelectItem value="Surgery">Surgery</SelectItem>
              <SelectItem value="X-Ray">X-Ray</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="doctor" className="text-right">
            Doctor
          </Label>
          <Input
            id="doctor"
            value={formData.doctorName}
            onChange={(e) => handleChange('doctorName', e.target.value)}
            className="col-span-3"
            required
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Reschedule</Button>
      </DialogFooter>
    </form>
  );
};

export default RescheduleAppointment;
