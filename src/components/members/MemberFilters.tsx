import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { MemberFilters, DiscipleshipStage } from "@/types/member";
import { Search, Filter, X } from "lucide-react";
import { DateRange } from "react-day-picker";

interface MemberFiltersProps {
  filters: MemberFilters;
  onFiltersChange: (filters: MemberFilters) => void;
  onReset: () => void;
  className?: string;
}

export const MemberFiltersComponent = ({
  filters,
  onFiltersChange,
  onReset,
  className
}: MemberFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof MemberFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const updateDateRange = (dateRange: DateRange | undefined, type: 'last_activity' | 'join_date') => {
    onFiltersChange({
      ...filters,
      date_range: dateRange ? {
        start: dateRange.from,
        end: dateRange.to,
        type
      } : undefined
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.discipleship_stage) count++;
    if (filters.baptism_status && filters.baptism_status !== 'all') count++;
    if (filters.engagement_level && filters.engagement_level !== 'all') count++;
    if (filters.date_range) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={className}>
      {/* Quick Search */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members by name, email, or phone..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={onReset} size="sm">
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Discipleship Stage */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Discipleship Stage
                </label>
                <Select
                  value={filters.discipleship_stage || 'all'}
                  onValueChange={(value) => 
                    updateFilter('discipleship_stage', value === 'all' ? undefined : value as DiscipleshipStage)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="Seeker">Seeker</SelectItem>
                    <SelectItem value="New Believer">New Believer</SelectItem>
                    <SelectItem value="Growing">Growing</SelectItem>
                    <SelectItem value="Mature">Mature</SelectItem>
                    <SelectItem value="Leader">Leader</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Baptism Status */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Baptism Status
                </label>
                <Select
                  value={filters.baptism_status || 'all'}
                  onValueChange={(value) => 
                    updateFilter('baptism_status', value === 'all' ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All members" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="baptized">Baptized</SelectItem>
                    <SelectItem value="not_baptized">Not Baptized</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Engagement Level */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Engagement Level
                </label>
                <Select
                  value={filters.engagement_level || 'all'}
                  onValueChange={(value) => 
                    updateFilter('engagement_level', value === 'all' ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High (80%+)</SelectItem>
                    <SelectItem value="medium">Medium (60-79%)</SelectItem>
                    <SelectItem value="low">Low (30-59%)</SelectItem>
                    <SelectItem value="inactive">Inactive (&lt;30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Date Filter Type
                </label>
                <Select
                  value={filters.date_range?.type || 'last_activity'}
                  onValueChange={(value) => {
                    if (filters.date_range) {
                      updateDateRange({
                        from: filters.date_range.start,
                        to: filters.date_range.end
                      }, value as 'last_activity' | 'join_date');
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_activity">Last Activity</SelectItem>
                    <SelectItem value="join_date">Join Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Date Range ({filters.date_range?.type === 'join_date' ? 'Join Date' : 'Last Activity'})
              </label>
              <DateRangePicker
                value={{
                  from: filters.date_range?.start,
                  to: filters.date_range?.end
                }}
                onChange={(dateRange) => updateDateRange(dateRange, filters.date_range?.type || 'last_activity')}
                placeholder="Select date range"
              />
            </div>

            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Active Filters ({activeFiltersCount})
                </label>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <Badge variant="secondary">
                      Search: "{filters.search}"
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => updateFilter('search', undefined)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {filters.discipleship_stage && (
                    <Badge variant="secondary">
                      Stage: {filters.discipleship_stage}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => updateFilter('discipleship_stage', undefined)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {filters.baptism_status && filters.baptism_status !== 'all' && (
                    <Badge variant="secondary">
                      Baptism: {filters.baptism_status === 'baptized' ? 'Baptized' : 'Not Baptized'}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => updateFilter('baptism_status', undefined)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {filters.engagement_level && filters.engagement_level !== 'all' && (
                    <Badge variant="secondary">
                      Engagement: {filters.engagement_level}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => updateFilter('engagement_level', undefined)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {filters.date_range && (
                    <Badge variant="secondary">
                      {filters.date_range.type === 'join_date' ? 'Join Date' : 'Last Activity'}: Date Range
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => updateFilter('date_range', undefined)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};