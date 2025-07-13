import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

type ActivityStatus = "completed" | "pending" | "processing" | "new" | "cancelled" | "in progress";

interface Activity {
  id: string;
  clientName: string;
  status: ActivityStatus;
  time: string;
}


async function fetchRecentActivity() {
  // First, fetch the recent requests - limit to 8
  const { data: requests, error } = await supabase
    .from('requests')
    .select('id, status, updated_at, client_id')
    .order('updated_at', { ascending: false })
    .limit(8);

  if (error) throw error;

  // Create a map to store client names
  const clientNames = new Map();
  
  // Get unique client IDs
  const clientIds = [...new Set(requests.map(req => req.client_id).filter(Boolean))];
  
  // If there are client IDs, fetch their names
  if (clientIds.length > 0) {
    const { data: clients } = await supabase
      .from('clients')
      .select('id, first_name, last_name')
      .in('id', clientIds);
      
    // Create a map of client_id to full name
    if (clients) {
      clients.forEach(client => {
        clientNames.set(client.id, `${client.first_name} ${client.last_name}`);
      });
    }
  }
  
  // Map requests to activities
  return requests.map((request) => ({
    id: request.id,
    clientName: request.client_id && clientNames.has(request.client_id) 
      ? clientNames.get(request.client_id) 
      : 'Client inconnu',
    status: request.status as ActivityStatus,
    time: formatDistanceToNow(new Date(request.updated_at), { addSuffix: true }),
  }));
}

function getStatusStyles(status: ActivityStatus) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
    case "new":
      return "bg-amber-100 text-amber-800";
    case "processing":
    case "in progress":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "";
  }
}

export function RecentActivity() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: fetchRecentActivity,
  });

  
let t;
  try {
    const { t: translateFn } = useLanguage();
    t = translateFn;
  } catch (error) {
    // Fallback if LanguageProvider is not available
    t = (key: string) => key;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.recentActivity')} </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Chargement...</div>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Requête #{activity.id} pour {activity.clientName}
                  </p>
                </div>
                <Badge className={cn("font-normal", getStatusStyles(activity.status))}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
