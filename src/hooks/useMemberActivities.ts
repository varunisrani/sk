import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MemberActivity, ActivityFormData } from '@/types/activity';

export const useMemberActivities = (memberId: string) => {
  return useQuery({
    queryKey: ['member-activities', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_activities')
        .select('*')
        .eq('member_id', memberId)
        .order('activity_date', { ascending: false });

      if (error) throw error;
      return data as MemberActivity[];
    },
    enabled: !!memberId,
  });
};

export const useCreateMemberActivity = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ memberId, activityData }: { memberId: string; activityData: ActivityFormData }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get current user's profile for recorded_by
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const activityToInsert = {
        member_id: memberId,
        activity_type: activityData.activity_type,
        activity_title: activityData.activity_title,
        activity_description: activityData.activity_description || null,
        activity_date: activityData.activity_date.toISOString(),
        duration_minutes: activityData.duration_minutes || null,
        location: activityData.location || null,
        notes: activityData.notes || null,
        recorded_by: profile?.id || null,
      };

      const { data, error } = await supabase
        .from('member_activities')
        .insert(activityToInsert)
        .select()
        .single();

      if (error) throw error;
      
      // Update member's last_activity_log
      await supabase
        .from('members')
        .update({ last_activity_log: new Date().toISOString() })
        .eq('id', memberId);

      return data as MemberActivity;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['member-activities', data.member_id] });
      queryClient.invalidateQueries({ queryKey: ['member', data.member_id] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useUpdateMemberActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activityId, activityData }: { activityId: string; activityData: Partial<ActivityFormData> }) => {
      const updateData: any = {};
      
      if (activityData.activity_type !== undefined) updateData.activity_type = activityData.activity_type;
      if (activityData.activity_title !== undefined) updateData.activity_title = activityData.activity_title;
      if (activityData.activity_description !== undefined) updateData.activity_description = activityData.activity_description || null;
      if (activityData.activity_date !== undefined) updateData.activity_date = activityData.activity_date.toISOString();
      if (activityData.duration_minutes !== undefined) updateData.duration_minutes = activityData.duration_minutes || null;
      if (activityData.location !== undefined) updateData.location = activityData.location || null;
      if (activityData.notes !== undefined) updateData.notes = activityData.notes || null;

      const { data, error } = await supabase
        .from('member_activities')
        .update(updateData)
        .eq('id', activityId)
        .select()
        .single();

      if (error) throw error;
      return data as MemberActivity;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['member-activities', data.member_id] });
    },
  });
};

export const useDeleteMemberActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      const { data: activity } = await supabase
        .from('member_activities')
        .select('member_id')
        .eq('id', activityId)
        .single();

      const { error } = await supabase
        .from('member_activities')
        .delete()
        .eq('id', activityId);

      if (error) throw error;
      return activity?.member_id;
    },
    onSuccess: (memberId) => {
      if (memberId) {
        queryClient.invalidateQueries({ queryKey: ['member-activities', memberId] });
      }
    },
  });
};