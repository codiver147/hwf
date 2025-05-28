
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isToday, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface RequestStatsProps {
  requests: any[];
}

export function RequestStats({ requests }: RequestStatsProps) {
  const { t } = useLanguage();
  
  const newRequests = requests.filter((req) => req.status === "new").length;
  const inProgressRequests = requests.filter((req) => req.status === "in progress").length;
  const completedRequests = requests.filter((req) => req.status === "completed").length;
  const cancelledRequests = requests.filter((req) => req.status === "cancelled").length;
  const completedToday = requests.filter((req) => {
    if (req.status !== "completed") return false;
    return isToday(parseISO(req.updated_at));
  }).length;

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('status.new')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newRequests}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('status.inProgress')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressRequests}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('status.completed')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedRequests}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('status.cancelled')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cancelledRequests}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('status.completed')} {t('status.completed') === 'Terminé' ? "Aujourd'hui" : "Today"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedToday}</div>
        </CardContent>
      </Card>
    </div>
  );
}
