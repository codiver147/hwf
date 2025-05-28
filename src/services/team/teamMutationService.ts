
import { supabase } from "@/integrations/supabase/client";

export const teamMutationService = {
  async createTeam(teamData: { name: string; description: string }, memberIds: number[] = [], skillIds: number[] = []) {
    const { data: team, error } = await supabase
      .from('teams')
      .insert(teamData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Add team members
    if (memberIds.length > 0) {
      const memberRows = memberIds.map(volunteerId => ({
        team_id: team.id,
        volunteer_id: volunteerId
      }));
      
      const { error: memberError } = await supabase
        .from('team_members')
        .insert(memberRows);
      
      if (memberError) throw memberError;
    }

    // Add team skills
    if (skillIds.length > 0) {
      const skillRows = skillIds.map(skillId => ({
        team_id: team.id,
        skill_id: skillId
      }));
      
      const { error: skillError } = await supabase
        .from('team_skills')
        .insert(skillRows);
      
      if (skillError) throw skillError;
    }
    
    return team;
  },
  
  async updateTeam(teamId: number, teamData: { name: string; description: string }, memberIds: number[] = [], skillIds: number[] = []) {
    // Update team data
    const { error } = await supabase
      .from('teams')
      .update(teamData)
      .eq('id', teamId);
    
    if (error) throw error;
    
    // Delete existing team members and skills to replace with new ones
    const { error: deleteMemError } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId);
    
    if (deleteMemError) throw deleteMemError;
    
    const { error: deleteSkillError } = await supabase
      .from('team_skills')
      .delete()
      .eq('team_id', teamId);
    
    if (deleteSkillError) throw deleteSkillError;
    
    // Add team members
    if (memberIds.length > 0) {
      const memberRows = memberIds.map(volunteerId => ({
        team_id: teamId,
        volunteer_id: volunteerId
      }));
      
      const { error: memberError } = await supabase
        .from('team_members')
        .insert(memberRows);
      
      if (memberError) throw memberError;
    }
    
    // Add team skills
    if (skillIds.length > 0) {
      const skillRows = skillIds.map(skillId => ({
        team_id: teamId,
        skill_id: skillId
      }));
      
      const { error: skillError } = await supabase
        .from('team_skills')
        .insert(skillRows);
      
      if (skillError) throw skillError;
    }
    
    return true;
  },
  
  async deleteTeam(teamId: number) {
    // Delete team members first
    const { error: memError } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId);
    
    if (memError) throw memError;
    
    // Delete team skills
    const { error: skillError } = await supabase
      .from('team_skills')
      .delete()
      .eq('team_id', teamId);
    
    if (skillError) throw skillError;
    
    // Delete the team
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);
    
    if (error) throw error;
    
    return true;
  }
};
