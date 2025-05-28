
import { supabase } from "@/integrations/supabase/client";

export const teamSkillService = {
  async getTeamSkills(teamId: number) {
    try {
      const { data, error } = await supabase
        .from('team_skills')
        .select('*, skills(*)')
        .eq('team_id', teamId);
      
      if (error) {
        console.error('Error fetching team skills:', error);
        throw error;
      }
      
      console.log("Team skills fetched:", data);
      return data || [];
    } catch (error) {
      console.error('Error in getTeamSkills:', error);
      throw error;
    }
  },

  async addTeamSkill(teamId: number, skillId: number) {
    const { data, error } = await supabase
      .from('team_skills')
      .insert({ team_id: teamId, skill_id: skillId })
      .select('*, skills(*)')
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeTeamSkill(teamId: number, skillId: number) {
    const { error } = await supabase
      .from('team_skills')
      .delete()
      .eq('team_id', teamId)
      .eq('skill_id', skillId);
    
    if (error) throw error;
  },
};
