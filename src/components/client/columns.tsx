
import { ColumnDef } from "@tanstack/react-table";
import { Client } from "@/services/clientService";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/contexts/LanguageContext";

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

// Helper component for expandable client reference
const ClientReference = ({ client }: { client: Client }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent">
          <div className="flex items-center gap-1">
            {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            {client.id}
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
        <div className="pl-4 border-l-2 border-muted">
          <div><strong>{t('client.refClient')}:</strong> {client.id}</div>
          <div><strong>{t('client.email')}:</strong> {client.email || t('common.none')}</div>
          <div><strong>{t('client.phone')}:</strong> {client.phone || t('common.none')}</div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Helper function for displaying table actions
const Actions = ({ id, firstName, lastName }: { id: number, firstName: string, lastName: string }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const mutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: t('client.deleteSuccess'),
        description: t('client.deleteSuccess'),
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('client.errorDeleting'),
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
              {t('client.deleteClient')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('common.areYouSure')} {firstName} {lastName} ? {t('client.deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mutation.mutate(id)}
              className="bg-red-500 hover:bg-red-600"
            >
              {t('client.deleteClient')}
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
    cell: ({ row }) => <ClientReference client={row.original} />,
    size: 60,
  },
  {
    accessorFn: row => `${row.first_name} ${row.last_name}`,
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium min-w-0">
        <div className="truncate">
          {row.original.first_name} {row.original.last_name}
        </div>
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: "country_of_origin",
    header: "Origin",
    cell: ({ row }) => (
      <div className="text-sm min-w-0">
        <div className="truncate">
          {row.original.country_of_origin || '-'}
        </div>
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "languages_spoken",
    header: "Language",
    cell: ({ row }) => (
      <div className="text-sm min-w-0">
        <div className="truncate">
          {row.original.languages_spoken || '-'}
        </div>
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "reference_organization",
    header: "Reference Org", 
    cell: ({ row }) => (
      <div className="text-sm min-w-0">
        <div className="truncate">
          {row.original.reference_organization || '-'}
        </div>
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "status_in_canada",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status_in_canada} />,
    size: 100,
  },
  {
    accessorKey: "housing_type",
    header: "Housing",
    cell: ({ row }) => (
      <div className="text-sm min-w-0">
        <div className="truncate">
          {row.original.housing_type || '-'}
        </div>
      </div>
    ),
    size: 90,
  },
  {
    accessorKey: "number_of_children",
    header: "Children",
    cell: ({ row }) => (
      <div className="text-sm text-center">
        {row.original.number_of_children || 0}
      </div>
    ),
    size: 70,
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
    size: 100,
  },
];
