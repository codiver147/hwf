
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StockActionSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function StockActionSelect({ value, onValueChange }: StockActionSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Action</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="add">
            <div className="flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-2 text-green-500" />
              Add Stock
            </div>
          </SelectItem>
          <SelectItem value="remove">
            <div className="flex items-center">
              <ArrowDownRight className="h-4 w-4 mr-2 text-red-500" />
              Remove Stock
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
