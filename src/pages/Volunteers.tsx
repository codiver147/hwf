
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getVolunteers, deleteVolunteer } from "@/services/volunteerService";
import { columns } from "@/components/volunteer/columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Volunteers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const { data: volunteers = [], isLoading, error } = useQuery({
    queryKey: ['volunteers'],
    queryFn: getVolunteers,
  });

  const filteredVolunteers = volunteers.filter(volunteer => {
    const searchStr = searchQuery.toLowerCase();
    return (
      volunteer.first_name.toLowerCase().includes(searchStr) ||
      volunteer.last_name.toLowerCase().includes(searchStr) ||
      volunteer.email.toLowerCase().includes(searchStr) ||
      (volunteer.skills && volunteer.skills.some(skill => skill.toLowerCase().includes(searchStr)))
    );
  });

  if (error) {
    console.error('Error loading volunteers:', error);
    toast.error("Échec du chargement des volontaires");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('pages.volunteers.title')}</h1>
          <p className="text-muted-foreground">
            {t('pages.volunteers.manage')}
          </p>
        </div>
        <Button onClick={() => navigate('/volunteers/add')} className="bg-hwf-purple hover:bg-hwf-purple-dark">
          <UserPlus className="mr-2 h-4 w-4" />
          {t('actions.addVolunteer')}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {volunteers.length} {t('nav.volunteers')}
          </span>
        </div>
        <div className="w-64">
          <Input
            placeholder={`${t('actions.search')}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredVolunteers}
        isLoading={isLoading}
      />
    </div>
  );
}
