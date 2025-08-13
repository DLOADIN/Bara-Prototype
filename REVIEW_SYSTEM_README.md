# Bara App Review System

## 🎯 Overview

The Bara App now includes a comprehensive review system that allows users to search for businesses and submit reviews. The system is fully integrated with the database schema and supports multi-language functionality.

## 🚀 Features

### ✅ **Business Search**
- Real-time search functionality
- Search by business name
- Filter by location
- Display business details (category, address, phone, website)
- Premium and verified business indicators

### ✅ **Review Submission**
- Interactive star rating system (1-5 stars)
- Review title (max 100 characters)
- Review content (max 1000 characters)
- Form validation
- User authentication required
- Review moderation system

### ✅ **Database Integration**
- Full integration with Supabase database
- Proper foreign key relationships
- Review status tracking (pending/approved/rejected)
- User authentication integration

### ✅ **Multi-language Support**
- Complete translation support for English, French, Spanish, and Swahili
- Dynamic language switching
- Localized error messages and UI text

## 🗄️ Database Schema

### **Reviews Table**
```sql
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT,
    content TEXT,
    images TEXT[],
    status review_status DEFAULT 'pending',
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, user_id)
);
```

### **Businesses Table**
```sql
CREATE TABLE public.businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category_id UUID REFERENCES public.categories(id),
    city_id UUID REFERENCES public.cities(id),
    country_id UUID REFERENCES public.countries(id),
    phone TEXT,
    email TEXT,
    website TEXT,
    address TEXT,
    status business_status DEFAULT 'pending',
    is_premium BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🛠️ Setup Instructions

### 1. **Database Setup**
```bash
# Run the schema file
psql -d your_database -f database/schema.sql

# Populate with sample data
psql -d your_database -f database/sample-data.sql
```

### 2. **Environment Variables**
Make sure you have the following environment variables set:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. **Install Dependencies**
```bash
npm install
```

### 4. **Start Development Server**
```bash
npm run dev
```

## 📱 How to Use

### **For Users:**

1. **Navigate to Write Review Page**
   - Click "Write a Review" in the navigation
   - Or visit `/writeareview`

2. **Search for a Business**
   - Enter business name in the search field
   - Optionally specify location
   - Click "FIND" or press Enter

3. **Select a Business**
   - Browse search results
   - Click on the business you want to review
   - Verify business details

4. **Write Your Review**
   - Rate the business (1-5 stars)
   - Write a review title (max 100 characters)
   - Write detailed review content (max 1000 characters)
   - Click "Submit Review"

5. **Review Submission**
   - Must be logged in to submit
   - Reviews are moderated before publication
   - Receive confirmation message

### **For Developers:**

#### **Adding New Translation Keys**
```json
// src/locales/en.json
{
  "reviews": {
    "newKey": "New translation text"
  }
}
```

#### **Customizing Review Form**
```tsx
// Modify the ReviewForm interface in WriteReviewPage.tsx
interface ReviewForm {
  business_id: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  // Add new fields here
}
```

#### **Adding New Business Fields**
```sql
-- Add new columns to businesses table
ALTER TABLE public.businesses 
ADD COLUMN new_field TEXT;
```

## 🔧 API Endpoints

### **Search Businesses**
```typescript
const { data, error } = await db.businesses()
  .select(`
    *,
    category:categories(name, slug),
    city:cities(name)
  `)
  .ilike('name', `%${searchTerm}%`)
  .eq('status', 'active')
  .limit(10);
```

### **Submit Review**
```typescript
const { error } = await db.reviews().insert({
  business_id: reviewForm.business_id,
  user_id: user.id,
  rating: reviewForm.rating,
  title: reviewForm.title,
  content: reviewForm.content,
  images: reviewForm.images,
  status: 'pending'
});
```

## 🎨 UI Components

### **Search Form**
- Business name input with search icon
- Location input with map pin icon
- Search button with loading state

### **Search Results**
- Business cards with hover effects
- Category badges
- Premium/verified indicators
- Business details (address, phone, website)

### **Review Form**
- Interactive star rating system
- Character counters
- Form validation
- Submit button with loading state

## 🌍 Internationalization

The review system supports multiple languages:

- **English** (`en`)
- **French** (`fr`)
- **Spanish** (`es`)
- **Swahili** (`sw`)

All user-facing text is translatable through the i18n system.

## 🔒 Security Features

- **User Authentication Required**: Users must be logged in to submit reviews
- **Form Validation**: Client-side and server-side validation
- **Rate Limiting**: One review per user per business
- **Content Moderation**: Reviews are marked as pending before approval
- **SQL Injection Protection**: Using Supabase's parameterized queries

## 📊 Sample Data

The system includes sample data for testing:

- **8 Countries** (Rwanda, Kenya, Uganda, Tanzania, Ethiopia, Ghana, Nigeria, Botswana)
- **8 Cities** (Kigali, Nairobi, Kampala, Dar es Salaam, Addis Ababa, Accra, Lagos, Gaborone)
- **10 Categories** (Restaurants, Dentists, Auto Repair, Lawyers, Hotels, Banks, Pharmacies, Schools, Hospitals, Shopping)
- **21 Sample Businesses** across different categories
- **5 Sample Reviews** for testing

## 🚨 Error Handling

The system includes comprehensive error handling:

- **Search Errors**: Network issues, invalid queries
- **Validation Errors**: Missing required fields, invalid data
- **Authentication Errors**: User not logged in
- **Submission Errors**: Database errors, network issues

All errors are displayed to users with appropriate messages and suggestions.

## 🔄 Future Enhancements

### **Planned Features:**
- [ ] Image upload for reviews
- [ ] Review helpful/unhelpful voting
- [ ] Review editing and deletion
- [ ] Business owner responses to reviews
- [ ] Review analytics and reporting
- [ ] Email notifications for review status
- [ ] Review moderation dashboard
- [ ] Review sentiment analysis

### **Technical Improvements:**
- [ ] Review caching for better performance
- [ ] Review search and filtering
- [ ] Review export functionality
- [ ] Review API rate limiting
- [ ] Review spam detection

## 📝 Contributing

When contributing to the review system:

1. **Follow the existing code structure**
2. **Add translations for new text**
3. **Include proper error handling**
4. **Add TypeScript types for new features**
5. **Test with sample data**
6. **Update this documentation**

## 🐛 Troubleshooting

### **Common Issues:**

1. **Search not working**
   - Check database connection
   - Verify business data exists
   - Check console for errors

2. **Review submission fails**
   - Ensure user is logged in
   - Check form validation
   - Verify database permissions

3. **Translations not showing**
   - Check i18n configuration
   - Verify translation keys exist
   - Clear browser cache

### **Debug Mode:**
Enable debug mode in `src/lib/i18n.ts`:
```typescript
debug: true
```

## 📞 Support

For issues or questions about the review system:

1. Check the console for error messages
2. Review the database logs
3. Verify environment variables
4. Test with sample data
5. Check the Supabase dashboard

---

**Ready to help users share their experiences and build trust in the Bara community! 🚀** 