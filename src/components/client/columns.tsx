
import { ColumnDef } from "@tanstack/react-table";
import { Client } from "@/services/clientService";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClient } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";
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

// Helper component for status badge
const StatusBadge = ({ status }: { status: string | null | undefined }) => {
  const getStatusStyles = () => {
    if (!status) return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    
    switch (status.toLowerCase()) {
      case 'recent arrival':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'refugee':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'low income':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <Badge className={getStatusStyles()}>
      {status || 'Unknown'}
    </Badge>
  );
};

// Helper function for displaying table actions
const Actions = ({ id, firstName, lastName }: { id: number, firstName: string, lastName: string }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const mutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
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

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/clients/view/${id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/clients/edit/${id}`)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Supprimer le Client
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {firstName} {lastName} ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mutation.mutate(id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer le Client
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorFn: row => `${row.first_name} ${row.last_name}`,
    header: "Name",
  },
  {
    accessorKey: "country_of_origin",
    header: "Origin",
  },
  {
    accessorKey: "status_in_canada",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status_in_canada} />,
  },
  {
    accessorKey: "housing_type",
    header: "Housing",
  },
  {
    accessorKey: "number_of_children",
    header: "Children",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Actions 
        id={row.original.id} 
        firstName={row.original.first_name}
        lastName={row.original.last_name}
      />
    ),
  },
];
