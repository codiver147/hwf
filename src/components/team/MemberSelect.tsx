
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface MemberSelectProps {
  selectedMembers: string[];
  onChange: (members: string[]) => void;
}

// Define interface for volunteer data
interface Volunteer {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  team_members?: Array<{ volunteer_id: number }> | null;
}

export function MemberSelect({ selectedMembers, onChange }: MemberSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('volunteers')
          .select(`
            id, 
            first_name, 
            last_name, 
            email,
            team_members(volunteer_id)
          `)
          .order('first_name');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setVolunteers(data);
        } else {
          setVolunteers([]);
        }
      } catch (err: any) {
        console.error('Error fetching volunteers:', err);
        setError(err.message || 'Failed to load volunteers');
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const filteredVolunteers = volunteers.filter(
    volunteer =>
      !selectedMembers.includes(volunteer.id.toString()) &&
      (volunteer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       volunteer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       volunteer.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (volunteerId: string) => {
    if (!selectedMembers.includes(volunteerId)) {
      onChange([...selectedMembers, volunteerId]);
    }
  };

  const handleRemove = (volunteerId: string) => {
    onChange(selectedMembers.filter(id => id !== volunteerId));
  };

  const getVolunteerName = (volunteerId: string) => {
    const volunteer = volunteers.find(v => v.id.toString() === volunteerId);
    return volunteer ? `${volunteer.first_name} ${volunteer.last_name}` : 'Unknown Member';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedMembers.map((volunteerId) => (
          <Badge 
            key={volunteerId}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {getVolunteerName(volunteerId)}
            <button
              type="button"
              onClick={() => handleRemove(volunteerId)}
              className="ml-1 hover:bg-gray-200 rounded"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      <Select onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Add team member..." />
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <input
              className="w-full rounded-md border border-input px-3 py-2 text-sm"
              placeholder="Search volunteers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {loading && (
            <div className="p-2 text-sm text-gray-500">
              Loading volunteers...
            </div>
          )}
          
          {error && (
            <div className="p-2 text-sm text-red-500">
              {error}
            </div>
          )}
          
          {!loading && !error && filteredVolunteers.length > 0 ? (
            filteredVolunteers.map((volunteer) => (
              <SelectItem 
                key={volunteer.id} 
                value={volunteer.id.toString()}
              >
                {volunteer.first_name} {volunteer.last_name}
              </SelectItem>
            ))
          ) : (
            !loading && !error && (
              <div className="p-2 text-sm text-gray-500">
                No volunteers found
              </div>
            )
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
