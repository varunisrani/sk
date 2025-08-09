import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserChurches } from '@/hooks/useChurch';
import { Announcement, AnnouncementFormData, AnnouncementCategory } from '@/types/announcement';

const PUBLIC_CHURCH_ID = '00000000-0000-0000-0000-000000000000';

export interface AnnouncementFilters {
  category?: AnnouncementCategory | 'all';
  status?: 'all' | 'active' | 'inactive';
}

export const useAnnouncements = (filters?: AnnouncementFilters) => {
  const { data: userChurches } = useUserChurches();
  const churchId = userChurches?.[0]?.church_id;
  const effectiveChurchId = churchId || PUBLIC_CHURCH_ID;

  return useQuery({
    queryKey: ['announcements', effectiveChurchId, filters],
    queryFn: async () => {
      let query = supabase
        .from('announcements')
        .select('*')
        .eq('church_id', effectiveChurchId)
        .order('publish_date', { ascending: false });

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('active', filters.status === 'active');
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Announcement[];
    },
    enabled: true,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: userChurches } = useUserChurches();
  const churchId = userChurches?.[0]?.church_id;

  return useMutation({
    mutationFn: async (form: AnnouncementFormData) => {
      const effectiveChurchId = churchId || PUBLIC_CHURCH_ID;

      const toInsert = {
        church_id: effectiveChurchId,
        title: form.title,
        body_html: form.body_html,
        category: form.category,
        publish_date: form.publish_date ? form.publish_date.toISOString().split('T')[0] : null,
        active: form.active,
        created_by: user?.id ?? null,
      };

      const { data, error } = await supabase
        .from('announcements')
        .insert(toInsert)
        .select()
        .single();

      if (error) throw error;
      return data as Announcement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AnnouncementFormData> & { active?: boolean } }) => {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.body_html !== undefined) dbUpdates.body_html = updates.body_html;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.publish_date !== undefined) dbUpdates.publish_date = updates.publish_date ? updates.publish_date.toISOString().split('T')[0] : null;
      if (updates.active !== undefined) dbUpdates.active = updates.active;

      const { data, error } = await supabase
        .from('announcements')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Announcement;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcement', data.id] });
    },
  });
};

export const useIncrementAnnouncementView = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('increment_announcement_view', { p_announcement_id: id });
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};