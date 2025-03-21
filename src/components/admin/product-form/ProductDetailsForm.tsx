
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from 'lucide-react';
import { Product } from '@/data/products';

interface ProductDetailsFormProps {
  product: Partial<Product>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSwitchChange: (checked: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isNewProduct: boolean;
  saving: boolean;
}

const ProductDetailsForm = ({
  product,
  handleInputChange,
  handleSwitchChange,
  handleSubmit,
  isNewProduct,
  saving
}: ProductDetailsFormProps) => {
  return (
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
  );
};

export default ProductDetailsForm;
