import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  linkedin_url?: string;
  notes?: string;
  connection_strength: 'weak' | 'medium' | 'strong';
  last_contact_date?: string;
  created_at: string;
  updated_at: string;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchContacts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Type conversion for connection_strength
      const typedData = (data || []).map(contact => ({
        ...contact,
        connection_strength: (contact.connection_strength || 'weak') as 'weak' | 'medium' | 'strong'
      }));
      setContacts(typedData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'No user' };

    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          ...contactData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      const typedData = {
        ...data,
        connection_strength: (data.connection_strength || 'weak') as 'weak' | 'medium' | 'strong'
      };
      setContacts(prev => [typedData, ...prev]);
      toast({
        title: "Success",
        description: "Contact added successfully",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error", 
        description: "Failed to add contact",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    if (!user) return { error: 'No user' };

    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      const typedData = {
        ...data,
        connection_strength: (data.connection_strength || 'weak') as 'weak' | 'medium' | 'strong'
      };
      setContacts(prev => 
        prev.map(contact => contact.id === id ? { ...contact, ...typedData } : contact)
      );
      
      toast({
        title: "Success",
        description: "Contact updated successfully",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Error",
        description: "Failed to update contact", 
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteContact = async (id: string) => {
    if (!user) return { error: 'No user' };

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setContacts(prev => prev.filter(contact => contact.id !== id));
      
      toast({
        title: "Success", 
        description: "Contact deleted successfully",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  return {
    contacts,
    loading,
    addContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts
  };
};