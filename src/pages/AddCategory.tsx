
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { inventoryService } from "@/services/inventoryService";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AddCategory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await inventoryService.createCategory({
        name,
        description
      });
      
      toast({
        title: t('common.success'),
        description: t('categories.addSuccess'),
      });
      
      navigate("/categories");
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: t('common.error'),
        description: t('categories.errorAdding'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/categories")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{t('categories.addNew')}</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('categories.information')}</CardTitle>
          <CardDescription>
            {t('categories.addDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="font-medium">
                  {t('categories.name')}
                </label>
                <Input
                  id="name"
                  placeholder={t('categories.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="font-medium">
                  {t('categories.description')}
                </label>
                <Textarea
                  id="description"
                  placeholder={t('categories.descriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-32"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/categories")}
              >
                {t('actions.cancel')}
              </Button>
              <Button
                type="submit"
                className="bg-hwf-purple hover:bg-hwf-purple-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>{t('common.saving')}</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('actions.save')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
