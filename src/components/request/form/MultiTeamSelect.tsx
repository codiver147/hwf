
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface Team {
  id: number;
  name: string;
}

interface MultiTeamSelectProps {
  form: UseFormReturn<any>;
}

export const MultiTeamSelect = ({ form }: MultiTeamSelectProps) => {
  const { t } = useLanguage();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
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

  const selectedTeamIds = form.watch("teamIds");
  console.log("selectedTeamIds from watch:", selectedTeamIds);
  
  const safeTeamIds = Array.isArray(selectedTeamIds) ? selectedTeamIds : [];
  const selectedTeams = teams.filter(team => safeTeamIds.includes(team.id.toString()));

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTeamSelect = (teamId: string) => {
    const currentTeamIds = form.getValues("teamIds") || [];
    if (!Array.isArray(currentTeamIds)) {
      form.setValue("teamIds", [teamId]);
      return;
    }
    
    if (currentTeamIds.includes(teamId)) {
      form.setValue("teamIds", currentTeamIds.filter(id => id !== teamId));
    } else {
      form.setValue("teamIds", [...currentTeamIds, teamId]);
    }
  };

  const removeTeam = (teamId: string) => {
    const currentTeamIds = form.getValues("teamIds") || [];
    if (!Array.isArray(currentTeamIds)) return;
    form.setValue("teamIds", currentTeamIds.filter(id => id !== teamId));
  };

  return (
    <FormField
      control={form.control}
      name="teamIds"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{t('request.teams')} *</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="justify-between min-h-10"
                >
                  {selectedTeams.length > 0
                    ? `${selectedTeams.length} ${t('request.teamsSelected')}`
                    : t('request.selectTeams')}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <div className="p-2">
                <Input
                  placeholder={t('request.searchTeam')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <ScrollArea className="max-h-60">
                <div className="p-1">
                  {isLoading ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      {t('common.loading')}
                    </div>
                  ) : filteredTeams.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      {t('request.noTeamFound')}
                    </div>
                  ) : (
                    filteredTeams.map((team) => (
                      <div
                        key={team.id}
                        className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                        onClick={() => handleTeamSelect(team.id.toString())}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            safeTeamIds.includes(team.id.toString()) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="flex-1">{team.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          
          {selectedTeams.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTeams.map((team) => (
                <Badge key={team.id} variant="secondary" className="flex items-center gap-1">
                  {team.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTeam(team.id.toString())}
                  />
                </Badge>
              ))}
            </div>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
