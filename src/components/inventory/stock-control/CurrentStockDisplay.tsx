
interface CurrentStockDisplayProps {
  quantity: number;
  location: string;
  isAvailable: boolean;
}

export function CurrentStockDisplay({ quantity, location, isAvailable }: CurrentStockDisplayProps) {
  return (
    <div className="pt-4">
      <h3 className="text-sm font-medium mb-2">Current Stock</h3>
      <div className="flex items-center gap-2 border p-2 rounded-md">
        <div className="bg-gray-100 p-2 rounded-md">
          <span className="text-lg font-semibold">{quantity}</span>
        </div>
        <div className="text-sm">
          <div>Location: {location || 'Not specified'}</div>
          <div>Status: {isAvailable ? 'Available' : 'Unavailable'}</div>
        </div>
      </div>
    </div>
  );
}
