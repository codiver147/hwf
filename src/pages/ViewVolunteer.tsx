
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteVolunteer, getVolunteerById } from "@/services/volunteerService";
import { useAuth } from "@/contexts/AuthContext";
import { formatAvailability, formatSkills } from "@/utils/volunteerUtils";
import { useLanguage } from "@/contexts/LanguageContext";

const fetchVolunteer = async (id: string) => {
  console.log(`Fetching volunteer with ID: ${id}`);
  try {
    const data = await getVolunteerById(Number(id));
    console.log("Volunteer data received:", data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch volunteer:`, error);
    throw new Error(`Failed to fetch volunteer`);
  }
};

export default function ViewVolunteer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  console.log(`Rendering ViewVolunteer component with ID: ${id}`);
  console.log("Authentication status:", isAuthenticated());
  
  const { data: volunteer, isLoading, error } = useQuery({
    queryKey: ['volunteer', id],
    queryFn: () => fetchVolunteer(id as string),
    retry: 1,
    meta: {
      onError: () => {
        toast.error(t('volunteer.errorLoading') || "Failed to load volunteer information");
      }
    },
    enabled: !!id
  });

  if (error) {
    console.error("Error in useQuery:", error);
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log("User not authenticated, redirecting to login");
      toast.error(t('auth.loginError') || "Please log in to view volunteer details");
      navigate("/login");
    }
  }, [isAuthenticated, navigate, t]);

  const mutation = useMutation({
    mutationFn: deleteVolunteer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      toast.success(t('volunteer.deleteSuccess'));
      navigate("/volunteers");
    },
    onError: () => {
      toast.error(t('volunteer.errorDeleting'));
    },
  });

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (id) {
      mutation.mutate(Number(id));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error rendering volunteer view:", error);
    return (
      <div className="text-center text-red-500 p-6">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
        <p>{t('common.error')}</p>
        <p className="text-sm text-gray-500 mt-2">{t('auth.loginError')}</p>
        <div className="flex justify-center gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/volunteers")}
          >
            {t('header.backToVolunteers')}
          </Button>
          <Button 
            variant="default" 
            onClick={() => navigate("/login")}
          >
            {t('auth.login')}
          </Button>
        </div>
      </div>
    );
  }

  if (!volunteer) {
    console.error("No volunteer data found");
    return (
      <div className="text-center text-amber-500 p-6">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
        <p>{t('volunteer.noVolunteerFound')}</p>
        <Button 
          variant="outline" 
          onClick={() => navigate("/volunteers")}
          className="mt-4"
        >
          {t('header.backToVolunteers')}
        </Button>
      </div>
    );
  }

  console.log("Volunteer skills data:", volunteer.skills);
  
  const processedSkills: string[] = Array.isArray(volunteer.skills)
    ? volunteer.skills.filter((s): s is string => typeof s === "string" && !!s)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('pages.volunteers.information')}</h1>
          <p className="text-muted-foreground">
            {t('pages.volunteers.manage')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/volunteers")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> {t('header.backToVolunteers')}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/volunteers/edit/${id}`)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" /> {t('common.edit')}
          </Button>
          <Button 
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" /> {t('common.delete')}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-semibold">
              {volunteer.first_name} {volunteer.last_name}
            </h2>
            <Badge variant={volunteer.is_active ? "default" : "secondary"}>
              {volunteer.is_active ? t('status.active') : t('status.inactive')}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">{t('client.contactInformation')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{volunteer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{volunteer.phone || t('common.none')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{volunteer.address || t('common.none')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{t('volunteer.joinDate')}: {volunteer.join_date ? new Date(volunteer.join_date).toLocaleDateString() : t('common.none')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">{t('volunteer.skills')}</h3>
                <div className="flex flex-wrap gap-2">
                  {processedSkills.length > 0 ? (
                    processedSkills.map((skill, index) =>
                      skill ? (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ) : null
                    )
                  ) : (
                    <p className="text-muted-foreground">{t('common.none')}</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">{t('volunteer.availability')}</h3>
                <div className="text-muted-foreground">
                  {formatAvailability(
                    typeof volunteer.availability === 'string' && volunteer.availability
                      ? JSON.parse(volunteer.availability || '{}')
                      : volunteer.availability
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              {t('common.delete')} {t('pages.volunteers.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('common.areYouSure')} {volunteer.first_name} {volunteer.last_name}? {t('request.deleteConfirmation')}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
