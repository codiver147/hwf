
import { useParams, useNavigate } from "react-router-dom";
import { teamService } from "@/services/team";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit2, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ViewTeam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const teamId = parseInt(id || "");

  const { data: team, isLoading } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamService.getTeamById(teamId),
    enabled: !isNaN(teamId)
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-hwf-purple border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900">{t('team.noTeamFound')}</h2>
        <p className="mt-2 text-gray-600">{t('team.noTeamFound')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/teams")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-2xl font-bold">{team.name}</h1>
        </div>
        <Button 
          onClick={() => navigate(`/teams/edit/${team.id}`)}
          className="bg-hwf-purple hover:bg-hwf-purple-dark"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          {t('common.edit')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('pages.teams.information')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">{t('common.description')}</h3>
            <p className="mt-1 text-gray-600">{team.description || t('common.none')}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">{t('dashboard.monthlyStats')}</h3>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{t('team.teamMembers')}</span>
                </div>
                <p className="mt-1 text-2xl font-semibold text-hwf-purple">
                  {team.team_members?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
