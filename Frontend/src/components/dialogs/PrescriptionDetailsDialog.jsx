import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/admin/ui/dialog";
import { Badge } from "@/components/admin/ui/badge";
import { Calendar, User, Pill, ClipboardList } from "lucide-react";

const PrescriptionDetailsDialog = ({ open, onOpenChange, prescription }) => {
  if (!prescription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Prescription Details
          </DialogTitle>
          <DialogDescription>
            All information for this prescription.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <span className="font-semibold">Date:</span>{" "}
            {prescription.createdAt ? new Date(prescription.createdAt).toLocaleString() : "N/A"}
          </div>
          <div>
            <span className="font-semibold">Doctor:</span>{" "}
            {prescription.doctor?.name} ({prescription.doctor?.specialization})
          </div>
          <div>
            <span className="font-semibold">Diagnosis:</span> {prescription.diagnosis}
          </div>
          <div>
            <span className="font-semibold">Instructions:</span> {prescription.instructions}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <Badge>{prescription.status}</Badge>
          </div>
          <div>
            <span className="font-semibold">Medicines:</span>
            <ul className="ml-4 list-disc text-sm">
              {prescription.medicines?.map((med, idx) => (
                <li key={idx}>
                  <span className="font-medium">{med.medicine?.name}</span>
                  {` (${med.dosage}, ${med.frequency}, ${med.duration})`}
                  {med.notes && <span> - {med.notes}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-semibold">Start Date:</span>{" "}
            {prescription.startDate ? new Date(prescription.startDate).toLocaleDateString() : "N/A"}
          </div>
          <div>
            <span className="font-semibold">End Date:</span>{" "}
            {prescription.endDate ? new Date(prescription.endDate).toLocaleDateString() : "N/A"}
          </div>
          <div>
            <span className="font-semibold">Follow Up Date:</span>{" "}
            {prescription.followUpDate ? new Date(prescription.followUpDate).toLocaleDateString() : "N/A"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionDetailsDialog;