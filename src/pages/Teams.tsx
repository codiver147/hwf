
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  UsersRound
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { teamService } from "@/services/teamService";
import { DeleteTeamDialog } from "@/components/team/DeleteTeamDialog";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface TeamSkill {
  id: number;
  skill_id: number;
  team_id: number;
  skills?: {
    id: number;
    name: string;
  };
}

interface TeamMember {
  id: number;
  team_id: number;
  volunteer_id: number;
}

interface Team {
  id: number;
  name: string;
  description?: string;
  active_requests?: number;
  completed_requests?: number;
  team_members?: TeamMember[];
  team_skills?: TeamSkill[];
}

export default function Teams() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: teamService.getTeams,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.team_skills?.some(ts => ts.skills?.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const totalTeams = teams.length;
  const totalMembers = teams.reduce((sum, team) => sum + (team.team_members?.length || 0), 0);
  const activeRequests = teams.reduce((sum, team) => sum + (team.active_requests || 0), 0);
  const completedRequests = teams.reduce((sum, team) => sum + (team.completed_requests || 0), 0);

  const columns: ColumnDef<Team>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Team Name",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>
              {row.original.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "team_members",
      header: "Members",
      cell: ({ row }) => row.original.team_members?.length || 0,
    },
    {
      accessorKey: "active_requests",
      header: "Active Requests",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className="font-medium">{row.original.active_requests || 0}</span>
          <span className="text-xs text-muted-foreground ml-2">
            ({row.original.completed_requests || 0} completed)
          </span>
        </div>
      ),
    },
    {
      accessorKey: "team_skills",
      header: "Skills",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.team_skills?.map((ts) => (
            <Badge key={ts.id} variant="outline" className="bg-gray-50">
              {ts.skills?.name || 'Unknown'}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => navigate(`/teams/view/${row.original.id}`)}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => navigate(`/teams/edit/${row.original.id}`)}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <DeleteTeamDialog team={row.original} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            Manage your volunteer teams and assignments
          </p>
        </div>
        <Button 
          className="bg-hwf-purple hover:bg-hwf-purple-dark"
          onClick={() => navigate("/teams/add")}
        >
          <UsersRound className="mr-2 h-4 w-4" />
          New Team
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRequests}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team List</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search teams..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredTeams}
            isLoading={isLoading}
            enablePagination={true}
            defaultPageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
