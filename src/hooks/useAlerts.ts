import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserChurches } from '@/hooks/useChurch';
import { PastoralAlert, AlertComment } from '@/types/alert';

const PUBLIC_CHURCH_ID = '00000000-0000-0000-0000-000000000000';

export const useAlerts = () => {
  const { data: userChurches } = useUserChurches();
  const churchId = userChurches?.[0]?.church_id || PUBLIC_CHURCH_ID;

  return useQuery({
    queryKey: ['alerts', churchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pastoral_alerts')
        .select('*')
        .eq('church_id', churchId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as PastoralAlert[];
    },
  });
};

export const useAlert = (id: string) => {
  return useQuery({
    queryKey: ['alert', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pastoral_alerts')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as PastoralAlert | null;
    },
    enabled: !!id,
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  const { data: userChurches } = useUserChurches();
  const churchId = userChurches?.[0]?.church_id || PUBLIC_CHURCH_ID;

  return useMutation({
    mutationFn: async (payload: Partial<PastoralAlert>) => {
      const body: any = { ...payload, church_id: churchId };
      const { data, error } = await supabase
        .from('pastoral_alerts')
        .insert(body)
        .select()
        .single();
      if (error) throw error;
      return data as PastoralAlert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useUpdateAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PastoralAlert> }) => {
      const { data, error } = await supabase
        .from('pastoral_alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as PastoralAlert;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alert', data.id] });
    },
  });
};

export const useAlertComments = (alertId: string) => {
  return useQuery({
    queryKey: ['alert-comments', alertId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_comments')
        .select('*')
        .eq('alert_id', alertId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []) as AlertComment[];
    },
    enabled: !!alertId,
  });
};

export const useAddAlertComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<AlertComment, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('alert_comments')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data as AlertComment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['alert-comments', data.alert_id] });
    },
  });
};
