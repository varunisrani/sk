import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MemberNote, NoteFormData } from '@/types/note';

export const useMemberNotes = (memberId: string) => {
  return useQuery({
    queryKey: ['member-notes', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_notes')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MemberNote[];
    },
    enabled: !!memberId,
  });
};

export const useCreateMemberNote = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ memberId, noteData }: { memberId: string; noteData: NoteFormData }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get current user's profile for created_by
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const noteToInsert = {
        member_id: memberId,
        note_type: noteData.note_type,
        title: noteData.title,
        content: noteData.content,
        is_confidential: noteData.is_confidential,
        visibility: noteData.visibility,
        follow_up_needed: noteData.follow_up_needed,
        follow_up_date: noteData.follow_up_date ? noteData.follow_up_date.toISOString().split('T')[0] : null,
        tags: noteData.tags || [],
        created_by: profile.id,
      };

      const { data, error } = await supabase
        .from('member_notes')
        .insert(noteToInsert)
        .select()
        .single();

      if (error) throw error;
      return data as MemberNote;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['member-notes', data.member_id] });
    },
  });
};

export const useUpdateMemberNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId, noteData }: { noteId: string; noteData: Partial<NoteFormData> }) => {
      const updateData: any = {};
      
      if (noteData.note_type !== undefined) updateData.note_type = noteData.note_type;
      if (noteData.title !== undefined) updateData.title = noteData.title;
      if (noteData.content !== undefined) updateData.content = noteData.content;
      if (noteData.is_confidential !== undefined) updateData.is_confidential = noteData.is_confidential;
      if (noteData.visibility !== undefined) updateData.visibility = noteData.visibility;
      if (noteData.follow_up_needed !== undefined) updateData.follow_up_needed = noteData.follow_up_needed;
      if (noteData.follow_up_date !== undefined) updateData.follow_up_date = noteData.follow_up_date ? noteData.follow_up_date.toISOString().split('T')[0] : null;
      if (noteData.tags !== undefined) updateData.tags = noteData.tags || [];

      const { data, error } = await supabase
        .from('member_notes')
        .update(updateData)
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;
      return data as MemberNote;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['member-notes', data.member_id] });
    },
  });
};

export const useDeleteMemberNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const { data: note } = await supabase
        .from('member_notes')
        .select('member_id')
        .eq('id', noteId)
        .single();

      const { error } = await supabase
        .from('member_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      return note?.member_id;
    },
    onSuccess: (memberId) => {
      if (memberId) {
        queryClient.invalidateQueries({ queryKey: ['member-notes', memberId] });
      }
    },
  });
};