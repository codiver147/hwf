
import { ColumnDef } from "@tanstack/react-table";
import { Volunteer } from "@/types/volunteer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteVolunteer } from "@/services/volunteerService";
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
import { formatAvailability } from "@/utils/volunteerUtils";

const StatusBadge = ({ is_active }: { is_active: boolean }) => {
  const status: "active" | "inactive" = is_active ? "active" : "inactive";
  const getStatusStyles = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };
  return (
    <Badge className={getStatusStyles()}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const Actions = ({ id, firstName, lastName }: { id: number, firstName: string, lastName: string }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: deleteVolunteer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      toast.success("Le volontaire a été supprimé avec succès");
    },
    onError: () => {
      toast.error("Échec de la suppression du volontaire");
    },
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/volunteers/view/${id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/volunteers/edit/${id}`)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Supprimer le Volontaire
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {firstName} {lastName} ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mutation.mutate(Number(id))}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const columns: ColumnDef<Volunteer>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorFn: row => `${row.first_name} ${row.last_name}`,
    id: "name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "skills",
    header: "Compétences",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {Array.isArray(row.original.skills) && row.original.skills.length > 0
          ? row.original.skills.map((skill, index) =>
              skill ? (
                <Badge key={index} variant="outline">{skill}</Badge>
              ) : null
            )
          : <span className="text-muted-foreground">Aucun</span>}
      </div>
    ),
  },
  {
    accessorKey: "availability",
    header: "Disponibilité",
    cell: ({ row }) => {
      const availability = row.original.availability;
      
      // Parse JSON if it's a string
      let availabilityObj = availability;
      if (typeof availability === 'string' && availability) {
        try {
          availabilityObj = JSON.parse(availability);
        } catch (e) {
          console.error("Error parsing availability JSON:", e);
          availabilityObj = {};
        }
      }
      
      return (
        <span className="text-xs text-muted-foreground">
          {formatAvailability(availabilityObj || {})}
        </span>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Statut",
    cell: ({ row }) => <StatusBadge is_active={row.original.is_active} />,
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
