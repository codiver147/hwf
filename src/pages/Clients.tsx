import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClient, getClients } from "@/services/clientService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  UserPlus, 
  Search, 
  Filter, 
  Eye, 
  Pencil, 
  Trash2,
  AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const clients = [
  {
    id: "1",
    name: "Hamz Rodriguezddd",
    country: "Spain",
    status: "permanent-resident",
    housing: "Apartment",
    children: 31
  },
  {
    id: "2",
    name: "Ahmed Hassan",
    country: "Syria",
    status: "refugee",
    housing: "Townhouse",
    children: 2
  },
  {
    id: "3",
    name: "Li Wei",
    country: "China",
    status: "student-visa",
    housing: "Basement Apartment",
    children: 0
  },
  {
    id: "4",
    name: "Olga Petrov",
    country: "Ukraine",
    status: "temporary-resident",
    housing: "Apartment",
    children: 1
  }
];

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

export default function Clients() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients
  });

  const mutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès du système.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Échec de la suppression du client. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const filteredClients = clients.filter(client => 
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.country_of_origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(client.id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage client information and requests
          </p>
        </div>
        <Button 
          className="bg-hwf-purple hover:bg-hwf-purple-dark"
          onClick={() => navigate("/clients/add")}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Housing</TableHead>
                  <TableHead>Children</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No clients found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>{`${client.first_name} ${client.last_name}`}</TableCell>
                      <TableCell>{client.country_of_origin}</TableCell>
                      <TableCell>{getStatusBadge(client.status_in_canada)}</TableCell>
                      <TableCell>{client.housing_type}</TableCell>
                      <TableCell>{client.number_of_children}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => navigate(`/clients/view/${client.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => navigate(`/clients/edit/${client.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
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
                                <Button 
                                  variant="destructive" 
                                  onClick={() => {
                                    mutation.mutate(client.id);
                                    document.querySelector('[data-state="open"] button[aria-label="Close"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                                  }}
                                >
                                  Supprimer le Client
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
