
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClient, updateClient } from "@/services/clientService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClientForm } from "@/components/client/ClientForm";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EditClient() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // Fetch client data
  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClient(Number(id)),
    enabled: !!id && isAuthenticated(),
  });

  // Update client mutation
  const mutation = useMutation({
    mutationFn: (data: any) => updateClient(Number(id), data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: t('client.updateSuccess'),
        description: t('client.updateSuccess'),
      });
      navigate('/clients');
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: t('client.errorUpdating'),
        variant: "destructive",
      });
    },
  });

  const handleUpdateClient = async (data: any) => {
    // Log data being sent for update
    console.log("Updating client with data:", data);
    mutation.mutate(data);
  };

  if (isLoading) {
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

  if (error) {
    return <div className="text-red-500">{t('common.error')}: {(error as Error).message}</div>;
  }

  // Transform client data to match the form structure
  // Handle the status_in_canada field properly
  const getValidStatusInCanada = (status: string | null | undefined): "permanent-resident" | "refugee" | "student-visa" | "temporary-resident" => {
    // Check if the status is one of the valid enum values
    if (status === "permanent-resident" || status === "refugee" || 
        status === "student-visa" || status === "temporary-resident") {
      return status;
    }
    // Default to permanent-resident if invalid or undefined
    return "permanent-resident";
  };

  const defaultValues = client ? {
    firstName: client.first_name || "",
    lastName: client.last_name || "",
    email: client.email || "",
    phone: client.phone || "",
    address: client.address || "",
    city: client.city || "",
    postalCode: client.postal_code || "",
    languagesSpoken: client.languages_spoken || "",
    countryOfOrigin: client.country_of_origin || "",
    statusInCanada: getValidStatusInCanada(client.status_in_canada),
    housingType: client.housing_type || "Apartment",
    hasTransportation: Boolean(client.has_transportation),
    numberOfAdults: client.number_of_adults || 1,
    numberOfChildren: client.number_of_children || 0,
    childrenAges: client.children_ages || "",
    referenceOrganization: client.reference_organization || "",
  } : undefined;
  
  console.log("Prepared default values:", defaultValues);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('client.editClient')}</h1>
          <p className="text-muted-foreground">
            {t('pages.clients.manage')}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/clients")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('client.backToClients')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('pages.clients.information')}</CardTitle>
          <CardDescription>
            {t('pages.clients.manage')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm 
            defaultValues={defaultValues} 
            onSubmit={handleUpdateClient} 
            isEditing={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
