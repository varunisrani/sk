import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MemberForm } from '@/components/members/MemberForm';
import { useMember, useUpdateMember } from '@/hooks/useMembers';
import { useToast } from '@/hooks/use-toast';
import type { MemberFormData } from '@/types/member';

export default function EditMemberPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: member, isLoading } = useMember(id!);
  const updateMemberMutation = useUpdateMember();

  const handleSubmit = async (data: MemberFormData) => {
    if (!member) return;
    
    try {
      await updateMemberMutation.mutateAsync({
        memberId: member.id,
        memberData: data,
      });
      
      toast({
        title: "Member updated successfully",
        description: `${data.name}'s profile has been updated.`,
      });
      
      navigate(`/dashboard/members/${member.id}`);
    } catch (error: any) {
      toast({
        title: "Failed to update member",
        description: error.message || "There was an error updating the member. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/members/${id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Member not found</h2>
        <p className="text-muted-foreground mt-2">
          The member you're trying to edit doesn't exist or you don't have permission to edit them.
        </p>
        <Button className="mt-4" onClick={() => navigate('/dashboard/members')}>
          Back to Members
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/dashboard/members/${id}`)}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Member</h1>
        <p className="text-muted-foreground">
          Update {member.name}'s profile information
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberForm
            initialData={member}
            isEditing
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={updateMemberMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}