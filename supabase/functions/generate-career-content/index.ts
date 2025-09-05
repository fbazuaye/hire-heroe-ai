import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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
    const { 
      type, 
      prompt, 
      jobDescription, 
      userProfile, 
      companyName, 
      positionTitle,
      tone = 'professional' 
    } = await req.json();

    console.log('Received request:', { type, companyName, positionTitle, tone });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'cover_letter':
        systemPrompt = `You are an expert career coach and cover letter writer. Create compelling, personalized cover letters that highlight relevant skills and experience. Write in a ${tone} tone.`;
        userPrompt = `Create a cover letter for the following:
Company: ${companyName}
Position: ${positionTitle}
Job Description: ${jobDescription}
User Profile: ${JSON.stringify(userProfile)}

Additional context: ${prompt}

Please write a compelling cover letter that:
1. Shows enthusiasm for the company and role
2. Highlights relevant skills and experience
3. Demonstrates knowledge about the company/industry
4. Uses a ${tone} tone throughout
5. Is concise but impactful (aim for 3-4 paragraphs)`;
        break;

      case 'motivation':
        systemPrompt = 'You are a supportive career coach who provides encouragement and motivation for job seekers. Be uplifting, practical, and inspiring.';
        userPrompt = `Generate motivational content for a job seeker. Context: ${prompt}. 

Please provide:
1. An inspiring quote
2. A practical tip for job searching
3. A positive affirmation

Make it personalized and encouraging.`;
        break;

      case 'job_match':
        systemPrompt = 'You are a career advisor who analyzes job matches. Provide detailed analysis of how well a candidate fits a role.';
        userPrompt = `Analyze the job match for:
Position: ${positionTitle} at ${companyName}
Job Description: ${jobDescription}
Candidate Profile: ${JSON.stringify(userProfile)}

Provide:
1. Match percentage (0-100%)
2. Strengths that align with the role
3. Potential gaps or areas for improvement
4. Specific suggestions for applying`;
        break;

      case 'salary_insights':
        systemPrompt = 'You are a compensation expert who provides salary insights and negotiation advice.';
        userPrompt = `Provide salary insights for:
Position: ${positionTitle}
Company: ${companyName}
User Profile: ${JSON.stringify(userProfile)}
Additional Context: ${prompt}

Include:
1. Estimated salary range for this role
2. Factors that could affect compensation
3. Negotiation tips
4. Market trends for this position`;
        break;

      default:
        throw new Error('Invalid request type');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Generated content successfully');

    // If it's a cover letter, save it to the database
    if (type === 'cover_letter' && supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Get user from request headers
        const authHeader = req.headers.get('authorization');
        if (authHeader) {
          const token = authHeader.replace('Bearer ', '');
          const { data: { user }, error: userError } = await supabase.auth.getUser(token);
          
          if (user && !userError) {
            await supabase.from('cover_letters').insert({
              user_id: user.id,
              title: `Cover Letter for ${positionTitle} at ${companyName}`,
              company_name: companyName,
              position_title: positionTitle,
              content: generatedContent,
              job_description: jobDescription,
              tone: tone,
              status: 'generated'
            });
            console.log('Cover letter saved to database');
          }
        }
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Don't fail the request if database save fails
      }
    }

    return new Response(JSON.stringify({ 
      content: generatedContent,
      type: type 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-career-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred processing your request' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});