import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";
import { AlertTriangle } from "lucide-react";

const PatientDeleteDialog = ({ open, onOpenChange, patient, onConfirm }) => {
  if (!patient) return null;

  // Get patient name from user data or fallback
  const patientName = patient.user?.name || "this patient";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete Patient Confirmation
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-medium">{patientName}</span>? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-500 mb-4">
            Deleting this patient will permanently remove all of the following information:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
            <li>Patient personal information</li>
            <li>Medical history and records</li>
            <li>Appointment history</li>
            <li>Billing information</li>
            <li>Prescriptions and medication history</li>
            <li>Lab results and diagnostics</li>
          </ul>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
          >
            Delete Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDeleteDialog; 