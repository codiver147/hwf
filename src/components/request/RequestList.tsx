
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Edit,
  MoreVertical,
  Trash2,
  Calendar,
} from "lucide-react";
import { UpdateStatusDialog } from "./UpdateStatusDialog";
import { AssignTeamDialog } from "./AssignTeamDialog";
import { AssignVolunteerDialog } from "./AssignVolunteerDialog";
import { getStatusBadge, getPriorityBadge } from "./view/StatusBadges";

interface RequestListProps {
  filteredRequests: any[];
  onDeleteRequest: (request: any) => void;
  onStatusUpdate: () => void;
  onTeamAssign?: () => void;
  onVolunteerAssign?: () => void;
}

export function RequestList({ 
  filteredRequests, 
  onDeleteRequest, 
  onStatusUpdate,
  onTeamAssign,
  onVolunteerAssign
}: RequestListProps) {
  const navigate = useNavigate();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [volunteerDialogOpen, setVolunteerDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const openStatusDialog = (request: any) => {
    setSelectedRequest(request);
    setStatusDialogOpen(true);
  };

  const openTeamDialog = (request: any) => {
    setSelectedRequest(request);
    setTeamDialogOpen(true);
  };

  const openVolunteerDialog = (request: any) => {
    setSelectedRequest(request);
    setVolunteerDialogOpen(true);
  };

  const formatDateTime = (date: string | null) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleString();
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Volunteers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request: any) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">#{request.id}</TableCell>
                  <TableCell>
                    {request.clients ? 
                      `${request.clients.first_name} ${request.clients.last_name}` : 
                      "N/A"}
                  </TableCell>
                  <TableCell>
                    {request.teams?.name || "No Team"}
                  </TableCell>
                  <TableCell>
                    {request.request_volunteers?.map((rv: any) => 
                      rv.volunteers?.first_name + ' ' + rv.volunteers?.last_name
                    ).join(', ') || 
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs hover:bg-slate-100 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openVolunteerDialog(request);
                      }}
                    >
                      Assign Volunteer
                    </Button>
                    }
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                  <TableCell>
                    {formatDateTime(request.created_at)}
                  </TableCell>
                  <TableCell>
                    {request.scheduled_at ? (
                      formatDateTime(request.scheduled_at)
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs hover:bg-slate-100 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          openVolunteerDialog(request);
                        }}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/requests/${request.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/requests/${request.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openStatusDialog(request)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDeleteRequest(request)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedRequest && (
        <>
          <UpdateStatusDialog
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            requestId={selectedRequest.id}
            currentStatus={selectedRequest.status}
            onStatusUpdate={onStatusUpdate}
          />
          
          <AssignTeamDialog
            open={teamDialogOpen}
            onOpenChange={setTeamDialogOpen}
            requestId={selectedRequest.id}
            currentTeamId={selectedRequest.team_id}
            onAssignTeam={() => {
              onTeamAssign?.();
              setSelectedRequest(null);
            }}
          />
          
          <AssignVolunteerDialog
            open={volunteerDialogOpen}
            onOpenChange={setVolunteerDialogOpen}
            requestId={selectedRequest.id}
            onAssignVolunteer={() => {
              onVolunteerAssign?.();
              setSelectedRequest(null);
            }}
          />
        </>
      )}
    </>
  );
}
