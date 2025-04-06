
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { cn } from "@/lib/utils";

const DoctorSchedule = ({ schedule }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Your Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.map((item) => (
            <div 
              key={item.id} 
              className={cn(
                "p-3 border-l-4 rounded-r-lg",
                item.isNext 
                  ? "border-hospital-primary bg-blue-50" 
                  : "border-gray-200 hover:bg-gray-50"
              )}
            >
              <div className="font-medium">{item.patientName}</div>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span>{item.time}</span>
                <span className="text-gray-300">•</span>
                <span>{item.type}</span>
              </div>
              {item.isNext && (
                <div className="mt-1 text-xs font-medium text-hospital-primary">
                  Next appointment
                </div>
              )}
            </div>
          ))}

          {schedule.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No appointments scheduled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorSchedule;
