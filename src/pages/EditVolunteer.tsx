
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { VolunteerForm } from "@/components/volunteer/VolunteerForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getVolunteerById, updateVolunteer } from "@/services/volunteerService";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditVolunteer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [volunteer, setVolunteer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch volunteer data
        const volunteerData = await getVolunteerById(Number(id));
        console.log("Fetched volunteer data:", volunteerData);
        
        // Format volunteer data for the form
        const formattedVolunteer = {
          ...volunteerData,
          name: `${volunteerData.first_name} ${volunteerData.last_name}`,
          startDate: volunteerData.join_date ? new Date(volunteerData.join_date) : new Date(),
          status: volunteerData.is_active ? "active" : "inactive",
          emergency_contact: volunteerData.emergency_contact || '',
          emergencyContact: volunteerData.emergency_contact || '',
        };
        
        // Parse availability if it's a string
        if (typeof volunteerData.availability === 'string') {
          try {
            formattedVolunteer.availability = JSON.parse(volunteerData.availability);
          } catch (e) {
            console.error("Error parsing availability:", e);
            formattedVolunteer.availability = {};
          }
        }
        
        setVolunteer(formattedVolunteer);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Volunteer not found");
        navigate("/volunteers");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) fetchData();
  }, [id, navigate]);

  const handleUpdateVolunteer = async (formData: any) => {
    try {
      console.log("Updating volunteer with data:", formData);
      
      // Format data for API
      const apiData = {
        first_name: formData.name.split(' ')[0],
        last_name: formData.name.split(' ').slice(1).join(' '),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        emergency_contact: formData.emergencyContact,
        is_active: formData.status === "active",
        join_date: formData.startDate ? formData.startDate.toISOString().split('T')[0] : null,
        availability: formData.availabilitySlots || {},
        // Convert skill names to skill IDs for API
        skills: formData.skills
      };
      
      await updateVolunteer(Number(id), apiData);
      toast.success("Volunteer information updated successfully");
      navigate("/volunteers");
    } catch (error) {
      console.error("Error updating volunteer:", error);
      toast.error("Failed to update volunteer");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[350px] mt-2" />
          </div>
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(8).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!volunteer) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Volunteer</h1>
          <p className="text-muted-foreground">
            Update volunteer information
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/volunteers")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Volunteers
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Volunteer Information - {volunteer.first_name} {volunteer.last_name}</CardTitle>
          <CardDescription>
            Make changes to the volunteer's information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VolunteerForm 
            defaultValues={volunteer} 
            onSubmit={handleUpdateVolunteer} 
            isEditing={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
