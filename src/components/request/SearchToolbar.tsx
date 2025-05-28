
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface SearchToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SearchToolbar({ searchQuery, onSearchChange }: SearchToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search requests..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline" className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        Filters
      </Button>
    </div>
  );
}
