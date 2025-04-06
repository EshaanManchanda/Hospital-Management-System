
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Building, ScrollText } from "lucide-react";

const statusStyles = {
  scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  "in-progress": "bg-green-100 text-green-800 hover:bg-green-100",
  completed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

const ScheduleDetails = ({ schedule }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-medium">{schedule.doctorName}</h3>
          <p className="text-gray-500 flex items-center gap-1 mt-1">
            <Building className="h-4 w-4" />
            {schedule.department}
          </p>
        </div>
        <Badge 
          className={statusStyles[schedule.status]}
        >
          {schedule.status.replace('-', ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Schedule ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{schedule.id}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Patients</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-400" />
            <p className="text-lg font-semibold">{schedule.patients}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge 
              className={statusStyles[schedule.status]}
            >
              {schedule.status.replace('-', ' ')}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Date & Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <p className="font-medium">{schedule.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <p className="font-medium">{`${schedule.startTime} - ${schedule.endTime}`}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2">
            <ScrollText className="h-5 w-5 text-gray-400 mt-0.5" />
            <p className="text-gray-600">
              This schedule is for {schedule.doctorName} in the {schedule.department} department.
              They will be seeing {schedule.patients} patients on {schedule.date} from {schedule.startTime} to {schedule.endTime}.
              {schedule.status === "in-progress" && " The doctor is currently attending to patients according to this schedule."}
              {schedule.status === "scheduled" && " The doctor will be available during these hours for patient consultations."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleDetails;
