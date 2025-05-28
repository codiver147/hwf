
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StockReasonSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  action: string;
}

export function StockReasonSelect({ value, onValueChange, action }: StockReasonSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Reason</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select reason" />
        </SelectTrigger>
        <SelectContent>
          {action === "add" ? (
            <>
              <SelectItem value="donation">Donation Received</SelectItem>
              <SelectItem value="purchase">New Purchase</SelectItem>
              <SelectItem value="return">Returned Item</SelectItem>
              <SelectItem value="correction">Inventory Correction</SelectItem>
            </>
          ) : (
            <>
              <SelectItem value="assigned">Assigned to Client</SelectItem>
              <SelectItem value="damaged">Damaged/Disposed</SelectItem>
              <SelectItem value="lost">Lost/Missing</SelectItem>
              <SelectItem value="correction">Inventory Correction</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
