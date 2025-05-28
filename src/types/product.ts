
export interface Product {
  id: number;
  name: string;
  quantity: number;
  code?: string;
  category_id?: number;
}

export interface SelectedProduct extends Product {
  requestedQuantity: number;
}
