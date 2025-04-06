
import React from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/admin/ui/dropdown-menu";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { 
  Card, 
  CardContent 
} from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";
import { Search, Filter, ChevronDown, Plus } from "lucide-react";

const Doctors = () => {
  // Convert any TypeScript typing to regular JavaScript
  const [searchTerm, setSearchTerm] = React.useState("");
  const [doctors, setDoctors] = React.useState([
    // Mock data structure (would come from an API in a real app)
    {
      id: 1,
      name: "Dr. William Chen",
      specialty: "Cardiology",
      experience: "12 years",
      patients: 48,
      availability: "Available",
      imageUrl: "/assets/doctor-1.jpg" 
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      specialty: "Neurology",
      experience: "8 years",
      patients: 36,
      availability: "Available",
      imageUrl: "/assets/doctor-2.jpg"
    },
    {
      id: 3,
      name: "Dr. Michael Rodriguez",
      specialty: "Orthopedics",
      experience: "15 years",
      patients: 52,
      availability: "On Leave",
      imageUrl: "/assets/doctor-3.jpg"
    },
    // Additional doctors would be here
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Doctors</h1>
          <p className="text-gray-600">Manage hospital doctors and specialists</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search doctors..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Departments</DropdownMenuItem>
              <DropdownMenuItem>Cardiology</DropdownMenuItem>
              <DropdownMenuItem>Neurology</DropdownMenuItem>
              <DropdownMenuItem>Orthopedics</DropdownMenuItem>
              <DropdownMenuItem>Pediatrics</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-hospital-primary hover:bg-hospital-accent">
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doctor => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div className="relative pt-6 pb-4 px-6 flex flex-col items-center">
                  <div className="absolute top-0 right-0 p-3">
                    <Badge className={doctor.availability === "Available" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}>
                      {doctor.availability}
                    </Badge>
                  </div>
                  
                  <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
                    {doctor.imageUrl && (
                      <img 
                        src={doctor.imageUrl} 
                        alt={doctor.name} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold">{doctor.name}</h3>
                  <p className="text-gray-500">{doctor.specialty}</p>
                  
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-gray-600">{doctor.experience} experience</span>
                    <span className="mx-2">•</span>
                    <span className="text-gray-600">{doctor.patients} patients</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 flex divide-x">
                  <button className="flex-1 py-3 text-sm font-medium text-hospital-primary hover:bg-gray-50">
                    View Profile
                  </button>
                  <button className="flex-1 py-3 text-sm font-medium text-hospital-primary hover:bg-gray-50">
                    Schedule
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
