
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

  return data || [];
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

  return data || [];
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

  return data || [];
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

  return data;
}

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/admin/upload-image', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to upload image');
    }

    return result.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function updateProduct(product: Partial<Product>): Promise<Product> {
  try {
    const response = await fetch('/api/admin/update-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to update product');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const response = await fetch('/api/admin/delete-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}
