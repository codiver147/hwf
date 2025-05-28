import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export const inventoryService = {
  // Fetch all inventory items with category details
  async getInventoryItems() {
    try {
      // First fetch all inventory items
      const { data: items, error: itemsError } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (itemsError) throw itemsError;
      
      if (!items || items.length === 0) return [];
      
      // Then fetch all categories
      const { data: categories, error: categoriesError } = await supabase
        .from('inventory_categories')
        .select('*');
      
      if (categoriesError) throw categoriesError;
      
      // Manually join the data
      const itemsWithCategories = items.map(item => {
        const category = categories?.find(cat => cat.id === item.category_id);
        return {
          ...item,
          inventory_categories: category || null
        };
      });
      
      return itemsWithCategories || [];
    } catch (error) {
      console.error('Error in getInventoryItems:', error);
      throw error;
    }
  },

  // Create a new inventory item
  async createInventoryItem(item: TablesInsert<'inventory_items'>) {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update an inventory item
  async updateInventoryItem(id: number, item: TablesUpdate<'inventory_items'>) {
    const { data, error } = await supabase
      .from('inventory_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete an inventory item
  async deleteInventoryItem(id: number) {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Fetch a single inventory item by ID
  async getInventoryItemById(id: number) {
    try {
      // Fetch the inventory item
      const { data: item, error: itemError } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('id', id)
        .single();
      
      if (itemError) {
        if (itemError.code === 'PGRST116') {
          return null; // Item not found
        }
        throw itemError;
      }
      
      if (!item) return null;
      
      // Fetch the category if needed
      if (item.category_id) {
        const { data: category, error: categoryError } = await supabase
          .from('inventory_categories')
          .select('*')
          .eq('id', item.category_id)
          .single();
        
        if (!categoryError && category) {
          return {
            ...item,
            inventory_categories: category
          };
        }
      }
      
      return {
        ...item,
        inventory_categories: null
      };
    } catch (error) {
      console.error('Error in getInventoryItemById:', error);
      throw error;
    }
  },

  // Update inventory item quantity
  async updateItemQuantity(id: number, quantity: number) {
    const { data, error } = await supabase
      .from('inventory_items')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Category Operations
  async getCategories() {
    const { data, error } = await supabase
      .from('inventory_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async createCategory(category: TablesInsert<'inventory_categories'>) {
    const { data, error } = await supabase
      .from('inventory_categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getCategoryById(id: number) {
    const { data, error } = await supabase
      .from('inventory_categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Category not found
      }
      throw error;
    }
    return data;
  },

  async updateCategory(id: number, category: TablesUpdate<'inventory_categories'>) {
    const { data, error } = await supabase
      .from('inventory_categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCategory(id: number) {
    const { error } = await supabase
      .from('inventory_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
