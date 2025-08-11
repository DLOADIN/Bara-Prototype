# SUPABASE SETUP FOR BARA APP

## 🚀 Quick Setup Guide

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `Bara-Listings`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your target users (e.g., `West Europe` for Africa)
6. Click "Create new project"

### 2. Get Project Credentials

Once your project is created, go to **Settings > API** and copy:
- **Project URL**: `https://your-project-id.supabase.co`
- **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Keep this secret!)

### 3. Run Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `database/schema.sql`
3. Click "Run" to create all tables and indexes

### 4. Apply RLS Policies

1. In the same SQL Editor, copy and paste the contents of `database/rls_policies.sql`
2. Click "Run" to apply all Row Level Security policies

### 5. Seed Initial Data

1. Copy and paste the contents of `database/seed_data.sql`
2. Click "Run" to populate the database with initial data

### 6. Configure Authentication

1. Go to **Authentication > Settings**
2. Configure your site URL: `http://localhost:8080` (for development)
3. Add redirect URLs:
   - `http://localhost:8080/auth/callback`
   - `http://localhost:8080/dashboard`
   - `http://localhost:8080/profile`

### 7. Set Up Storage (Optional)

1. Go to **Storage**
2. Create a new bucket called `business-images`
3. Set it to public
4. Create another bucket called `user-avatars`
5. Set it to authenticated users only

## 🔧 Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service Role Key (for admin functions)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
VITE_APP_NAME=Bara
VITE_APP_URL=http://localhost:8080
```

## 📱 Supabase Client Setup

Install the Supabase client:

```bash
npm install @supabase/supabase-js
```

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 🔐 Authentication Setup

### Enable Auth Providers

1. Go to **Authentication > Providers**
2. Enable the providers you want:
   - **Email**: Enable email/password signup
   - **Google**: Add Google OAuth credentials
   - **Facebook**: Add Facebook OAuth credentials
   - **Phone**: Enable phone number authentication

### Email Templates

1. Go to **Authentication > Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link
   - Change email address

## 🛡️ Security Configuration

### RLS Policies Summary

The RLS policies ensure:

- **Public Read Access**: Anyone can view active businesses, categories, countries, cities
- **User-Specific Access**: Users can only modify their own data
- **Business Owner Access**: Business owners can manage their own businesses
- **Admin Access**: Admins have full access to all data
- **Review Moderation**: Reviews are moderated before public display

### API Security

- All tables have RLS enabled
- Users can only access data they're authorized to see
- Business owners can only manage their own businesses
- Admins have full access through service role key

## 📊 Database Structure Overview

### Core Tables

1. **users** - User profiles and authentication
2. **countries** - Country information and metadata
3. **cities** - City data with coordinates
4. **categories** - Business categories
5. **businesses** - Business listings and details
6. **reviews** - User reviews and ratings
7. **premium_features** - Premium business features
8. **payments** - Payment transactions
9. **events** - Event listings
10. **products** - Marketplace products

### Key Features

- **Full-text Search**: Businesses, products, and events are searchable
- **Geolocation**: Cities have coordinates for mapping
- **Analytics**: View and click tracking for businesses
- **Premium Features**: Support for paid business features
- **Multi-language**: Support for English, French, Swahili

## 🚨 Important Notes

### Performance

- All tables have appropriate indexes
- Full-text search is optimized with GIN indexes
- Geolocation queries are optimized

### Scalability

- UUID primary keys for better distribution
- JSONB fields for flexible data storage
- Proper foreign key relationships

### Security

- RLS policies prevent unauthorized access
- User authentication is handled by Supabase Auth
- Sensitive operations require admin privileges

## 🔄 Database Migrations

For future updates, create migration files:

```sql
-- migration_001_add_new_feature.sql
ALTER TABLE public.businesses ADD COLUMN new_feature TEXT;
```

## 📈 Monitoring

1. Go to **Dashboard** to monitor:
   - Database performance
   - API usage
   - Authentication metrics
   - Storage usage

2. Set up alerts for:
   - High API usage
   - Database errors
   - Authentication failures

## 🆘 Troubleshooting

### Common Issues

1. **RLS Blocking Queries**: Check if user is authenticated and has proper permissions
2. **Foreign Key Errors**: Ensure referenced data exists before inserting
3. **Performance Issues**: Check if indexes are being used properly

### Debug Queries

```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY tablename, attname;
```

## 🎯 Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database schema
3. ✅ Apply RLS policies
4. ✅ Seed initial data
5. 🔄 Configure authentication
6. 🔄 Set up storage buckets
7. 🔄 Test API endpoints
8. 🔄 Integrate with React app

---

**Ready to build the Bara app! 🚀** 