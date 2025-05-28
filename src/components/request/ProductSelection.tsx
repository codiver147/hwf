import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ProductFilterToolbar } from "./ProductFilterToolbar";
import { inventoryService } from "@/services/inventoryService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductList } from "./product-selection/ProductList";
import { useProductSelection } from "./product-selection/useProductSelection";
import { toast } from "sonner";
import { Product, SelectedProduct } from "@/types/product";

interface ProductSelectionProps {
  categoryId?: number | string;
  selectedProducts: SelectedProduct[];
  onProductSelect: (products: SelectedProduct[]) => void;
}

export function ProductSelection({ 
  categoryId = "all",
  selectedProducts = [],
  onProductSelect 
}: ProductSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [codeQuery, setCodeQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryId?.toString() || "all");
  
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: inventoryService.getCategories,
  });

  const { 
    data: allProducts = [], 
    isLoading: isLoadingProducts,
    error: productsError 
  } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: inventoryService.getInventoryItems,
  });

  const { 
    quantityErrors, 
    handleQuantityChange, 
    toggleProductSelection 
  } = useProductSelection(
    selectedProducts,
    onProductSelect
  );

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId.toString());
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoriesError) {
      console.error("Error loading categories:", categoriesError);
      toast.error("Impossible de charger les catégories");
    }
    
    if (productsError) {
      console.error("Error loading products:", productsError);
      toast.error("Impossible de charger les produits");
    }
  }, [categoriesError, productsError]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const normalizedCategoryId = selectedCategory === "all" 
    ? "all" 
    : selectedCategory;

  const filteredProducts = React.useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) return [];
    
    return allProducts.filter((product: Product) => {
      if (!product) return false;
      
      const matchesCategory = normalizedCategoryId === "all" ? true : 
        product.category_id === Number(normalizedCategoryId);
      
      const matchesSearch = !searchQuery || searchQuery.toLowerCase() === "" || 
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCode = !codeQuery || codeQuery === "" || 
        (product.code && product.code.toLowerCase().includes(codeQuery.toLowerCase()));
      
      return matchesCategory && (matchesSearch || matchesCode);
    });
  }, [allProducts, normalizedCategoryId, searchQuery, codeQuery]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Sélection des produits</h3>
          <p className="text-sm text-muted-foreground">
            Sélectionnez les produits pour votre demande
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select 
            value={selectedCategory} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {Array.isArray(categories) && categories.map((category: any) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ProductFilterToolbar
            searchQuery={searchQuery}
            codeQuery={codeQuery}
            onSearchChange={setSearchQuery}
            onCodeChange={setCodeQuery}
          />

          {isLoadingProducts || isLoadingCategories ? (
            <div className="py-8 flex justify-center items-center">
              <div className="animate-spin h-8 w-8 border-4 border-hwf-purple border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <ProductList
                  products={filteredProducts}
                  selectedProducts={selectedProducts}
                  quantityErrors={quantityErrors}
                  onProductSelect={toggleProductSelection}
                  onQuantityChange={handleQuantityChange}
                />
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Aucun produit trouvé
                </div>
              )}
            </>
          )}

          <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="font-medium mb-2">Produits sélectionnés ({selectedProducts.length})</h4>
            {selectedProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun produit sélectionné</p>
            ) : (
              <ul className="text-sm space-y-1">
                {selectedProducts.map(product => (
                  <li key={product.id} className="flex justify-between">
                    <span>{product.name}</span>
                    <span className={quantityErrors[product.id.toString()] ? "text-red-500" : ""}>
                      {product.requestedQuantity} / {product.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
