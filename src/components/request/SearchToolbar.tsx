
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SearchToolbar({ searchQuery, onSearchChange }: SearchToolbarProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('request.searchRequests')}
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
