
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useProductForm } from '@/hooks/useProductForm';
import ImageUploader from '@/components/admin/product-form/ImageUploader';
import ProductDetailsForm from '@/components/admin/product-form/ProductDetailsForm';

const ProductForm = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  const {
    product,
    productImages,
    setProductImages,
    loading,
    saving,
    isNewProduct,
    handleInputChange,
    handleSwitchChange,
    handleSubmit
  } = useProductForm(id);
  
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
          <ImageUploader 
            productImages={productImages} 
            setProductImages={setProductImages} 
          />
        </div>
        
        {/* Product details form */}
        <div className="lg:col-span-2">
          <ProductDetailsForm
            product={product}
            handleInputChange={handleInputChange}
            handleSwitchChange={handleSwitchChange}
            handleSubmit={handleSubmit}
            isNewProduct={isNewProduct}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
