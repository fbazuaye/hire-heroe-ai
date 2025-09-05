import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  category: string;
  proficiency_level: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSkills = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (skillData: Omit<Skill, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'No user' };

    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({
          ...skillData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setSkills(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Skill added successfully",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error", 
        description: "Failed to add skill",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    if (!user) return { error: 'No user' };

    try {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setSkills(prev => 
        prev.map(skill => skill.id === id ? { ...skill, ...data } : skill)
      );
      
      toast({
        title: "Success",
        description: "Skill updated successfully",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating skill:', error);
      toast({
        title: "Error",
        description: "Failed to update skill", 
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteSkill = async (id: string) => {
    if (!user) return { error: 'No user' };

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setSkills(prev => prev.filter(skill => skill.id !== id));
      
      toast({
        title: "Success", 
        description: "Skill deleted successfully",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [user]);

  return {
    skills,
    loading,
    addSkill,
    updateSkill,
    deleteSkill,
    refetch: fetchSkills
  };
};