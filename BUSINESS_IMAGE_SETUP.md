# 🏢 Business Image Storage Setup Guide

This guide will help you set up proper image storage for the admin business management system.

## 📋 Prerequisites

- Supabase project with storage enabled
- Admin access to your Supabase dashboard
- Storage buckets for sponsored banners already set up

## 🚀 Setup Steps

### 1. Run Storage Setup SQL

Run the `database/setup_business_storage_buckets.sql` script in your Supabase SQL Editor:

```sql
-- This will create two new buckets:
-- - business-images (for business photos)
-- - business-logos (for business logos)
-- Copy and paste the entire content of setup_business_storage_buckets.sql
```

### 2. Verify Storage Buckets

1. Go to **Storage** in your Supabase Dashboard
2. You should see three buckets:
   - `sponsored-banners` (for sponsored banner images)
   - `business-images` (for business photos)
   - `business-logos` (for business logos)
3. All buckets should be **Public** with **5MB** file size limit

## 🔧 How It Works

### Image Upload Process for Admin

1. **Admin selects images** → File validation (type, size)
2. **Preview shown** → Local object URL for immediate display
3. **Form submitted** → Images uploaded to appropriate storage buckets
4. **Database updated** → Business record with storage URLs
5. **Images accessible** → Public URLs for display

### File Structure

```
business-images/
├── businesses/
│   ├── 1703123456789-abc123.jpg
│   ├── 1703123456790-def456.png
│   └── ...

business-logos/
├── logos/
│   ├── 1703123456789-xyz789.jpg
│   ├── 1703123456790-uvw012.png
│   └── ...
```

### Storage Features

- ✅ **File validation** (JPEG, PNG, GIF, WebP only)
- ✅ **Size limits** (5MB per file)
- ✅ **Unique filenames** (timestamp + random)
- ✅ **Public access** (no authentication needed)
- ✅ **Multiple images** (business can have multiple photos)
- ✅ **Logo support** (separate bucket for logos)
- ✅ **Error handling** (upload failures)

## 🛠️ Configuration

### File Limits
- **Max size**: 5MB per file
- **Allowed types**: JPEG, PNG, GIF, WebP
- **Business images**: `business-images/businesses/`
- **Business logos**: `business-logos/logos/`

### RLS Policies
- **Upload**: Anyone can upload
- **View**: Anyone can view
- **Update**: Anyone can update
- **Delete**: Anyone can delete

## 🧪 Testing

### Test Admin Image Upload

1. **Go to Admin Panel** → Businesses
2. **Click "Add New Business"**
3. **Upload images**:
   - Select multiple business photos
   - Upload a business logo
4. **Fill form** and submit
5. **Verify**:
   - Images appear in storage buckets
   - Business record has correct image URLs
   - Images display correctly in business listing

### Test Image Editing

1. **Edit existing business**
2. **Add new images** to existing business
3. **Verify**:
   - New images are uploaded
   - Existing images are preserved
   - Combined image list is correct

## 🔍 Troubleshooting

### Common Issues

1. **"Bucket not found"**
   - Run the storage setup SQL script
   - Check bucket names are exactly `business-images` and `business-logos`

2. **"Permission denied"**
   - Verify RLS policies are set correctly
   - Check buckets are set to public

3. **"File too large"**
   - Check file size (must be < 5MB)
   - Verify file size limit in bucket settings

4. **"Invalid file type"**
   - Only JPEG, PNG, GIF, WebP allowed
   - Check file extension and MIME type

5. **"Images not displaying"**
   - Check if URLs are correct
   - Verify images are in public buckets
   - Check browser console for errors

### Debug Steps

1. Check Supabase logs for storage errors
2. Verify bucket permissions in Storage settings
3. Test with a small image first
4. Check browser console for JavaScript errors
5. Verify image URLs in database records

## 📁 Files Modified

- `src/pages/admin/AdminBusinesses.tsx` - Image upload integration
- `src/lib/storage.ts` - Storage utility functions (already exists)
- `database/setup_business_storage_buckets.sql` - Storage setup script

## ✅ Success Indicators

- Images upload successfully to storage buckets
- Images display correctly in business listings
- Multiple images can be uploaded per business
- Logo upload works separately
- File validation works (type, size limits)
- No console errors during upload/display

## 🎯 Key Features

### For Admins
- **Multiple image upload** per business
- **Logo upload** (separate from images)
- **File validation** (type and size)
- **Preview system** (immediate display)
- **Error handling** (clear error messages)

### For Users
- **Fast loading** (images served from CDN)
- **High quality** (original images preserved)
- **Responsive** (images scale properly)
- **Reliable** (Supabase storage infrastructure)

Your admin business management system now has full image storage capabilities! 🎉

## 📝 Notes

- Images are stored permanently until manually deleted
- No automatic cleanup (images persist even if business is deleted)
- Consider implementing cleanup logic for deleted businesses
- Monitor storage usage as it grows
