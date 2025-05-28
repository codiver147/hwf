
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { teamService } from "@/services/team";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MemberSelect } from "@/components/team/MemberSelect";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const teamId = parseInt(id || "");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch team data
  const { data: team, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamService.getTeamById(teamId),
    enabled: !isNaN(teamId),
    meta: {
      onError: (error: any) => {
        console.error("Error loading team:", error);
        toast.error("Error loading team data");
      }
    }
  });

  // Fetch team members
  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers', teamId],
    queryFn: () => teamService.getTeamMembers(teamId),
    enabled: !isNaN(teamId),
    meta: {
      onError: (error: any) => {
        console.error("Error loading team members:", error);
      }
    }
  });

  // Fetch team skills
  const { data: teamSkills } = useQuery({
    queryKey: ['teamSkills', teamId],
    queryFn: () => teamService.getTeamSkills(teamId),
    enabled: !isNaN(teamId),
    meta: {
      onError: (error: any) => {
        console.error("Error loading team skills:", error);
      }
    }
  });

  // Fetch skills
  const { data: skills = [], isLoading: isLoadingSkills } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Initialize form data when team data is loaded
  useEffect(() => {
    if (team) {
      console.log("Setting team data:", team);
      setName(team.name || "");
      setDescription(team.description || "");
    }
  }, [team]);

  // Initialize selected members when team members data is loaded
  useEffect(() => {
    if (teamMembers && teamMembers.length > 0) {
      console.log("Setting team members:", teamMembers);
      const memberIds = teamMembers.map(member => member.volunteer_id);
      setSelectedMembers(memberIds);
    }
  }, [teamMembers]);

  // Initialize selected skills when team skills data is loaded
  useEffect(() => {
    if (teamSkills && teamSkills.length > 0) {
      console.log("Setting team skills:", teamSkills);
      const skillIds = teamSkills.map(skill => skill.skill_id);
      setSelectedSkills(skillIds);
    }
  }, [teamSkills]);

  const handleSkillToggle = (skillId: number) => {
    setSelectedSkills(prev => {
      if (prev.includes(skillId)) {
        return prev.filter(id => id !== skillId);
      } else {
        return [...prev, skillId];
      }
    });
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError("Le nom de l'équipe est requis");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const teamData = {
        name,
        description,
      };

      await teamService.updateTeam(teamId, teamData, selectedMembers, selectedSkills);

      toast.success("Équipe mise à jour");
      navigate("/teams");
    } catch (error: any) {
      console.error('Error updating team:', error);
      setError(error.message || "Échec de la mise à jour de l'équipe");
      
      toast.error(error.message || "Échec de la mise à jour de l'équipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTeam) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-hwf-purple border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!team && !isLoadingTeam) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900">Équipe non trouvée</h2>
        <p className="mt-2 text-gray-600">L'équipe que vous recherchez n'existe pas ou a été supprimée.</p>
        <Button 
          onClick={() => navigate("/teams")} 
          className="mt-4 bg-hwf-purple hover:bg-hwf-purple-dark"
        >
          Retour aux équipes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/teams")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Modifier l'équipe</h1>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Information de l'équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="font-medium">
                  Nom de l'équipe
                </label>
                <Input
                  id="name"
                  placeholder="Entrez le nom de l'équipe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="description" className="font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Entrez la description et le but de l'équipe"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-20"
                />
              </div>

              <div className="grid gap-2">
                <label className="font-medium">Membres de l'équipe</label>
                <MemberSelect
                  selectedMembers={selectedMembers.map(String)}
                  onChange={(members) => setSelectedMembers(members.map(Number))}
                />
              </div>
              
              <div className="grid gap-2">
                <label className="font-medium">
                  Compétences de l'équipe
                </label>
                
                {isLoadingSkills ? (
                  <div>Chargement des compétences...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`skill-${skill.id}`}
                          checked={selectedSkills.includes(skill.id)}
                          onCheckedChange={() => handleSkillToggle(skill.id)}
                        />
                        <label
                          htmlFor={`skill-${skill.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {skill.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/teams")}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-hwf-purple hover:bg-hwf-purple-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Enregistrement...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
