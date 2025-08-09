import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAlert, useUpdateAlert, useAlertComments, useAddAlertComment } from '@/hooks/useAlerts';
import type { AlertStatus } from '@/types/alert';
import { ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';

export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: alert } = useAlert(id!);
  const updateAlert = useUpdateAlert();
  const { data: comments = [] } = useAlertComments(id!);
  const addComment = useAddAlertComment();

  const [note, setNote] = useState('');

  if (!alert) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Alert not found</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard/alerts')}>Back to Alerts</Button>
      </div>
    );
  }

  const updateStatus = async (status: AlertStatus) => {
    await updateAlert.mutateAsync({ id: alert.id, updates: { status, resolved: status === 'resolved' } });
  };

  const sendNotification = async () => {
    await updateAlert.mutateAsync({ id: alert.id, updates: { notification_sent: true, notification_sent_at: new Date().toISOString() } });
  };

  const onAddComment = async () => {
    if (!note.trim()) return;
    await addComment.mutateAsync({ alert_id: alert.id, comment_text: note, comment_type: 'update' });
    setNote('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/dashboard/alerts')}><ArrowLeft className="mr-2 h-4 w-4"/>Back</Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={sendNotification}><Send className="mr-2 h-4 w-4"/>Send Notification</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{alert.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs">Status</label>
              <Select value={(alert.status || 'open') as string} onValueChange={(v) => updateStatus(v as AlertStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['open','in_progress','resolved','closed','escalated'].map(s => (
                    <SelectItem key={s} value={s}>{s.replace('_',' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs">Priority</label>
              <Input value={alert.priority || ''} readOnly />
            </div>
            <div>
              <label className="text-xs">Type</label>
              <Input value={alert.alert_type} readOnly />
            </div>
          </div>
          <div>
            <label className="text-xs">Description</label>
            <Textarea value={alert.description} readOnly />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {comments.map(c => (
              <div key={c.id} className="p-3 rounded-md border border-border">
                <div className="text-xs text-muted-foreground">{new Date(c.created_at || '').toLocaleString()}</div>
                <div className="text-sm">{c.comment_text}</div>
              </div>
            ))}
            {comments.length === 0 && <div className="text-sm text-muted-foreground">No comments yet.</div>}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Add a comment..." value={note} onChange={(e) => setNote(e.target.value)} />
            <Button onClick={onAddComment}>Add</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
