"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type EventFilters = {
  search: string;
  location: string;
  date: Date | undefined;
};

type Props = {
  filters: EventFilters;
  onChange: (next: EventFilters) => void;
  onApply: () => void;
};

export function EventsFilters({ filters, onChange, onApply }: Props) {
  return (
    <div className="space-y-4 rounded-lg border border-white/10 p-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search Events</Label>
        <Input
          id="search"
          placeholder="Search by name or location..."
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter") onApply();
          }}
        />
      </div>
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.date ? format(filters.date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.date}
              onSelect={(date) => onChange({ ...filters, date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {filters.date && (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground"
            onClick={() => onChange({ ...filters, date: undefined })}
          >
            Clear date
          </Button>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Filter by location..."
          value={filters.location}
          onChange={(event) => onChange({ ...filters, location: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter") onApply();
          }}
        />
      </div>
      <div className="pt-4">
        <Button className="w-full" onClick={onApply}>Apply Filters</Button>
      </div>
    </div>
  );
}
