
import { supabase } from "@/integrations/supabase/client";

interface RequestItem {
  request_id: number;
  inventory_item_id: number;
  quantity: number;
  status: string;
}

export const requestItemService = {
  async getRequestItems(requestId: number) {
    try {
      // First, get the request items
      const { data: requestItems, error: requestItemsError } = await supabase
        .from('request_items')
        .select('*')
        .eq('request_id', requestId);
      
      if (requestItemsError) throw requestItemsError;
      
      // If we found request items, get the associated inventory items
      if (requestItems && requestItems.length > 0) {
        const inventoryItemIds = requestItems.map(item => item.inventory_item_id);
        
        // Get inventory item details for all requested items
        const { data: inventoryItems, error: inventoryError } = await supabase
          .from('inventory_items')
          .select('*')
          .in('id', inventoryItemIds);
        
        if (inventoryError) throw inventoryError;
        
        // Combine request items with their inventory item details
        const itemsWithDetails = requestItems.map(requestItem => {
          const inventoryItem = inventoryItems.find(item => item.id === requestItem.inventory_item_id);
          return {
            ...requestItem,
            inventory_item: inventoryItem
          };
        });
        
        console.log("Retrieved request items with details:", itemsWithDetails);
        return itemsWithDetails;
      }
      
      return requestItems || [];
    } catch (error) {
      console.error('Error fetching request items:', error);
      throw error;
    }
  },
  
  async addItemToRequest(item: RequestItem) {
    try {
      const { data, error } = await supabase
        .from('request_items')
        .insert({
          request_id: item.request_id,
          inventory_item_id: item.inventory_item_id,
          quantity: item.quantity,
          status: item.status || 'requested'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding item to request:', error);
      throw error;
    }
  },

  async clearRequestItems(requestId: number) {
    try {
      const { error } = await supabase
        .from('request_items')
        .delete()
        .eq('request_id', requestId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing request items:', error);
      throw error;
    }
  }
};
