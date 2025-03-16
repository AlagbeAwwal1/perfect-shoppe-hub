
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  SearchIcon,
  Star,
  X,
} from 'lucide-react';
import { 
  getAllProducts, 
  deleteProduct,
  updateProduct
} from '@/data/supabaseProducts';
import { Product } from '@/data/products';

const ProductsManagement = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [updatingFeatured, setUpdatingFeatured] = useState<string | null>(null);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Failed to load products",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast({
        title: "Product deleted",
        description: "The product has been successfully removed"
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Failed to delete product",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const toggleFeaturedStatus = async (product: Product) => {
    try {
      setUpdatingFeatured(product.id);
      const updatedProduct = {
        ...product,
        featured: !product.featured
      };
      
      await updateProduct(updatedProduct);
      
      // Update local state
      setProducts(products.map(p => 
        p.id === product.id ? {...p, featured: !p.featured} : p
      ));
      
      toast({
        title: updatedProduct.featured ? "Product featured" : "Product unfeatured",
        description: `${product.name} has been ${updatedProduct.featured ? 'added to' : 'removed from'} featured products`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Failed to update product",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setUpdatingFeatured(null);
    }
  };
  
  // Filter products by search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="text-gray-600 hover:text-brand-purple">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-brand-purple">Manage Products</h1>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-64">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            variant={filterCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory(null)}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={filterCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
        
        <Link to="/admin/products/new">
          <Button className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">Image</th>
                <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">Category</th>
                <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">Price</th>
                <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">Featured</th>
                <th className="px-4 py-3 text-left text-sm text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500 truncate">{product.description}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{product.category}</td>
                  <td className="px-4 py-3 font-medium">₦{product.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeaturedStatus(product)}
                      disabled={updatingFeatured === product.id}
                      className="p-1"
                    >
                      {updatingFeatured === product.id ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-brand-gold" />
                      ) : product.featured ? (
                        <Star className="h-5 w-5 text-brand-gold fill-brand-gold" />
                      ) : (
                        <Star className="h-5 w-5 text-gray-300" />
                      )}
                    </Button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm || filterCategory ? 'No products match your search criteria.' : 'No products found. Add your first product!'}
          </p>
          {(searchTerm || filterCategory) && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory(null);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
