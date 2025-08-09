import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserChurches } from '@/hooks/useChurch';

const PUBLIC_CHURCH_ID = '00000000-0000-0000-0000-000000000000';

export interface DashboardAnalytics {
  metrics: {
    totalActiveMembers: number;
    newMembersThisMonth: number;
    pendingAlerts: number;
    averageAttendanceRate: number; // 0..1
    baptismsThisYear: number;
    stageDistribution: Record<string, number>;
  };
  charts: {
    stageDistribution: { name: string; value: number }[];
    newMembersLast6Months: { month: string; count: number }[];
    alertsByStatus: { status: string; count: number }[];
  };
}

export const useDashboardAnalytics = () => {
  const { data: userChurches } = useUserChurches();
  const churchId = userChurches?.[0]?.church_id || PUBLIC_CHURCH_ID;

  return useQuery<DashboardAnalytics>({
    queryKey: ['dashboard-analytics', churchId],
    queryFn: async () => {
      // Fetch members
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id, active, created_at, last_service_attendance, baptized, baptism_date, discipleship_stage')
        .eq('church_id', churchId)
        .eq('active', true);
      if (membersError) throw membersError;

      // Fetch alerts
      const { data: alerts, error: alertsError } = await supabase
        .from('pastoral_alerts')
        .select('id, status')
        .eq('church_id', churchId);
      if (alertsError) throw alertsError;

      const totalActiveMembers = members?.length || 0;

      // New members this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newMembersThisMonth = (members || []).filter(m => m.created_at && new Date(m.created_at) >= startOfMonth).length;

      // Pending alerts
      const pendingStatuses = new Set(['open','in_progress','escalated']);
      const pendingAlerts = (alerts || []).filter(a => pendingStatuses.has((a.status as string) || 'open')).length;

      // Average attendance rate = members with last_service_attendance within last 30 days / total active
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const attendedCount = (members || []).filter(m => m.last_service_attendance && new Date(m.last_service_attendance) >= cutoff).length;
      const averageAttendanceRate = totalActiveMembers > 0 ? attendedCount / totalActiveMembers : 0;

      // Baptisms this year
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const baptismsThisYear = (members || []).filter(m => m.baptized && m.baptism_date && new Date(m.baptism_date) >= startOfYear).length;

      // Stage distribution
      const stageDistribution: Record<string, number> = {};
      (members || []).forEach(m => {
        const s = m.discipleship_stage || 'Unknown';
        stageDistribution[s] = (stageDistribution[s] || 0) + 1;
      });

      // Charts
      const stageDistributionChart = Object.entries(stageDistribution).map(([name, value]) => ({ name, value }));

      // New members last 6 months
      const months: { month: string; count: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        const count = (members || []).filter(m => m.created_at && new Date(m.created_at) >= start && new Date(m.created_at) < end).length;
        const label = d.toLocaleString(undefined, { month: 'short' });
        months.push({ month: `${label}`, count });
      }

      // Alerts by status
      const alertsByStatusMap: Record<string, number> = {};
      (alerts || []).forEach(a => {
        const s = (a.status as string) || 'open';
        alertsByStatusMap[s] = (alertsByStatusMap[s] || 0) + 1;
      });
      const alertsByStatus = Object.entries(alertsByStatusMap).map(([status, count]) => ({ status, count }));

      return {
        metrics: {
          totalActiveMembers,
          newMembersThisMonth,
          pendingAlerts,
          averageAttendanceRate,
          baptismsThisYear,
          stageDistribution,
        },
        charts: {
          stageDistribution: stageDistributionChart,
          newMembersLast6Months: months,
          alertsByStatus,
        },
      };
    },
  });
};
