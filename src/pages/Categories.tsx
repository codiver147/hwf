
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Folder,
  Plus,
  Edit2,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { inventoryService } from "@/services/inventoryService";
import { Tables } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

export default function Categories() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Tables<'inventory_categories'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Tables<'inventory_categories'> | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await inventoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: t('common.error'),
        description: t('categories.errorLoading'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      await inventoryService.deleteCategory(selectedCategory.id);
      setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('categories.deleted'),
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: t('common.error'),
        description: t('categories.errorDeleting'),
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (category: Tables<'inventory_categories'>) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<Tables<'inventory_categories'>>[] = [
    {
      accessorKey: "name",
      header: t('categories.name'),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: t('categories.description'),
      cell: ({ row }) => (
        <div className="max-w-xs truncate">
          {row.original.description || '-'}
        </div>
      ),
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
            onClick={() => navigate(`/categories/edit/${row.original.id}`)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => openDeleteDialog(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('nav.categories')}</h1>
          <p className="text-muted-foreground">
            {t('categories.manage')}
          </p>
        </div>
        <Button 
          className="bg-hwf-purple hover:bg-hwf-purple-dark"
          onClick={() => navigate("/categories/add")}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('categories.addNew')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('categories.list')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('categories.search')}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {t('common.filters')}
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={filteredCategories}
            isLoading={loading}
            enablePagination={true}
            defaultPageSize={10}
          />
        </CardContent>
      </Card>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('categories.deleteTitle')}</DialogTitle>
            <DialogDescription>
              {t('categories.deleteConfirmation')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('actions.cancel')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              {t('categories.delete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
