
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { 
  getProductByIdFromDB,
  updateProduct
} from '@/data/supabaseProducts';
import { Product } from '@/data/products';
import { ProductImageItem } from '@/components/admin/product-form/ImageUploader';

export const useProductForm = (productId?: string) => {
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
  
  const isNewProduct = !productId || productId === 'new';
  
  useEffect(() => {
    if (!isNewProduct) {
      fetchProductData();
    }
  }, [productId]);
  
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const data = await getProductByIdFromDB(productId!);
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
      
      await updateProduct(product);
      
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

  return {
    product,
    productImages,
    setProductImages,
    loading,
    saving,
    isNewProduct,
    handleInputChange,
    handleSwitchChange,
    handleSubmit
  };
};
