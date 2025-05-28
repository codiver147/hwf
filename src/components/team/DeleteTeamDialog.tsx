
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { teamService } from "@/services/team";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Team {
  id: number;
  name: string;
}

interface DeleteTeamDialogProps {
  team: Team;
}

export function DeleteTeamDialog({ team }: DeleteTeamDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteTeam, isPending } = useMutation({
    mutationFn: async () => {
      console.log(`Delete confirmation clicked for team ID: ${team.id}`);
      return await teamService.deleteTeam(team.id);
    },
    onSuccess: () => {
      // Since the function returns a boolean (true) on success, we can just use it directly
      toast.success(`Team "${team.name}" deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting team:', error);
      toast.error(`Failed to delete team "${team.name}". Please try again later.`);
      setIsOpen(false);
    },
  });

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Team
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{team.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                deleteTeam();
              }}
              className="bg-red-500 hover:bg-red-600"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
