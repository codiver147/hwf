
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { InventoryItemForm } from "@/components/inventory/InventoryItemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { inventoryService } from "@/services/inventoryService";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AddInventoryItem() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAddItem = async (data: any) => {
    try {
      const itemData = {
        name: data.name,
        category_id: parseInt(data.category),
        condition: data.condition,
        quantity: parseInt(data.quantity),
        location: data.location,
        is_available: data.status === 'available' ? 1 : 0,
        description: data.description,
        date_received: new Date().toISOString()
      };

      await inventoryService.createInventoryItem(itemData);
      
      toast({
        title: "Success",
        description: "Inventory item added successfully",
      });
      
      navigate("/inventory");
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to add inventory item",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('pages.inventory.addNew')}</h1>
          <p className="text-muted-foreground">
            {t('pages.inventory.information')}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/inventory")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('header.backToInventory')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('pages.inventory.information')}</CardTitle>
          <CardDescription>
            {t('pages.inventory.information')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryItemForm onSubmit={handleAddItem} />
        </CardContent>
      </Card>
    </div>
  );
}
