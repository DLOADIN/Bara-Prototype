import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { PopupAd, fetchActivePopupAds, uploadPopupImage, createPopupAd, updatePopupAd, deletePopupAd } from '@/lib/popupAdsService';
import { Plus, Trash2, Edit, Upload } from 'lucide-react';

export default function AdminPopupAds() {
  const { toast } = useToast();
  const [rows, setRows] = useState<PopupAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PopupAd | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: '', link_url: '', image_url: '', sort_order: 0, is_active: true });

  const load = async () => {
    setLoading(true);
    try {
      // fetch both active and inactive for admin view
      const { data, error } = await (window as any).supabase
        .from('popup_ads')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setRows(data || []);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to load ads', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    try {
      let imageUrl = form.image_url;
      if (file) imageUrl = await uploadPopupImage(file);
      const payload = { ...form, image_url: imageUrl } as any;
      if (editing) {
        await updatePopupAd(editing.id, payload);
        toast({ title: 'Updated', description: 'Ad updated' });
      } else {
        await createPopupAd(payload);
        toast({ title: 'Created', description: 'Ad created' });
      }
      setOpen(false); setEditing(null); setFile(null);
      setForm({ name: '', link_url: '', image_url: '', sort_order: 0, is_active: true });
      load();
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to save ad', variant: 'destructive' });
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this ad?')) return;
    try { await deletePopupAd(id); toast({ title: 'Deleted' }); load(); } 
    catch (e) { toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' }); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Popup Ads</h1>
          <Button onClick={() => { setEditing(null); setForm({ name: '', link_url: '', image_url: '', sort_order: rows.length, is_active: true }); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Ad
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ads ({rows.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? 'Loading…' : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell><img src={r.image_url} className="h-12 w-16 object-cover rounded" /></TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell className="truncate max-w-[240px] text-blue-600"><a href={r.link_url || ''} target="_blank" rel="noreferrer">{r.link_url}</a></TableCell>
                      <TableCell>{r.is_active ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{r.sort_order}</TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditing(r); setForm({ name: r.name, link_url: r.link_url || '', image_url: r.image_url, sort_order: r.sort_order, is_active: r.is_active }); setOpen(true); }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => remove(r.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Ad' : 'Add Ad'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <Label>Link URL</Label>
                  <Input value={form.link_url} onChange={(e) => setForm((p) => ({ ...p, link_url: e.target.value }))} placeholder="https://…" />
                </div>
              </div>

              <div>
                <Label>Image</Label>
                <div className="flex items-center gap-3">
                  <input id="popup-upload" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                  <label htmlFor="popup-upload" className="inline-flex items-center gap-2 px-3 py-2 rounded border cursor-pointer"><Upload className="w-4 h-4"/> Select image</label>
                  {form.image_url && !file && <img src={form.image_url} className="h-10 rounded" />}
                  {file && <span className="text-sm text-gray-600">{file.name}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <Label>Sort Order</Label>
                  <Input type="number" value={form.sort_order} onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value || '0', 10) }))} />
                </div>
                <div className="flex items-center gap-2 mt-6 md:mt-8">
                  <Switch checked={form.is_active} onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))} />
                  <span>Active</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={submit}>{editing ? 'Update' : 'Create'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}


