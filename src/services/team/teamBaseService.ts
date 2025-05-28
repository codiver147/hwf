
import { supabase } from "@/integrations/supabase/client";

export const teamBaseService = {
  async getTeams() {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*, team_members(*), team_skills(*, skills(*))');

      if (error) {
        console.error('Error fetching teams:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTeams:', error);
      throw error;
    }
  },

  async getTeamById(id: number) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*, team_members(*), team_skills(*, skills(*))')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching team by ID:', error);
        throw error;
      }
      
      console.log("Team data fetched:", data);
      return data;
    } catch (error) {
      console.error('Error in getTeamById:', error);
      throw error;
    }
  },
};
