
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
import { useLanguage } from "@/contexts/LanguageContext";

export default function EditRequest() {
  const { t } = useLanguage();
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

  // Récupérer les équipes assignées à la requête
  const { data: requestTeams, isLoading: isLoadingTeams } = useQuery({
    queryKey: ['request-teams', id],
    queryFn: () => requestService.getRequestTeams(Number(id)),
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
        toast.error(t('request.errorUpdating'));
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
          name: item.inventory_item?.name || t('common.unknown'),
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
      toast.error(t('request.errorUpdating'));
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
        status: data.status,
        priority: data.priority,
        description: data.description,
        location: data.location,
        scheduled_at: data.scheduled_at ? data.scheduled_at.toISOString() : null
      };

      console.log("Formatted request data:", requestData);

      // Update the request in Supabase
      await requestService.updateRequest(Number(id), requestData);
      
      // Update multiple teams assignment
      if (data.teamIds && data.teamIds.length > 0) {
        console.log("Updating teams:", data.teamIds);
        const teamIdsAsNumbers = data.teamIds.map((id: string) => parseInt(id));
        await requestService.assignMultipleTeamsToRequest(Number(id), teamIdsAsNumbers);
      }
      
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
      queryClient.invalidateQueries({ queryKey: ['request-teams', id] });
      
      toast.success(t('request.updateSuccess'));
      navigate("/requests");
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error(t('request.errorUpdating'));
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
            <h1 className="text-2xl font-bold tracking-tight">{t('pages.notFound.title')}</h1>
            <p className="text-muted-foreground">
              {t('pages.notFound.description')}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/requests")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('header.backToRequests')}
          </Button>
        </div>
      </div>
    );
  }

  console.log("Selected products for form:", selectedProducts);
  console.log("Request teams:", requestTeams);

  // Préparer les données pour le formulaire
  const initialData = {
    clientId: request.client_id?.toString(),
    teamIds: requestTeams ? requestTeams.map((rt: any) => rt.team_id.toString()) : [],
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
        <h1 className="text-2xl font-semibold">{t('actions.update')} {t('common.request')} #{id}</h1>
        <Button variant="outline" onClick={() => navigate("/requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('header.backToRequests')}
        </Button>
      </div>

      <Card className="border-t-4 border-t-hwf-purple shadow-md">
        <CardHeader>
          <CardTitle>{t('pages.requests.information')}</CardTitle>
          <CardDescription>
            {t('pages.requests.manage')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestForm onSubmit={handleUpdateRequest} initialData={initialData} />
        </CardContent>
      </Card>
    </div>
  );
}
