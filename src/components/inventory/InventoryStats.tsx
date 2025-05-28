
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InventoryStatsProps {
  totalItems: number;
  availableItems: number;
}

export function InventoryStats({ totalItems, availableItems }: InventoryStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Available Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableItems}</div>
        </CardContent>
      </Card>
    </div>
  );
}
