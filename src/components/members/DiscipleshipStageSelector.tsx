import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DiscipleshipStage } from "@/types/member";

interface DiscipleshipStageSelectorProps {
  value?: DiscipleshipStage;
  onChange: (stage: DiscipleshipStage) => void;
  showDescriptions?: boolean;
  placeholder?: string;
  className?: string;
}

const STAGE_DESCRIPTIONS = {
  'Seeker': 'Exploring faith, asking questions about Christianity',
  'New Believer': 'Recently accepted Christ, learning basic foundations',
  'Growing': 'Actively growing in faith and biblical knowledge',
  'Mature': 'Well-established in faith, mentoring others',
  'Leader': 'Serving in leadership roles, discipling others'
} as const;

const STAGE_COLORS = {
  'Seeker': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'New Believer': 'bg-green-100 text-green-800 border-green-200',
  'Growing': 'bg-blue-100 text-blue-800 border-blue-200',
  'Mature': 'bg-purple-100 text-purple-800 border-purple-200',
  'Leader': 'bg-orange-100 text-orange-800 border-orange-200'
} as const;

export const DiscipleshipStageSelector = ({
  value,
  onChange,
  showDescriptions = false,
  placeholder = "Select discipleship stage",
  className
}: DiscipleshipStageSelectorProps) => {
  const stages: DiscipleshipStage[] = ['Seeker', 'New Believer', 'Growing', 'Mature', 'Leader'];

  return (
    <div className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {stages.map((stage) => (
            <SelectItem key={stage} value={stage}>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={STAGE_COLORS[stage]}>
                  {stage}
                </Badge>
                {showDescriptions && (
                  <span className="text-sm text-muted-foreground">
                    {STAGE_DESCRIPTIONS[stage]}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {showDescriptions && value && (
        <p className="text-sm text-muted-foreground mt-2">
          {STAGE_DESCRIPTIONS[value]}
        </p>
      )}
    </div>
  );
};

export const DiscipleshipStageBadge = ({ stage }: { stage?: DiscipleshipStage }) => {
  if (!stage) return null;
  
  return (
    <Badge variant="outline" className={STAGE_COLORS[stage]}>
      {stage}
    </Badge>
  );
};