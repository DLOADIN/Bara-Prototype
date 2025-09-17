# 🖼️ Image Storage Setup Guide

This guide will help you set up proper image storage for the sponsored banner system.

## 📋 Prerequisites

- Supabase project with storage enabled
- Admin access to your Supabase dashboard

## 🚀 Setup Steps

### 1. Enable Storage in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New Bucket"**
4. Create a bucket named `sponsored-banners`
5. Set it as **Public** (so images can be accessed via URL)
6. Set file size limit to **5MB**
7. Add allowed MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`

### 2. Run Storage Setup SQL

Run the `database/setup_storage_bucket.sql` script in your Supabase SQL Editor:

```sql
-- This will create the bucket and set up RLS policies
-- Copy and paste the entire content of setup_storage_bucket.sql
```

### 3. Verify Storage Setup

1. Go to **Storage** → **sponsored-banners** bucket
2. You should see the bucket is created and public
3. Try uploading a test image manually to verify it works

## 🔧 How It Works

### Image Upload Process

1. **User selects image** → File validation (type, size)
2. **Preview shown** → Local object URL for immediate preview
3. **Payment completed** → Image uploaded to Supabase Storage
4. **Database updated** → Banner record created with storage URL
5. **Image accessible** → Public URL for display

### File Structure

```
sponsored-banners/
├── banners/
│   ├── 1703123456789-abc123.jpg
│   ├── 1703123456790-def456.png
│   └── ...
```

### Storage Features

- ✅ **File validation** (type, size)
- ✅ **Unique filenames** (timestamp + random)
- ✅ **Public access** (no authentication needed)
- ✅ **Automatic cleanup** (when banner deleted)
- ✅ **Error handling** (upload failures)

## 🛠️ Configuration

### File Limits
- **Max size**: 5MB
- **Allowed types**: JPEG, PNG, GIF, WebP
- **Storage path**: `sponsored-banners/banners/`

### RLS Policies
- **Upload**: Anyone can upload
- **View**: Anyone can view
- **Update**: Anyone can update
- **Delete**: Anyone can delete

## 🧪 Testing

1. **Upload test**: Try uploading an image through the sponsor page
2. **View test**: Check if the image displays correctly
3. **Delete test**: Delete a banner and verify image is removed

## 🔍 Troubleshooting

### Common Issues

1. **"Bucket not found"**
   - Run the storage setup SQL script
   - Check bucket name is exactly `sponsored-banners`

2. **"Permission denied"**
   - Verify RLS policies are set correctly
   - Check bucket is set to public

3. **"File too large"**
   - Check file size (must be < 5MB)
   - Verify file size limit in bucket settings

4. **"Invalid file type"**
   - Only JPEG, PNG, GIF, WebP allowed
   - Check file extension and MIME type

### Debug Steps

1. Check Supabase logs for storage errors
2. Verify bucket permissions in Storage settings
3. Test with a small image first
4. Check browser console for JavaScript errors

## 📁 Files Modified

- `src/lib/storage.ts` - Storage utility functions
- `src/pages/SponsorCountryPage.tsx` - Image upload integration
- `src/pages/admin/AdminSponsoredBanners.tsx` - Image deletion
- `database/setup_storage_bucket.sql` - Storage setup script

## ✅ Success Indicators

- Images upload successfully to storage
- Images display correctly on country pages
- Images are deleted when banners are removed
- No console errors during upload/display
- File validation works (type, size limits)

Your sponsored banner system now has full image storage capabilities! 🎉
