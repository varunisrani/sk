import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserChurches } from '@/hooks/useChurch';
import { Member, MemberFormData, MemberFilters, MemberStats } from '@/types/member';
const PUBLIC_CHURCH_ID = '00000000-0000-0000-0000-000000000000';

export const useMembers = (filters?: MemberFilters) => {
  const { user } = useAuth();
  const { data: userChurches } = useUserChurches();
  const churchId = userChurches?.[0]?.church_id;
  const effectiveChurchId = churchId || PUBLIC_CHURCH_ID;

  return useQuery({
    queryKey: ['members', effectiveChurchId, filters],
    queryFn: async () => {
      let query = supabase
        .from('members')
        .select('*')
        .eq('church_id', effectiveChurchId)
        .eq('active', true)
        .order('name');

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone_number.ilike.%${filters.search}%`);
      }

      if (filters?.discipleship_stage) {
        query = query.eq('discipleship_stage', filters.discipleship_stage);
      }

      if (filters?.baptism_status === 'baptized') {
        query = query.eq('baptized', true);
      } else if (filters?.baptism_status === 'not_baptized') {
        query = query.eq('baptized', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Member[];
    },
    enabled: true,
  });
};

export const useMember = (memberId: string) => {
  return useQuery({
    queryKey: ['member', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', memberId)
        .single();

      if (error) throw error;
      return data as Member;
    },
    enabled: !!memberId,
  });
};

export const useMemberStats = () => {
  const { user } = useAuth();
  const { data: userChurches } = useUserChurches();
  const churchId = userChurches?.[0]?.church_id;
  const effectiveChurchId = churchId || PUBLIC_CHURCH_ID;

  return useQuery({
    queryKey: ['member-stats', effectiveChurchId],
    queryFn: async () => {
      const { data: members, error } = await supabase
        .from('members')
        .select('discipleship_stage, engagement_score, last_activity_log')
        .eq('church_id', effectiveChurchId)
        .eq('active', true);

      if (error) throw error;

      const stats: MemberStats = {
        total: members.length,
        by_stage: {
          'New Believer': 0,
          'Growing': 0,
          'Mature': 0,
          'Leader': 0,
          'Seeker': 0,
        },
        engagement: {
          high: 0,
          medium: 0,
          low: 0,
          inactive: 0,
        },
        recent_activity: 0,
      };

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      members.forEach((member) => {
        // Count by stage
        if (member.discipleship_stage) {
          stats.by_stage[member.discipleship_stage]++;
        }

        // Count by engagement
        const score = member.engagement_score || 0;
        if (score >= 0.8) stats.engagement.high++;
        else if (score >= 0.6) stats.engagement.medium++;
        else if (score >= 0.3) stats.engagement.low++;
        else stats.engagement.inactive++;

        // Count recent activity
        if (member.last_activity_log && new Date(member.last_activity_log) > oneWeekAgo) {
          stats.recent_activity++;
        }
      });

      return stats;
    },
    enabled: true,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: userChurches } = useUserChurches();
  const churchId = userChurches?.[0]?.church_id;

  return useMutation({
    mutationFn: async (memberData: MemberFormData) => {
      // Determine effective church
      const effectiveChurchId = churchId || PUBLIC_CHURCH_ID;

      // Optionally get profile id for created_by when logged in
      let profileId: string | null = null;
      if (user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        profileId = profile?.id ?? null;
      }

      // Generate member number if not provided
      const memberNumber = `M${Date.now().toString().slice(-6)}`;

      const memberToInsert = {
        church_id: effectiveChurchId,
        name: memberData.name,
        email: memberData.email || null,
        phone_number: memberData.phone_number || null,
        birthday: memberData.birthday ? memberData.birthday.toISOString().split('T')[0] : null,
        address: memberData.address || null,
        country: memberData.country || null,
        city: memberData.city || null,
        discipleship_stage: memberData.discipleship_stage || null,
        spiritual_gifts: memberData.spiritual_gifts || [],
        baptized: memberData.baptized,
        baptism_date: memberData.baptism_date ? memberData.baptism_date.toISOString().split('T')[0] : null,
        saved_status: memberData.saved_status,
        salvation_date: memberData.salvation_date ? memberData.salvation_date.toISOString().split('T')[0] : null,
        biblical_understanding: memberData.biblical_understanding || null,
        email_notifications: memberData.email_notifications,
        sms_notifications: memberData.sms_notifications,
        language_preference: memberData.language_preference,
        member_number: memberNumber,
        photo_url: memberData.photo_url || null,
        created_by: profileId,
      };

      const { data, error } = await supabase
        .from('members')
        .insert(memberToInsert)
        .select()
        .single();

      if (error) throw error;
      return data as Member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member-stats'] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ memberId, memberData }: { memberId: string; memberData: Partial<MemberFormData> }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const updateData: any = {};
      
      if (memberData.name !== undefined) updateData.name = memberData.name;
      if (memberData.email !== undefined) updateData.email = memberData.email || null;
      if (memberData.phone_number !== undefined) updateData.phone_number = memberData.phone_number || null;
      if (memberData.birthday !== undefined) updateData.birthday = memberData.birthday ? memberData.birthday.toISOString().split('T')[0] : null;
      if (memberData.address !== undefined) updateData.address = memberData.address || null;
      if (memberData.country !== undefined) updateData.country = memberData.country || null;
      if (memberData.city !== undefined) updateData.city = memberData.city || null;
      if (memberData.discipleship_stage !== undefined) updateData.discipleship_stage = memberData.discipleship_stage || null;
      if (memberData.spiritual_gifts !== undefined) updateData.spiritual_gifts = memberData.spiritual_gifts || [];
      if (memberData.baptized !== undefined) updateData.baptized = memberData.baptized;
      if (memberData.baptism_date !== undefined) updateData.baptism_date = memberData.baptism_date ? memberData.baptism_date.toISOString().split('T')[0] : null;
      if (memberData.saved_status !== undefined) updateData.saved_status = memberData.saved_status;
      if (memberData.salvation_date !== undefined) updateData.salvation_date = memberData.salvation_date ? memberData.salvation_date.toISOString().split('T')[0] : null;
      if (memberData.biblical_understanding !== undefined) updateData.biblical_understanding = memberData.biblical_understanding || null;
      if (memberData.email_notifications !== undefined) updateData.email_notifications = memberData.email_notifications;
      if (memberData.sms_notifications !== undefined) updateData.sms_notifications = memberData.sms_notifications;
      if (memberData.language_preference !== undefined) updateData.language_preference = memberData.language_preference;
      if (memberData.photo_url !== undefined) updateData.photo_url = memberData.photo_url || null;

      const { data, error } = await supabase
        .from('members')
        .update(updateData)
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;
      return data as Member;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', data.id] });
      queryClient.invalidateQueries({ queryKey: ['member-stats'] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('members')
        .update({ active: false })
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member-stats'] });
    },
  });
};