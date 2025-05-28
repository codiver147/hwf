
import React from "react";
import { useNavigate } from "react-router-dom";
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
import { createVolunteer } from "@/services/volunteerService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AddVolunteer() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleAddVolunteer = async (formData: any) => {
    try {
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
        skills: formData.skills
      };
      
      await createVolunteer(apiData);
      toast.success("Volunteer added successfully");
      navigate("/volunteers");
    } catch (error) {
      console.error("Error adding volunteer:", error);
      toast.error("Failed to add volunteer");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('pages.volunteers.addNew')}</h1>
          <p className="text-muted-foreground">
            {t('pages.volunteers.information')}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/volunteers")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('header.backToVolunteers')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('pages.volunteers.information')}</CardTitle>
          <CardDescription>
            {t('pages.volunteers.information')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VolunteerForm onSubmit={handleAddVolunteer} />
        </CardContent>
      </Card>
    </div>
  );
}
