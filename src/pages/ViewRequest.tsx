
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { requestService } from "@/services/request";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Edit2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AssignTeamDialog } from "@/components/request/AssignTeamDialog";
import { RequestDetails } from "@/components/request/view/RequestDetails";
import { DeliveryHistory } from "@/components/request/view/DeliveryHistory";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ViewRequest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const { data: request, isLoading, error, refetch } = useQuery({
    queryKey: ['request', id],
    queryFn: () => requestService.getRequestById(Number(id)),
    enabled: !!id
  });

  const markAsCompleted = async () => {
    try {
      await requestService.updateRequestStatus(Number(id), 'completed');
      toast({
        title: "Statut mis à jour",
        description: "La requête a été marquée comme terminée",
      });
      refetch();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-hwf-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Requête non trouvée</h1>
            <p className="text-muted-foreground">
              La requête que vous recherchez n'existe pas
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/requests")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux requêtes
          </Button>
        </div>
      </div>
    );
  }

  // Safely get client information with proper type checking
  const clientInfo = request.clients;
  let clientName = 'Client non assigné';
  
  if (clientInfo && typeof clientInfo === 'object' && !Array.isArray(clientInfo)) {
    const clientObj = clientInfo as { first_name?: string; last_name?: string };
    if ('first_name' in clientObj && 'last_name' in clientObj) {
      const firstName = clientObj.first_name || '';
      const lastName = clientObj.last_name || '';
      clientName = `${firstName} ${lastName}`.trim() || 'Client non assigné';
    }
  }

  // Formater la date pour affichage
  const formattedDate = request.scheduled_at 
    ? format(new Date(request.scheduled_at), "dd/MM/yyyy HH:mm", { locale: fr })
    : 'Non programmée';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Requête #{request.id}</h1>
          <p className="text-muted-foreground">
            Requête pour {clientName}
          </p>
          <p className="text-muted-foreground">
            Date planifiée: {formattedDate}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/requests")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/requests/${request.id}/edit`)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la requête</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RequestDetails request={request} />
          <div className="pt-4">
            <Button 
              onClick={markAsCompleted}
              className="w-full bg-hwf-purple hover:bg-hwf-purple-dark"
              disabled={request.status === 'completed'}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marquer comme terminée
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <AssignTeamDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        requestId={request.id}
        currentTeamId={request.team_id}
        onAssignTeam={() => {
          toast({
            title: "Équipe mise à jour",
            description: "L'équipe a été assignée avec succès",
          });
          refetch();
        }}
      />
    </div>
  );
}
