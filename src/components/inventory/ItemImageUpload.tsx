
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, X, FileImage } from "lucide-react";
import { toast } from "sonner";

interface ItemImageUploadProps {
  initialImage?: string;
  onImageChange: (imageData: string | null) => void;
}

export function ItemImageUpload({ initialImage, onImageChange }: ItemImageUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(initialImage || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-medium">Item Image</Label>
        {previewImage && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleRemoveImage}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" /> Remove
          </Button>
        )}
      </div>

      {previewImage ? (
        <div className="relative group">
          <img 
            src={previewImage} 
            alt="Item preview" 
            className="rounded-md object-cover w-full max-h-64"
          />
          <div 
            className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 rounded-md flex items-center justify-center transition-opacity cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Button variant="secondary">
              <FileImage className="h-4 w-4 mr-2" />
              Change Image
            </Button>
          </div>
        </div>
      ) : (
        <Card
          className="border-dashed border-2 p-8 flex flex-col items-center justify-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2 text-center">
            <p className="font-medium">Upload an Image</p>
            <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
          </div>
          <Button
            type="button" 
            variant="outline" 
            className="mt-4"
          >
            <Upload className="h-4 w-4 mr-2" /> Upload Image
          </Button>
        </Card>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
      
      <p className="text-xs text-muted-foreground">
        Accepted formats: JPG, PNG, WEBP. Max size: 5MB
      </p>
    </div>
  );
}
