import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { healthData } = await req.json();
    console.log('Received health data:', healthData);

    // Save health data to database
    const { data: savedData, error: saveError } = await supabaseClient
      .from('health_data')
      .insert({
        user_id: user.id,
        ...healthData,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving health data:', saveError);
      return new Response(JSON.stringify({ error: 'Failed to save health data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // TODO: Load .pkl model and make prediction
    // For now, return mock prediction
    const mockPrediction = {
      health_score: Math.round(Math.random() * 100),
      risk_level: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      recommendations: [
        'Maintain regular workout schedule',
        'Consider increasing protein intake',
        'Stay hydrated throughout the day'
      ]
    };

    // Update the record with prediction result
    const { error: updateError } = await supabaseClient
      .from('health_data')
      .update({ prediction_result: mockPrediction })
      .eq('id', savedData.id);

    if (updateError) {
      console.error('Error updating prediction:', updateError);
    }

    console.log('Prediction completed:', mockPrediction);

    return new Response(
      JSON.stringify({
        success: true,
        data_id: savedData.id,
        prediction: mockPrediction
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in predict-health function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});