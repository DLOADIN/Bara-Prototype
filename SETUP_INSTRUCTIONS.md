# 🚀 Complete Events System Setup Instructions

## Step 1: Database Migration

### 1.1 Run the SQL Migration
1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Go to the SQL Editor

2. **Execute the Migration**
   - Copy the entire contents of `database/migrations/events_enhancement_v2.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

   This will create:
   - Enhanced events table with all required fields (NO PAYMENT FIELDS)
   - Event categories table
   - Event tickets table (FREE TICKETS ONLY)
   - Universal RLS policies (anyone can do any CRUD operation)
   - Supabase storage bucket for event images
   - Search functions and indexes
   - Sample data

### 1.2 Verify Storage Bucket
After running the migration, check that the `event-images` bucket was created:
- Go to Storage in your Supabase dashboard
- You should see an `event-images` bucket
- It should be set to public access

## Step 2: Environment Variables

Make sure your `.env` file has the required Supabase variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Install Dependencies

Run these commands to install required dependencies:

```bash
npm install @supabase/supabase-js @tanstack/react-query
```

## Step 4: File Structure

The following files have been created/updated:

### New Files Created:
- `database/migrations/events_enhancement_v2.sql` - Database migration
- `src/lib/eventsService.ts` - Events API service with Supabase storage
- `src/hooks/useEvents.ts` - React hooks for events management
- `src/pages/admin/AdminEventsEnhanced.tsx` - Enhanced admin interface
- `SETUP_INSTRUCTIONS.md` - This setup guide

### Updated Files:
- `src/pages/EventsPage.tsx` - Updated to use database service
- `src/components/EventCard.tsx` - Updated with new design
- `src/App.tsx` - Added admin events route
- `src/components/admin/AdminSidebar.tsx` - Added events menu item

## Step 5: Key Features Implemented

### ✅ Universal Database Access
- **RLS Policies**: Anyone can perform any CRUD operation on events
- **No Authentication Required**: Public access to all event operations
- **Universal Permissions**: Grant access to both `anon` and `authenticated` users

### ✅ Supabase Storage Integration
- **Event Images**: Stored in `event-images` bucket
- **Public Access**: Images are publicly accessible
- **Organized Storage**: Images stored by event ID for easy management
- **Upload Functions**: `uploadEventImage()`, `deleteEventImage()`, `getEventImageUrl()`

### ✅ No Payment Functionality
- **Free Events Only**: Removed all payment-related fields
- **Free Tickets**: All tickets are free with no pricing
- **No Payment Processing**: Completely removed payment integration
- **Registration Only**: Focus on event registration, not payment

### ✅ Enhanced Admin Interface
- **Image Upload**: Drag & drop with Supabase storage
- **Real-time Preview**: See images before upload
- **Progress Indicators**: Upload status feedback
- **Multiple Images**: Support for multiple event images
- **Free Ticket Management**: Create free ticket types

### ✅ Advanced Search & Filtering
- **Full-text Search**: Search across title, description, venue, organizer
- **Category Filtering**: Dynamic event categories
- **Date Range Filtering**: Filter by start/end dates
- **Country/City Filtering**: Location-based filtering
- **Real-time Results**: Instant search results

## Step 6: Testing the System

### 6.1 Test Admin Interface
1. Navigate to `/admin/events`
2. Click "Add Event"
3. Fill in event details
4. Upload an event image (should upload to Supabase storage)
5. Save the event

### 6.2 Test Public Events Page
1. Navigate to `/events`
2. Search for events
3. Filter by category, date, location
4. Click on an event to view details

### 6.3 Test Image Storage
1. Upload an image in admin
2. Check Supabase Storage dashboard
3. Verify image is stored in `event-images` bucket
4. Check that image displays correctly on events page

## Step 7: Database Schema Overview

### Events Table Fields:
- `id`, `title`, `description`
- `organizer_name`, `organizer_handle`, `organizer_email`, `organizer_phone`
- `venue_name`, `venue_address`, `venue_latitude`, `venue_longitude`
- `event_image_url`, `event_images` (array)
- `start_date`, `end_date`
- `category`, `event_status`, `is_public`, `is_featured`
- `capacity`, `registration_count`, `view_count`
- `website_url`, `facebook_url`, `twitter_url`, `instagram_url`
- `country_id`, `city_id`

### Event Categories Table:
- `id`, `name`, `slug`, `description`
- `icon`, `color`, `is_active`, `sort_order`

### Event Tickets Table:
- `id`, `event_id`, `name`, `description`
- `is_default`, `max_quantity`, `registered_quantity`
- `is_active` (NO PRICE FIELDS)

## Step 8: Troubleshooting

### Common Issues:

1. **Storage Bucket Not Created**
   - Check if the migration ran successfully
   - Manually create the `event-images` bucket in Supabase Storage
   - Set it to public access

2. **Image Upload Fails**
   - Check Supabase storage permissions
   - Verify the bucket exists and is public
   - Check browser console for errors

3. **Database Connection Issues**
   - Verify environment variables
   - Check Supabase project settings
   - Ensure RLS policies are correctly applied

4. **Events Not Loading**
   - Check if the migration created sample data
   - Verify RLS policies allow public access
   - Check browser network tab for API errors

## Step 9: Production Deployment

### 9.1 Environment Setup
- Set up production Supabase project
- Configure production environment variables
- Run the migration on production database

### 9.2 Storage Configuration
- Ensure `event-images` bucket is public
- Set up CDN if needed for better performance
- Configure storage policies for production

### 9.3 Performance Optimization
- Database indexes are already created
- Full-text search is optimized
- Image compression can be added if needed

## 🎉 You're Ready!

The events system is now fully functional with:
- ✅ Universal CRUD access (no authentication required)
- ✅ Supabase storage for event images
- ✅ Free events only (no payment functionality)
- ✅ Advanced search and filtering
- ✅ Admin interface with image upload
- ✅ Public events page with dark theme
- ✅ Country/city-based organization
- ✅ Dynamic event categories

The system is ready for production use!
