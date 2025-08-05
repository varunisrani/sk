import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Church, UserRole } from '@/types/database';

export const useUserChurches = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-churches', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          churches (*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useChurch = (churchId: string) => {
  return useQuery({
    queryKey: ['church', churchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .eq('id', churchId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!churchId,
  });
};

export const useCreateChurch = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (churchData: Omit<Church, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Create church
      const { data: church, error: churchError } = await supabase
        .from('churches')
        .insert(churchData)
        .select()
        .single();
      
      if (churchError) throw churchError;
      
      // Assign user as admin
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          church_id: church.id,
          role: 'admin' as const,
          assigned_by: user.id,
        });
      
      if (roleError) throw roleError;
      
      return church;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-churches', user?.id] });
    },
  });
};

export const useUserRole = (churchId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-role', user?.id, churchId],
    queryFn: async () => {
      if (!user?.id || !churchId) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('church_id', churchId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!churchId,
  });
};