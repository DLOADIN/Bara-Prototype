# Business Categorization Setup Guide

This guide helps you ensure that all businesses in your Bara App database are properly categorized and that category-based queries work correctly.

## 🎯 Overview

The Bara App uses a category-based system to organize businesses. Each business must be assigned to a specific category (like "Restaurants", "Hotels", "Banks", etc.) to appear in the correct listings when users browse by category.

## 📋 Prerequisites

Before running these scripts, ensure you have:

1. **Database Access**: Access to your Supabase SQL editor
2. **Sample Data**: The database should have sample businesses and categories
3. **Backup**: Consider backing up your data before making changes

## 🚀 Quick Setup

### Step 1: Run the Verification Script

First, run the verification script to check the current state of your categorization:

```sql
-- In your Supabase SQL editor, run:
\i database/verify-categorization.sql
```

This script will:
- ✅ Check if all expected categories exist
- ✅ Identify uncategorized businesses
- ✅ Show business counts by category
- ✅ Auto-categorize businesses based on their names
- ✅ Create performance indexes

### Step 2: Run the Test Script

After running the verification script, test that everything works:

```sql
-- In your Supabase SQL editor, run:
\i database/test-categorization.sql
```

This script will:
- ✅ Test category-based queries
- ✅ Verify city-specific category queries
- ✅ Check search functionality
- ✅ Validate data integrity
- ✅ Provide a summary report

## 📊 Expected Results

After running the scripts, you should see:

### Categories
- **20+ active categories** including:
  - Restaurants
  - Hotels
  - Banks
  - Hospitals
  - Schools
  - Shopping
  - Dentists
  - Auto Repair
  - Lawyers
  - Pharmacies
  - Museums
  - Coffee Shops
  - Gyms & Fitness
  - Beauty Salons
  - Pet Services
  - Airports
  - Bars
  - Clinics
  - Real Estate
  - Transportation

### Businesses
- **All active businesses should be categorized**
- **0 uncategorized businesses**
- **Proper distribution across categories**

## 🔧 Manual Categorization

If you need to manually categorize businesses, use these queries:

### Assign a Business to a Category

```sql
-- Replace with actual IDs
UPDATE public.businesses 
SET category_id = (SELECT id FROM public.categories WHERE slug = 'restaurants')
WHERE id = 'your-business-id';
```

### Bulk Categorize by Name Pattern

```sql
-- Example: Categorize all businesses with "restaurant" in the name
UPDATE public.businesses 
SET category_id = (SELECT id FROM public.categories WHERE slug = 'restaurants')
WHERE category_id IS NULL 
AND status = 'active'
AND LOWER(name) LIKE '%restaurant%';
```

## 🧪 Testing Your Setup

### Test Category Queries

Test that businesses appear in the correct categories:

```sql
-- Test restaurants
SELECT b.name, c.name as category 
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
WHERE c.slug = 'restaurants' AND b.status = 'active';

-- Test hotels
SELECT b.name, c.name as category 
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
WHERE c.slug = 'hotels' AND b.status = 'active';
```

### Test City-Specific Queries

Test that city filtering works with categories:

```sql
-- Test restaurants in Kigali
SELECT b.name, c.name as category, ci.name as city
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
JOIN public.cities ci ON b.city_id = ci.id
WHERE c.slug = 'restaurants' 
AND ci.name = 'Kigali'
AND b.status = 'active';
```

## 🐛 Troubleshooting

### Common Issues

#### 1. No Businesses Found in Categories

**Problem**: Categories show 0 businesses
**Solution**: 
```sql
-- Check if businesses exist
SELECT COUNT(*) FROM public.businesses WHERE status = 'active';

-- Check if categories exist
SELECT COUNT(*) FROM public.categories WHERE is_active = true;

-- Check for uncategorized businesses
SELECT COUNT(*) FROM public.businesses 
WHERE category_id IS NULL AND status = 'active';
```

#### 2. Invalid Category References

**Problem**: Businesses reference non-existent categories
**Solution**:
```sql
-- Find invalid references
SELECT b.id, b.name, b.category_id
FROM public.businesses b
LEFT JOIN public.categories c ON b.category_id = c.id
WHERE b.category_id IS NOT NULL AND c.id IS NULL;

-- Fix by setting category_id to NULL
UPDATE public.businesses 
SET category_id = NULL
WHERE category_id NOT IN (SELECT id FROM public.categories);
```

#### 3. Performance Issues

**Problem**: Category queries are slow
**Solution**:
```sql
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_category_status 
ON public.businesses(category_id, status);

CREATE INDEX IF NOT EXISTS idx_categories_slug_active 
ON public.categories(slug, is_active);
```

### Debug Queries

Use these queries to debug issues:

```sql
-- Check category distribution
SELECT 
    c.name,
    COUNT(b.id) as business_count
FROM public.categories c
LEFT JOIN public.businesses b ON c.id = b.category_id AND b.status = 'active'
WHERE c.is_active = true
GROUP BY c.id, c.name
ORDER BY business_count DESC;

-- Check for orphaned businesses
SELECT 
    b.name,
    b.category_id,
    c.name as category_name
FROM public.businesses b
LEFT JOIN public.categories c ON b.category_id = c.id
WHERE b.status = 'active' AND (b.category_id IS NULL OR c.id IS NULL);
```

## 📱 Frontend Integration

### CategoryGrid Component

The `CategoryGrid` component should now display all categories with proper business counts:

```typescript
// The component will automatically fetch categories
const { data: categories } = useQuery({
  queryKey: ['categories'],
  queryFn: () => db.categories().select('*').eq('is_active', true)
});
```

### ListingsPage Component

The `ListingsPage` component should now properly filter businesses by category:

```typescript
// This should now work correctly
const { data: businesses } = useBusinessesByCategory(categorySlug, citySlug);
```

## 🔄 Maintenance

### Regular Checks

Run these queries periodically to ensure data integrity:

```sql
-- Monthly check for uncategorized businesses
SELECT COUNT(*) as uncategorized_count
FROM public.businesses 
WHERE category_id IS NULL AND status = 'active';

-- Monthly check for category distribution
SELECT 
    c.name,
    COUNT(b.id) as business_count
FROM public.categories c
LEFT JOIN public.businesses b ON c.id = b.category_id AND b.status = 'active'
WHERE c.is_active = true
GROUP BY c.id, c.name
ORDER BY business_count DESC;
```

### Adding New Categories

To add new categories:

```sql
INSERT INTO public.categories (name, slug, icon, description, sort_order) 
VALUES ('New Category', 'new-category', 'icon-name', 'Description', 50);
```

## 📞 Support

If you encounter issues:

1. **Check the console logs** in your browser for error messages
2. **Run the test scripts** to identify specific problems
3. **Verify database connections** and permissions
4. **Check that all required tables exist** and have the correct structure

## ✅ Success Criteria

Your categorization is working correctly when:

- ✅ All active businesses have a valid category_id
- ✅ Category-based queries return expected results
- ✅ City-specific category queries work
- ✅ Search functionality includes category filtering
- ✅ CategoryGrid shows all categories with business counts
- ✅ ListingsPage displays businesses for each category

---

**Note**: This setup ensures that users can easily navigate your business directory using the category system, making it much easier to find specific types of businesses in their area.
