
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Search, Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock data for skills
const mockSkills = [
  { id: "SKL001", name: "Driving", category: "Transportation", volunteers: 15, teams: 3 },
  { id: "SKL002", name: "Lifting", category: "Physical", volunteers: 22, teams: 4 },
  { id: "SKL003", name: "IT", category: "Technical", volunteers: 8, teams: 2 },
  { id: "SKL004", name: "Customer Service", category: "Interpersonal", volunteers: 17, teams: 5 },
  { id: "SKL005", name: "Organization", category: "Administrative", volunteers: 12, teams: 4 },
  { id: "SKL006", name: "Inventory", category: "Logistics", volunteers: 10, teams: 3 },
  { id: "SKL007", name: "Documentation", category: "Administrative", volunteers: 7, teams: 2 },
  { id: "SKL008", name: "Translation (French)", category: "Language", volunteers: 5, teams: 1 },
  { id: "SKL009", name: "Translation (Spanish)", category: "Language", volunteers: 6, teams: 2 },
  { id: "SKL010", name: "Translation (Arabic)", category: "Language", volunteers: 4, teams: 1 },
  { id: "SKL011", name: "Admin", category: "Administrative", volunteers: 9, teams: 3 },
  { id: "SKL012", name: "Maintenance", category: "Technical", volunteers: 11, teams: 2 },
];

export default function Skills() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [skills, setSkills] = useState(mockSkills);

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    // In a real application, this would make an API call
    setSkills(skills.filter(skill => skill.id !== id));
    toast.success("Skill deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">
            Manage skills for volunteers and teams
          </p>
        </div>
        <Button
          onClick={() => navigate("/skills/add")}
          className="bg-hwf-purple hover:bg-hwf-purple-dark"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Skill
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Skills List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            View and manage skills for the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Volunteers</TableHead>
                <TableHead className="text-center">Teams</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-hwf-purple mr-2" />
                        {skill.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{skill.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{skill.volunteers}</TableCell>
                    <TableCell className="text-center">{skill.teams}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Manage Skill</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => navigate(`/skills/edit/${skill.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(skill.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No skills found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
