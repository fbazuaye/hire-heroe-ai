import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface JobApplication {
  id: string;
  user_id: string;
  company_name: string;
  position_title: string;
  status: string;
  application_date: string | null;
  job_url: string | null;
  salary_range: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useJobApplications = () => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchJobApplications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobApplications(data || []);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch job applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addJobApplication = async (applicationData: Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'No user' };

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          ...applicationData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setJobApplications(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Job application added successfully",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error adding job application:', error);
      toast({
        title: "Error", 
        description: "Failed to add job application",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateJobApplication = async (id: string, updates: Partial<JobApplication>) => {
    if (!user) return { error: 'No user' };

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setJobApplications(prev => 
        prev.map(app => app.id === id ? { ...app, ...data } : app)
      );
      
      toast({
        title: "Success",
        description: "Job application updated successfully",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating job application:', error);
      toast({
        title: "Error",
        description: "Failed to update job application", 
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteJobApplication = async (id: string) => {
    if (!user) return { error: 'No user' };

    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setJobApplications(prev => prev.filter(app => app.id !== id));
      
      toast({
        title: "Success", 
        description: "Job application deleted successfully",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting job application:', error);
      toast({
        title: "Error",
        description: "Failed to delete job application",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchJobApplications();
  }, [user]);

  return {
    jobApplications,
    loading,
    addJobApplication,
    updateJobApplication,
    deleteJobApplication,
    refetch: fetchJobApplications
  };
};