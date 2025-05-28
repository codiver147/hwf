
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Edit2, 
  Tag, 
  MapPin, 
  Calendar, 
  ShoppingBag,
  PackageCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { inventoryService } from "@/services/inventoryService";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ViewInventoryItem() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!id) return;
        const data = await inventoryService.getInventoryItemById(parseInt(id));
        setItem(data);
      } catch (error) {
        console.error('Error fetching item:', error);
        toast({
          title: t('common.error'),
          description: t('inventory.errorLoading'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, toast, t]);

  const getStatusBadge = (isAvailable: number) => {
    return isAvailable ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('inventory.available')}</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t('inventory.unavailable')}</Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-hwf-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('inventory.itemNotFound')}</h1>
            <p className="text-muted-foreground">
              {t('inventory.itemNotFoundDesc')}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/inventory")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('header.backToInventory')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
          <p className="text-muted-foreground">
            {t('inventory.itemId')}: {item.id}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/inventory")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/inventory/edit/${item.id}`)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('inventory.itemDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t('inventory.category')}</h3>
              <p className="flex items-center mt-1">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                {item.inventory_categories?.name || t('inventory.uncategorized')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t('common.status')}</h3>
              <p className="mt-1">{getStatusBadge(item.is_available)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t('inventory.condition')}</h3>
              <p className="flex items-center mt-1">
                <PackageCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                {item.condition}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t('inventory.quantity')}</h3>
              <p className="flex items-center mt-1">
                <ShoppingBag className="h-4 w-4 mr-2 text-muted-foreground" />
                {item.quantity}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t('inventory.location')}</h3>
              <p className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                {item.location}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t('inventory.dateAdded')}</h3>
              <p className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t('inventory.description')}</h3>
            <p className="mt-1">{item.description || t('inventory.noDescription')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
