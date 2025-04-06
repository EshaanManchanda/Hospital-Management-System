import React, { useState, useEffect } from "react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Badge } from "@/components/admin/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import { Switch } from "@/components/admin/ui/switch";
import { Separator } from "@/components/admin/ui/separator";
import { toast } from "@/components/admin/ui/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Users,
  Info,
  LogOut,
} from "lucide-react";

const Settings = () => {
  // Get theme from ThemeContext
  const { theme, setTheme } = useTheme();
  
  // State for profile settings
  const [profile, setProfile] = useState({
    name: "Dr. James Wilson",
    email: "james.wilson@medicore.com",
    phone: "+1 (555) 123-4567",
    specialization: "Cardiology",
    language: "English",
    theme: "light",
  });

  // State for notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    marketingEmails: false,
    systemUpdates: true,
  });

  // State for security settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    rememberDevices: true,
    loginNotifications: true,
  });

  // State for appearance settings
  const [appearance, setAppearance] = useState({
    theme: "light",
    fontSize: "medium",
    highContrast: false,
  });

  // Sync local state with theme context on mount
  useEffect(() => {
    setAppearance(prev => ({...prev, theme}));
  }, [theme]);

  // Handle form submission for profile settings
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  // Handle form submission for notification settings
  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Notification Preferences Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  // Handle form submission for security settings
  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Security Settings Updated",
      description: "Your security settings have been updated successfully.",
    });
  };

  // Handle form submission for appearance settings
  const handleAppearanceSubmit = (e) => {
    e.preventDefault();
    
    // Update the application theme using context
    setTheme(appearance.theme);
    
    // Save other appearance settings if needed
    // This could be stored in a database or localStorage in a real application
    
    toast({
      title: "Appearance Settings Updated",
      description: "Your theme has been updated and applied to the entire application.",
      variant: "success"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <SettingsIcon className="h-9 w-9 text-gray-800 mt-1" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input 
                      id="specialization" 
                      value={profile.specialization}
                      onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Tell us about yourself and your expertise"
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language"
                    className="w-full h-10 px-3 border rounded-md"
                    value={profile.language}
                    onChange={(e) => setProfile({...profile, language: e.target.value})}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button 
                className="bg-hospital-primary hover:bg-hospital-accent"
                onClick={handleProfileSubmit}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailNotifications: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications in-app</p>
                    </div>
                    <Switch 
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, pushNotifications: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">SMS Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via text message</p>
                    </div>
                    <Switch 
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, smsNotifications: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Appointment Reminders</h3>
                      <p className="text-sm text-gray-500">Receive reminders for upcoming appointments</p>
                    </div>
                    <Switch 
                      checked={notifications.appointmentReminders}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, appointmentReminders: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Marketing Emails</h3>
                      <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                    </div>
                    <Switch 
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, marketingEmails: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">System Updates</h3>
                      <p className="text-sm text-gray-500">Receive notifications about system updates</p>
                    </div>
                    <Switch 
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, systemUpdates: checked})
                      }
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Defaults</Button>
              <Button 
                className="bg-hospital-primary hover:bg-hospital-accent"
                onClick={handleNotificationSubmit}
              >
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Security</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch 
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSecurity({...security, twoFactorAuth: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Remember Devices</h4>
                      <p className="text-sm text-gray-500">Stay logged in on trusted devices</p>
                    </div>
                    <Switch 
                      checked={security.rememberDevices}
                      onCheckedChange={(checked) => 
                        setSecurity({...security, rememberDevices: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Login Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications for account logins</p>
                    </div>
                    <Switch 
                      checked={security.loginNotifications}
                      onCheckedChange={(checked) => 
                        setSecurity({...security, loginNotifications: checked})
                      }
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Once you delete your account, there is no going back. This action cannot be undone.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button 
                className="bg-hospital-primary hover:bg-hospital-accent"
                onClick={handleSecuritySubmit}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAppearanceSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${appearance.theme === "light" ? "border-hospital-primary bg-gray-50 ring-2 ring-hospital-primary ring-opacity-50" : ""}`} 
                      onClick={() => setAppearance({...appearance, theme: "light"})}
                    >
                      <div className="h-24 bg-white border mb-2 rounded flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-hospital-primary"></div>
                      </div>
                      <div className="font-medium text-center">Light</div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${appearance.theme === "dark" ? "border-hospital-primary bg-gray-800 ring-2 ring-hospital-primary ring-opacity-50" : ""}`} 
                      onClick={() => setAppearance({...appearance, theme: "dark"})}
                    >
                      <div className="h-24 bg-gray-900 border border-gray-700 mb-2 rounded flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-hospital-primary"></div>
                      </div>
                      <div className="font-medium text-center">Dark</div>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${appearance.theme === "system" ? "border-hospital-primary bg-gray-50 ring-2 ring-hospital-primary ring-opacity-50" : ""}`} 
                      onClick={() => setAppearance({...appearance, theme: "system"})}
                    >
                      <div className="h-24 bg-gradient-to-r from-white to-gray-900 border mb-2 rounded flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-hospital-primary to-hospital-accent"></div>
                      </div>
                      <div className="font-medium text-center">System</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Font Size</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`border rounded-lg p-3 cursor-pointer text-center transition-all duration-200 hover:shadow-md ${appearance.fontSize === "small" ? "border-hospital-primary bg-gray-50 ring-2 ring-hospital-primary ring-opacity-50" : ""}`} onClick={() => setAppearance({...appearance, fontSize: "small"})}>
                      <div className="text-sm">Small</div>
                    </div>
                    
                    <div className={`border rounded-lg p-3 cursor-pointer text-center transition-all duration-200 hover:shadow-md ${appearance.fontSize === "medium" ? "border-hospital-primary bg-gray-50 ring-2 ring-hospital-primary ring-opacity-50" : ""}`} onClick={() => setAppearance({...appearance, fontSize: "medium"})}>
                      <div className="text-base">Medium</div>
                    </div>
                    
                    <div className={`border rounded-lg p-3 cursor-pointer text-center transition-all duration-200 hover:shadow-md ${appearance.fontSize === "large" ? "border-hospital-primary bg-gray-50 ring-2 ring-hospital-primary ring-opacity-50" : ""}`} onClick={() => setAppearance({...appearance, fontSize: "large"})}>
                      <div className="text-lg">Large</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">High Contrast Mode</h3>
                    <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                  </div>
                  <Switch 
                    checked={appearance.highContrast}
                    onCheckedChange={(checked) => 
                      setAppearance({...appearance, highContrast: checked})
                    }
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  const defaultTheme = "light";
                  setAppearance({
                    theme: defaultTheme,
                    fontSize: "medium",
                    highContrast: false,
                  });
                  setTheme(defaultTheme);
                }}
              >
                Reset to Defaults
              </Button>
              <Button 
                className="bg-hospital-primary hover:bg-hospital-accent"
                onClick={handleAppearanceSubmit}
                type="submit"
              >
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
              <CardDescription>
                Manage your subscription and payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Current Plan</h3>
                    <p className="text-sm text-gray-500">Professional Plan</p>
                  </div>
                  <Badge className="bg-hospital-primary">Active</Badge>
                </div>
                <div className="mt-4 flex justify-between items-baseline">
                  <div className="text-2xl font-bold">$29.99<span className="text-sm font-normal text-gray-500">/month</span></div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-900 rounded p-2 text-white">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">Add Payment Method</Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Billing History</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-3 gap-4 p-4 font-medium bg-gray-50">
                    <div>Date</div>
                    <div>Amount</div>
                    <div className="text-right">Status</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-4 p-4">
                    <div>Mar 1, 2024</div>
                    <div>$29.99</div>
                    <div className="text-right"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge></div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-4 p-4">
                    <div>Feb 1, 2024</div>
                    <div>$29.99</div>
                    <div className="text-right"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge></div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-4 p-4">
                    <div>Jan 1, 2024</div>
                    <div>$29.99</div>
                    <div className="text-right"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge></div>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">View All Invoices</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
