
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { inventoryService } from "@/services/inventoryService";

export default function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        if (!id) return;
        const category = await inventoryService.getCategoryById(parseInt(id));
        if (category) {
          setName(category.name);
          setDescription(category.description || "");
        } else {
          toast({
            title: "Error",
            description: "Category not found",
            variant: "destructive",
          });
          navigate("/categories");
        }
      } catch (error) {
        console.error('Error loading category:', error);
        toast({
          title: "Error",
          description: "Failed to load category",
          variant: "destructive",
        });
        navigate("/categories");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await inventoryService.updateCategory(parseInt(id), {
        name,
        description
      });
      
      toast({
        title: "Category Updated",
        description: `${name} has been updated successfully`,
      });
      
      navigate("/categories");
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading category data...</p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="font-medium">
                  Category Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter category description"
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
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-hwf-purple hover:bg-hwf-purple-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
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
