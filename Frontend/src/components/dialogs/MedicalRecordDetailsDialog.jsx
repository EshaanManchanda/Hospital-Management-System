import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/admin/ui/dialog";
import { Badge } from "@/components/admin/ui/badge";
import { FileText, Calendar, User, Stethoscope } from "lucide-react";

const MedicalRecordDetailsDialog = ({ open, onOpenChange, record }) => {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical Record Details
          </DialogTitle>
          <DialogDescription>
            View the full details of your medical record.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <span className="font-semibold">Title:</span> {record.title || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Type:</span> {record.type || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Date:</span> {record.date ? new Date(record.date).toLocaleString() : "N/A"}
          </div>
          <div>
            <span className="font-semibold">Doctor:</span> {record.doctor?.name || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Diagnosis:</span> {record.diagnosis || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Treatment:</span> {record.treatment || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Notes:</span> {record.notes || "N/A"}
          </div>
          {record.vitalSigns && (
            <div>
              <span className="font-semibold">Vital Signs:</span>
              <ul className="ml-4 list-disc text-sm">
                {Object.entries(record.vitalSigns).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value !== null && value !== undefined ? value : "N/A"}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {record.attachments && record.attachments.length > 0 && (
            <div>
              <span className="font-semibold">Attachments:</span>
              <ul className="ml-4 list-disc text-sm">
                {record.attachments.map((att, idx) => (
                  <li key={idx}>
                    <a href={att.filePath} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                      {att.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordDetailsDialog;