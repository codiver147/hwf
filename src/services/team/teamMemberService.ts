
import { supabase } from "@/integrations/supabase/client";

export const teamMemberService = {
  async getTeamMembers(teamId: number) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          volunteers (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('team_id', teamId);
      
      if (error) {
        console.error('Error fetching team members:', error);
        throw error;
      }
      
      console.log("Team members fetched:", data);
      return data || [];
    } catch (error) {
      console.error('Error in getTeamMembers:', error);
      throw error;
    }
  },

  async addTeamMember(teamId: number, volunteerId: number) {
    const { data, error } = await supabase
      .from('team_members')
      .insert({ team_id: teamId, volunteer_id: volunteerId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeTeamMember(teamId: number, volunteerId: number) {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('volunteer_id', volunteerId);
    
    if (error) throw error;
  },
};
