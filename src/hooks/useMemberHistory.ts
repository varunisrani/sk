import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MemberHistoryEntry {
  id: string;
  member_id: string;
  change_type: string;
  old_values: any;
  new_values: any;
  reason?: string;
  changed_by?: string;
  changed_at: string;
}

export const useMemberHistory = (memberId: string) => {
  return useQuery({
    queryKey: ['member-history', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_history')
        .select('*')
        .eq('member_id', memberId)
        .order('changed_at', { ascending: false });

      if (error) throw error;
      return data as MemberHistoryEntry[];
    },
    enabled: !!memberId,
  });
};