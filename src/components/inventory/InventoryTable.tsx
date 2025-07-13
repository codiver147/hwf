
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface InventoryTableProps {
  items: any[];
  onDelete: (id: number) => void;
  onStockControl: (item: any) => void;
  loading: boolean;
}

export function InventoryTable({ items, onDelete, onStockControl, loading }: InventoryTableProps) {
  const navigate = useNavigate();
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { t } = useLanguage();

  const getStatusBadge = (status: boolean) => {
    if (status) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('inventory.available')}</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{t('inventory.unavailable')}</Badge>;
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
      setItemToDelete(null);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: t('inventory.item'),
    },
    {
      accessorKey: "inventory_categories.name",
      header: t('inventory.category'),
      cell: ({ row }) => row.original.inventory_categories?.name || '-',
    },
    {
      accessorKey: "condition",
      header: t('inventory.condition'),
    },
    {
      accessorKey: "quantity",
      header: t('inventory.quantity'),
    },
    {
      accessorKey: "is_available",
      header: t('common.status'),
      cell: ({ row }) => getStatusBadge(row.original.is_available),
    },
    {
      accessorKey: "location",
      header: t('inventory.location'),
    },
    {
      id: "actions",
      header: t('common.actions'),
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => navigate(`/inventory/view/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => navigate(`/inventory/edit/${row.original.id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onStockControl(row.original)}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        isLoading={loading}
        enablePagination={true}
        defaultPageSize={10}
      />

      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.areYouSure')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('inventory.deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
