import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Bell, TrendingUp, Calendar, Plus, Activity, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserChurches } from "@/hooks/useChurch";

const DashboardPage = () => {
  const { user: authUser } = useAuth();
  const { data: profile } = useProfile();
  const { data: userChurches } = useUserChurches();

  const user = {
    name: profile?.display_name || authUser?.email?.split('@')[0] || "User",
    church: userChurches?.[0]?.churches?.name || "Your Church"
  };

  const stats = [
    {
      title: "Total Members",
      value: "0",
      description: "Start adding members to your database",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Active Alerts",
      value: "0",
      description: "No pastoral alerts at this time",
      icon: Bell,
      color: "text-warning"
    },
    {
      title: "This Month's Growth",
      value: "0%",
      description: "Growth compared to last month",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Upcoming Events",
      value: "0",
      description: "Events scheduled for this month",
      icon: Calendar,
      color: "text-church-blue"
    }
  ];

  const quickActions = [
    {
      title: "Add New Member",
      description: "Register a new church member",
      icon: Users,
      action: "/members/new"
    },
    {
      title: "Create Event",
      description: "Schedule a church event",
      icon: Calendar,
      action: "/events/new"
    },
    {
      title: "Send Communication",
      description: "Send message to members",
      icon: Bell,
      action: "/communications/new"
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