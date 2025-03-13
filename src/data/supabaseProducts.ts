
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./products";

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return (data || []).map(item => ({
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

  return (data || []).map(item => ({
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
  
  return {
    ...data,
    category: data.category as Product['category']
  };
}

export async function uploadProductImage(file: File): Promise<string> {
  // Generate a unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function updateProduct(product: Partial<Product>): Promise<Product> {
  console.log('Updating product with Supabase client:', product);
  
  try {
    let result;
    
    if (product.id) {
      // Update existing product
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
    } else {
      // Create new product
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
