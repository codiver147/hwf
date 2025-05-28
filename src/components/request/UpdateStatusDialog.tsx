
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { requestService } from "@/services/request";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: number;
  currentStatus: string;
  onStatusUpdate: () => void;
}

export function UpdateStatusDialog({
  open,
  onOpenChange,
  requestId,
  currentStatus,
  onStatusUpdate,
}: UpdateStatusDialogProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await requestService.updateRequestStatus(requestId, status);
      
      // If status is set to 'scheduled', we'll also set the scheduled_at time
      if (status === 'scheduled') {
        await requestService.updateRequest(requestId, {
          status,
          scheduled_at: new Date().toISOString()
        });
      } else {
        await requestService.updateRequest(requestId, { status });
      }
      
      toast({
        title: "Status Updated",
        description: `Request status has been updated to ${status}`,
      });
      
      onStatusUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('actions.updateStatus')}</DialogTitle>
          <DialogDescription>
            Choose a new status for this request
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">{t('status.new')}</SelectItem>
              <SelectItem value="in progress">{t('status.inProgress')}</SelectItem>
              <SelectItem value="completed">{t('status.completed')}</SelectItem>
              <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('actions.cancel')}
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating || status === currentStatus}
            className="bg-hwf-purple hover:bg-hwf-purple-dark"
          >
            {isUpdating ? "Updating..." : t('actions.update')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
