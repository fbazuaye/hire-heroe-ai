import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CoverLetter {
  id: string;
  user_id: string;
  title: string;
  company_name: string;
  position_title: string;
  content: string;
  job_description: string | null;
  tone: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useCoverLetters = () => {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCoverLetters = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoverLetters(data || []);
    } catch (error) {
      console.error('Error fetching cover letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCoverLetter = async (params: {
    companyName: string;
    positionTitle: string;
    jobDescription: string;
    prompt?: string;
    tone?: string;
    userProfile?: any;
  }) => {
    if (!user) return { error: 'No user' };

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-career-content', {
        body: {
          type: 'cover_letter',
          companyName: params.companyName,
          positionTitle: params.positionTitle,
          jobDescription: params.jobDescription,
          prompt: params.prompt || '',
          tone: params.tone || 'professional',
          userProfile: params.userProfile
        }
      });

      if (error) throw error;
      
      // Refresh the list
      await fetchCoverLetters();
      
      return { data: data.content, error: null };
    } catch (error) {
      console.error('Error generating cover letter:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteCoverLetter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCoverLetters(prev => prev.filter(letter => letter.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      return { error };
    }
  };

  return {
    coverLetters,
    loading,
    fetchCoverLetters,
    generateCoverLetter,
    deleteCoverLetter
  };
};