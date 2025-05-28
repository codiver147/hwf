
import { useNavigate } from "react-router-dom";
import { ClientForm } from "@/components/client/ClientForm";
import { createClient } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AddClient() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (data: any) => {
    try {
      await createClient(data);
      toast({
        title: "Client créé avec succès",
        description: "Le nouveau client a été ajouté à la base de données",
      });
      navigate("/clients");
    } catch (error: any) {
      toast({
        title: "Erreur lors de la création du client",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t('pages.clients.addNew')}</h1>
          <p className="text-gray-500">{t('pages.clients.information')}</p>
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate("/clients")}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('header.backToClients')}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('pages.clients.information')}</CardTitle>
          <CardDescription>
            {t('pages.clients.information')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
