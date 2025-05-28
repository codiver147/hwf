
import { useState, useCallback } from "react";
import { Product, SelectedProduct } from "@/types/product";

export function useProductSelection(
  initialProducts: SelectedProduct[] = [],
  onProductsChange: (products: SelectedProduct[]) => void
) {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(initialProducts);
  const [quantityErrors, setQuantityErrors] = useState<Record<string, boolean>>({});

  // Toggle product selection (add/remove)
  const toggleProductSelection = useCallback((product: Product) => {
    setSelectedProducts(prevSelected => {
      const productIndex = prevSelected.findIndex(p => p.id === product.id);
      
      // Product is already selected, remove it
      if (productIndex > -1) {
        const newProducts = [...prevSelected];
        newProducts.splice(productIndex, 1);
        onProductsChange(newProducts);
        return newProducts;
      } 
      
      // Product is not selected, add it with default quantity 1
      const newProduct = {
        ...product,
        requestedQuantity: 1
      };
      
      const newProducts = [...prevSelected, newProduct];
      onProductsChange(newProducts);
      return newProducts;
    });
  }, [onProductsChange]);

  // Update quantity for selected product
  const handleQuantityChange = useCallback((productId: number, newQuantity: number) => {
    setSelectedProducts(prevSelected => {
      const newProducts = prevSelected.map(product => {
        if (product.id === productId) {
          // Don't allow quantity to go below 1
          const validatedQuantity = Math.max(1, newQuantity);
          
          // Check if requested quantity exceeds available quantity
          const hasError = validatedQuantity > product.quantity;
          
          // Update error state
          setQuantityErrors(prev => ({
            ...prev,
            [productId]: hasError
          }));
          
          return {
            ...product,
            requestedQuantity: validatedQuantity
          };
        }
        return product;
      });
      
      onProductsChange(newProducts);
      return newProducts;
    });
  }, [onProductsChange]);

  return {
    selectedProducts,
    quantityErrors,
    toggleProductSelection,
    handleQuantityChange
  };
}
