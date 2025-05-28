
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function EditInventoryItem() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!id) return;
        const data = await inventoryService.getInventoryItemById(parseInt(id));
        setItem(data);
      } catch (error) {
        console.error('Error fetching item:', error);
        toast({
          title: "Error",
          description: "Failed to load item details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, toast]);

  const handleUpdateItem = async (data: any) => {
    try {
      if (!id) return;

      const itemData = {
        name: data.name,
        category_id: parseInt(data.category),
        condition: data.condition,
        quantity: parseInt(data.quantity),
        location: data.location,
        is_available: data.status === 'available' ? 1 : 0,
        description: data.description,
      };

      await inventoryService.updateInventoryItem(parseInt(id), itemData);
      
      toast({
        title: "Success",
        description: "Inventory item updated successfully",
      });
      
      navigate("/inventory");
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to update inventory item",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-hwf-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Item Not Found</h1>
            <p className="text-muted-foreground">
              The inventory item you're looking for doesn't exist
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/inventory")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  const formData = {
    name: item.name,
    category: item.category_id?.toString(),
    condition: item.condition,
    quantity: item.quantity,
    location: item.location,
    status: item.is_available ? 'available' : 'unavailable',
    description: item.description,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Item</h1>
          <p className="text-muted-foreground">
            Update item information
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/inventory")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Information</CardTitle>
          <CardDescription>
            Update the form below with the item's details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryItemForm initialData={formData} onSubmit={handleUpdateItem} />
        </CardContent>
      </Card>
    </div>
  );
}
