import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Bell, TrendingUp, Calendar, Plus, Activity, AlertCircle, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserChurches } from "@/hooks/useChurch";
import { useDashboardAnalytics } from "@/hooks/useAnalytics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { useIsStaff } from "@/hooks/useRoles";
import FirstSetupCard from "@/components/auth/FirstSetupCard";

const DashboardPage = () => {
  const { user: authUser } = useAuth();
  const { data: profile } = useProfile();
  const { data: userChurches } = useUserChurches();

  const { data: analytics, isLoading } = useDashboardAnalytics();

  const user = {
    name: profile?.display_name || authUser?.email?.split('@')[0] || "User",
    church: userChurches?.[0]?.churches?.name || "Your Church"
  };

  const total = analytics?.metrics.totalActiveMembers ?? 0;
  const newThisMonth = analytics?.metrics.newMembersThisMonth ?? 0;
  const pendingAlerts = analytics?.metrics.pendingAlerts ?? 0;
  const attendancePct = Math.round((analytics?.metrics.averageAttendanceRate ?? 0) * 100);
  const baptismsThisYear = analytics?.metrics.baptismsThisYear ?? 0;
  const topStage = (() => {
    const dist = analytics?.metrics.stageDistribution || {};
    let top = 'N/A';
    let max = 0;
    Object.entries(dist).forEach(([k, v]) => { if (v > max) { max = v; top = k; } });
    return `${top} (${max})`;
  })();

  const stats = [
    {
      title: "Total Active Members",
      value: total.toString(),
      description: "All active profiles",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "New Members This Month",
      value: newThisMonth.toString(),
      description: "Joined this month",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Pending Pastoral Alerts",
      value: pendingAlerts.toString(),
      description: "Open or in progress",
      icon: Bell,
      color: "text-warning"
    },
    {
      title: "Average Attendance Rate",
      value: `${attendancePct}%`,
      description: "Last 30 days",
      icon: BarChart3,
      color: "text-church-blue"
    },
    {
      title: "Baptisms This Year",
      value: baptismsThisYear.toString(),
      description: `${new Date().getFullYear()}`,
      icon: Calendar,
      color: "text-primary"
    },
    {
      title: "Discipleship Stage Distribution",
      value: topStage,
      description: "Most common stage",
      icon: Users,
      color: "text-primary"
    }
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e', '#06b6d4'];

  const exportReport = () => {
    const lines: string[] = [];
    lines.push('Metric,Value');
    lines.push(`Total Active Members,${total}`);
    lines.push(`New Members This Month,${newThisMonth}`);
    lines.push(`Pending Pastoral Alerts,${pendingAlerts}`);
    lines.push(`Average Attendance Rate,${attendancePct}%`);
    lines.push(`Baptisms This Year,${baptismsThisYear}`);
    lines.push('');
    lines.push('Discipleship Stage Distribution');
    Object.entries(analytics?.metrics.stageDistribution || {}).forEach(([k,v]) => lines.push(`${k},${v}`));
    lines.push('');
    lines.push('New Members (Last 6 Months)');
    (analytics?.charts.newMembersLast6Months || []).forEach(r => lines.push(`${r.month},${r.count}`));
    lines.push('');
    lines.push('Alerts by Status');
    (analytics?.charts.alertsByStatus || []).forEach(r => lines.push(`${r.status},${r.count}`));

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const urlObj = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = urlObj;
    link.download = `church-analytics-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(urlObj);
  };
  const quickActions = [
    {
      title: "Add New Member",
      description: "Register a new church member",
      icon: Users,
      action: "/dashboard/members/create"
    },
    {
      title: "Create Alert",
      description: "Open a pastoral alert",
      icon: Bell,
      action: "/dashboard/alerts"
    },
    {
      title: "View Analytics",
      description: "Open analytics overview",
      icon: BarChart3,
      action: "/dashboard"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "info",
      title: "Welcome to ECHAD SI Agent!",
      description: "Your church management system is ready to use.",
      time: "Just now",
      icon: Activity
    },
    {
      id: 2,
      type: "action",
      title: "Set up your first ministry",
      description: "Configure ministry groups and assign leaders.",
      time: "Getting started",
      icon: AlertCircle
    }
  ];

  const isStaff = useIsStaff();
  if (!isStaff) {
    return (
      <div className="space-y-6">
        <FirstSetupCard />
        <div className="bg-gradient-to-r from-primary/10 to-church-blue/10 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h1>
          <p className="text-muted-foreground">This dashboard is available to church staff (admin, pastor, staff). You can still view church announcements.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Visit Communications to view the latest updates from your church.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = '/dashboard/communications')}>Go to Communications</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-church-blue/10 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening at {user.church} today.
            </p>
          </div>
          <div className="hidden md:block">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Quick Start Guide
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get you started with church management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Start
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <activity.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <div className="flex items-center mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {activity.time}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty state message */}
            <div className="text-center py-6 border-t border-border mt-4">
              <p className="text-sm text-muted-foreground">
                More activity will appear here as you use the system
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Section */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with ECHAD SI Agent</CardTitle>
          <CardDescription>
            Follow these steps to set up your church management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">Add Your Members</h4>
              <p className="text-sm text-muted-foreground">
                Start by importing or adding your church members to the database
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">Configure Alerts</h4>
              <p className="text-sm text-muted-foreground">
                Set up pastoral care alerts and notifications for better member engagement
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">Explore Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Use AI-powered insights to understand your church's growth and engagement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;