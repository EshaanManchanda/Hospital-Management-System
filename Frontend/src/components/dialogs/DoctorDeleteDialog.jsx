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
import { AlertCircle } from "lucide-react";

const DoctorDeleteDialog = ({ open, onOpenChange, doctor, onConfirm }) => {
  if (!doctor) return null;

  const doctorName = doctor.user?.name || "this doctor";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {doctorName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Deleting this doctor will remove all their information from the system, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
            <li>Doctor's profile and personal information</li>
            <li>All appointment records with patients</li>
            <li>Access to the system</li>
          </ul>
          <p className="mt-4 text-sm font-medium">
            Please confirm that you want to proceed with this deletion.
          </p>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
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
            Delete Doctor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDeleteDialog; 