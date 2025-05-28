import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, UserCircle, ClipboardList } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

async function fetchDashboardData() {
  const [clientsResult, volunteersResult, inventoryResult, requestsResult] = await Promise.all([
    supabase.from('clients').select('count'),
    supabase.from('volunteers').select('count').eq('is_active', 1),
    supabase.from('inventory_items').select('count'),
    supabase.from('requests').select('*').eq('status', 'in progress'),
  ]);

  if (clientsResult.error) throw clientsResult.error;
  if (volunteersResult.error) throw volunteersResult.error;
  if (inventoryResult.error) throw inventoryResult.error;
  if (requestsResult.error) throw requestsResult.error;

  return {
    totalClients: clientsResult.data[0].count,
    activeVolunteers: volunteersResult.data[0].count,
    inventoryItems: inventoryResult.data[0].count,
    pendingRequests: requestsResult.data.length,
  };
}

async function fetchMonthlyStats() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [clientsData, volunteersData] = await Promise.all([
    supabase
      .from('clients')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString()),
    supabase
      .from('volunteers')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString()),
  ]);

  if (clientsData.error) throw clientsData.error;
  if (volunteersData.error) throw volunteersData.error;

  const monthlyStats = new Map();

  // Initialize all months with 0
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = format(date, 'MMM yyyy');
    monthlyStats.set(monthKey, { month: monthKey, clients: 0, volunteers: 0 });
  }

  // Count clients per month
  clientsData.data.forEach((client) => {
    const monthKey = format(new Date(client.created_at), 'MMM yyyy');
    if (monthlyStats.has(monthKey)) {
      const stats = monthlyStats.get(monthKey);
      stats.clients += 1;
    }
  });

  // Count volunteers per month
  volunteersData.data.forEach((volunteer) => {
    const monthKey = format(new Date(volunteer.created_at), 'MMM yyyy');
    if (monthlyStats.has(monthKey)) {
      const stats = monthlyStats.get(monthKey);
      stats.volunteers += 1;
    }
  });

  return Array.from(monthlyStats.values()).reverse();
}

export default function Dashboard() {
  const { t } = useLanguage();
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardData,
  });

  const { data: monthlyStats, isLoading: isLoadingChart } = useQuery({
    queryKey: ['monthlyStats'],
    queryFn: fetchMonthlyStats,
  });

  if (isLoadingStats || isLoadingChart) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.overview')}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('dashboard.totalClients')}
          value={stats?.totalClients || 0}
          icon={UserCircle}
        />
        <StatCard
          title={t('dashboard.activeVolunteers')}
          value={stats?.activeVolunteers || 0}
          icon={Users}
        />
        <StatCard
          title={t('dashboard.inventoryItems')}
          value={stats?.inventoryItems || 0}
          icon={Package}
        />
        <StatCard
          title={t('dashboard.pendingRequests')}
          value={stats?.pendingRequests || 0}
          icon={ClipboardList}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.monthlyStats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clients" fill="#7E69AB" name="Nouveaux Clients" />
                  <Bar dataKey="volunteers" fill="#9b87f5" name="Nouveaux Bénévoles" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <RecentActivity />
      </div>
    </div>
  );
}
