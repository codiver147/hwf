
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { inventoryService } from "@/services/inventoryService";
import { StockActionSelect } from "./stock-control/StockActionSelect";
import { StockReasonSelect } from "./stock-control/StockReasonSelect";
import { CurrentStockDisplay } from "./stock-control/CurrentStockDisplay";

type StockControlDialogProps = {
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
};

export function StockControlDialog({ 
  item, 
  open, 
  onOpenChange,
  onUpdate 
}: StockControlDialogProps) {
  const { toast } = useToast();
  const [action, setAction] = useState("add");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("donation");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const newQuantity = action === "add" 
        ? item.quantity + quantity
        : item.quantity - quantity;

      await inventoryService.updateItemQuantity(item.id, newQuantity);
      
      const actionText = action === "add" ? "added to" : "removed from";
      toast({
        title: "Stock Updated",
        description: `${quantity} ${item.name} ${actionText} inventory`,
      });
      
      if (onUpdate) {
        onUpdate();
      }
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stock Control: {item.name}</DialogTitle>
          <DialogDescription>
            Update inventory quantities
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StockActionSelect 
              value={action}
              onValueChange={setAction}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <StockReasonSelect 
            value={reason}
            onValueChange={setReason}
            action={action}
          />
          
          <CurrentStockDisplay
            quantity={item.quantity}
            location={item.location}
            isAvailable={item.is_available}
          />
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading || quantity < 1}
            className="bg-hwf-purple hover:bg-hwf-purple-dark"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>Update Stock</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
