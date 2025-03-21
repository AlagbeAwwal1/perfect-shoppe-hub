
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

    // Handle the form data
    const formData = await req.formData();
    
    // Check if we're receiving a single file or multiple files
    const files = formData.getAll('images');
    
    if (!files || files.length === 0) {
      throw new Error('No image files uploaded');
    }
    
    console.log(`Received ${files.length} file(s) for upload`);
    
    const uploadResults = [];
    
    // Process each file
    for (const fileData of files) {
      if (!(fileData instanceof File)) {
        console.log('Skipping non-file entry in form data');
        continue;
      }
      
      const file = fileData as File;
      console.log('Processing file:', file.name, file.type, file.size);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, fileBytes, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading file:', error);
        uploadResults.push({
          originalName: file.name,
          success: false,
          error: error.message
        });
      } else {
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        console.log('File uploaded successfully:', publicUrl);
        uploadResults.push({
          originalName: file.name,
          success: true,
          url: publicUrl
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      results: uploadResults,
      urls: uploadResults.filter(r => r.success).map(r => r.url)
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    console.error('Error in upload-image function:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 400,
    });
  }
});
