import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { teamService } from "@/services/teamService";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MemberSelect } from "@/components/team/MemberSelect";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AddTeam() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch skills from Supabase
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
      setError("Team name is required");
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
      console.log("Submitting team data:", {
        name,
        description,
        selectedMembers,
        selectedSkills
      });
      
      const teamData = {
        name,
        description,
        active_requests: 0,
        completed_requests: 0
      };

      await teamService.createTeam(teamData, selectedMembers, selectedSkills);

      toast({
        title: "Team Created",
        description: `${name} has been created successfully`,
      });
      
      navigate("/teams");
    } catch (error: any) {
      console.error('Error creating team:', error);
      setError(error.message || "Failed to create team. Please try again.");
      
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Create New Team</h1>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="font-medium">
                  Team Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter team name"
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
                  placeholder="Enter team description and purpose"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-20"
                />
              </div>

              <div className="grid gap-2">
                <label className="font-medium">Team Members</label>
                <MemberSelect
                  selectedMembers={selectedMembers.map(String)}
                  onChange={(members) => setSelectedMembers(members.map(Number))}
                />
              </div>
              
              <div className="grid gap-2">
                <label className="font-medium">
                  Team Skills
                </label>
                
                {isLoadingSkills ? (
                  <div>Loading skills...</div>
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
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-hwf-purple hover:bg-hwf-purple-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Team
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
