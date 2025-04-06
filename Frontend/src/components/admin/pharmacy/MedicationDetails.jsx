
import React from "react";
import { Button } from "@/components/admin/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { Separator } from "@/components/admin/ui/separator";
import { Badge } from "@/components/admin/ui/badge";
import { 
  Pill, 
  Package, 
  DollarSign, 
  PackageCheck, 
  Building, 
  ShoppingBag 
} from "lucide-react";

const MedicationDetails = ({ medication, isOpen, onClose }) => {
  if (!medication) return null;

  // Function to get badge color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "in-stock":
        return "bg-green-500 hover:bg-green-600";
      case "low-stock":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "out-of-stock":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    return status
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Pill className="mr-2 h-5 w-5" />
            Medication Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about this medication.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{medication.name}</h3>
            <Badge className={getStatusColor(medication.status)}>
              {formatStatus(medication.status)}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-[20px_1fr] items-start gap-4">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Category</p>
              <p className="text-sm text-muted-foreground">{medication.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-[20px_1fr] items-start gap-4">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Stock</p>
              <p className="text-sm text-muted-foreground">{medication.stock} units</p>
            </div>
          </div>

          <div className="grid grid-cols-[20px_1fr] items-start gap-4">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Price</p>
              <p className="text-sm text-muted-foreground">{medication.price}</p>
            </div>
          </div>

          <div className="grid grid-cols-[20px_1fr] items-start gap-4">
            <Building className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Supplier</p>
              <p className="text-sm text-muted-foreground">{medication.supplier}</p>
            </div>
          </div>

          {medication.description && (
            <div className="pt-2">
              <p className="font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{medication.description}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationDetails;
