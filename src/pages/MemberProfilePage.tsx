import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, MessageSquare, Plus, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ActivityTimeline } from '@/components/members/ActivityTimeline';
import { MemberNotes } from '@/components/members/MemberNotes';
import { MemberHistory } from '@/components/members/MemberHistory';
import { useMember } from '@/hooks/useMembers';
import { DiscipleshipStageBadge } from '@/components/members/DiscipleshipStageSelector';
import { format } from 'date-fns';

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: member, isLoading, error } = useMember(id!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Member not found</h2>
        <p className="text-muted-foreground mt-2">
          The member you're looking for doesn't exist or you don't have permission to view them.
        </p>
        <Button className="mt-4" onClick={() => navigate('/dashboard/members')}>
          Back to Members
        </Button>
      </div>
    );
  }

  const getEngagementLevel = (score?: number) => {
    if (!score) return { level: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    if (score >= 0.8) return { level: 'High', color: 'bg-green-100 text-green-800' };
    if (score >= 0.5) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Low', color: 'bg-red-100 text-red-800' };
  };

  const engagement = getEngagementLevel(member.engagement_score);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/members')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Members
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Message
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/dashboard/members/${member.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Member Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={member.photo_url || ''} />
              <AvatarFallback className="text-2xl">
                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{member.name}</h1>
                {member.discipleship_stage && (
                  <DiscipleshipStageBadge stage={member.discipleship_stage} />
                )}
                <Badge className={engagement.color}>
                  {engagement.level} Engagement
                </Badge>
              </div>
              
              {member.member_number && (
                <p className="text-sm text-muted-foreground mb-4">
                  Member #{member.member_number}
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {member.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{member.email}</span>
                  </div>
                )}
                
                {member.phone_number && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{member.phone_number}</span>
                  </div>
                )}
                
                {(member.city || member.country) && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{[member.city, member.country].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {member.baptized ? 'Yes' : 'No'}
            </div>
            <p className="text-xs text-muted-foreground">Baptized</p>
            {member.baptism_date && (
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(member.baptism_date), 'MMM dd, yyyy')}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {member.saved_status ? 'Yes' : 'No'}
            </div>
            <p className="text-xs text-muted-foreground">Born Again</p>
            {member.salvation_date && (
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(member.salvation_date), 'MMM dd, yyyy')}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {member.spiritual_gifts?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Spiritual Gifts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {member.biblical_understanding || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Biblical Understanding</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {member.birthday && (
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Birthday</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      {format(new Date(member.birthday), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                )}
                
                {member.address && (
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Address</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      {member.address}
                    </p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm font-medium">Language:</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {member.language_preference === 'en' ? 'English' : member.language_preference}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Spiritual Information */}
            <Card>
              <CardHeader>
                <CardTitle>Spiritual Journey</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {member.spiritual_gifts && member.spiritual_gifts.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Spiritual Gifts:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.spiritual_gifts.map((gift) => (
                        <Badge key={gift} variant="secondary" className="text-xs">
                          {gift}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Email Notifications:</span>
                    <span className="text-sm text-muted-foreground">
                      {member.email_notifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">SMS Notifications:</span>
                    <span className="text-sm text-muted-foreground">
                      {member.sms_notifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline memberId={member.id} canAddActivity={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Activity Timeline</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Log Activity
              </Button>
            </CardHeader>
            <CardContent>
            <ActivityTimeline memberId={member.id} canAddActivity />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pastoral Notes</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </CardHeader>
            <CardContent>
              <MemberNotes memberId={member.id} canCreateNotes />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Change History</CardTitle>
            </CardHeader>
            <CardContent>
              <MemberHistory memberId={member.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}