import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";
import { 
  FileText, 
  User, 
  UserPlus, 
  Calendar, 
  Stethoscope, 
  Loader2, 
  Upload,
  AlertCircle
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { Label } from "@/components/admin/ui/label";
import { ScrollArea } from "@/components/admin/ui/scroll-area";
// Fix the imports to use direct imports instead of from index
import patientService from "../../services/patientservice";
import doctorService from "../../services/doctorService";
import medicalRecordService from "../../services/medicalRecordService";
import { toast } from "react-hot-toast";

const MedicalRecordDialog = ({ open, onOpenChange, onSuccess, record = null }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    diagnosis: "",
    treatment: "", // Added treatment field
    notes: "",
    date: new Date().toISOString().split('T')[0],
    type: "Consultation",
    attachments: null
  });

  // Update useEffect for record editing
  useEffect(() => {
    if (record) {
      setFormData({
        patient: record.patient?._id || record.patient || "",
        doctor: record.doctor?._id || record.doctor || "",
        diagnosis: record.diagnosis || "",
        treatment: record.treatment || "", // Added treatment field
        notes: record.notes || "",
        date: record.date ? new Date(record.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type: record.type || "Consultation",
        attachments: null
      });
    } else {
      // Reset form for new record
      setFormData({
        patient: "",
        doctor: "",
        diagnosis: "",
        treatment: "", // Added treatment field
        notes: "",
        date: new Date().toISOString().split('T')[0],
        type: "Consultation",
        attachments: null
      });
    }
  }, [record, open]);

  // Fetch patients and doctors when dialog opens
  useEffect(() => {
    if (open) {
      fetchPatientsAndDoctors();
    }
  }, [open]);

  const fetchPatientsAndDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch patients with proper pagination params
      const patientsResponse = await patientService.getAllPatients({
        page: 1,
        limit: 100
      });
      
      if (patientsResponse.success) {
        setPatients(patientsResponse.data || []);
      } else {
        console.error("Failed to fetch patients:", patientsResponse.message);
        toast.error("Failed to load patients");
      }
      
      // Fetch doctors
      const doctorsResponse = await doctorService.getAllDoctors();
      if (doctorsResponse.success) {
        setDoctors(doctorsResponse.data || []);
      } else {
        console.error("Failed to fetch doctors:", doctorsResponse.message);
        toast.error("Failed to load doctors");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load required data. Please try again.");
      toast.error("Failed to load required data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      attachments: e.target.files[0]
    }));
  };

  // Update handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.patient || !formData.diagnosis || !formData.treatment) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Create FormData object for file upload
      const submitData = new FormData();
      submitData.append("patient", formData.patient);
      if (formData.doctor) submitData.append("doctor", formData.doctor);
      submitData.append("diagnosis", formData.diagnosis);
      submitData.append("treatment", formData.treatment);
      submitData.append("notes", formData.notes || '');
      submitData.append("date", formData.date);
      submitData.append("type", formData.type);
      
      // Handle file attachments
      if (formData.attachments) {
        submitData.append("attachments", formData.attachments);
      }
      
      let response;
      if (record?._id) {
        // Update existing record
        response = await medicalRecordService.updateMedicalRecord(record._id, submitData);
      } else {
        // Create new record
        response = await medicalRecordService.createMedicalRecord(submitData);
      }
      
      if (response.success) {
        toast.success(record ? "Medical record updated successfully" : "Medical record created successfully");
        onSuccess(response.data);
        onOpenChange(false);
      } else {
        setError(response.message || "Failed to save medical record");
        toast.error(response.message || "Failed to save medical record");
      }
    } catch (err) {
      console.error("Error saving medical record:", err);
      setError("An error occurred while saving the medical record");
      toast.error("An error occurred while saving the medical record");
    } finally {
      setSubmitting(false);
    }
  };

  // Add Treatment field in the form
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {record ? "Edit Medical Record" : "Add New Medical Record"}
          </DialogTitle>
          <DialogDescription>
            {record 
              ? "Update the information for this medical record" 
              : "Create a new medical record for a patient"}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 p-3 rounded-md flex items-start mb-4">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <ScrollArea className="max-h-[calc(90vh-12rem)]">
          <form onSubmit={handleSubmit} className="space-y-4 px-1">
            {/* Patient Selection */}
            <div className="space-y-2">
              <Label htmlFor="patient" className="font-medium">
                Patient <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.patient}
                onValueChange={(value) => handleSelectChange("patient", value)}
                disabled={loading || submitting}
              >
                <SelectTrigger id="patient" className="w-full">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.length > 0 ? (
                    patients.map((patient) => (
                      <SelectItem key={patient._id} value={patient._id}>
                        {patient.user?.name || patient.name || "Unknown Patient"}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-patients" disabled>
                      No patients available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {patients.length === 0 && !loading && (
                <p className="text-xs text-amber-600 mt-1">
                  No patients found. Please ensure patients are registered in the system.
                </p>
              )}
            </div>
            
            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label htmlFor="doctor" className="font-medium">
                Doctor
              </Label>
              <Select
                value={formData.doctor}
                onValueChange={(value) => handleSelectChange("doctor", value)}
                disabled={loading || submitting}
              >
                <SelectTrigger id="doctor" className="w-full">
                  <SelectValue placeholder="Select a doctor (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <SelectItem key={doctor._id} value={doctor._id}>
                        Dr. {doctor.user?.name || doctor.name || "Unknown Doctor"}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-doctors" disabled>
                      No doctors available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {doctors.length === 0 && !loading && (
                <p className="text-xs text-amber-600 mt-1">
                  No doctors found. Doctor assignment is optional.
                </p>
              )}
            </div>
            
            {/* Record Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="font-medium">
                Record Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
                disabled={submitting}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Lab Test">Lab Test</SelectItem>
                  <SelectItem value="X-Ray">X-Ray</SelectItem>
                  <SelectItem value="MRI">MRI</SelectItem>
                  <SelectItem value="CT Scan">CT Scan</SelectItem>
                  <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                  <SelectItem value="Surgery">Surgery</SelectItem>
                  <SelectItem value="Prescription">Prescription</SelectItem>
                  <SelectItem value="Vaccination">Vaccination</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="font-medium">
                Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="pl-10"
                  disabled={submitting}
                />
              </div>
            </div>
            
            {/* Diagnosis */}
            <div className="space-y-2">
              <Label htmlFor="diagnosis" className="font-medium">
                Diagnosis / Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                placeholder="Enter diagnosis or record title"
                disabled={submitting}
                required
              />
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter detailed notes about the medical record"
                rows={4}
                disabled={submitting}
              />
            </div>
            
            {/* File Attachment */}
            <div className="space-y-2">
              <Label htmlFor="attachments" className="font-medium">
                Attachments
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Drag and drop files here, or click to select files
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports: PDF, JPG, PNG, DOCX (Max 10MB)
                  </p>
                  <Input
                    id="attachments"
                    name="attachments"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={submitting}
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("attachments").click()}
                    disabled={submitting}
                  >
                    Select File
                  </Button>
                </div>
                {formData.attachments && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-700 truncate">
                      {formData.attachments.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </ScrollArea>
        
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !formData.patient || !formData.diagnosis}
            className="ml-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {record ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{record ? "Update Record" : "Create Record"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordDialog;