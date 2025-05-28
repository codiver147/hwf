
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface DeliveryHistoryProps {
  deliveries: any[];
}

export const DeliveryHistory = ({ deliveries = [] }: DeliveryHistoryProps) => {
  const { t, language } = useLanguage();
  
  const getDeliveryStatus = (status: string) => {
    return status === 'completed' 
      ? (language === 'fr' ? 'Livraison effectuée' : 'Delivery completed')
      : (language === 'fr' ? 'Livraison prévue' : 'Delivery scheduled');
  };
  
  const getNoPlanningText = () => {
    return language === 'fr' ? 'Non planifiée' : 'Not scheduled';
  };
  
  const getNoDeliveriesText = () => {
    return language === 'fr' ? 'Aucune livraison planifiée' : 'No deliveries scheduled';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'fr' ? 'Historique des livraisons' : 'Delivery History'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deliveries?.map((assignment, index) => (
            <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {getDeliveryStatus(assignment.status)}
                </span>
                <span className="text-muted-foreground">
                  {assignment.scheduled_date 
                    ? format(new Date(assignment.scheduled_date), 'dd/MM/yyyy HH:mm')
                    : getNoPlanningText()}
                </span>
              </div>
              {assignment.volunteers && (
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'fr' ? 'Par' : 'By'} {assignment.volunteers.first_name} {assignment.volunteers.last_name}
                </p>
              )}
              {assignment.notes && (
                <p className="text-xs text-muted-foreground mt-1">{assignment.notes}</p>
              )}
            </div>
          ))}
          {(!deliveries || deliveries.length === 0) && (
            <p className="text-sm text-muted-foreground">{getNoDeliveriesText()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
