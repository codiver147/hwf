
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Volunteer } from "@/types/volunteer";

// Skill interface for the service
export interface Skill {
  id: number;
  name: string;
  description?: string;
}

// Parse DB volunteer row to Volunteer type (ensure is_active is boolean)
function parseVolunteerFromDb(row: any): Volunteer {
  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    emergency_contact: row.emergency_contact,
    availability: row.availability,
    join_date: row.join_date,
    is_active: !!row.is_active,
    skills: [], // Default empty array, will be populated separately
  };
}

// Fetch all volunteers with skills
export async function getVolunteers(): Promise<Volunteer[]> {
  try {
    // Fetch volunteers
    const { data: volunteers, error: vError } = await supabase
      .from("volunteers")
      .select("*")
      .order("id");
    
    if (vError) {
      toast.error("Error loading volunteers");
      throw vError;
    }

    // Create volunteer objects from data
    const parsedVolunteers = (volunteers || []).map(vol => parseVolunteerFromDb(vol));
    
    // Fetch skills separately for each volunteer
    for (const volunteer of parsedVolunteers) {
      try {
        // Get skills for this volunteer
        const { data: volunteerSkills } = await supabase
          .from("volunteer_skills")
          .select("skill_id")
          .eq("volunteer_id", volunteer.id);
        
        if (volunteerSkills && volunteerSkills.length > 0) {
          // Get skill details for each skill ID
          const skillIds = volunteerSkills.map(vs => vs.skill_id);
          
          const { data: skillDetails } = await supabase
            .from("skills")
            .select("name")
            .in("id", skillIds);
          
          // Add skill names to volunteer
          volunteer.skills = (skillDetails || []).map(skill => skill.name);
        }
      } catch (error) {
        console.error(`Error fetching skills for volunteer ${volunteer.id}:`, error);
      }
    }
    
    return parsedVolunteers;
  } catch (error) {
    console.error("Error in getVolunteers:", error);
    throw error;
  }
}

// Single volunteer with skills
export async function getVolunteerById(id: number): Promise<Volunteer | null> {
  try {
    const { data: vol, error } = await supabase
      .from("volunteers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    if (error || !vol) {
      toast.error("Volunteer not found");
      throw error || new Error("Volunteer not found");
    }
    
    const volunteer = parseVolunteerFromDb(vol);
    
    // Get skills for this volunteer
    const { data: volunteerSkills } = await supabase
      .from("volunteer_skills")
      .select("skill_id")
      .eq("volunteer_id", id);
    
    if (volunteerSkills && volunteerSkills.length > 0) {
      const skillIds = volunteerSkills.map(vs => vs.skill_id);
      
      const { data: skillDetails } = await supabase
        .from("skills")
        .select("*")
        .in("id", skillIds);
      
      // Add skill names array
      volunteer.skills = (skillDetails || []).map(skill => skill.name);
    }
    
    return volunteer;
  } catch (error) {
    console.error("Error in getVolunteerById:", error);
    throw error;
  }
}

// Fetch all skills (for selection)
export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("name");
    
  if (error) throw error;
  return data ?? [];
}

// Create volunteer
export async function createVolunteer(volunteer: Partial<Volunteer>): Promise<void> {
  try {
    // Format data for insertion
    const insertData = {
      first_name: volunteer.first_name || "",
      last_name: volunteer.last_name || "",
      email: volunteer.email || "",
      phone: volunteer.phone ?? null,
      address: volunteer.address ?? null,
      emergency_contact: volunteer.emergency_contact ?? null,
      availability: volunteer.availability ? JSON.stringify(volunteer.availability) : null,
      join_date: volunteer.join_date ?? null,
      is_active: volunteer.is_active ? 1 : 0
    };

    // Insert volunteer
    const { data: newVolunteer, error } = await supabase
      .from("volunteers")
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    // Handle skills if provided
    if (volunteer.skills?.length && newVolunteer?.id) {
      const skillsData = await supabase
        .from("skills")
        .select("id, name")
        .in("name", volunteer.skills);

      if (skillsData.error) throw skillsData.error;

      const skillRows = skillsData.data.map(skill => ({
        volunteer_id: newVolunteer.id,
        skill_id: skill.id
      }));

      const { error: skillsError } = await supabase
        .from("volunteer_skills")
        .insert(skillRows);

      if (skillsError) throw skillsError;
    }

    toast.success("Volunteer added successfully");
  } catch (error) {
    console.error("Error creating volunteer:", error);
    toast.error("Failed to create volunteer");
    throw error;
  }
}

// Update volunteer
export async function updateVolunteer(id: number, volunteer: Partial<Volunteer>): Promise<void> {
  try {
    // Format data for update
    const updateData = {
      first_name: volunteer.first_name,
      last_name: volunteer.last_name,
      email: volunteer.email,
      phone: volunteer.phone ?? null,
      address: volunteer.address ?? null,
      emergency_contact: volunteer.emergency_contact ?? null,
      availability: volunteer.availability ? JSON.stringify(volunteer.availability) : null,
      join_date: volunteer.join_date ?? null,
      is_active: volunteer.is_active ? 1 : 0
    };

    const { error } = await supabase
      .from("volunteers")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;

    // Handle skills update
    if (volunteer.skills) {
      // First delete existing skills
      await supabase
        .from("volunteer_skills")
        .delete()
        .eq("volunteer_id", id);

      // Get skill IDs from names
      const { data: skillsData, error: skillsQueryError } = await supabase
        .from("skills")
        .select("id, name")
        .in("name", volunteer.skills);

      if (skillsQueryError) throw skillsQueryError;

      if (skillsData && skillsData.length > 0) {
        const skillRows = skillsData.map(skill => ({
          volunteer_id: id,
          skill_id: skill.id
        }));

        const { error: skillsError } = await supabase
          .from("volunteer_skills")
          .insert(skillRows);

        if (skillsError) throw skillsError;
      }
    }

    toast.success("Volunteer updated successfully");
  } catch (error) {
    console.error("Error updating volunteer:", error);
    toast.error("Failed to update volunteer");
    throw error;
  }
}

// Delete volunteer
export async function deleteVolunteer(id: number): Promise<void> {
  // First delete from volunteer_skills
  await supabase
    .from("volunteer_skills")
    .delete()
    .eq("volunteer_id", id);
    
  // Then delete volunteer
  const { error } = await supabase
    .from("volunteers")
    .delete()
    .eq("id", id);
    
  if (error) {
    toast.error("Error deleting volunteer");
    throw error;
  }
  
  toast.success("Volunteer deleted successfully");
}
