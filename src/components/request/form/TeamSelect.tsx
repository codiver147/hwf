
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface Team {
  id: number;
  name: string;
}

interface TeamSelectProps {
  form: UseFormReturn<any>;
}

export const TeamSelect = ({ form }: TeamSelectProps) => {
  const { t } = useLanguage();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setTeams(data || []);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FormField
      control={form.control}
      name="teamId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('request.team')} ({t('common.optional')})</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('request.selectTeam')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <div className="p-2">
                <input
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  placeholder={t('request.searchTeam')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {isLoading ? (
                <SelectItem value="loading" disabled>{t('common.loading')}</SelectItem>
              ) : filteredTeams.length === 0 ? (
                <SelectItem value="empty" disabled>{t('request.noTeamFound')}</SelectItem>
              ) : (
                filteredTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
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
