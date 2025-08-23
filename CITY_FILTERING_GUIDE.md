# City Filtering Functionality - Implementation Guide

## 🎯 Overview

I've enhanced the Bara App with intelligent city filtering functionality that allows users to:

1. **See cities with businesses in the current category** - When browsing a category, users can see which cities have businesses in that category
2. **Filter by specific cities** - Users can select a city to see only businesses from that location
3. **View business counts per city** - Each city shows how many businesses it has in the selected category
4. **Clear city filters** - Users can easily return to viewing all businesses

## 🚀 How It Works

### 1. **Smart City Dropdown**

When users visit a category page (e.g., `/category/restaurants`), the city dropdown now shows:

- **Cities with businesses in this category** - Listed first with business counts
- **All cities** - Listed below for complete coverage
- **Clear filter option** - "Show all cities" to remove city filter

### 2. **Business Count Display**

The city dropdown shows:
- City name and country
- Number of businesses in that category
- Visual badges for easy scanning

### 3. **Dynamic Filtering**

- **No city selected**: Shows all businesses in the category
- **City selected**: Shows only businesses from that city in the category
- **Real-time updates**: Business count updates immediately when city is selected

## 📁 Files Modified

### Backend Changes
1. **`src/lib/businessService.ts`** - Added new methods:
   - `getCitiesByCategory()` - Get cities with businesses in a category
   - `getCategoryStats()` - Get comprehensive category statistics

2. **`src/hooks/useBusinesses.ts`** - Added new hooks:
   - `useCitiesByCategory()` - Hook for fetching cities by category
   - `useCategoryStats()` - Hook for category statistics

### Frontend Changes
1. **`src/pages/ListingsPage.tsx`** - Enhanced with:
   - Smart city dropdown with business counts
   - Category summary cards
   - City-specific filtering
   - Visual indicators for selected cities

## 🔧 Technical Implementation

### Database Queries

The system uses optimized queries to get cities with businesses in specific categories:

```sql
-- Get cities with businesses in a category
SELECT 
    c.name as city_name,
    co.name as country_name,
    COUNT(b.id) as business_count
FROM public.cities c
JOIN public.countries co ON c.country_id = co.id
JOIN public.businesses b ON c.id = b.city_id
JOIN public.categories cat ON b.category_id = cat.id
WHERE cat.slug = 'restaurants' 
AND b.status = 'active'
GROUP BY c.id, c.name, co.name
ORDER BY business_count DESC;
```

### Service Methods

#### `getCitiesByCategory(categorySlug)`
Returns cities that have businesses in the specified category:

```typescript
interface CityWithBusinesses {
  city_id: string;
  city_name: string;
  country_name: string;
  business_count: number;
}
```

#### `getCategoryStats(categorySlug)`
Returns comprehensive statistics for a category:

```typescript
interface CategoryStats {
  total_businesses: number;
  cities_count: number;
  premium_count: number;
  verified_count: number;
  cities: CityWithBusinesses[];
}
```

## 🎨 User Interface Features

### 1. **Enhanced City Dropdown**

```
┌─────────────────────────────────────┐
│ 🗺️  Select a City                   ▼ │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Cities with Restaurant businesses   │
│ ─────────────────────────────────── │
│ ✓ Show all cities                   │
│ ─────────────────────────────────── │
│ Kigali, Rwanda          [5]         │
│ Nairobi, Kenya          [3]         │
│ Kampala, Uganda         [2]         │
│ ─────────────────────────────────── │
│ All cities                          │
│ ─────────────────────────────────── │
│ Accra, Ghana                        │
│ Cairo, Egypt                        │
└─────────────────────────────────────┘
```

### 2. **Category Summary Cards**

#### When No City Selected:
```
┌─────────────────────────────────────┐
│ 🍽️  Restaurants Available in 8 Cities │
│ Select a city above to see businesses│
│ in that location, or browse all 25  │
│ businesses below.                    │
│                                     │
│                              [25]   │
│                         Total       │
└─────────────────────────────────────┘
```

#### When City Selected:
```
┌─────────────────────────────────────┐
│ 🍽️  Restaurants in Kigali           │
│ Showing 5 businesses in Kigali      │
│                                     │
│                              [5]    │
│                         Businesses  │
└─────────────────────────────────────┘
```

## 🧪 Testing

### Test Script
Run the comprehensive test script to verify functionality:

```sql
\i database/test-city-filtering.sql
```

This script tests:
- ✅ Cities with businesses in each category
- ✅ City-specific category queries
- ✅ Business count accuracy
- ✅ Performance of city filtering
- ✅ Edge cases and data integrity

### Manual Testing

1. **Visit a category page** (e.g., `/category/restaurants`)
2. **Check the city dropdown** - Should show cities with business counts
3. **Select a city** - Should filter to show only businesses from that city
4. **Clear the filter** - Should show all businesses again
5. **Verify business counts** - Should match the actual number of businesses

## 📊 Example Usage

### Scenario 1: Browsing Restaurants
1. User visits `/category/restaurants`
2. Sees "Restaurants Available in 8 Cities" summary
3. Opens city dropdown, sees:
   - Kigali (5 businesses)
   - Nairobi (3 businesses)
   - Kampala (2 businesses)
4. Selects "Kigali"
5. Sees "Restaurants in Kigali" with 5 businesses listed

### Scenario 2: Browsing Hotels
1. User visits `/category/hotels`
2. Sees "Hotels Available in 6 Cities" summary
3. Opens city dropdown, sees:
   - Nairobi (4 businesses)
   - Kigali (2 businesses)
   - Cairo (3 businesses)
4. Selects "Nairobi"
5. Sees "Hotels in Nairobi" with 4 businesses listed

## 🔍 Performance Optimizations

### Database Indexes
The system uses optimized indexes for fast city filtering:

```sql
-- Index for category-based queries
CREATE INDEX idx_businesses_category_status ON public.businesses(category_id, status);

-- Index for city-based queries
CREATE INDEX idx_businesses_city_status ON public.businesses(city_id, status);

-- Index for category slug lookups
CREATE INDEX idx_categories_slug_active ON public.categories(slug, is_active);
```

### Query Optimization
- Uses efficient JOINs instead of subqueries
- Groups results at the database level
- Sorts by business count for better UX
- Caches results with React Query

## 🐛 Troubleshooting

### Common Issues

#### 1. **No cities showing in dropdown**
**Solution**: Check that businesses have valid `city_id` values
```sql
SELECT COUNT(*) FROM public.businesses 
WHERE city_id IS NULL AND status = 'active';
```

#### 2. **Incorrect business counts**
**Solution**: Verify category assignments
```sql
SELECT c.name, COUNT(b.id) 
FROM public.categories c
LEFT JOIN public.businesses b ON c.id = b.category_id AND b.status = 'active'
WHERE c.slug = 'restaurants'
GROUP BY c.id, c.name;
```

#### 3. **Slow city filtering**
**Solution**: Check that indexes are created
```sql
SELECT indexname FROM pg_indexes 
WHERE tablename = 'businesses' 
AND indexname LIKE '%category%' OR indexname LIKE '%city%';
```

### Debug Queries

```sql
-- Check cities with businesses in restaurants category
SELECT 
    c.name as city_name,
    COUNT(b.id) as business_count
FROM public.cities c
JOIN public.businesses b ON c.id = b.city_id
JOIN public.categories cat ON b.category_id = cat.id
WHERE cat.slug = 'restaurants' 
AND b.status = 'active'
GROUP BY c.id, c.name
ORDER BY business_count DESC;

-- Check business distribution across cities
SELECT 
    c.name as city_name,
    cat.name as category_name,
    COUNT(b.id) as business_count
FROM public.cities c
JOIN public.businesses b ON c.id = b.city_id
JOIN public.categories cat ON b.category_id = cat.id
WHERE b.status = 'active'
GROUP BY c.id, c.name, cat.id, cat.name
ORDER BY c.name, business_count DESC;
```

## ✅ Success Criteria

The city filtering functionality is working correctly when:

- ✅ City dropdown shows cities with business counts
- ✅ Selecting a city filters businesses correctly
- ✅ Business counts are accurate
- ✅ Clear filter option works
- ✅ Performance is fast (< 500ms for city queries)
- ✅ UI is intuitive and responsive

## 🎉 Benefits

With this city filtering system:

1. **Better User Experience** - Users can easily find businesses in their preferred cities
2. **Reduced Information Overload** - Filtering by city reduces the number of results
3. **Improved Discovery** - Users can see which cities have businesses in their category
4. **Enhanced Navigation** - Clear visual indicators show business availability
5. **Scalable Design** - Works efficiently even with thousands of businesses

## 📞 Next Steps

1. **Test the functionality** using the provided test script
2. **Verify frontend integration** by browsing categories and cities
3. **Monitor performance** and optimize if needed
4. **Add more cities and businesses** to expand coverage
5. **Consider adding proximity filtering** for nearby cities

The city filtering system is now ready to provide users with a much more targeted and useful browsing experience!
