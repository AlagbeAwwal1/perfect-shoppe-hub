
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
  X
} from 'lucide-react';
import { 
  getProductByIdFromDB, 
  updateProduct, 
  uploadProductImage 
} from '@/data/supabaseProducts';
import { Product } from '@/data/products';
import { Navigate } from 'react-router-dom';

const ProductForm = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form state
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    image: '/placeholder.svg',
    category: 'scarf',
    featured: false,
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
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
    const file = e.target.files?.[0];
    if (!file) return;
    
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
    
    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleImageUpload = async () => {
    if (!imageFile) return;
    
    try {
      setUploadingImage(true);
      const imageUrl = await uploadProductImage(imageFile);
      setProduct(prev => ({ ...prev, image: imageUrl }));
      setImageFile(null);
      setPreviewUrl(null);
      
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
    } finally {
      setUploadingImage(false);
    }
  };
  
  const handleCancelImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
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
    
    try {
      setSaving(true);
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
        {/* Image upload section */}
        <div className="lg:col-span-1">
          <div className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Product Image</h2>
            
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              )}
            </div>
            
            {imageFile ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 truncate">{imageFile.name}</p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleImageUpload}
                    disabled={uploadingImage}
                    className="flex-1"
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelImage}
                    disabled={uploadingImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="product-image" className="block mb-2">
                  Select Image
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('product-image')?.click()}
                    className="w-full"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
              </div>
            )}
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
