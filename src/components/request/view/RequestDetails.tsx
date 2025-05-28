
import { User, Users, Calendar, Package, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { getStatusBadge, getPriorityBadge } from "./StatusBadges";

interface RequestDetailsProps {
  request: any;
}

export const RequestDetails = ({ request }: RequestDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
        <p className="flex items-center mt-1">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          {request.clients ? `${request.clients.first_name} ${request.clients.last_name}` : 'Non assigné'}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Statut</h3>
        <p className="mt-1">{getStatusBadge(request.status)}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Équipe</h3>
        <p className="flex items-center mt-1">
          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
          {request.teams?.name || "Non assignée"}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Priorité</h3>
        <p className="mt-1">{getPriorityBadge(request.priority)}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Localisation</h3>
        <p className="flex items-center mt-1">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          {request.location || "Non spécifiée"}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Date de création</h3>
        <p className="flex items-center mt-1">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          {request.created_at ? format(new Date(request.created_at), 'dd/MM/yyyy HH:mm') : 'Non disponible'}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Volontaires assignés</h3>
        <p className="flex items-center mt-1">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          {request.request_volunteers && request.request_volunteers.length > 0 
            ? request.request_volunteers
                .map(rv => rv.volunteers && `${rv.volunteers.first_name} ${rv.volunteers.last_name}`)
                .filter(Boolean)
                .join(', ')
            : "Aucun volontaire assigné"}
        </p>
      </div>
      {request.scheduled_at && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Date prévue</h3>
          <p className="flex items-center mt-1">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            {format(new Date(request.scheduled_at), 'dd/MM/yyyy HH:mm')}
          </p>
        </div>
      )}
      <div className="md:col-span-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
        <p className="text-sm">{request.description || 'Aucune description'}</p>
      </div>
      {request.request_items && request.request_items.length > 0 && (
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Articles demandés</h3>
          <ul className="list-disc list-inside space-y-1">
            {request.request_items.map((item: any) => (
              <li key={item.inventory_item_id} className="text-sm flex items-start">
                <Package className="h-4 w-4 mr-2 text-muted-foreground inline mt-0.5" />
                {item.inventory_items?.name} (Quantité: {item.quantity})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
