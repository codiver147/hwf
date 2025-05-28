
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProductQuantityControlProps {
  productId: number;
  productName: string;
  maxQuantity: number;
  currentQuantity: number;
  hasError: boolean;
  onQuantityChange: (productId: number, newQuantity: number) => void;
}

export function ProductQuantityControl({
  productId,
  productName,
  maxQuantity,
  currentQuantity,
  hasError,
  onQuantityChange,
}: ProductQuantityControlProps) {
  return (
    <div className="mt-2 pt-2 border-t border-dashed">
      {hasError && (
        <Alert variant="destructive" className="mb-2 py-2 px-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Quantité maximale disponible: {maxQuantity}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex items-center justify-between">
        <div className="text-xs">Quantité:</div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange(productId, currentQuantity - 1);
            }}
            disabled={currentQuantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>

          <Input
            className="w-14 h-6 px-1 text-center text-sm"
            value={currentQuantity}
            onChange={(e) => {
              e.stopPropagation();
              const value = parseInt(e.target.value) || 0;
              onQuantityChange(productId, value);
            }}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            type="number"
            min="1"
            max={maxQuantity}
          />

          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange(productId, currentQuantity + 1);
            }}
            disabled={currentQuantity >= maxQuantity}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
