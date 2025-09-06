import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, chatId, overrideConfig } = await req.json();
    
    console.log('Proxying request to Flowise:', { question, chatId });

    // Use the specific Flowise endpoint provided
    const flowiseUrl = 'https://srv938896.hstgr.cloud/api/v1/prediction/81474cb0-b321-4dfe-abd3-0487f4de430b';
    
    const response = await fetch(flowiseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        chatId,
        overrideConfig: overrideConfig || {}
      })
    });

    if (!response.ok) {
      console.error('Flowise API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to get response from ChatBot service',
          details: errorText 
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    console.log('Flowise response received successfully');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in flowise-proxy:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})