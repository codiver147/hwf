
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreVertical, Trash2, Calendar } from "lucide-react";
import { UpdateStatusDialog } from "./UpdateStatusDialog";
import { AssignTeamDialog } from "./AssignTeamDialog";
import { AssignVolunteerDialog } from "./AssignVolunteerDialog";
import { getStatusBadge, getPriorityBadge } from "./view/StatusBadges";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

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

  const getTeamsDisplay = (request: any) => {
    if (request.request_teams && request.request_teams.length > 0) {
      return request.request_teams
        .map((rt: any) => rt.teams?.name)
        .filter(Boolean)
        .join(', ');
    }
    
    if (request.teams?.name) {
      return request.teams.name;
    }
    
    return "No Team";
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => `#${row.original.id}`,
    },
    {
      accessorKey: "clients",
      header: "Client",
      cell: ({ row }) => {
        const client = row.original.clients;
        return client ? `${client.first_name} ${client.last_name}` : "N/A";
      },
    },
    {
      accessorKey: "teams",
      header: "Team(s)",
      cell: ({ row }) => getTeamsDisplay(row.original),
    },
    {
      accessorKey: "request_volunteers",
      header: "Volunteers",
      cell: ({ row }) => {
        const volunteers = row.original.request_volunteers;
        if (volunteers && volunteers.length > 0) {
          return volunteers.map((rv: any) => 
            rv.volunteers?.first_name + ' ' + rv.volunteers?.last_name
          ).join(', ');
        }
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs hover:bg-slate-100 p-1"
            onClick={(e) => {
              e.stopPropagation();
              openVolunteerDialog(row.original);
            }}
          >
            Assign Volunteer
          </Button>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => getPriorityBadge(row.original.priority),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => formatDateTime(row.original.created_at),
    },
    {
      accessorKey: "scheduled_at",
      header: "Scheduled",
      cell: ({ row }) => {
        const scheduledAt = row.original.scheduled_at;
        if (scheduledAt) {
          return formatDateTime(scheduledAt);
        }
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs hover:bg-slate-100 p-1"
            onClick={(e) => {
              e.stopPropagation();
              openVolunteerDialog(row.original);
            }}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Schedule
          </Button>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/requests/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/requests/${row.original.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => openStatusDialog(row.original)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDeleteRequest(row.original)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredRequests}
        enablePagination={true}
        defaultPageSize={10}
      />

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
