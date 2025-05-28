
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  UserPlus, 
  UserMinus,
  Check,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type AssignVolunteersDialogProps = {
  team: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Mock volunteer data
const mockVolunteers = [
  { id: "VOL021", name: "Alex Johnson", skills: ["Driving", "IT Support"], isAssigned: false },
  { id: "VOL022", name: "Maria Garcia", skills: ["Client Communication", "Documentation"], isAssigned: false },
  { id: "VOL023", name: "James Wilson", skills: ["Furniture Assembly", "Heavy Lifting"], isAssigned: false },
  { id: "VOL024", name: "Sarah Chen", skills: ["Inventory Management", "Administration"], isAssigned: false },
  { id: "VOL025", name: "David Rodriguez", skills: ["Driving", "Furniture Assembly"], isAssigned: false },
  { id: "VOL026", name: "Jennifer Kim", skills: ["Client Assessment", "Documentation"], isAssigned: false },
  { id: "VOL027", name: "Michael Patel", skills: ["IT Support", "Electronics Setup"], isAssigned: false },
  { id: "VOL028", name: "Emily Thompson", skills: ["Kitchen Organization", "Inventory"], isAssigned: false },
];

export function AssignVolunteersDialog({ team, open, onOpenChange }: AssignVolunteersDialogProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // In a real app, fetch all volunteers from API
      // Mark volunteers as assigned if they're already in the team
      const volunteersWithAssignmentStatus = mockVolunteers.map(volunteer => ({
        ...volunteer,
        isAssigned: team.members ? team.members.some(member => member.id === volunteer.id) : false
      }));
      
      setVolunteers(volunteersWithAssignmentStatus);
      setSelectedVolunteers(volunteersWithAssignmentStatus.filter(v => v.isAssigned).map(v => v.id));
    }
  }, [open, team]);

  const filteredVolunteers = volunteers.filter(volunteer => 
    volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleVolunteerSelection = (volunteerId) => {
    setSelectedVolunteers(prev => 
      prev.includes(volunteerId)
        ? prev.filter(id => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  const handleSave = () => {
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Team Updated",
        description: `${selectedVolunteers.length} volunteers have been assigned to the team`,
      });
      
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Volunteers to Team</DialogTitle>
          <DialogDescription>
            Select volunteers to assign to the {team?.name} team
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative my-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search volunteers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto mt-2 -mx-6 px-6">
          <div className="space-y-4">
            {filteredVolunteers.length > 0 ? (
              filteredVolunteers.map((volunteer) => (
                <div 
                  key={volunteer.id}
                  className={`flex items-center justify-between p-3 border rounded-md ${
                    selectedVolunteers.includes(volunteer.id) 
                      ? "border-hwf-purple bg-hwf-soft-purple" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {volunteer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{volunteer.name}</div>
                      <div className="text-xs text-muted-foreground">{volunteer.id}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {volunteer.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${
                      selectedVolunteers.includes(volunteer.id) 
                        ? "text-hwf-purple hover:text-hwf-purple-dark hover:bg-hwf-soft-purple" 
                        : ""
                    }`}
                    onClick={() => toggleVolunteerSelection(volunteer.id)}
                  >
                    {selectedVolunteers.includes(volunteer.id) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No volunteers found matching your search.
              </div>
            )}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <DialogFooter className="sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedVolunteers.length} volunteers selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="bg-hwf-purple hover:bg-hwf-purple-dark"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Save Assignments
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
