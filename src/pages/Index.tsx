
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Home, Package, Users, Database } from "lucide-react";
import { useState } from "react";
import { testDbConnection } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);

  const handleTestDbConnection = async () => {
    setTesting(true);
    try {
      const result = await testDbConnection();
      toast({
        title: "Database Connection",
        description: result.message || "Connection successful",
        variant: "default", // Changed from "success" to "default"
      });
    } catch (error) {
      toast({
        title: "Database Connection Error",
        description: "Failed to connect to the database. Please check your server settings.",
        variant: "destructive",
      });
      console.error("Database connection error:", error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-hwf-purple">Welcome to HWF Donations</CardTitle>
          <CardDescription>
            Manage your donation operations with our comprehensive system
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="overview" className="px-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">
              <Home className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="volunteers">
              <Users className="h-4 w-4 mr-2" />
              Volunteers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium mb-2">Quick Dashboard</h3>
                <p className="text-gray-600 mb-4">Access all your important stats at a glance</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = "/dashboard"}
                >
                  Go to Dashboard
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium mb-2">Recent Requests</h3>
                <p className="text-gray-600 mb-4">View and manage the latest client requests</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = "/requests"}
                >
                  View Requests
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium mb-2">Team Activity</h3>
                <p className="text-gray-600 mb-4">Monitor your team's progress and assignments</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = "/teams"}
                >
                  View Teams
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium mb-2">Database Connection</h3>
              <p className="text-gray-600 mb-4">Test the connection to your MySQL database</p>
              <Button 
                className="bg-hwf-purple hover:bg-hwf-purple-dark"
                onClick={handleTestDbConnection}
                disabled={testing}
              >
                <Database className="h-4 w-4 mr-2" />
                {testing ? "Testing..." : "Test Database Connection"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium mb-2">Inventory Management</h3>
              <p className="text-gray-600 mb-4">
                Track, update and manage all your inventory items. Control stock levels and monitor item statuses.
              </p>
              <Button 
                className="bg-hwf-purple hover:bg-hwf-purple-dark"
                onClick={() => window.location.href = "/inventory"}
              >
                Manage Inventory
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="volunteers" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium mb-2">Volunteer Coordination</h3>
              <p className="text-gray-600 mb-4">
                Manage volunteer information, assign teams, and track volunteer skills and availability.
              </p>
              <Button 
                className="bg-hwf-purple hover:bg-hwf-purple-dark"
                onClick={() => window.location.href = "/volunteers"}
              >
                Manage Volunteers
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-between bg-gray-50 mt-6">
          <p className="text-sm text-gray-500">HWF Donations Management System</p>
          <Button variant="link" size="sm" onClick={() => window.location.href = "/login"}>
            Admin Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
