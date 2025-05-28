import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClient, deleteClient } from "@/services/clientService";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Home,
  Car
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

function getStatusBadge(status: string) {
  switch (status) {
    case "permanent-resident":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Permanent Resident</Badge>;
    case "refugee":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Refugee</Badge>;
    case "student-visa":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Student Visa</Badge>;
    case "temporary-resident":
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Temporary Resident</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function ViewClient() {
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

  // Delete client mutation
  const mutation = useMutation({
    mutationFn: () => deleteClient(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès du système.",
      });
      navigate('/clients');
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Échec de la suppression du client. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-muted-foreground">Loading client details...</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate("/clients")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h2 className="text-xl font-semibold">Client Not Found</h2>
              <p className="text-muted-foreground mt-2">
                The client you're looking for does not exist or has been removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Client Details</h1>
          <p className="text-muted-foreground">
            View detailed information about this client
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/clients")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <Button variant="outline" onClick={() => navigate(`/clients/edit/${id}`)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Supprimer le Client
                </DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer {client.first_name} {client.last_name} ? Cette action ne peut pas être annulée.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => document.querySelector('[data-state="open"] button[aria-label="Close"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={() => mutation.mutate()}>
                  Supprimer le Client
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {client.first_name} {client.last_name}
            </span>
            {getStatusBadge(client.status_in_canada)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email || "No email provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone || "No phone provided"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p>{client.address || "No address provided"}</p>
                      {client.city && <p>{client.city}</p>}
                      {client.postal_code && <p>{client.postal_code}</p>}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-3">Demographics</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>From {client.country_of_origin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Speaks {client.languages_spoken}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-3">Household Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span>Housing: {client.housing_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span>Transportation: {client.has_transportation ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{client.number_of_adults} Adults, {client.number_of_children} Children</span>
                  </div>
                  {client.children_ages && (
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p>Children's Ages:</p>
                        <p className="text-muted-foreground">{client.children_ages}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
