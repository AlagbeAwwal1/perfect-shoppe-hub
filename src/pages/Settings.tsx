
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Bell, 
  User, 
  Lock, 
  CreditCard, 
  MapPin, 
  Moon, 
  Sun, 
  Languages, 
  Save
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleSave = (section: string) => {
    toast({
      title: "Settings Updated",
      description: `Your ${section} settings have been saved successfully.`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" defaultValue={user?.email} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-purple/90"
                onClick={() => handleSave("profile")}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="current-password" className="text-sm font-medium">Current Password</label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-purple/90"
                onClick={() => handleSave("security")}
              >
                <Save className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Order Updates</label>
                  <p className="text-xs text-muted-foreground">Receive updates about your orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Promotions</label>
                  <p className="text-xs text-muted-foreground">Receive emails about new promotions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">New Arrivals</label>
                  <p className="text-xs text-muted-foreground">Get notified about new products</p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-purple/90"
                onClick={() => handleSave("notification")}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
              <CardDescription>
                Update your default shipping address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Street Address</label>
                <Input id="address" placeholder="123 Main St" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">City</label>
                  <Input id="city" placeholder="City" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm font-medium">State</label>
                  <Input id="state" placeholder="State" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label htmlFor="zip" className="text-sm font-medium">Zip Code</label>
                  <Input id="zip" placeholder="Zip Code" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium">Country</label>
                  <Input id="country" placeholder="Country" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-purple/90"
                onClick={() => handleSave("shipping")}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Address
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your saved payment methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-muted-foreground">No payment methods saved yet</p>
              </div>
              <Button variant="outline" className="w-full">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                <Moon className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize your display preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Dark Mode</label>
                  <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Language</label>
                  <p className="text-xs text-muted-foreground">Select your preferred language</p>
                </div>
                <select className="px-3 py-2 rounded-md border border-input bg-background text-sm">
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-purple/90"
                onClick={() => handleSave("appearance")}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
