
import { supabase } from "@/integrations/supabase/client";

export const multiTeamService = {
  async assignMultipleTeamsToRequest(requestId: number, teamIds: number[]) {
    try {
      // First, remove existing team assignments
      await this.clearRequestTeams(requestId);
      
      // Then add new team assignments
      if (teamIds.length > 0) {
        const teamAssignments = teamIds.map(teamId => ({
          request_id: requestId,
          team_id: teamId
        }));
        
        const { data, error } = await supabase
          .from('request_teams')
          .insert(teamAssignments)
          .select();
        
        if (error) {
          console.error('Error assigning multiple teams to request:', error);
          throw error;
        }
        
        return data;
      }
    } catch (error) {
      console.error('Error in assignMultipleTeamsToRequest:', error);
      throw error;
    }
  },

  async clearRequestTeams(requestId: number) {
    try {
      const { error } = await supabase
        .from('request_teams')
        .delete()
        .eq('request_id', requestId);
      
      if (error) {
        console.error('Error clearing request teams:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in clearRequestTeams:', error);
      throw error;
    }
  },

  async getRequestTeams(requestId: number) {
    try {
      const { data, error } = await supabase
        .from('request_teams')
        .select(`
          team_id,
          teams:team_id (
            id,
            name
          )
        `)
        .eq('request_id', requestId);
      
      if (error) {
        console.error('Error fetching request teams:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getRequestTeams:', error);
      throw error;
    }
  }
};
