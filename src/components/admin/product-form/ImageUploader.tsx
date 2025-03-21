
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Upload,
  X,
  Check,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { uploadProductImage } from '@/data/supabaseProducts';

export interface ProductImageItem {
  id?: string;
  file?: File;
  url: string;
  isPrimary: boolean;
  isUploading?: boolean;
}

interface ImageUploaderProps {
  productImages: ProductImageItem[];
  setProductImages: React.Dispatch<React.SetStateAction<ProductImageItem[]>>;
}

const ImageUploader = ({ productImages, setProductImages }: ImageUploaderProps) => {
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Process each file
    Array.from(files).forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size must be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        const isPrimary = productImages.length === 0 || (!productImages.some(img => img.isPrimary));
        
        setProductImages(prev => [
          ...prev, 
          {
            file,
            url: reader.result as string,
            isPrimary,
            isUploading: false
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input so the same file can be selected again
    e.target.value = '';
  };
  
  const handleUploadImage = async (index: number) => {
    const image = productImages[index];
    if (!image.file) return;
    
    try {
      // Mark as uploading
      setProductImages(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], isUploading: true };
        return updated;
      });
      
      // Upload the image
      const imageUrl = await uploadProductImage(image.file);
      
      // Update the image object
      setProductImages(prev => {
        const updated = [...prev];
        updated[index] = { 
          ...updated[index], 
          url: imageUrl, 
          file: undefined, 
          isUploading: false 
        };
        return updated;
      });
      
      toast({
        title: "Image uploaded",
        description: "Your image has been successfully uploaded"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Failed to upload image",
        description: "Please try again later",
        variant: "destructive"
      });
      
      // Mark as not uploading
      setProductImages(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], isUploading: false };
        return updated;
      });
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setProductImages(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      
      // If we've removed the primary image, set the first image as primary
      if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
        updated[0] = { ...updated[0], isPrimary: true };
      }
      
      return updated;
    });
  };
  
  const handleSetPrimary = (index: number) => {
    setProductImages(prev => {
      return prev.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }));
    });
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Product Images</h2>
      
      <div className="space-y-6">
        {productImages.map((image, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img 
                src={image.url} 
                alt={`Product image ${index + 1}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {index + 1}. {image.isPrimary && <span className="text-brand-purple">(Main)</span>}
              </span>
              <div className="flex gap-2">
                {image.file && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUploadImage(index)}
                    disabled={image.isUploading}
                  >
                    {image.isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                )}
                
                {!image.isPrimary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetPrimary(index)}
                    title="Set as main image"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {image.file && (
              <p className="text-xs text-gray-500 truncate mt-1">
                {image.file.name} ({Math.round(image.file.size / 1024)}KB)
              </p>
            )}
          </div>
        ))}
        
        <div className="pt-4">
          <Input
            id="product-image"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            multiple
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('product-image')?.click()}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add More Images
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
