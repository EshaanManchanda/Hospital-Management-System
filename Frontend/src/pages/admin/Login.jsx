
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/admin/ui/use-toast";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { HeartPulse, Lock, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsSubmitting(false);
      
      // For demo purposes, we'll just navigate to the dashboard
      toast({
        title: "Login successful",
        description: "Welcome back to MediCore HMS",
      });
      
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-hospital-primary text-white p-2 rounded-lg mb-4">
              <HeartPulse className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-display font-semibold text-gray-900">MediCore</h1>
            <p className="text-gray-600 mt-2">Hospital Management System</p>
          </div>

          <Tabs defaultValue="email">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="otp">OTP</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-hospital-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-hospital-primary hover:bg-hospital-accent"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="otp">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="otp-email"
                      type="email" 
                      placeholder="name@example.com" 
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-hospital-primary hover:bg-hospital-accent"
                >
                  Send OTP
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Need help? <a href="#" className="text-hospital-primary hover:underline">Contact support</a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Image and content */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-hospital-primary to-hospital-accent text-white">
        <div className="h-full flex flex-col items-center justify-center p-10">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-display font-semibold mb-4">Welcome to MediCore HMS</h2>
            <p className="text-lg opacity-90 mb-6">
              Your comprehensive hospital management solution for efficient healthcare administration and patient care.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-10">
              <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Patient Management</h3>
                <p className="text-sm opacity-80">Efficiently manage patient data and medical records</p>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Appointment Scheduling</h3>
                <p className="text-sm opacity-80">Streamline scheduling and resource allocation</p>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Pharmacy Integration</h3>
                <p className="text-sm opacity-80">Manage medications and inventory seamlessly</p>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Analytics & Reporting</h3>
                <p className="text-sm opacity-80">Data-driven insights for better decision making</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
