import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAlerts, useCreateAlert } from '@/hooks/useAlerts';
import { useMembers } from '@/hooks/useMembers';
import type { AlertPriority, AlertStatus, AlertType } from '@/types/alert';
import { Plus } from 'lucide-react';

const typeColors: Record<string, string> = {
  crisis: 'bg-red-100 text-red-800',
  pastoral_care: 'bg-blue-100 text-blue-800',
  disengagement: 'bg-yellow-100 text-yellow-800',
  milestone: 'bg-green-100 text-green-800',
};

export default function AlertsPage() {
  const navigate = useNavigate();
  const { data: alerts = [] } = useAlerts();
  const { data: members = [] } = useMembers();
  const createAlert = useCreateAlert();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    member_id: '',
    alert_type: 'pastoral_care' as AlertType,
    priority: 'medium' as AlertPriority,
    title: '',
    description: '',
  });

  const onCreate = async () => {
    await createAlert.mutateAsync({ ...form, status: 'open' as AlertStatus, ai_generated: false });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pastoral Alerts</h1>
          <p className="text-muted-foreground">Track risks and care needs</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm">Member</label>
                <Select value={form.member_id} onValueChange={(v) => setForm({ ...form, member_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Type</label>
                  <Select value={form.alert_type} onValueChange={(v) => setForm({ ...form, alert_type: v as AlertType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['disengagement','spiritual_gap','unanswered_question','milestone','pastoral_care','crisis','custom'].map(t => (
                        <SelectItem key={t} value={t}>{t.replace('_',' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm">Priority</label>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as AlertPriority })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['low','medium','high','critical'].map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm">Title</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm">Description</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <Button onClick={onCreate} disabled={!form.member_id || !form.title || !form.description || createAlert.isPending}>
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.map((a) => (
          <Card key={a.id} className="cursor-pointer" onClick={() => navigate(`/dashboard/alerts/${a.id}`)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                {a.title}
                <Badge className={typeColors[a.alert_type] || 'bg-muted text-foreground'}>{a.alert_type.replace('_',' ')}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div>Priority: <span className="font-medium">{a.priority || 'medium'}</span></div>
              <div>Status: <span className="font-medium">{a.status || 'open'}</span></div>
              <div>Created: {new Date(a.created_at || '').toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
        {alerts.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">No alerts yet. Create one to get started.</div>
        )}
      </div>
    </div>
  );
}
