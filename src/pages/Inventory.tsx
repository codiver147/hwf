
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackagePlus } from "lucide-react";
import { StockControlDialog } from "@/components/inventory/StockControlDialog";
import { useToast } from "@/hooks/use-toast";
import { inventoryService } from "@/services/inventoryService";
import { InventoryStats } from "@/components/inventory/InventoryStats";
import { InventoryToolbar } from "@/components/inventory/InventoryToolbar";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Inventory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const data = await inventoryService.getInventoryItems();
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      toast({
        title: t('common.error'),
        description: t('inventory.errorLoading'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteItem = async (id: number) => {
    try {
      await inventoryService.deleteInventoryItem(id);
      toast({
        title: t('common.success'),
        description: t('inventory.itemDeleted'),
      });
      fetchItems();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('inventory.errorDeleting'),
        variant: "destructive",
      });
    }
  };

  const openStockControl = (item: any) => {
    setSelectedItem(item);
    setIsStockDialogOpen(true);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.inventory_categories?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableItems = items.filter(item => item.is_available).length;
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('pages.inventory.title')}</h1>
          <p className="text-muted-foreground">
            {t('pages.inventory.manage')}
          </p>
        </div>
        <Button 
          className="bg-hwf-purple hover:bg-hwf-purple-dark"
          onClick={() => navigate("/inventory/add")}
        >
          <PackagePlus className="mr-2 h-4 w-4" />
          {t('actions.addInventory')}
        </Button>
      </div>

      <InventoryStats 
        totalItems={totalItems}
        availableItems={availableItems}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('inventory.list')}</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="rounded-md border overflow-hidden">
            <InventoryTable
              items={filteredItems}
              onDelete={handleDeleteItem}
              onStockControl={openStockControl}
              loading={loading}
            />
          </div>
        </CardContent>
      </Card>

      {selectedItem && (
        <StockControlDialog
          item={selectedItem}
          open={isStockDialogOpen}
          onOpenChange={setIsStockDialogOpen}
          onUpdate={fetchItems}
        />
      )}
    </div>
  );
}
