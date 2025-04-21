import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/admin/ui/dialog";
import { Pill, Calendar } from "lucide-react";

const MedicineDetailsDialog = ({ open, onOpenChange, medicine }) => {
  if (!medicine) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            {medicine.name}
          </DialogTitle>
          <DialogDescription>
            Medicine details and instructions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div><span className="font-semibold">Dosage:</span> {medicine.dosage}</div>
          <div><span className="font-semibold">Frequency:</span> {medicine.frequency}</div>
          <div><span className="font-semibold">Instructions:</span> {medicine.instructions}</div>
          <div><span className="font-semibold">Prescribed By:</span> {medicine.prescribedBy}</div>
          <div><span className="font-semibold">Start Date:</span> {medicine.startDate ? new Date(medicine.startDate).toLocaleDateString() : "N/A"}</div>
          <div><span className="font-semibold">End Date:</span> {medicine.endDate ? new Date(medicine.endDate).toLocaleDateString() : "N/A"}</div>
          <div><span className="font-semibold">Refills Remaining:</span> {medicine.refillsRemaining}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicineDetailsDialog;