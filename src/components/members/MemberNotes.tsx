import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TagInput } from "@/components/ui/TagInput";
import { MemberNote, NoteFormData, NOTE_TYPES, NoteVisibility } from "@/types/note";
import { useMemberNotes, useCreateMemberNote } from "@/hooks/useMemberNotes";
import { format, formatDistanceToNow } from "date-fns";
import { 
  StickyNote, 
  Plus, 
  Calendar,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MemberNotesProps {
  memberId: string;
  canCreateNotes: boolean;
  maxHeight?: string;
}

export const MemberNotes = ({
  memberId,
  canCreateNotes,
  maxHeight = "500px"
}: MemberNotesProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState<NoteFormData>({
    note_type: 'General',
    title: '',
    content: '',
    is_confidential: false,
    visibility: 'staff_only',
    follow_up_needed: false,
    tags: []
  });

  const { data: notes = [], isLoading } = useMemberNotes(memberId);
  const createNote = useCreateMemberNote();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both title and content for the note.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createNote.mutateAsync({ memberId, noteData: newNote });
      
      // Reset form
      setNewNote({
        note_type: 'General',
        title: '',
        content: '',
        is_confidential: false,
        visibility: 'staff_only',
        follow_up_needed: false,
        tags: []
      });
      setShowAddForm(false);
      
      toast({
        title: "Note Added",
        description: "The note has been successfully added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getVisibilityIcon = (visibility: NoteVisibility) => {
    switch (visibility) {
      case 'public':
        return <Eye className="h-3 w-3" />;
      case 'confidential':
        return <EyeOff className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getVisibilityColor = (visibility: NoteVisibility) => {
    switch (visibility) {
      case 'public':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'staff_only':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pastor_only':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'confidential':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'prayer request':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'counseling':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'follow-up':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'concern':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'celebration':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <StickyNote className="h-5 w-5" />
            <span>Pastoral Notes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-4 border rounded-lg">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <StickyNote className="h-5 w-5" />
            <span>Pastoral Notes</span>
          </span>
          {canCreateNotes && (
            <Button 
              size="sm" 
              onClick={() => setShowAddForm(!showAddForm)}
              variant={showAddForm ? "outline" : "default"}
            >
              <Plus className="h-4 w-4 mr-2" />
              {showAddForm ? "Cancel" : "Add Note"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add Note Form */}
        {showAddForm && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Add New Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="note-type">Note Type</Label>
                  <Select
                    value={newNote.note_type}
                    onValueChange={(value) => setNewNote(prev => ({ ...prev, note_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={newNote.visibility}
                    onValueChange={(value) => setNewNote(prev => ({ ...prev, visibility: value as NoteVisibility }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="staff_only">Staff Only</SelectItem>
                      <SelectItem value="pastor_only">Pastor Only</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Note title..."
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Note content..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <TagInput
                  value={newNote.tags || []}
                  onChange={(tags) => setNewNote(prev => ({ ...prev, tags }))}
                  placeholder="Add tags..."
                  suggestions={['Prayer', 'Counseling', 'Follow-up', 'Family', 'Health', 'Ministry']}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="confidential"
                    checked={newNote.is_confidential}
                    onCheckedChange={(checked) => 
                      setNewNote(prev => ({ ...prev, is_confidential: checked as boolean }))
                    }
                  />
                  <Label htmlFor="confidential" className="text-sm">Confidential</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="follow-up"
                    checked={newNote.follow_up_needed}
                    onCheckedChange={(checked) => 
                      setNewNote(prev => ({ ...prev, follow_up_needed: checked as boolean }))
                    }
                  />
                  <Label htmlFor="follow-up" className="text-sm">Needs Follow-up</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={createNote.isPending}>
                  {createNote.isPending ? "Adding..." : "Add Note"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        {notes.length === 0 ? (
          <div className="text-center py-8">
            <StickyNote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notes recorded yet</p>
            {canCreateNotes && (
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Note
              </Button>
            )}
          </div>
        ) : (
          <ScrollArea style={{ height: maxHeight }}>
            <div className="space-y-4">
              {notes.map((note) => (
                <Card key={note.id} className="border-l-4 border-l-primary/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-foreground">{note.title}</h4>
                          {note.is_confidential && (
                            <Badge variant="destructive" className="text-xs">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Confidential
                            </Badge>
                          )}
                          {note.follow_up_needed && (
                            <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Follow-up
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getNoteTypeColor(note.note_type)}`}
                          >
                            {note.note_type}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getVisibilityColor(note.visibility)}`}
                          >
                            {getVisibilityIcon(note.visibility)}
                            <span className="ml-1 capitalize">{note.visibility.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
                      {note.content}
                    </p>

                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {note.follow_up_date && (
                      <div className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Follow-up by: {format(new Date(note.follow_up_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};