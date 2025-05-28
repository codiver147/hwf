
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { RequestForm } from "@/components/request/RequestForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { requestService } from "@/services/request";
import { requestItemService } from "@/services/request/requestItemService";

export default function EditRequest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  // Récupérer la requête
  const { data: request, isLoading } = useQuery({
    queryKey: ['request', id],
    queryFn: () => requestService.getRequestById(Number(id)),
    enabled: !!id
  });

  // Récupérer les articles de la requête 
  const { data: requestItems, isLoading: isLoadingItems } = useQuery({
    queryKey: ['request-items', id],
    queryFn: () => requestItemService.getRequestItems(Number(id)),
    enabled: !!id,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching request items in query:", error);
        toast.error("Erreur lors de la récupération des produits de la requête");
      }
    }
  });

  // Process request items when they are loaded
  useEffect(() => {
    if (requestItems && Array.isArray(requestItems)) {
      processRequestItems(requestItems);
    }
  }, [requestItems]);

  // Process request items and get inventory details
  const processRequestItems = (items: any[]) => {
    if (!Array.isArray(items) || items.length === 0) {
      setSelectedProducts([]);
      return;
    }

    try {
      setLoadingProducts(true);
      
      // Transform items into the format expected by the form
      const formattedProducts = items.map((item: any) => {
        return {
          id: item.inventory_item_id,
          name: item.inventory_item?.name || "Produit inconnu",
          description: item.inventory_item?.description || "",
          quantity: item.inventory_item?.quantity || 0,
          requestedQuantity: item.quantity || 1,
          category_id: item.inventory_item?.category_id
        };
      });
      
      console.log("Processed products for form:", formattedProducts);
      setSelectedProducts(formattedProducts);
    } catch (error) {
      console.error("Error processing request items:", error);
      toast.error("Erreur lors du traitement des produits");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleUpdateRequest = async (data: any) => {
    try {
      console.log("Form data:", data);

      // Format data for Supabase
      const requestData = {
        client_id: parseInt(data.clientId),
        team_id: data.teamId ? parseInt(data.teamId) : null,
        status: data.status,
        priority: data.priority,
        description: data.description,
        location: data.location,
        scheduled_at: data.scheduled_at ? data.scheduled_at.toISOString() : null
      };

      console.log("Formatted request data:", requestData);

      // Update the request in Supabase
      await requestService.updateRequest(Number(id), requestData);
      
      // Clear existing request items first
      await requestItemService.clearRequestItems(Number(id));
      
      // If there are products, update them with the request
      if (data.products && data.products.length > 0) {
        console.log("Updating products:", data.products);
        
        const requestItemPromises = data.products.map((product: any) => {
          return requestService.addRequestItem({
            request_id: Number(id),
            inventory_item_id: product.id,
            quantity: product.requestedQuantity,
            status: "requested"
          });
        });
        
        await Promise.all(requestItemPromises);
      }
      
      // Add volunteer to request if selected
      if (data.volunteerId) {
        await requestService.assignVolunteerToRequest(Number(id), parseInt(data.volunteerId));
      }

      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      queryClient.invalidateQueries({ queryKey: ['request-items', id] });
      
      toast.success("Requête mise à jour avec succès");
      navigate("/requests");
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error("Erreur lors de la mise à jour de la requête");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-hwf-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Request Not Found</h1>
            <p className="text-muted-foreground">
              The request you're looking for doesn't exist
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/requests")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  console.log("Selected products for form:", selectedProducts);

  // Préparer les données pour le formulaire
  const initialData = {
    clientId: request.client_id?.toString(),
    teamId: request.team_id?.toString(),
    volunteerId: request.request_volunteers?.[0]?.volunteer_id?.toString(),
    status: request.status,
    scheduled_at: request.scheduled_at ? new Date(request.scheduled_at) : undefined,
    date: request.scheduled_at ? new Date(request.scheduled_at) : undefined,
    time: request.scheduled_at ? 
      `${new Date(request.scheduled_at).getHours().toString().padStart(2, '0')}:${new Date(request.scheduled_at).getMinutes().toString().padStart(2, '0')}` : 
      undefined,
    location: request.location,
    description: request.description,
    priority: request.priority,
    products: selectedProducts
  };

  console.log("Initial form data:", initialData);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Modifier la Requête #{id}</h1>
        <Button variant="outline" onClick={() => navigate("/requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux Requêtes
        </Button>
      </div>

      <Card className="border-t-4 border-t-hwf-purple shadow-md">
        <CardHeader>
          <CardTitle>Détails de la Requête</CardTitle>
          <CardDescription>
            Modifiez le formulaire ci-dessous avec les détails de la requête
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestForm onSubmit={handleUpdateRequest} initialData={initialData} />
        </CardContent>
      </Card>
    </div>
  );
}
