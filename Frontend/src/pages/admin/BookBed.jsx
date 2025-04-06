
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BedIcon, Calendar, User, Phone, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { useToast } from "@/components/admin/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";

const BookBed = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    patientID: "",
    contactNumber: "",
    bedType: "",
    ward: "",
    admissionDate: "",
    expectedStay: "",
    reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirmation(true);
    }, 1500);
  };

  const handleConfirmation = () => {
    setShowConfirmation(false);
    toast({
      title: "Bed Booked Successfully",
      description: `Bed has been reserved for ${formData.patientName}`,
    });
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BedIcon className="h-6 w-6 text-hospital-primary" />
            <CardTitle>Book a Hospital Bed</CardTitle>
          </div>
          <CardDescription>
            Fill in the patient details to reserve a hospital bed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  placeholder="Full Name"
                  required
                  value={formData.patientName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientID">Patient ID</Label>
                <Input
                  id="patientID"
                  name="patientID"
                  placeholder="Patient ID Number"
                  required
                  value={formData.patientID}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                placeholder="Phone number"
                required
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedType">Bed Type</Label>
                <Select
                  value={formData.bedType}
                  onValueChange={(value) => handleSelectChange("bedType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bed type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="semi-private">Semi-Private</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="icu">ICU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Ward</Label>
                <Select
                  value={formData.ward}
                  onValueChange={(value) => handleSelectChange("ward", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Ward</SelectItem>
                    <SelectItem value="pediatric">Pediatric Ward</SelectItem>
                    <SelectItem value="maternity">Maternity Ward</SelectItem>
                    <SelectItem value="surgical">Surgical Ward</SelectItem>
                    <SelectItem value="emergency">Emergency Ward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  name="admissionDate"
                  type="date"
                  required
                  value={formData.admissionDate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedStay">Expected Stay (days)</Label>
                <Input
                  id="expectedStay"
                  name="expectedStay"
                  type="number"
                  min="1"
                  placeholder="Number of days"
                  required
                  value={formData.expectedStay}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Admission</Label>
              <Input
                id="reason"
                name="reason"
                placeholder="Brief description of medical condition"
                required
                value={formData.reason}
                onChange={handleChange}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-hospital-primary" 
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Book Bed"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bed Reservation</DialogTitle>
            <DialogDescription>
              Please verify the details below for bed reservation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium"><User className="inline mr-1" /> Patient:</div>
              <div>{formData.patientName}</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium"><BedIcon className="inline mr-1" /> Bed Type:</div>
              <div>{formData.bedType || "Not specified"}</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium"><Calendar className="inline mr-1" /> Admission Date:</div>
              <div>{formData.admissionDate || "Not specified"}</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium"><Clock className="inline mr-1" /> Expected Stay:</div>
              <div>{formData.expectedStay ? `${formData.expectedStay} days` : "Not specified"}</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium"><Phone className="inline mr-1" /> Contact:</div>
              <div>{formData.contactNumber || "Not specified"}</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button className="bg-hospital-primary" onClick={handleConfirmation}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookBed;
