
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProductFilterToolbarProps {
  searchQuery: string;
  codeQuery: string;
  onSearchChange: (value: string) => void;
  onCodeChange: (value: string) => void;
}

export function ProductFilterToolbar({
  searchQuery,
  codeQuery,
  onSearchChange,
  onCodeChange,
}: ProductFilterToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="relative flex-1">
        <Input
          placeholder="Rechercher par code..."
          value={codeQuery}
          onChange={(e) => onCodeChange(e.target.value)}
        />
      </div>
    </div>
  );
}
