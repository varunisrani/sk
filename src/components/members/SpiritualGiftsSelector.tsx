import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SPIRITUAL_GIFTS } from "@/types/member";
import { ChevronDown, X } from "lucide-react";

interface SpiritualGiftsSelectorProps {
  value: string[];
  onChange: (gifts: string[]) => void;
  maxSelections?: number;
  placeholder?: string;
  className?: string;
}

export const SpiritualGiftsSelector = ({
  value = [],
  onChange,
  maxSelections,
  placeholder = "Select spiritual gifts",
  className
}: SpiritualGiftsSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleGiftToggle = (gift: string) => {
    const isSelected = value.includes(gift);
    
    if (isSelected) {
      onChange(value.filter(g => g !== gift));
    } else {
      if (!maxSelections || value.length < maxSelections) {
        onChange([...value, gift]);
      }
    }
  };

  const removeGift = (gift: string) => {
    onChange(value.filter(g => g !== gift));
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <span>{value.length} gift{value.length !== 1 ? 's' : ''} selected</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <ScrollArea className="h-72">
            <div className="p-4 space-y-2">
              {SPIRITUAL_GIFTS.map((gift) => (
                <div key={gift} className="flex items-center space-x-2">
                  <Checkbox
                    id={gift}
                    checked={value.includes(gift)}
                    onCheckedChange={() => handleGiftToggle(gift)}
                    disabled={
                      maxSelections && 
                      !value.includes(gift) && 
                      value.length >= maxSelections
                    }
                  />
                  <label
                    htmlFor={gift}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {gift}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((gift) => (
            <Badge key={gift} variant="secondary" className="px-2 py-1">
              {gift}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeGift(gift)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {maxSelections && (
        <p className="text-xs text-muted-foreground mt-1">
          {value.length}/{maxSelections} gifts selected
        </p>
      )}
    </div>
  );
};