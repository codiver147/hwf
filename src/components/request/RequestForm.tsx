
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ClientSelect } from "./form/ClientSelect";
import { RequestDetails } from "./form/RequestDetails";
import { ScheduleSelect } from "./form/ScheduleSelect";
import { ProductSelection } from "./ProductSelection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MultiTeamSelect } from "./form/MultiTeamSelect";
import { VolunteerSelect } from "./form/VolunteerSelect";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: number;
  name: string;
  quantity: number;
  code?: string;
  category_id?: number;
}

interface SelectedProduct extends Product {
  requestedQuantity: number;
}

const requestSchema = z.object({
  clientId: z.string().min(1, "Client requis"),
  teamIds: z.array(z.string()).min(1, "Au moins une équipe requise"),
  volunteerId: z.string().optional(),
  status: z.string().min(1, "Statut requis"),
  date: z.date().optional(),
  time: z.string().optional(),
  scheduled_at: z.date().optional(),
  location: z.string().min(1, "Adresse requise"),
  description: z.string().min(1, "Description requise"),
  priority: z.string().min(1, "Priorité requise"),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface RequestFormProps {
  onSubmit: (data: RequestFormValues & { products: SelectedProduct[] }) => void;
  initialData?: any;
}

export function RequestForm({ onSubmit, initialData }: RequestFormProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [activeTab, setActiveTab] = useState("details");

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      status: "new",
      priority: "medium",
      teamIds: [],
      volunteerId: "",
      clientId: "",
      location: "",
      description: "",
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData?.products && initialData.products.length > 0) {
      setSelectedProducts(initialData.products);
      console.log("Initializing selected products:", initialData.products);
    }
  }, [initialData]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleProductSelection = (products: SelectedProduct[]) => {
    setSelectedProducts(products);
    console.log("Updated selected products:", products);
  };

  const handleFormSubmit = (data: RequestFormValues) => {
    if (selectedProducts.length === 0) {
      toast.error(t('request.errorAdding'), {
        style: {
          backgroundColor: "#fee2e2",
          border: "1px solid #ef4444",
          color: "#dc2626",
        },
      });
      setActiveTab("products");
      return;
    }

    onSubmit({
      ...data,
      products: selectedProducts
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">{t('request.details')}</TabsTrigger>
              <TabsTrigger value="products">{t('request.products')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ClientSelect form={form} />
                    <MultiTeamSelect form={form} />
                    <VolunteerSelect form={form} />
                    <RequestDetails form={form} />
                    <ScheduleSelect form={form} />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab("products")}
                >
                  {t('request.continueProducts')}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-4">
              <ProductSelection
                categoryId={selectedCategory}
                selectedProducts={selectedProducts}
                onProductSelect={handleProductSelection}
              />
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab("details")}
                >
                  {t('request.backToDetails')}
                </Button>
                
                <Button 
                  type="submit" 
                  className="bg-hwf-purple hover:bg-hwf-purple/90"
                >
                  {initialData ? t('request.update') : t('request.create')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
