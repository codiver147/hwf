
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { requestService } from "@/services/request";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RequestStats } from "@/components/request/RequestStats";
import { SearchToolbar } from "@/components/request/SearchToolbar";
import { RequestList } from "@/components/request/RequestList";
import { useLanguage } from "@/contexts/LanguageContext";

// Updated interface to match actual Supabase response
interface RequestWithDetails {
  id: number;
  client_id?: number;
  team_id?: number;
  status?: string;
  priority?: string;
  description?: string;
  location?: string;
  scheduled_at?: string;
  created_at?: string;
  updated_at?: string;
  clients?: {
    first_name?: string;
    last_name?: string;
  } | null;
  teams?: {
    name?: string;
  } | null;
  request_volunteers?: Array<{
    volunteer_id?: number;
    volunteers?: {
      first_name?: string;
      last_name?: string;
    } | null;
  }>;
  request_items?: Array<any>;
  request_teams?: Array<{
    team_id: number;
    teams: {
      id: number;
      name: string;
    };
  }>;
}

export default function Requests() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [requestToDelete, setRequestToDelete] = useState<RequestWithDetails | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: requestService.getRequests,
  });

  const filteredRequests = Array.isArray(requests) ? requests.filter((request: any) => {
    const searchStr = searchQuery.toLowerCase();
    return (
      request?.clients?.first_name?.toLowerCase().includes(searchStr) ||
      request?.clients?.last_name?.toLowerCase().includes(searchStr) ||
      request?.teams?.name?.toLowerCase().includes(searchStr) ||
      request?.request_teams?.some((rt: any) => rt.teams?.name?.toLowerCase().includes(searchStr)) ||
      request.status?.toLowerCase().includes(searchStr)
    );
  }) : [];

  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;
    
    try {
      await requestService.deleteRequest(requestToDelete.id);
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      
      toast({
        title: t('request.deleteSuccess'),
        description: t('request.deleteSuccess'),
      });
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: t('common.error'),
        description: t('request.errorDeleting'),
        variant: "destructive",
      });
    }
    
    setIsDeleteDialogOpen(false);
    setRequestToDelete(null);
  };

  const handleDataUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['requests'] });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-hwf-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('pages.requests.title')}</h1>
          <p className="text-muted-foreground">
            {t('pages.requests.manage')}
          </p>
        </div>
        <Button 
          className="bg-hwf-purple hover:bg-hwf-purple-dark"
          onClick={() => navigate("/requests/add")}
        >
          <ClipboardPlus className="mr-2 h-4 w-4" />
          {t('pages.requests.addNew')}
        </Button>
      </div>

      <RequestStats requests={filteredRequests} />

      <Card>
        <CardHeader>
          <CardTitle>{t('request.list')}</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchToolbar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <RequestList 
            filteredRequests={filteredRequests}
            onDeleteRequest={(request) => {
              setRequestToDelete(request);
              setIsDeleteDialogOpen(true);
            }}
            onStatusUpdate={handleDataUpdate}
            onTeamAssign={handleDataUpdate}
            onVolunteerAssign={handleDataUpdate}
          />
        </CardContent>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.areYouSure')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('request.deleteConfirmation')} #{requestToDelete?.id} {requestToDelete?.status && `(${requestToDelete.status})`}.
              {t('inventory.deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRequest}
              className="bg-red-500 hover:bg-red-600"
            >
              {t('actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
