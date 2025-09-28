# Supabase Storage Setup for Slideshow Images

## 1. Create Storage Bucket

### Via Supabase Dashboard:
1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `slideshow-images`
   - **Public**: ✅ **Yes** (so images can be accessed publicly)
   - **File size limit**: 10MB (adjust as needed)
   - **Allowed MIME types**: `image/jpeg,image/png,image/gif,image/webp`

### Via SQL (Alternative):
```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'slideshow-images',
  'slideshow-images',
  true,
  10485760, -- 10MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);
```

## 2. Set Up Storage Policies

### Allow Public Read Access:
```sql
-- Allow public to view images
CREATE POLICY "Allow public to view slideshow images" ON storage.objects
FOR SELECT USING (bucket_id = 'slideshow-images');
```

### Allow Authenticated Users to Upload:
```sql
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload slideshow images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'slideshow-images' 
  AND auth.role() = 'authenticated'
);
```

### Allow Authenticated Users to Update/Delete:
```sql
-- Allow authenticated users to update their own images
CREATE POLICY "Allow authenticated users to update slideshow images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'slideshow-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Allow authenticated users to delete slideshow images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'slideshow-images' 
  AND auth.role() = 'authenticated'
);
```

## 3. Storage URL Structure

Images will be stored with the following URL structure:
```
https://[your-project-id].supabase.co/storage/v1/object/public/slideshow-images/[filename]
```

## 4. File Naming Convention

Recommended naming convention for uploaded files:
- Format: `slideshow-[timestamp]-[random-id].[extension]`
- Example: `slideshow-1703123456789-abc123.jpg`

## 5. Environment Variables

Make sure your `.env` file includes:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 6. Testing the Setup

### Test Upload (via Supabase Dashboard):
1. Go to Storage > slideshow-images
2. Try uploading a test image
3. Verify the public URL works

### Test via Code:
```typescript
// Test upload function
const uploadImage = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('slideshow-images')
    .upload(`test-${Date.now()}.jpg`, file);
    
  if (error) {
    console.error('Upload error:', error);
  } else {
    console.log('Upload successful:', data);
  }
};
```

## 7. Storage Quotas and Limits

### Default Limits:
- **Free Tier**: 1GB storage, 2GB bandwidth
- **Pro Tier**: 100GB storage, 250GB bandwidth

### File Size Recommendations:
- **Max file size**: 5-10MB per image
- **Recommended dimensions**: 1920x1080 or similar
- **Format**: JPEG for photos, PNG for graphics with transparency

## 8. Security Considerations

1. **Public Access**: Images are publicly accessible (required for slideshow)
2. **File Validation**: Always validate file types and sizes on upload
3. **Rate Limiting**: Consider implementing rate limiting for uploads
4. **Virus Scanning**: Consider adding virus scanning for uploaded files

## 9. Backup Strategy

1. **Regular Backups**: Set up automated backups of your storage bucket
2. **Image Optimization**: Consider compressing images before upload
3. **CDN**: Consider using a CDN for better performance

## 10. Monitoring

Monitor your storage usage:
- **Dashboard**: Check storage usage in Supabase dashboard
- **Alerts**: Set up alerts for storage quota limits
- **Analytics**: Monitor bandwidth usage and popular images
