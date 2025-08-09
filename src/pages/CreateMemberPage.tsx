import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MemberForm } from '@/components/members/MemberForm';
import { useCreateMember } from '@/hooks/useMembers';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { MemberFormData } from '@/types/member';

export default function CreateMemberPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createMemberMutation = useCreateMember();
  const { user } = useAuth();

  const handleSubmit = async (data: MemberFormData) => {
    try {
      const newMember = await createMemberMutation.mutateAsync(data);
      
      toast({
        title: "Member created successfully",
        description: `${data.name} has been added to your church.`,
      });
      
      navigate(user ? `/dashboard/members/${newMember.id}` : '/dashboard/members');
    } catch (error: any) {
      toast({
        title: "Failed to create member",
        description: error.message || "There was an error creating the member. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/members');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/members')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Members
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Add New Member</h1>
        <p className="text-muted-foreground">
          Create a new member profile and track their spiritual journey
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createMemberMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}