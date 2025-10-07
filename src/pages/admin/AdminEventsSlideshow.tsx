import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Trash2, Edit, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface EventSlideImage {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  image_alt_text: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const AdminEventsSlideshow = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<EventSlideImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EventSlideImage | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_alt_text: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('event_slideshow_images')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      toast({ title: 'Error', description: 'Failed to load images', variant: 'destructive' });
    }
    setImages(data || []);
    setLoading(false);
  };

  const uploadToBucket = async (f: File): Promise<string> => {
    const ext = f.name.split('.').pop();
    const name = `event-slide-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('event-slideshow-images').upload(name, f);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('event-slideshow-images').getPublicUrl(name);
    // Normalize URL: ensure '/public/' segment exists for public bucket access
    const normalized = publicUrl.includes('/object/public/')
      ? publicUrl
      : publicUrl.replace('/storage/v1/object/', '/storage/v1/object/public/');
    return normalized;
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const reset = () => {
    setForm({ title: '', description: '', image_alt_text: '', is_active: true, sort_order: images.length });
    setEditing(null);
    setFile(null);
    setPreview(null);
  };

  const save = async () => {
    try {
      let imageUrl = editing?.image_url;
      if (!editing && file) {
        imageUrl = await uploadToBucket(file);
      }
      if (!imageUrl) {
        toast({ title: 'Image required', description: 'Please upload an image', variant: 'destructive' });
        return;
      }
      const payload = {
        title: form.title || null,
        description: form.description || null,
        image_url: imageUrl,
        image_alt_text: form.image_alt_text || null,
        is_active: form.is_active,
        sort_order: form.sort_order,
      };
      if (editing) {
        const { error } = await supabase.from('event_slideshow_images').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('event_slideshow_images').insert(payload);
        if (error) throw error;
      }
      toast({ title: 'Saved', description: 'Background image saved' });
      setDialogOpen(false);
      reset();
      fetchImages();
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to save image', variant: 'destructive' });
    }
  };

  const remove = async (img: EventSlideImage) => {
    if (!confirm('Delete this image?')) return;
    const { error } = await supabase.from('event_slideshow_images').delete().eq('id', img.id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
      return;
    }
    toast({ title: 'Deleted', description: 'Image removed' });
    fetchImages();
  };

  const toggleActive = async (img: EventSlideImage) => {
    const { error } = await supabase.from('event_slideshow_images').update({ is_active: !img.is_active }).eq('id', img.id);
    if (error) return toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    fetchImages();
  };

  const changeOrder = async (img: EventSlideImage, dir: -1 | 1) => {
    const { error } = await supabase.from('event_slideshow_images').update({ sort_order: img.sort_order + dir }).eq('id', img.id);
    if (error) return toast({ title: 'Error', description: 'Failed to reorder', variant: 'destructive' });
    fetchImages();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Events Page Background</h1>
            <p className="text-gray-600">Manage slideshow images for the Events page hero</p>
          </div>
          <Button onClick={() => { reset(); setDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Image
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Images ({images.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : images.length === 0 ? (
              <div className="text-center py-10">No images yet</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {images.map(img => (
                    <TableRow key={img.id}>
                      <TableCell>
                        <div className="w-20 h-12 overflow-hidden rounded">
                          <img src={img.image_url} alt={img.image_alt_text || 'slide'} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>{img.title || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={img.is_active} onCheckedChange={() => toggleActive(img)} />
                          <Badge>{img.is_active ? <span className="flex items-center"><Eye className="w-3 h-3 mr-1"/>Active</span> : <span className="flex items-center"><EyeOff className="w-3 h-3 mr-1"/>Hidden</span>}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" onClick={() => changeOrder(img, -1)}><ArrowUp className="w-3 h-3"/></Button>
                          <span className="px-2 text-sm">{img.sort_order}</span>
                          <Button variant="outline" size="icon" onClick={() => changeOrder(img, 1)}><ArrowDown className="w-3 h-3"/></Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => { setEditing(img); setForm({ title: img.title || '', description: img.description || '', image_alt_text: img.image_alt_text || '', is_active: img.is_active, sort_order: img.sort_order }); setPreview(img.image_url); setDialogOpen(true); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => remove(img)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Background Image' : 'Add Background Image'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded p-4 text-center">
                {preview ? (
                  <img src={preview} alt="preview" className="max-h-56 mx-auto rounded" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Upload a JPG, PNG, GIF, or WebP</p>
                  </>
                )}
                {!editing && (
                  <>
                    <input id="bg-upload" type="file" accept="image/*" onChange={onFile} className="hidden" />
                    <label htmlFor="bg-upload" className="mt-2 inline-block text-blue-600 cursor-pointer">Choose Image</label>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Title</label>
                  <Input value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Sort Order</label>
                  <Input type="number" value={form.sort_order} onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <Textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} />
              </div>
              <div>
                <label className="block text-sm mb-1">Alt Text</label>
                <Input value={form.image_alt_text} onChange={(e) => setForm(prev => ({ ...prev, image_alt_text: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm(prev => ({ ...prev, is_active: v }))} />
                <span className="text-sm">Show in slideshow</span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={save}>{editing ? 'Update' : 'Save'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminEventsSlideshow;


