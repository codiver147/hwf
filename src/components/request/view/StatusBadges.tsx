
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export const getStatusBadge = (status: string) => {
  const { t } = useLanguage();
  
  switch (status) {
    case "new":
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{t('status.new')}</Badge>;
    case "in progress":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{t('status.inProgress')}</Badge>;
    case "processing":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{t('status.processing')}</Badge>;
    case "scheduled":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{t('status.scheduled')}</Badge>;
    case "completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('status.completed')}</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{t('status.cancelled')}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const getPriorityBadge = (priority: string) => {
  const { t } = useLanguage();
  
  switch (priority) {
    case "low":
      return <Badge variant="outline" className="border-purple-200 text-purple-700">{t('priority.low')}</Badge>;
    case "medium":
      return <Badge variant="outline" className="border-blue-200 text-blue-700">{t('priority.medium')}</Badge>;
    case "high":
      return <Badge variant="outline" className="border-red-200 text-red-700">{t('priority.high')}</Badge>;
    case "urgent":
      return <Badge variant="outline" className="border-red-200 text-red-700">{t('priority.urgent')}</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};
