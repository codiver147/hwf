
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

interface TeamFormProps {
  team?: {
    id?: number;
    name: string;
    description?: string;
  };
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
}

export function TeamForm({ team, onSubmit }: TeamFormProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form fields when team prop changes
  useEffect(() => {
    if (team) {
      setName(team.name || "");
      setDescription(team.description || "");
    }
  }, [team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ name, description });
      toast.success(team?.id ? "Équipe mise à jour" : "Équipe créée");
      navigate("/teams");
    } catch (error) {
      console.error("Error submitting team:", error);
      toast.error(team?.id ? "Erreur lors de la mise à jour" : "Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/teams")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">
          {team?.id ? "Modifier l'équipe" : "Nouvelle équipe"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Information de l'équipe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'équipe</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Entrez le nom de l'équipe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le rôle et les responsabilités de l'équipe"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/teams")}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="bg-hwf-purple hover:bg-hwf-purple-dark"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
