
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-hwf-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        {t('inventory.noItems')}
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('inventory.item')}</TableHead>
            <TableHead>{t('inventory.category')}</TableHead>
            <TableHead>{t('inventory.condition')}</TableHead>
            <TableHead>{t('inventory.quantity')}</TableHead>
            <TableHead>{t('common.status')}</TableHead>
            <TableHead>{t('inventory.location')}</TableHead>
            <TableHead className="text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.inventory_categories?.name}</TableCell>
              <TableCell>{item.condition}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{getStatusBadge(item.is_available)}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => navigate(`/inventory/view/${item.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => navigate(`/inventory/edit/${item.id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onStockControl(item)}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
