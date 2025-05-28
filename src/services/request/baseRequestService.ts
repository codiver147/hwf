import { supabase } from "@/integrations/supabase/client";
import { RequestData } from "./types";

export const baseRequestService = {
  async getRequests() {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }
      
      const requests = data || [];
      
      const enhancedRequests = await Promise.all(requests.map(async (request) => {
        const [clientData, teamData, assignments, requestItems, request_volunteers] = await Promise.all([
          request.client_id ? supabase
            .from('clients')
            .select('first_name, last_name')
            .eq('id', request.client_id)
            .maybeSingle() : { data: null },
          
          request.team_id ? supabase
            .from('teams')
            .select('name')
            .eq('id', request.team_id)
            .maybeSingle() : { data: null },
          
          supabase
            .from('delivery_assignments')
            .select(`
              id, 
              scheduled_date, 
              completed_date, 
              status, 
              notes,
              volunteer_id
            `)
            .eq('request_id', request.id),
          
          supabase
            .from('request_items')
            .select('*, inventory_item_id')
            .eq('request_id', request.id),
          
          supabase
            .from('request_volunteers')
            .select(`
              *,
              volunteer_id
            `)
            .eq('request_id', request.id)
        ]);

        const assignmentsWithVolunteers = assignments.data ? await Promise.all(
          assignments.data.map(async (assignment) => {
            if (assignment.volunteer_id) {
              const { data: volunteerData } = await supabase
                .from('volunteers')
                .select('id, first_name, last_name')
                .eq('id', assignment.volunteer_id)
                .maybeSingle();
              
              return {
                ...assignment,
                volunteers: volunteerData
              };
            }
            return assignment;
          })
        ) : [];

        const requestItemsWithDetails = requestItems.data ? await Promise.all(
          requestItems.data.map(async (item) => {
            if (item.inventory_item_id) {
              const { data: itemData } = await supabase
                .from('inventory_items')
                .select('name, description')
                .eq('id', item.inventory_item_id)
                .maybeSingle();
              
              return {
                ...item,
                inventory_items: itemData
              };
            }
            return item;
          })
        ) : [];

        const volunteersWithDetails = request_volunteers.data ? await Promise.all(
          request_volunteers.data.map(async (rv) => {
            if (rv.volunteer_id) {
              const { data: volunteerData } = await supabase
                .from('volunteers')
                .select('id, first_name, last_name')
                .eq('id', rv.volunteer_id)
                .maybeSingle();
              
              return {
                ...rv,
                volunteers: volunteerData
              };
            }
            return rv;
          })
        ) : [];
        
        return {
          ...request,
          clients: clientData.data,
          teams: teamData.data,
          delivery_assignments: assignmentsWithVolunteers || [],
          request_items: requestItemsWithDetails || [],
          request_volunteers: volunteersWithDetails || []
        };
      }));
      
      return enhancedRequests;
    } catch (error) {
      console.error('Error in getRequests:', error);
      return []; 
    }
  },

  async getRequestById(id: number) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error(`Request with ID ${id} not found`);
      
      const [clientData, teamData, assignments, requestItems, request_volunteers] = await Promise.all([
        data.client_id ? supabase
          .from('clients')
          .select('first_name, last_name')
          .eq('id', data.client_id)
          .maybeSingle() : { data: null },
        
        data.team_id ? supabase
          .from('teams')
          .select('name')
          .eq('id', data.team_id)
          .maybeSingle() : { data: null },
        
        supabase
          .from('delivery_assignments')
          .select(`
            id, 
            scheduled_date, 
            completed_date, 
            status, 
            notes,
            volunteer_id
          `)
          .eq('request_id', id),
        
        supabase
          .from('request_items')
          .select('*, inventory_item_id')
          .eq('request_id', id),
        
        supabase
          .from('request_volunteers')
          .select(`
            *,
            volunteer_id
          `)
          .eq('request_id', id)
      ]);

      const assignmentsWithVolunteers = assignments.data ? await Promise.all(
        assignments.data.map(async (assignment) => {
          if (assignment.volunteer_id) {
            const { data: volunteerData } = await supabase
              .from('volunteers')
              .select('id, first_name, last_name')
              .eq('id', assignment.volunteer_id)
              .maybeSingle();
            
            return {
              ...assignment,
              volunteers: volunteerData
            };
          }
          return assignment;
        })
      ) : [];

      const requestItemsWithDetails = requestItems.data ? await Promise.all(
        requestItems.data.map(async (item) => {
          if (item.inventory_item_id) {
            const { data: itemData } = await supabase
              .from('inventory_items')
              .select('name, description')
              .eq('id', item.inventory_item_id)
              .maybeSingle();
            
            return {
              ...item,
              inventory_items: itemData
            };
          }
          return item;
        })
      ) : [];

      const volunteersWithDetails = request_volunteers.data ? await Promise.all(
        request_volunteers.data.map(async (rv) => {
          if (rv.volunteer_id) {
            const { data: volunteerData } = await supabase
              .from('volunteers')
              .select('id, first_name, last_name')
              .eq('id', rv.volunteer_id)
              .maybeSingle();
            
            return {
              ...rv,
              volunteers: volunteerData
            };
          }
          return rv;
        })
      ) : [];
      
      return {
        ...data,
        clients: clientData.data,
        teams: teamData.data,
        delivery_assignments: assignmentsWithVolunteers || [],
        request_items: requestItemsWithDetails || [],
        request_volunteers: volunteersWithDetails || []
      };
    } catch (error) {
      console.error('Error fetching request by ID:', error);
      throw error;
    }
  },

  async createRequest(request: Partial<RequestData>) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert(request)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  },

  async updateRequest(id: number, request: Partial<RequestData>) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update(request)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  },

  async deleteRequest(id: number) {
    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  },

  async updateRequestStatus(id: number, status: string) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update({ 
          status,
          ...(status === 'scheduled' ? { scheduled_at: new Date().toISOString() } : {})
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  }
};
