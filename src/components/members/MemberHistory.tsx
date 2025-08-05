import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MemberHistoryEntry, useMemberHistory } from "@/hooks/useMemberHistory";
import { format, formatDistanceToNow } from "date-fns";
import { History, User, Calendar } from "lucide-react";

interface MemberHistoryProps {
  memberId: string;
  maxHeight?: string;
}

export const MemberHistory = ({
  memberId,
  maxHeight = "400px"
}: MemberHistoryProps) => {
  const { data: history = [], isLoading } = useMemberHistory(memberId);

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType.toLowerCase()) {
      case 'created':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'updated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'stage_change':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'photo_updated':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'note_added':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatChangeType = (changeType: string) => {
    return changeType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderChangeDetails = (entry: MemberHistoryEntry) => {
    if (!entry.old_values && !entry.new_values) return null;

    const changes = [];
    
    if (entry.new_values && entry.old_values) {
      // Compare old and new values
      Object.keys(entry.new_values).forEach(key => {
        const oldValue = entry.old_values?.[key];
        const newValue = entry.new_values?.[key];
        
        if (oldValue !== newValue) {
          changes.push({
            field: key,
            from: oldValue,
            to: newValue
          });
        }
      });
    } else if (entry.new_values) {
      // New record created
      Object.keys(entry.new_values).forEach(key => {
        if (entry.new_values?.[key]) {
          changes.push({
            field: key,
            from: null,
            to: entry.new_values[key]
          });
        }
      });
    }

    return changes.map((change, index) => (
      <div key={index} className="text-xs text-muted-foreground mt-1">
        <span className="font-medium capitalize">
          {change.field.replace('_', ' ')}:
        </span>
        {change.from && (
          <span className="line-through mx-1">
            {typeof change.from === 'object' ? JSON.stringify(change.from) : String(change.from)}
          </span>
        )}
        {change.from && <span className="mx-1">→</span>}
        <span className="font-medium">
          {typeof change.to === 'object' ? JSON.stringify(change.to) : String(change.to)}
        </span>
      </div>
    ));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Change History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
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
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <span>Change History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No history available</p>
          </div>
        ) : (
          <ScrollArea style={{ height: maxHeight }}>
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {/* Timeline line */}
                  {index < history.length - 1 && (
                    <div className="absolute left-4 top-8 w-px h-8 bg-border"></div>
                  )}
                  
                  <div className="flex space-x-3">
                    {/* Change type icon */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center">
                        <History className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Change content */}
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getChangeTypeColor(entry.change_type)}`}
                            >
                              {formatChangeType(entry.change_type)}
                            </Badge>
                          </div>
                          
                          {entry.reason && (
                            <p className="text-sm text-muted-foreground mb-2">
                              <span className="font-medium">Reason:</span> {entry.reason}
                            </p>
                          )}

                          {renderChangeDetails(entry)}

                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(entry.changed_at), 'MMM d, yyyy h:mm a')}</span>
                            </div>
                            {entry.changed_by && (
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>Changed by staff</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(entry.changed_at), { addSuffix: true })}
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