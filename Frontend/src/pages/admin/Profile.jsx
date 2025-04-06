
import React from "react";
import { Button } from "@/components/admin/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader, 
  CardTitle
} from "@/components/admin/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/admin/ui/tabs";
import { Separator } from "@/components/admin/ui/separator";
import { Badge } from "@/components/admin/ui/badge";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { ScrollArea } from "@/components/admin/ui/scroll-area";
import { 
  Calendar,
  Clock,
  Mail,
  MapPin, 
  Phone,
  User,
  Medal,
  GraduationCap,
  Languages,
  Briefcase,
  Stethoscope,
  FileText,
  Building,
  Shield,
  Edit
} from "lucide-react";

// Convert TypeScript interfaces to standard JS comments for documentation

// Mock user data (would come from an API in a real app)
const userData = {
  id: "U12345",
  name: "Dr. James Wilson",
  role: "Cardiologist",
  email: "james.wilson@medicore.com",
  phone: "+1 (555) 123-4567",
  address: "123 Medical Center Drive, Los Angeles, CA 90001",
  joinDate: "2018-05-15",
  department: "Cardiology",
  avatar: "/assets/avatar-1.jpg",
  status: "active",
  about: "Experienced cardiologist with over 15 years of practice, specializing in interventional cardiology and heart failure management. Committed to providing compassionate care and the latest evidence-based treatments.",
  education: [
    { degree: "MD", institution: "Johns Hopkins University School of Medicine", year: "2003" },
    { degree: "Residency in Internal Medicine", institution: "Mayo Clinic", year: "2006" },
    { degree: "Fellowship in Cardiology", institution: "Cleveland Clinic", year: "2009" },
  ],
  certifications: [
    { title: "Board Certified in Cardiovascular Disease", year: "2010" },
    { title: "Advanced Cardiac Life Support (ACLS)", year: "2022" },
    { title: "Fellow of the American College of Cardiology (FACC)", year: "2012" },
  ],
  workHistory: [
    { position: "Senior Cardiologist", organization: "Memorial Hospital", period: "2016 - Present" },
    { position: "Attending Physician", organization: "City General Hospital", period: "2010 - 2016" },
    { position: "Research Fellow", organization: "National Heart Institute", period: "2009 - 2010" },
  ],
  specializations: ["Interventional Cardiology", "Heart Failure", "Preventive Cardiology", "Cardiac Imaging"],
  languages: ["English", "Spanish", "French"],
  recentActivity: [
    { type: "appointment", description: "Completed appointment with Sarah Johnson", time: "Today, 2:30 PM" },
    { type: "record", description: "Updated medical record for John Smith", time: "Yesterday, 11:15 AM" },
    { type: "report", description: "Submitted monthly department report", time: "3 days ago" },
    { type: "meeting", description: "Attended cardiology department meeting", time: "1 week ago" },
  ],
  upcomingSchedule: [
    { title: "Patient Consultation", time: "Tomorrow, 9:00 AM", location: "Office 302" },
    { title: "Surgery: Coronary Bypass", time: "Wednesday, 7:30 AM", location: "OR 5" },
    { title: "Department Meeting", time: "Thursday, 2:00 PM", location: "Conference Room B" },
    { title: "Research Presentation", time: "Friday, 11:00 AM", location: "Auditorium" },
  ],
};

const Profile = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState(userData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
          <p className="text-gray-600">Manage your account information and settings</p>
        </div>
        
        <Button 
          className="bg-hospital-primary hover:bg-hospital-accent"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? "View Profile" : "Edit Profile"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Profile card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
                <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <h2 className="mt-4 text-xl font-semibold">{profileData.name}</h2>
              <p className="text-gray-500">{profileData.role}</p>
              
              <Badge className="mt-2 bg-hospital-primary hover:bg-hospital-primary">
                {profileData.department}
              </Badge>
              
              <Separator className="my-4" />
              
              <div className="w-full space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{profileData.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined {new Date(profileData.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex flex-wrap justify-center gap-2">
                {profileData.specializations.map((spec, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-gray-50"
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right column - Tabs */}
        <div className="col-span-1 lg:col-span-2">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Bio</h3>
                    <p className="text-gray-600">{profileData.about}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-hospital-primary" />
                      Education
                    </h3>
                    <div className="space-y-3">
                      {profileData.education.map((edu, index) => (
                        <div key={index} className="flex flex-col">
                          <span className="font-medium">{edu.degree}</span>
                          <span className="text-gray-600">{edu.institution}</span>
                          <span className="text-sm text-gray-500">{edu.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Medal className="h-5 w-5 text-hospital-primary" />
                      Certifications
                    </h3>
                    <div className="space-y-3">
                      {profileData.certifications.map((cert, index) => (
                        <div key={index} className="flex flex-col">
                          <span className="font-medium">{cert.title}</span>
                          <span className="text-sm text-gray-500">{cert.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-hospital-primary" />
                      Work Experience
                    </h3>
                    <div className="space-y-3">
                      {profileData.workHistory.map((work, index) => (
                        <div key={index} className="flex flex-col">
                          <span className="font-medium">{work.position}</span>
                          <span className="text-gray-600">{work.organization}</span>
                          <span className="text-sm text-gray-500">{work.period}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                      <Languages className="h-5 w-5 text-hospital-primary" />
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.languages.map((lang, index) => (
                        <Badge key={index} variant="outline">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-8">
                      {profileData.recentActivity.map((activity, index) => (
                        <div key={index} className="relative pl-6 border-l border-gray-200">
                          <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white bg-hospital-primary"></div>
                          <div className="flex flex-col">
                            <span className="font-medium">{activity.description}</span>
                            <span className="text-sm text-gray-500">{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Schedule</CardTitle>
                  <CardDescription>Your scheduled appointments and meetings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profileData.upcomingSchedule.map((item, index) => (
                      <div key={index} className="flex border rounded-lg p-4">
                        <div className="mr-4 self-center p-2 bg-hospital-primary bg-opacity-10 rounded-lg">
                          <Clock className="h-6 w-6 text-hospital-primary" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="font-medium">{item.title}</span>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-gray-500">{item.time}</span>
                            <span className="text-sm text-gray-500">{item.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button variant="outline">View Full Schedule</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={profileData.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={profileData.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue={profileData.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" defaultValue={profileData.department} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue={profileData.address} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="about">About Me</Label>
                    <textarea
                      id="about"
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      defaultValue={profileData.about}
                    ></textarea>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-hospital-primary hover:bg-hospital-accent">Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
