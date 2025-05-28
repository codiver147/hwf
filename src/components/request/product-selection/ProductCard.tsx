
import React from "react";
import { Check, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductQuantityControl } from "./ProductQuantityControl";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  requestedQuantity: number;
  hasQuantityError: boolean;
  onSelect: (product: Product) => void;
  onQuantityChange: (productId: number, newQuantity: number) => void;
}

export function ProductCard({
  product,
  isSelected,
  requestedQuantity,
  hasQuantityError,
  onSelect,
  onQuantityChange,
}: ProductCardProps) {
  // Ensure product is defined
  if (!product || !product.id) {
    return null;
  }

  return (
    <div
      className={cn(
        "p-2 border rounded-md transition-colors",
        isSelected
          ? "border-hwf-purple bg-hwf-purple-light"
          : "border-gray-200 hover:border-hwf-purple"
      )}
    >
      <div 
        className="flex items-center cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <Package className="h-5 w-5 mr-2 text-muted-foreground" />
        <div className="flex-1">
          <p className="font-medium">{product.name || 'Unnamed Product'}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="mr-2">{product.code ? `Code: ${product.code}` : ''}</span>
            <span>Disponible: {product.quantity || 0}</span>
          </div>
        </div>
        {isSelected && <Check className="h-4 w-4 text-hwf-purple" />}
      </div>

      {isSelected && (
        <ProductQuantityControl
          productId={product.id}
          productName={product.name || 'Unnamed Product'}
          maxQuantity={product.quantity || 0}
          currentQuantity={requestedQuantity}
          hasError={hasQuantityError}
          onQuantityChange={onQuantityChange}
        />
      )}
    </div>
  );
}
