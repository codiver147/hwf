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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { requestService } from "@/services/request";

interface AssignVolunteerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: number;
  onAssignVolunteer: () => void;
}

export function AssignVolunteerDialog({
  open,
  onOpenChange,
  requestId,
  onAssignVolunteer
}: AssignVolunteerDialogProps) {
  const [volunteerId, setVolunteerId] = useState<string>("");
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      fetchVolunteers();
      
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [open]);

  const fetchVolunteers = async () => {
    try {
      const volunteersData = await requestService.getVolunteers();
      setVolunteers(volunteersData);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      toast({
        title: "Error",
        description: "Failed to load volunteers",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!volunteerId || !scheduledDate) {
      toast({
        title: "Missing information",
        description: "Please select a volunteer and scheduled date",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await requestService.assignVolunteer(
        requestId,
        parseInt(volunteerId),
        scheduledDate,
        notes
      );
      
      // Update request status to scheduled
      await requestService.updateRequest(requestId, { status: "scheduled" });
      
      toast({
        title: "Success",
        description: "Volunteer assigned and delivery scheduled",
      });
      
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      onAssignVolunteer();
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning volunteer:", error);
      toast({
        title: "Error",
        description: "Failed to assign volunteer",
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
          <DialogTitle>Schedule Delivery</DialogTitle>
          <DialogDescription>
            Assign a volunteer and schedule the delivery
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="volunteer">Volunteer</Label>
            <Select
              value={volunteerId}
              onValueChange={setVolunteerId}
            >
              <SelectTrigger id="volunteer">
                <SelectValue placeholder="Select a volunteer" />
              </SelectTrigger>
              <SelectContent>
                {volunteers.map((volunteer) => (
                  <SelectItem key={volunteer.id} value={volunteer.id.toString()}>
                    {volunteer.first_name} {volunteer.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Scheduled Date</Label>
            <Input
              id="date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Enter any special instructions or notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Scheduling..." : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
