import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Member } from "@/types/member";
import { DiscipleshipStageBadge } from "./DiscipleshipStageSelector";
import { Edit, Eye, Mail, Phone, Calendar, Activity } from "lucide-react";
import { format } from "date-fns";

interface MemberCardProps {
  member: Member;
  onEdit: () => void;
  onViewProfile: () => void;
  showQuickActions?: boolean;
}

export const MemberCard = ({
  member,
  onEdit,
  onViewProfile,
  showQuickActions = true
}: MemberCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getEngagementLevel = (score?: number) => {
    if (!score) return { level: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    if (score >= 0.8) return { level: 'High', color: 'bg-green-100 text-green-800' };
    if (score >= 0.6) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    if (score >= 0.3) return { level: 'Low', color: 'bg-orange-100 text-orange-800' };
    return { level: 'Inactive', color: 'bg-red-100 text-red-800' };
  };

  const engagement = getEngagementLevel(member.engagement_score);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={onViewProfile}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.photo_url} alt={member.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{member.name}</h3>
              {member.member_number && (
                <p className="text-sm text-muted-foreground">#{member.member_number}</p>
              )}
            </div>
          </div>
          {showQuickActions && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile();
                }}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <DiscipleshipStageBadge stage={member.discipleship_stage} />
          <Badge variant="outline" className={engagement.color}>
            {engagement.level}
          </Badge>
          {member.baptized && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Baptized
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm">
          {member.email && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{member.email}</span>
            </div>
          )}
          {member.phone_number && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{member.phone_number}</span>
            </div>
          )}
          {member.birthday && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(member.birthday), "MMM d")}</span>
            </div>
          )}
          {member.last_activity_log && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Active {format(new Date(member.last_activity_log), "MMM d")}</span>
            </div>
          )}
        </div>

        {member.spiritual_gifts && member.spiritual_gifts.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {member.spiritual_gifts.slice(0, 3).map((gift) => (
              <Badge key={gift} variant="secondary" className="text-xs">
                {gift}
              </Badge>
            ))}
            {member.spiritual_gifts.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{member.spiritual_gifts.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};