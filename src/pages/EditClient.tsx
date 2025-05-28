
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

export default function EditClient() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

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
        title: "Client updated",
        description: "Client information has been successfully updated.",
      });
      navigate('/clients');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
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
    return <div className="text-red-500">Error loading client: {(error as Error).message}</div>;
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
  } : undefined;
  
  console.log("Prepared default values:", defaultValues);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Client</h1>
          <p className="text-muted-foreground">
            Update client information
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/clients")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>
            Make changes to the client's information below
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
