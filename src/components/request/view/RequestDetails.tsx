
import { User, Users, Calendar, Package, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { getStatusBadge, getPriorityBadge } from "./StatusBadges";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface RequestDetailsProps {
  request: any;
}

export const RequestDetails = ({ request }: RequestDetailsProps) => {
  const { t } = useLanguage();

  // Function to get teams display with proper handling of multiple teams
  const getTeamsDisplay = () => {
    // Check if we have teams from request_teams relationship (multiple teams)
    if (request.request_teams && request.request_teams.length > 0) {
      const teamNames = request.request_teams
        .map((rt: any) => rt.teams?.name)
        .filter(Boolean);
      
      if (teamNames.length > 0) {
        return (
          <div className="flex flex-wrap gap-2">
            {teamNames.map((teamName: string, index: number) => (
              <Badge key={index} variant="secondary">
                {teamName}
              </Badge>
            ))}
          </div>
        );
      }
    }
    
    // Fallback to single team from teams relationship
    if (request.teams?.name) {
      return (
        <Badge variant="secondary">
          {request.teams.name}
        </Badge>
      );
    }
    
    return t('common.none');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{t('request.client')}</h3>
        <p className="flex items-center mt-1">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          {request.clients ? `${request.clients.first_name} ${request.clients.last_name}` : t('common.none')}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{t('common.status')}</h3>
        <p className="mt-1">{getStatusBadge(request.status)}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{t('request.teams')}</h3>
        <div className="flex items-center mt-1">
          <Users className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            {getTeamsDisplay()}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{t('request.priority')}</h3>
        <p className="mt-1">{getPriorityBadge(request.priority)}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{t('request.location')}</h3>
        <p className="flex items-center mt-1">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          {request.location || t('common.none')}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{t('client.createdAt')}</h3>
        <p className="flex items-center mt-1">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          {request.created_at ? format(new Date(request.created_at), 'dd/MM/yyyy HH:mm') : t('common.unknown')}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{t('request.volunteer')}</h3>
        <p className="flex items-center mt-1">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          {request.request_volunteers && request.request_volunteers.length > 0 
            ? request.request_volunteers
                .map(rv => rv.volunteers && `${rv.volunteers.first_name} ${rv.volunteers.last_name}`)
                .filter(Boolean)
                .join(', ')
            : t('common.none')}
        </p>
      </div>
      {request.scheduled_at && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{t('actions.schedule')}</h3>
          <p className="flex items-center mt-1">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            {format(new Date(request.scheduled_at), 'dd/MM/yyyy HH:mm')}
          </p>
        </div>
      )}
      <div className="md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('request.description')}</h3>
        <p className="text-sm">{request.description || t('common.none')}</p>
      </div>
      {request.request_items && request.request_items.length > 0 && (
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('request.products')}</h3>
          <ul className="list-disc list-inside space-y-1">
            {request.request_items.map((item: any) => (
              <li key={item.inventory_item_id} className="text-sm flex items-start">
                <Package className="h-4 w-4 mr-2 text-muted-foreground inline mt-0.5" />
                {item.inventory_items?.name} ({t('inventory.quantity')}: {item.quantity})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
