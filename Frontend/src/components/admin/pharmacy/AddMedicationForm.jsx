
import React, { useState } from "react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { DialogHeader, DialogFooter, DialogTitle } from "@/components/admin/ui/dialog";

const AddMedicationForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "0",
    price: "",
    supplier: "",
  });

  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Determine status based on stock
    let status = "in-stock";
    const stock = Number(formData.stock);
    
    if (stock <= 0) {
      status = "out-of-stock";
    } else if (stock <= 50) {
      status = "low-stock";
    }
    
    onAdd({
      ...formData,
      price: formData.price.startsWith("$") ? formData.price : `$${formData.price}`,
      stock: Number(formData.stock),
      status
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Add New Medication</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category
          </Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="stock" className="text-right">
            Stock
          </Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => handleChange('stock', e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price ($)
          </Label>
          <Input
            id="price"
            type="text"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className="col-span-3"
            placeholder="19.99"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="supplier" className="text-right">
            Supplier
          </Label>
          <Input
            id="supplier"
            value={formData.supplier}
            onChange={(e) => handleChange('supplier', e.target.value)}
            className="col-span-3"
            required
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Medication</Button>
      </DialogFooter>
    </form>
  );
};

export default AddMedicationForm;
