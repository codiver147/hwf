
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

export default function AddSkill() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    "Transportation",
    "Physical",
    "Technical",
    "Interpersonal",
    "Administrative",
    "Logistics",
    "Language",
    "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real application, this would make an API call
    console.log("Submitting skill data:", { name, category, description });
    
    setTimeout(() => {
      toast({
        title: "Skill Added",
        description: `${name} has been added successfully`,
      });
      setIsSubmitting(false);
      navigate("/skills");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/skills")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Add New Skill</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skill Information</CardTitle>
          <CardDescription>
            Add a new skill that volunteers can possess and teams may require
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="font-medium">
                  Skill Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter skill name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="category" className="font-medium">
                  Category
                </label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter skill description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-20"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/skills")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-hwf-purple hover:bg-hwf-purple-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Skill
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
