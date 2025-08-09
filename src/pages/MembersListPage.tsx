import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { MemberCard } from '@/components/members/MemberCard';
import { MemberFilters } from '@/components/members/MemberFilters';
import { useMembers, useMemberStats, useDeleteMember } from '@/hooks/useMembers';
import { useToast } from '@/hooks/use-toast';
import type { MemberFilters as MemberFiltersType } from '@/types/member';
import { useIsStaff } from '@/hooks/useRoles';

export default function MembersListPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [filters, setFilters] = useState<MemberFiltersType>({});
  const deleteMember = useDeleteMember();
  const { toast } = useToast();

  const isStaff = useIsStaff();

  const { data: members = [], isLoading } = useMembers(filters);
  const { data: stats } = useMemberStats();

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {row.original.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-sm text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'discipleship_stage',
      header: 'Stage',
      cell: ({ row }: any) => {
        const stage = row.original.discipleship_stage;
        if (!stage) return null;
        
        const stageColors = {
          'Seeker': 'bg-gray-100 text-gray-800',
          'New Believer': 'bg-blue-100 text-blue-800',
          'Growing': 'bg-green-100 text-green-800',
          'Mature': 'bg-purple-100 text-purple-800',
          'Leader': 'bg-orange-100 text-orange-800',
        };
        
        return (
          <Badge className={stageColors[stage as keyof typeof stageColors] || 'bg-gray-100 text-gray-800'}>
            {stage}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'last_activity_log',
      header: 'Last Activity',
      cell: ({ row }: any) => {
        const lastActivity = row.original.last_activity_log;
        if (!lastActivity) return <span className="text-muted-foreground">Never</span>;
        
        const date = new Date(lastActivity);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return (
          <span className={diffDays > 30 ? 'text-destructive' : 'text-muted-foreground'}>
            {diffDays === 0 ? 'Today' : `${diffDays} days ago`}
          </span>
        );
      },
    },
    {
      accessorKey: 'engagement_score',
      header: 'Engagement',
      cell: ({ row }: any) => {
        const score = row.original.engagement_score;
        if (score == null) return <span className="text-muted-foreground">-</span>;
        
        const level = score >= 0.8 ? 'High' : score >= 0.5 ? 'Medium' : 'Low';
        const color = score >= 0.8 ? 'text-green-600' : score >= 0.5 ? 'text-yellow-600' : 'text-red-600';
        
        return <span className={color}>{level}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/members/${row.original.id}`)}
          >
            View
          </Button>
          {isStaff && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/dashboard/members/${row.original.id}/edit`)}
            >
              Edit
            </Button>
          )}
          {isStaff && (
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                if (confirm(`Delete ${row.original.name}? This action deactivates the member.`)) {
                  try {
                    await deleteMember.mutateAsync(row.original.id);
                    toast({ title: 'Member deleted', description: `${row.original.name} has been deactivated.` });
                  } catch (e: any) {
                    toast({ title: 'Failed to delete member', description: e.message || 'Please try again.', variant: 'destructive' });
                  }
                }
              }}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleFiltersChange = (newFilters: MemberFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-muted-foreground">
            Manage your church members and track their spiritual journey
          </p>
        </div>
        {isStaff && (
          <Button onClick={() => navigate('/dashboard/members/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.engagement.high}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recent_activity}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.engagement.inactive}</div>
              <p className="text-xs text-muted-foreground">Inactive members</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberFilters 
            filters={filters} 
            onFiltersChange={handleFiltersChange}
            onReset={() => setFilters({})}
          />
        </CardContent>
      </Card>

      {/* View Toggle */}
      <Tabs value={view} onValueChange={(value) => setView(value as 'table' | 'grid')}>
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DataTable
            columns={columns}
            data={members}
            searchKey="name"
            searchPlaceholder="Search members..."
            pageSize={25}
          />
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onEdit={() => navigate(`/dashboard/members/${member.id}/edit`)}
                  onViewProfile={() => navigate(`/dashboard/members/${member.id}`)}
                  showQuickActions={isStaff}
                />
              ))}
            </div>
          )}

          {!isLoading && members.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No members found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by adding your first member.
              </p>
              <div className="mt-6">
                <Button onClick={() => navigate('/dashboard/members/create')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}