
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ProductFilterToolbar } from "../ProductFilterToolbar";
import { inventoryService } from "@/services/inventoryService";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductList } from "./ProductList";
import { useProductSelection } from "./useProductSelection";

interface Product {
  id: number;
  name: string;
  category_id: number;
  quantity: number;
  code?: string;
  inventory_categories?: {
    id: number;
    name: string;
  };
}

interface SelectedProduct extends Product {
  requestedQuantity: number;
}

interface ProductSelectionProps {
  categoryId: string;
  selectedProducts: SelectedProduct[];
  onProductSelect: (products: SelectedProduct[]) => void;
}

export function ProductSelection({ 
  categoryId, 
  selectedProducts = [], 
  onProductSelect 
}: ProductSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [codeQuery, setCodeQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: inventoryService.getCategories,
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: inventoryService.getInventoryItems,
  });

  const { quantityErrors, handleQuantityChange, toggleProductSelection } = useProductSelection(
    selectedProducts,
    onProductSelect
  );

  const filteredProducts = (allProducts || []).filter((product: Product) => {
    if (!product) return false;
    
    const matchesCategory = selectedCategory === "all" ? true : 
      product.category_id === parseInt(selectedCategory);
    const matchesSearch = !searchQuery || searchQuery.toLowerCase() === "" || 
      (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCode = !codeQuery || codeQuery === "" || 
      (product.code && product.code.toLowerCase().includes(codeQuery.toLowerCase()));
    
    return matchesCategory && (matchesSearch || matchesCode);
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Product Selection</h3>
          <p className="text-sm text-muted-foreground">
            Select the products for your request
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category: any) => (
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

          <ProductList
            products={filteredProducts}
            selectedProducts={selectedProducts}
            quantityErrors={quantityErrors}
            onProductSelect={toggleProductSelection}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
