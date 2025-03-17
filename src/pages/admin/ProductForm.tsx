
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  ImageIcon,
  Loader2,
  Save,
  Upload,
  X,
  Check,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { 
  getProductByIdFromDB, 
  updateProduct, 
  uploadProductImage,
  saveProductImages
} from '@/data/supabaseProducts';
import { Product } from '@/data/products';
import { Navigate } from 'react-router-dom';

interface ProductImageItem {
  id?: string;
  file?: File;
  url: string;
  isPrimary: boolean;
  isUploading?: boolean;
}

const ProductForm = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    image: '/placeholder.svg',
    category: 'scarf',
    featured: false,
    images: [],
  });
  
  const [productImages, setProductImages] = useState<ProductImageItem[]>([
    { url: '/placeholder.svg', isPrimary: true }
  ]);
  
  const isNewProduct = !id || id === 'new';
  
  useEffect(() => {
    if (!isNewProduct) {
      fetchProductData();
    }
  }, [id]);
  
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const data = await getProductByIdFromDB(id!);
      if (data) {
        setProduct(data);
        
        // Initialize the images array
        if (data.images && data.images.length > 0) {
          const imageItems: ProductImageItem[] = data.images.map((url, index) => ({
            url,
            isPrimary: url === data.image, // Set primary for the main image
            id: `existing-${index}` // We'll use this to track existing images
          }));
          setProductImages(imageItems);
        } else {
          setProductImages([
            { url: data.image, isPrimary: true, id: 'existing-main' }
          ]);
        }
      } else {
        toast({
          title: "Product not found",
          description: "The requested product could not be found",
          variant: "destructive"
        });
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Failed to load product",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Convert string to number for price
      setProduct(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setProduct(prev => ({ ...prev, featured: checked }));
  };
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!product.name?.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter a product name",
        variant: "destructive"
      });
      return;
    }
    
    if (!product.price || product.price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return;
    }
    
    if (!product.description?.trim()) {
      toast({
        title: "Description is required",
        description: "Please enter a product description",
        variant: "destructive"
      });
      return;
    }
    
    // Check if we have images to upload
    const hasUnsavedImages = productImages.some(img => img.file);
    if (hasUnsavedImages) {
      toast({
        title: "Unsaved images",
        description: "Please upload all images before saving the product",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure there's at least one image
    if (productImages.length === 0) {
      toast({
        title: "Image required",
        description: "Please add at least one image for the product",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Set the primary image as the main product image
      const primaryImage = productImages.find(img => img.isPrimary);
      if (primaryImage) {
        product.image = primaryImage.url;
      }
      
      // Add all image URLs to the product
      product.images = productImages.map(img => img.url);
      
      const updatedProduct = await updateProduct(product);
      
      toast({
        title: isNewProduct ? "Product created" : "Product updated",
        description: isNewProduct 
          ? "Your new product has been successfully created" 
          : "The product has been successfully updated"
      });
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Failed to save product",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-purple" />
        <p className="mt-4 text-gray-600">Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/products" className="text-gray-600 hover:text-brand-purple">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-brand-purple">
          {isNewProduct ? 'Add New Product' : 'Edit Product'}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Multiple Image upload section */}
        <div className="lg:col-span-1">
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
        </div>
        
        {/* Product details form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Product Details</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="block mb-2">
                  Product Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={product.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price" className="block mb-2">
                  Price (₦) *
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  value={product.price}
                  onChange={handleInputChange}
                  placeholder="Enter price in Naira"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category" className="block mb-2">
                  Category *
                </Label>
                <select
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
                  required
                >
                  <option value="scarf">Scarf</option>
                  <option value="khimar">Khimar</option>
                  <option value="accessory">Accessory</option>
                  <option value="prayer">Prayer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="description" className="block mb-2">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={product.featured || false}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-end gap-4">
              <Link to="/admin/products">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isNewProduct ? 'Create Product' : 'Update Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
