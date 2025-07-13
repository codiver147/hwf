
import React from "react";
import { useNavigate } from "react-router-dom";
import { RequestForm } from "@/components/request/RequestForm";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { requestService } from "@/services/request";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AddRequest() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const handleSubmit = async (data: any) => {
    try {
      console.log("Form data:", data);

      // Format data for Supabase - Create request first
      const requestData = {
        client_id: parseInt(data.clientId),
        status: data.status,
        priority: data.priority,
        description: data.description,
        location: data.location,
        scheduled_at: data.scheduled_at ? data.scheduled_at.toISOString() : null
      };

      console.log("Formatted request data:", requestData);

      // Create the request in Supabase
      const createdRequest = await requestService.createRequest(requestData);
      
      // Assign multiple teams to the request using the new junction table
      if (data.teamIds && data.teamIds.length > 0) {
        console.log("Assigning teams:", data.teamIds);
        const teamIdsAsNumbers = data.teamIds.map((id: string) => parseInt(id));
        await requestService.assignMultipleTeamsToRequest(createdRequest.id, teamIdsAsNumbers);
      }
      
      // If there are products, associate them with the request
      if (data.products && data.products.length > 0) {
        console.log("Adding products:", data.products);
        
        const requestItemPromises = data.products.map((product: any) => {
          return requestService.addRequestItem({
            request_id: createdRequest.id,
            inventory_item_id: product.id,
            quantity: product.requestedQuantity,
            status: "requested"
          });
        });
        
        await Promise.all(requestItemPromises);
      }
      
      // Add volunteer to request if selected
      if (data.volunteerId) {
        await requestService.assignVolunteerToRequest(createdRequest.id, parseInt(data.volunteerId));
      }

      // Invalidate requests query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      
      toast.success(t('request.addSuccess'));
      navigate("/requests");
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(t('request.errorAdding'));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t('pages.requests.addNew')}</h1>
        <Button variant="outline" onClick={() => navigate("/requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('header.backToRequests')}
        </Button>
      </div>

      <Card className="border-t-4 border-t-hwf-purple shadow-md">
        <CardHeader>
          <CardTitle>{t('pages.requests.information')}</CardTitle>
          <CardDescription>
            {t('pages.requests.information')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
