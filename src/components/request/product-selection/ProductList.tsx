
import React from "react";
import { ProductCard } from "./ProductCard";
import { Product, SelectedProduct } from "@/types/product";

interface ProductListProps {
  products: Product[];
  selectedProducts: SelectedProduct[];
  quantityErrors: Record<string, boolean>;
  onProductSelect: (product: Product) => void;
  onQuantityChange: (productId: number, newQuantity: number) => void;
}

export function ProductList({
  products,
  selectedProducts,
  quantityErrors,
  onProductSelect,
  onQuantityChange,
}: ProductListProps) {
  // Ensure products is defined and is an array
  const safeProducts = Array.isArray(products) ? products : [];
  const safeSelectedProducts = Array.isArray(selectedProducts) ? selectedProducts : [];
  
  if (safeProducts.length === 0) {
    return (
      <div className="col-span-full text-center p-4 text-muted-foreground">
        Aucun produit trouvé
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {safeProducts.map((product) => {
        if (!product?.id) return null;
        
        const isSelected = safeSelectedProducts.some(p => p?.id === product.id);
        const selectedProduct = safeSelectedProducts.find(p => p?.id === product.id);
        
        return (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={isSelected}
            requestedQuantity={selectedProduct?.requestedQuantity || 1}
            hasQuantityError={!!quantityErrors[product.id.toString()]}
            onSelect={onProductSelect}
            onQuantityChange={onQuantityChange}
          />
        );
      })}
    </div>
  );
}
