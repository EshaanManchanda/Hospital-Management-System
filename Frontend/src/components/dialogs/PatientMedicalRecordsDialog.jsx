import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/admin/ui/dialog";
import { Button } from "@/components/admin/ui/button";
import { ScrollArea } from "@/components/admin/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { 
  HeartPulse, 
  Pill,
  ClipboardList, 
  Activity,
  Stethoscope,
  FileText,
  FileSymlink,
  Save
} from "lucide-react";
import { Textarea } from "@/components/admin/ui/textarea";
import { Label } from "@/components/admin/ui/label";
import { Input } from "@/components/admin/ui/input";
import { Badge } from "@/components/admin/ui/badge";
import { cn } from "@/lib/utils";

const PatientMedicalRecordsDialog = ({ open, onOpenChange, patient, onSave }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Create state for editable fields with initial values from patient data
  const [medicalNotes, setMedicalNotes] = useState(patient?.notes || "");
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: patient?.vitalSigns?.bloodPressure || "",
    heartRate: patient?.vitalSigns?.heartRate || "",
    temperature: patient?.vitalSigns?.temperature || "",
    respiratoryRate: patient?.vitalSigns?.respiratoryRate || "",
    oxygenSaturation: patient?.vitalSigns?.oxygenSaturation || ""
  });
  
  // Reset states when patient changes
  React.useEffect(() => {
    if (patient) {
      setMedicalNotes(patient.notes || "");
      setVitalSigns({
        bloodPressure: patient?.vitalSigns?.bloodPressure || "",
        heartRate: patient?.vitalSigns?.heartRate || "",
        temperature: patient?.vitalSigns?.temperature || "",
        respiratoryRate: patient?.vitalSigns?.respiratoryRate || "",
        oxygenSaturation: patient?.vitalSigns?.oxygenSaturation || ""
      });
      setIsEditMode(false);
    }
  }, [patient, open]);

  if (!patient) return null;

  // Helper function to render safe items as a list
  const renderList = (items, emptyMessage) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <p className="text-sm text-muted-foreground italic">{emptyMessage}</p>;
    }
    
    return (
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  const handleSave = () => {
    // Create updated patient record
    const updatedPatient = {
      ...patient,
      notes: medicalNotes,
      vitalSigns: vitalSigns
    };
    
    // Call the provided onSave function with updated data
    onSave(updatedPatient);
    
    // Exit edit mode
    setIsEditMode(false);
  };

  const getLastVisitDate = () => {
    if (patient?.lastVisit) {
      return new Date(patient.lastVisit).toLocaleDateString();
    }
    
    if (patient?.appointments && patient.appointments.length > 0) {
      // Sort appointments by date (newest first)
      const sortedAppointments = [...patient.appointments]
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      if (sortedAppointments[0].date) {
        return new Date(sortedAppointments[0].date).toLocaleDateString();
      }
    }
    
    return "No recent visits";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Medical Records for {patient.user?.name || "Unknown Patient"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="px-2">
                  ID: {patient._id}
                </Badge>
                <Badge variant="outline" className="px-2">
                  Last Visit: {getLastVisitDate()}
                </Badge>
              </div>
              <Button 
                variant={isEditMode ? "default" : "outline"}
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? "Cancel Editing" : "Edit Records"}
              </Button>
            </div>

            <Tabs defaultValue="summary">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <h4 className="font-medium">Medical Notes</h4>
                  </div>
                  {isEditMode ? (
                    <Textarea 
                      value={medicalNotes} 
                      onChange={(e) => setMedicalNotes(e.target.value)}
                      rows={6}
                      placeholder="Enter detailed medical notes for this patient"
                    />
                  ) : (
                    <div className="border rounded-md p-3 bg-gray-50">
                      {medicalNotes ? (
                        <p className="text-sm whitespace-pre-wrap">{medicalNotes}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No medical notes recorded</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Pill className="h-4 w-4 mr-2 text-primary" />
                      <h4 className="font-medium">Allergies</h4>
                    </div>
                    <div className="border rounded-md p-3 bg-gray-50">
                      {renderList(patient.allergies, "No allergies recorded")}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <HeartPulse className="h-4 w-4 mr-2 text-primary" />
                      <h4 className="font-medium">Chronic Conditions</h4>
                    </div>
                    <div className="border rounded-md p-3 bg-gray-50">
                      {renderList(patient.chronicConditions, "No chronic conditions recorded")}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                    <h4 className="font-medium">Current Diagnoses</h4>
                  </div>
                  <div className="border rounded-md p-3 bg-gray-50">
                    {renderList(patient.diagnoses, "No current diagnoses recorded")}
                  </div>
                </div>
              </TabsContent>
              
              {/* Vitals Tab */}
              <TabsContent value="vitals" className="space-y-4">
                <div className="border rounded-md p-4 bg-gray-50">
                  <h4 className="font-medium flex items-center mb-3">
                    <Activity className="h-4 w-4 mr-2 text-primary" />
                    Latest Vital Signs
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Blood Pressure</Label>
                      {isEditMode ? (
                        <Input 
                          value={vitalSigns.bloodPressure}
                          onChange={(e) => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})}
                          placeholder="e.g. 120/80 mmHg"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm font-medium mt-1">
                          {vitalSigns.bloodPressure || "Not recorded"}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Heart Rate</Label>
                      {isEditMode ? (
                        <Input 
                          value={vitalSigns.heartRate}
                          onChange={(e) => setVitalSigns({...vitalSigns, heartRate: e.target.value})}
                          placeholder="e.g. 72 bpm"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm font-medium mt-1">
                          {vitalSigns.heartRate || "Not recorded"}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Temperature</Label>
                      {isEditMode ? (
                        <Input 
                          value={vitalSigns.temperature}
                          onChange={(e) => setVitalSigns({...vitalSigns, temperature: e.target.value})}
                          placeholder="e.g. 98.6 °F"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm font-medium mt-1">
                          {vitalSigns.temperature || "Not recorded"}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Respiratory Rate</Label>
                      {isEditMode ? (
                        <Input 
                          value={vitalSigns.respiratoryRate}
                          onChange={(e) => setVitalSigns({...vitalSigns, respiratoryRate: e.target.value})}
                          placeholder="e.g. 16 breaths/min"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm font-medium mt-1">
                          {vitalSigns.respiratoryRate || "Not recorded"}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Oxygen Saturation</Label>
                      {isEditMode ? (
                        <Input 
                          value={vitalSigns.oxygenSaturation}
                          onChange={(e) => setVitalSigns({...vitalSigns, oxygenSaturation: e.target.value})}
                          placeholder="e.g. 98%"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm font-medium mt-1">
                          {vitalSigns.oxygenSaturation || "Not recorded"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-3">Physical Measurements</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Height</Label>
                      <p className="text-sm font-medium mt-1">
                        {patient.height ? `${patient.height} cm` : "Not recorded"}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Weight</Label>
                      <p className="text-sm font-medium mt-1">
                        {patient.weight ? `${patient.weight} kg` : "Not recorded"}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">BMI</Label>
                      <p className="text-sm font-medium mt-1">
                        {patient.height && patient.weight 
                          ? (patient.weight / ((patient.height/100) * (patient.height/100))).toFixed(1)
                          : "Not available"}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Blood Type</Label>
                      <p className="text-sm font-medium mt-1">
                        {patient.bloodType || "Not recorded"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Conditions Tab */}
              <TabsContent value="conditions" className="space-y-4">
                <div>
                  <h4 className="font-medium flex items-center mb-3">
                    <HeartPulse className="h-4 w-4 mr-2 text-primary" />
                    Chronic Conditions
                  </h4>
                  <div className="border rounded-md p-4 bg-gray-50">
                    {renderList(patient.chronicConditions, "No chronic conditions recorded")}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center mb-3">
                    <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                    Current Diagnoses
                  </h4>
                  <div className="border rounded-md p-4 bg-gray-50">
                    {renderList(patient.diagnoses, "No current diagnoses recorded")}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center mb-3">
                    <Pill className="h-4 w-4 mr-2 text-primary" />
                    Allergies
                  </h4>
                  <div className="border rounded-md p-4 bg-gray-50">
                    {renderList(patient.allergies, "No allergies recorded")}
                  </div>
                </div>
              </TabsContent>
              
              {/* Medications Tab */}
              <TabsContent value="medications" className="space-y-4">
                <div>
                  <h4 className="font-medium flex items-center mb-3">
                    <Pill className="h-4 w-4 mr-2 text-primary" />
                    Current Medications
                  </h4>
                  <div className="border rounded-md p-4 bg-gray-50">
                    {renderList(patient.medications, "No current medications recorded")}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center mb-3">
                    <FileSymlink className="h-4 w-4 mr-2 text-primary" />
                    Prescription History
                  </h4>
                  <div className="border rounded-md p-4 bg-gray-50">
                    {patient.prescriptions && Array.isArray(patient.prescriptions) && patient.prescriptions.length > 0 ? (
                      <div className="space-y-3">
                        {patient.prescriptions.map((prescription, index) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="flex justify-between">
                              <p className="font-medium">{prescription.medication}</p>
                              <Badge variant="outline">{prescription.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Prescribed: {new Date(prescription.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm">Dosage: {prescription.dosage}</p>
                            <p className="text-sm">Doctor: {prescription.doctor}</p>
                            {prescription.notes && (
                              <p className="text-sm text-muted-foreground mt-1">{prescription.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No prescription history found</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              {/* History Tab */}
              <TabsContent value="history" className="space-y-4">
                <div>
                  <h4 className="font-medium flex items-center mb-3">
                    <ClipboardList className="h-4 w-4 mr-2 text-primary" />
                    Past Surgeries
                  </h4>
                  <div className="border rounded-md p-4 bg-gray-50">
                    {renderList(patient.surgeries, "No surgical history recorded")}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center mb-3">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    Family Medical History
                  </h4>
                  <div className="border rounded-md p-4 bg-gray-50">
                    {patient.familyHistory ? (
                      <p className="text-sm">{patient.familyHistory}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No family medical history recorded
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center mb-3">
                    <Activity className="h-4 w-4 mr-2 text-primary" />
                    Immunization Records
                  </h4>
                  <div className="border rounded-md p-4 bg-gray-50">
                    {patient.immunizations && Array.isArray(patient.immunizations) && patient.immunizations.length > 0 ? (
                      <div className="space-y-2">
                        {patient.immunizations.map((immunization, index) => (
                          <div key={index} className="border rounded-md p-2 flex justify-between">
                            <div>
                              <p className="font-medium">{immunization.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Date: {new Date(immunization.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge>{immunization.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No immunization records found
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
        
        <DialogFooter className="pt-4 gap-2">
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientMedicalRecordsDialog; 