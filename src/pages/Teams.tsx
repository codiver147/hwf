import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit2,
  UsersRound
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { teamService } from "@/services/teamService";
import { toast } from "sonner";
import { DeleteTeamDialog } from "@/components/team/DeleteTeamDialog";

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
          <CardTitle>Team List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-hwf-purple border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Active Requests</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.length > 0 ? (
                    filteredTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>
                                {team.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {team.name}
                          </div>
                        </TableCell>
                        <TableCell>{team.team_members?.length || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="font-medium">{team.active_requests || 0}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({team.completed_requests || 0} completed)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {team.team_skills?.map((ts) => (
                              <Badge key={ts.id} variant="outline" className="bg-gray-50">
                                {ts.skills?.name || 'Unknown'}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => navigate(`/teams/view/${team.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => navigate(`/teams/edit/${team.id}`)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <DeleteTeamDialog team={team} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No teams found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
