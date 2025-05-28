
import { supabase } from "@/integrations/supabase/client";

export const assignmentService = {
  async assignVolunteerToRequest(
    requestId: number,
    volunteerId: number
  ) {
    try {
      // Check if the volunteer is already assigned to the request
      const { data: existingAssignment, error: existingAssignmentError } = await supabase
        .from('request_volunteers')
        .select('*')
        .eq('request_id', requestId)
        .eq('volunteer_id', volunteerId);
  
      if (existingAssignmentError) {
        console.error('Error checking existing volunteer assignment:', existingAssignmentError);
        throw existingAssignmentError;
      }
  
      if (existingAssignment && existingAssignment.length > 0) {
        console.log('Volunteer already assigned to this request.');
        return; // Volunteer already assigned
      }
  
      // If not assigned, proceed to assign the volunteer
      const { data, error } = await supabase
        .from('request_volunteers')
        .insert([{ request_id: requestId, volunteer_id: volunteerId }])
        .select()
        .single();
  
      if (error) {
        console.error('Error assigning volunteer to request:', error);
        throw error;
      }
  
      return data;
    } catch (error) {
      console.error('Error assigning volunteer to request:', error);
      throw error;
    }
  },

  async removeVolunteerFromRequest(requestId: number, volunteerId: number) {
    try {
      const { error } = await supabase
        .from('request_volunteers')
        .delete()
        .eq('request_id', requestId)
        .eq('volunteer_id', volunteerId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error removing volunteer from request:', error);
      throw error;
    }
  },
  
  async createDeliveryAssignment(assignment: {
    request_id: number;
    volunteer_id: number;
    scheduled_date?: string;
    status?: string;
    notes?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('delivery_assignments')
        .insert([{
          ...assignment,
          status: assignment.status || 'scheduled'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating delivery assignment:', error);
      throw error;
    }
  },
  
  async updateDeliveryAssignment(
    id: number,
    updates: {
      volunteer_id?: number;
      scheduled_date?: string;
      completed_date?: string;
      status?: string;
      notes?: string;
    }
  ) {
    try {
      const { data, error } = await supabase
        .from('delivery_assignments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating delivery assignment:', error);
      throw error;
    }
  },
  
  async assignVolunteer(
    requestId: number,
    volunteerId: number,
    scheduledDate: string,
    notes?: string
  ) {
    try {
      // First, assign volunteer to request
      await this.assignVolunteerToRequest(requestId, volunteerId);
      
      // Then create a delivery assignment
      const assignment = await this.createDeliveryAssignment({
        request_id: requestId,
        volunteer_id: volunteerId,
        scheduled_date: scheduledDate,
        status: 'scheduled',
        notes
      });
      
      return assignment;
    } catch (error) {
      console.error('Error in assignVolunteer:', error);
      throw error;
    }
  }
};
