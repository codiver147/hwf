import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { requestService } from "@/services/request";

interface AssignTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: number;
  currentTeamId?: number | null;
  onAssignTeam: () => void;
}

export function AssignTeamDialog({
  open,
  onOpenChange,
  requestId,
  currentTeamId,
  onAssignTeam
}: AssignTeamDialogProps) {
  const [teamId, setTeamId] = useState<string>(currentTeamId?.toString() || "");
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      fetchTeams();
    }
  }, [open]);

  useEffect(() => {
    setTeamId(currentTeamId?.toString() || "");
  }, [currentTeamId]);

  const fetchTeams = async () => {
    try {
      const teamsData = await requestService.getTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await requestService.updateRequest(requestId, {
        team_id: teamId ? parseInt(teamId) : null
      });
      
      toast({
        title: "Success",
        description: "Team assignment updated",
      });
      
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      onAssignTeam();
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning team:", error);
      toast({
        title: "Error",
        description: "Failed to assign team",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Team</DialogTitle>
          <DialogDescription>
            Select a team to assign to this request
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="team">Team</Label>
            <Select
              value={teamId}
              onValueChange={setTeamId}
            >
              <SelectTrigger id="team">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
