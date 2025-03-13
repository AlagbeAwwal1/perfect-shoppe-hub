
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { product } = await req.json();
    console.log('Received product update request:', product);

    // Check if the product has an id (update) or not (create)
    let result;
    if (product.id) {
      // Update existing product
      result = await supabase
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
    } else {
      // Create new product
      result = await supabase
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
    }

    if (result.error) {
      console.error('Error updating product:', result.error);
      throw result.error;
    }

    console.log('Product updated successfully:', result.data);
    return new Response(JSON.stringify({ success: true, data: result.data }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    console.error('Error in update-product function:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 400,
    });
  }
});
