# Quick Storage Setup for Slideshow Images

## 🚨 IMMEDIATE FIX NEEDED

The error "Bucket not found" means the `slideshow-images` storage bucket doesn't exist in your Supabase project.

## Step 1: Create Storage Bucket (Choose ONE method)

### Method A: Via Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Click **"Storage"** in the left sidebar
3. Click **"New bucket"**
4. Fill in:
   - **Name**: `slideshow-images`
   - **Public**: ✅ **YES** (this is required!)
   - **File size limit**: `10485760` (10MB)
   - **Allowed MIME types**: `image/jpeg,image/png,image/gif,image/webp`
5. Click **"Create bucket"**

### Method B: Via SQL (Alternative)
Run this SQL in your Supabase SQL editor:

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

## Step 2: Set Storage Policies

Run this SQL in your Supabase SQL editor:

```sql
-- Allow public to view images
CREATE POLICY "Allow public to view slideshow images" ON storage.objects
FOR SELECT USING (bucket_id = 'slideshow-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload slideshow images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'slideshow-images' 
  AND auth.role() = 'authenticated'
);

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

## Step 3: Test the Setup

1. Go to `/admin/slideshow-images`
2. Try uploading an image
3. The error should be gone!

## 🔧 If You Still Get Errors

### Check Bucket Exists
```sql
SELECT * FROM storage.buckets WHERE id = 'slideshow-images';
```

### Check Policies
```sql
SELECT * FROM storage.policies WHERE bucket_id = 'slideshow-images';
```

### Verify Public Access
The bucket MUST be public for the slideshow to work on the homepage.

## ✅ Success Indicators

- No more "Bucket not found" errors
- Images upload successfully
- Images appear in the admin table
- Images show up on the homepage slideshow

## 🚀 Next Steps

Once the bucket is created:
1. Upload some test images via the admin panel
2. Toggle them on/off to test the functionality
3. Check that they appear on the homepage slideshow

The slideshow system will work perfectly once the storage bucket is properly configured!
