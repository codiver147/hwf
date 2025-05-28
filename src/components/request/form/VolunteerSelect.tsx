
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Volunteer {
  id: number;
  first_name: string;
  last_name: string;
}

interface VolunteerSelectProps {
  form: UseFormReturn<any>;
}

export const VolunteerSelect = ({ form }: VolunteerSelectProps) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const { data, error } = await supabase
          .from('volunteers')
          .select('id, first_name, last_name')
          .order('last_name');
        
        if (error) throw error;
        setVolunteers(data || []);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const filteredVolunteers = volunteers.filter(volunteer =>
    `${volunteer.first_name} ${volunteer.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <FormField
      control={form.control}
      name="volunteerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bénévole</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un bénévole" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <div className="p-2">
                <input
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  placeholder="Rechercher un bénévole..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {isLoading ? (
                <SelectItem value="loading" disabled>Chargement...</SelectItem>
              ) : filteredVolunteers.length === 0 ? (
                <SelectItem value="empty" disabled>Aucun bénévole trouvé</SelectItem>
              ) : (
                filteredVolunteers.map((volunteer) => (
                  <SelectItem key={volunteer.id} value={volunteer.id.toString()}>
                    {volunteer.first_name} {volunteer.last_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
