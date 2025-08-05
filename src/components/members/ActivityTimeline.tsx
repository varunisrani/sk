import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MemberActivity } from "@/types/activity";
import { useMemberActivities } from "@/hooks/useMemberActivities";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Plus,
  Activity as ActivityIcon 
} from "lucide-react";

interface ActivityTimelineProps {
  memberId: string;
  canAddActivity: boolean;
  onAddActivity?: () => void;
  maxHeight?: string;
}

export const ActivityTimeline = ({
  memberId,
  canAddActivity,
  onAddActivity,
  maxHeight = "400px"
}: ActivityTimelineProps) => {
  const { data: activities = [], isLoading } = useMemberActivities(memberId);

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  const formatActivityTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'service attendance':
        return <Calendar className="h-4 w-4" />;
      case 'meeting':
      case 'counseling session':
        return <FileText className="h-4 w-4" />;
      default:
        return <ActivityIcon className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'service attendance':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'small group':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'counseling session':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'volunteer work':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <ActivityIcon className="h-5 w-5" />
              <span>Activity Timeline</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <ActivityIcon className="h-5 w-5" />
            <span>Activity Timeline</span>
          </span>
          {canAddActivity && (
            <Button size="sm" onClick={onAddActivity}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <ActivityIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No activities recorded yet</p>
            {canAddActivity && (
              <Button variant="outline" className="mt-4" onClick={onAddActivity}>
                <Plus className="h-4 w-4 mr-2" />
                Record First Activity
              </Button>
            )}
          </div>
        ) : (
          <ScrollArea style={{ height: maxHeight }}>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id} className="relative">
                  {/* Timeline line */}
                  {index < activities.length - 1 && (
                    <div className="absolute left-5 top-10 w-px h-8 bg-border"></div>
                  )}
                  
                  <div className="flex space-x-3">
                    {/* Activity icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center">
                        {getActivityIcon(activity.activity_type)}
                      </div>
                    </div>

                    {/* Activity content */}
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium text-foreground">
                              {activity.activity_title}
                            </h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getActivityColor(activity.activity_type)}`}
                            >
                              {activity.activity_type}
                            </Badge>
                          </div>
                          
                          {activity.activity_description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {activity.activity_description}
                            </p>
                          )}

                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatActivityDate(activity.activity_date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatActivityTime(activity.activity_date)}</span>
                            </div>
                            {activity.duration_minutes && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{activity.duration_minutes} min</span>
                              </div>
                            )}
                            {activity.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                          </div>

                          {activity.notes && (
                            <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                              <p>{activity.notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};