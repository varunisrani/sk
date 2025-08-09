import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAnnouncements, useCreateAnnouncement, useIncrementAnnouncementView, useUpdateAnnouncement } from '@/hooks/useAnnouncements';
import { Announcement, AnnouncementCategory, AnnouncementFormData } from '@/types/announcement';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Loader2, Plus, Eye } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const categoryLabels: Record<AnnouncementCategory, string> = {
  general: 'General',
  urgent: 'Urgent',
  event: 'Event',
};

const typeBadgeVariant = (category: AnnouncementCategory) => {
  switch (category) {
    case 'urgent':
      return 'destructive' as const;
    case 'event':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
};

const NewAnnouncementDialog = ({ onCreated }: { onCreated?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AnnouncementFormData>({
    title: '',
    body_html: '',
    category: 'general',
    publish_date: new Date(),
    active: true,
  });
  const createMutation = useCreateAnnouncement();

  const submit = async () => {
    await createMutation.mutateAsync(form);
    setOpen(false);
    onCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-2" /> New Announcement</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v: AnnouncementCategory) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <Label>Publish Date</Label>
              <div className="rounded-md border p-2">
                <Calendar
                  mode="single"
                  selected={form.publish_date ?? undefined}
                  onSelect={(d) => setForm({ ...form, publish_date: d ?? null })}
                  initialFocus
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label>Active</Label>
            </div>
          </div>

          <div>
            <Label>Body</Label>
            <div className="mt-2">
              <ReactQuill theme="snow" value={form.body_html} onChange={(html) => setForm({ ...form, body_html: html })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={createMutation.isPending || !form.title || !form.body_html}>
            {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AnnouncementViewDialog = ({ announcement }: { announcement: Announcement }) => {
  const [open, setOpen] = useState(false);
  const incView = useIncrementAnnouncementView();

  useEffect(() => {
    if (open) {
      incView.mutate(announcement.id);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" />View</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{announcement.title}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground mb-2">
          <div className="flex gap-2 items-center">
            <Badge variant={typeBadgeVariant(announcement.category)}>{categoryLabels[announcement.category]}</Badge>
            <span>•</span>
            <span>{announcement.publish_date ? format(new Date(announcement.publish_date), 'PPP') : 'No date'}</span>
            <span>•</span>
            <span>{announcement.active ? 'Active' : 'Inactive'}</span>
            <span>•</span>
            <span>{announcement.view_count} views</span>
          </div>
        </div>
        <article className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: announcement.body_html }} />
      </DialogContent>
    </Dialog>
  );
};

const CommunicationsPage = () => {
  // SEO
  useEffect(() => {
    document.title = 'Church Announcements | Communications';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'View and publish church announcements with categories and scheduling.');
  }, []);

  const [category, setCategory] = useState<'all' | AnnouncementCategory>('all');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const { data: announcements = [], isLoading, refetch } = useAnnouncements({ category, status });

  const grouped = useMemo(() => announcements, [announcements]);

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Announcements</h1>
        <p className="text-sm text-muted-foreground">Create and manage announcements for your church community.</p>
      </header>

      <section className="flex items-center justify-between mb-4">
        <div className="flex gap-3 items-center">
          <div className="w-48">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v: any) => setCategory(v)}>
              <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <NewAnnouncementDialog onCreated={() => refetch()} />
      </section>

      <section>
        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No announcements yet</CardTitle>
              <CardDescription>Click "New Announcement" to publish your first update.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {grouped.map((a) => (
              <Card key={a.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{a.title}</CardTitle>
                      <CardDescription>
                        <div className="flex gap-2 items-center">
                          <Badge variant={typeBadgeVariant(a.category)}>{categoryLabels[a.category]}</Badge>
                          <span>•</span>
                          <span>{a.publish_date ? format(new Date(a.publish_date), 'PPP') : 'No date'}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant={a.active ? 'default' : 'outline'}>{a.active ? 'Active' : 'Inactive'}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="line-clamp-3 text-sm" dangerouslySetInnerHTML={{ __html: a.body_html }} />
                </CardContent>
                <div className="flex items-center justify-between px-6 pb-4">
                  <div className="text-xs text-muted-foreground">{a.view_count} views</div>
                  <AnnouncementViewDialog announcement={a} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default CommunicationsPage;