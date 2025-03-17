import { supabase } from "@/integrations/supabase/client";
import { Product } from "./products";

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  const products = (data || []) as Product[];
  
  // Fetch images for all products in a single query
  const { data: imagesData, error: imagesError } = await supabase
    .from('product_images')
    .select('*')
    .in('product_id', products.map(p => p.id));
    
  if (imagesError) {
    console.error('Error fetching product images:', imagesError);
    // Continue with products but no images
  } else {
    const imagesMap: Record<string, ProductImage[]> = {};
    (imagesData || []).forEach((img: ProductImage) => {
      if (!imagesMap[img.product_id]) {
        imagesMap[img.product_id] = [];
      }
      imagesMap[img.product_id].push(img);
    });
    
    // Add images to products
    products.forEach(product => {
      const productImages = imagesMap[product.id] || [];
      const primaryImage = productImages.find(img => img.is_primary);
      
      // Set the main image to the primary one or the first one, or keep the existing image
      if (primaryImage) {
        product.image = primaryImage.image_url;
      } else if (productImages.length > 0) {
        product.image = productImages[0].image_url;
      }
      
      // Add all images to product
      product.images = productImages.map(img => img.image_url);
    });
  }

  return products.map(item => ({
    ...item,
    category: item.category as Product['category']
  }));
}

export async function getFeaturedProductsFromDB(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('name');

  if (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }

  const products = (data || []) as Product[];
  
  // Fetch images for featured products
  const { data: imagesData, error: imagesError } = await supabase
    .from('product_images')
    .select('*')
    .in('product_id', products.map(p => p.id));
    
  if (imagesError) {
    console.error('Error fetching product images:', imagesError);
  } else {
    const imagesMap: Record<string, ProductImage[]> = {};
    (imagesData || []).forEach((img: ProductImage) => {
      if (!imagesMap[img.product_id]) {
        imagesMap[img.product_id] = [];
      }
      imagesMap[img.product_id].push(img);
    });
    
    // Add images to products
    products.forEach(product => {
      const productImages = imagesMap[product.id] || [];
      const primaryImage = productImages.find(img => img.is_primary);
      
      if (primaryImage) {
        product.image = primaryImage.image_url;
      } else if (productImages.length > 0) {
        product.image = productImages[0].image_url;
      }
      
      product.images = productImages.map(img => img.image_url);
    });
  }

  return products.map(item => ({
    ...item,
    category: item.category as Product['category']
  }));
}

export async function getProductsByCategoryFromDB(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('name');

  if (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    category: item.category as Product['category']
  }));
}

export async function getProductByIdFromDB(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }

  if (!data) return null;
  
  const { data: imagesData, error: imagesError } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', id)
    .order('is_primary', { ascending: false });
    
  const images: ProductImage[] = imagesData || [];
  
  if (imagesError) {
    console.error('Error fetching product images:', imagesError);
  }
  
  const product = {
    ...data,
    category: data.category as Product['category'],
    images: images.map(img => img.image_url)
  };
  
  const primaryImage = images.find(img => img.is_primary);
  if (primaryImage) {
    product.image = primaryImage.image_url;
  } else if (images.length > 0) {
    product.image = images[0].image_url;
  }
  
  return product;
}

export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function saveProductImages(productId: string, images: { file?: File, url?: string, isPrimary: boolean }[]): Promise<string[]> {
  try {
    const imageUrls: string[] = [];
    
    for (const image of images) {
      if (image.file) {
        const uploadedUrl = await uploadProductImage(image.file);
        image.url = uploadedUrl;
        imageUrls.push(uploadedUrl);
      } else if (image.url) {
        imageUrls.push(image.url);
      }
    }
    
    for (const image of images) {
      if (image.url) {
        await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: image.url,
            is_primary: image.isPrimary
          });
      }
    }
    
    return imageUrls;
  } catch (error) {
    console.error('Error saving product images:', error);
    throw error;
  }
}

export async function updateProductImages(productId: string, images: { id?: string, url: string, isPrimary: boolean }[]): Promise<void> {
  try {
    const { data: existingImages } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId);
      
    const existingImageIds = (existingImages || []).map((img: ProductImage) => img.id);
    const newImageIds = images.filter(img => img.id).map(img => img.id) as string[];
    
    const imagesToDelete = existingImageIds.filter(id => !newImageIds.includes(id));
    
    if (imagesToDelete.length > 0) {
      await supabase
        .from('product_images')
        .delete()
        .in('id', imagesToDelete);
    }
    
    for (const image of images) {
      if (image.id) {
        await supabase
          .from('product_images')
          .update({
            image_url: image.url,
            is_primary: image.isPrimary
          })
          .eq('id', image.id);
      } else {
        await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: image.url,
            is_primary: image.isPrimary
          });
      }
    }
  } catch (error) {
    console.error('Error updating product images:', error);
    throw error;
  }
}

export async function updateProduct(product: Partial<Product>): Promise<Product> {
  console.log('Updating product with Supabase client:', product);
  
  try {
    let result;
    
    if (product.id) {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          featured: product.featured || false,
          image: product.image
        })
        .eq('id', product.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      
      result = data;
      
      if (product.images && Array.isArray(product.images)) {
        const imageObjects = product.images.map((url, index) => ({
          url,
          isPrimary: index === 0
        }));
        
        await updateProductImages(product.id, imageObjects);
      }
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          featured: product.featured || false,
          image: product.image || '/placeholder.svg'
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
      
      result = data;
      
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        const imageObjects = product.images.map((url, index) => ({
          url,
          isPrimary: index === 0
        }));
        
        await saveProductImages(result.id, imageObjects);
      }
    }
    
    console.log('Product saved successfully:', result);
    return {
      ...result,
      category: result.category as Product['category']
    };
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
    
    console.log('Product deleted successfully');
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
}
