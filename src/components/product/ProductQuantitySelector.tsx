
import React from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Plus } from 'lucide-react';

interface ProductQuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const ProductQuantitySelector: React.FC<ProductQuantitySelectorProps> = ({ 
  quantity, 
  onIncrement, 
  onDecrement 
}) => {
  return (
    <div className="flex items-center mb-4">
      <span className="mr-4">Quantity:</span>
      <div className="flex items-center border rounded-md">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-none"
          onClick={onDecrement}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="px-4">{quantity}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-none"
          onClick={onIncrement}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductQuantitySelector;
