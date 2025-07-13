
import { supabase } from "@/integrations/supabase/client";
import { requestItemService } from "./requestItemService";
import { baseRequestService } from "./baseRequestService";
import { assignmentService } from "./assignmentService";
import { multiTeamService } from "./multiTeamService";

export const requestService = {
  // Use baseRequestService methods
  getRequests: baseRequestService.getRequests,
  getRequestById: baseRequestService.getRequestById,
  createRequest: baseRequestService.createRequest,
  updateRequest: baseRequestService.updateRequest,
  deleteRequest: baseRequestService.deleteRequest,
  updateRequestStatus: baseRequestService.updateRequestStatus,
  
  async assignTeamToRequest(requestId: number, teamId: number | null) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update({ team_id: teamId })
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) {
        console.error('Error assigning team to request:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error assigning team to request:', error);
      throw error;
    }
  },

  // New method for multiple teams
  async assignMultipleTeamsToRequest(requestId: number, teamIds: number[]) {
    return multiTeamService.assignMultipleTeamsToRequest(requestId, teamIds);
  },

  async getRequestTeams(requestId: number) {
    return multiTeamService.getRequestTeams(requestId);
  },

  async assignVolunteerToRequest(requestId: number, volunteerId: number) {
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
  
  getTeams: async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },
  
  getVolunteers: async () => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      throw error;
    }
  },
  
  // Use the assignmentService directly instead of a circular reference
  assignVolunteer: assignmentService.assignVolunteer,
  addRequestItem: requestItemService.addItemToRequest,
};
