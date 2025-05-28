
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InventoryToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function InventoryToolbar({ searchQuery, onSearchChange }: InventoryToolbarProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('inventory.search')}
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline">
        <Filter className="mr-2 h-4 w-4" />
        {t('common.filters')}
      </Button>
    </div>
  );
}
