
import { supabase } from "@/integrations/supabase/client";

export const baseRequestService = {
  async getRequests() {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          clients (
            first_name,
            last_name
          ),
          teams!fk_requests_team_id (
            name
          ),
          request_volunteers (
            volunteer_id,
            volunteers!fk_request_volunteers_volunteer_id (
              first_name,
              last_name
            )
          ),
          request_items (
            inventory_item_id,
            quantity,
            status,
            inventory_items (
              name,
              description,
              category_id
            )
          ),
          request_teams (
            team_id,
            teams (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getRequests:', error);
      throw error;
    }
  },

  async getRequestById(id: number) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          clients (
            first_name,
            last_name
          ),
          teams!fk_requests_team_id (
            name
          ),
          request_volunteers (
            volunteer_id,
            volunteers!fk_request_volunteers_volunteer_id (
              first_name,
              last_name
            )
          ),
          request_items (
            inventory_item_id,
            quantity,
            status,
            inventory_items (
              name,
              description,
              category_id
            )
          ),
          request_teams (
            team_id,
            teams (
              id,
              name
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching request by ID:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getRequestById:', error);
      throw error;
    }
  },

  async createRequest(requestData: any) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert([requestData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating request:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in createRequest:', error);
      throw error;
    }
  },

  async updateRequest(id: number, requestData: any) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update(requestData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating request:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in updateRequest:', error);
      throw error;
    }
  },

  async deleteRequest(id: number) {
    try {
      // First delete related records in the correct order
      
      // Delete delivery assignments
      const { error: deliveryError } = await supabase
        .from('delivery_assignments')
        .delete()
        .eq('request_id', id);
      
      if (deliveryError) {
        console.error('Error deleting delivery assignments:', deliveryError);
        throw deliveryError;
      }

      // Delete request items
      const { error: itemsError } = await supabase
        .from('request_items')
        .delete()
        .eq('request_id', id);
      
      if (itemsError) {
        console.error('Error deleting request items:', itemsError);
        throw itemsError;
      }

      // Delete request volunteers
      const { error: volunteersError } = await supabase
        .from('request_volunteers')
        .delete()
        .eq('request_id', id);
      
      if (volunteersError) {
        console.error('Error deleting request volunteers:', volunteersError);
        throw volunteersError;
      }

      // Delete request teams
      const { error: teamsError } = await supabase
        .from('request_teams')
        .delete()
        .eq('request_id', id);
      
      if (teamsError) {
        console.error('Error deleting request teams:', teamsError);
        throw teamsError;
      }

      // Finally delete the request itself
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting request:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteRequest:', error);
      throw error;
    }
  },

  async updateRequestStatus(requestId: number, status: string) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update({ status })
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating request status:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in updateRequestStatus:', error);
      throw error;
    }
  }
};
