# Database Setup for Bara App

## Ensuring All Categories Are Displayed

To make sure all categories are properly shown in the CategoryGrid component, follow these steps:

### 1. Run the Comprehensive Seed Data

First, run the main seed data file:
```sql
-- In your Supabase SQL editor, run:
\i database/comprehensive-seed-data.sql
```

### 2. Ensure All Categories Are Present

Run the ensure-all-categories script to guarantee all categories are available:
```sql
-- In your Supabase SQL editor, run:
\i database/ensure-all-categories.sql
```

### 3. Verify Categories Are Loaded

Check that all categories are present:
```sql
-- Count total categories
SELECT COUNT(*) as total_categories FROM public.categories WHERE is_active = true;

-- View all categories with their slugs
SELECT slug, name, sort_order FROM public.categories WHERE is_active = true ORDER BY sort_order;
```

### 4. Expected Categories

The following 20+ categories should be available:

**Core Categories (shown in image):**
1. Restaurants
2. Hotels  
3. Banks
4. Hospitals
5. Schools
6. Shopping
7. Dentists
8. Auto Repair
9. Lawyers
10. Pharmacies
11. Museums
12. Coffee Shops
13. Gyms & Fitness
14. Beauty Salons
15. Pet Services
16. Airports
17. Bars
18. Clinics
19. Real Estate
20. Transportation

**Additional Categories:**
21. Bookstores
22. Cafes
23. Cinemas & Theatres
24. Clubs (Professional)
25. Clubs (Leisure)
26. Doctors
27. Faith
28. Farms
29. Galleries (Art)
30. Government
31. Libraries
32. Markets
33. Parks
34. Post Offices
35. Recreation
36. Salons
37. Services
38. Tours
39. Universities
40. Utilities

### 5. Troubleshooting

If categories are still not showing:

1. **Check Database Connection**: Ensure your Supabase connection is working
2. **Verify RLS Policies**: Make sure Row Level Security allows reading categories
3. **Check Console Logs**: Look for debug information in browser console
4. **Verify Category Status**: Ensure all categories have `is_active = true`

### 6. RLS Policy for Categories

Make sure this policy exists:
```sql
-- Allow public read access to active categories
CREATE POLICY "Allow public read access to active categories"
ON public.categories FOR SELECT
TO public
USING (is_active = true);
```

### 7. Testing

After running the scripts:
1. Refresh your app
2. Check browser console for debug logs
3. Verify categories are displayed in the grid
4. Test the "View More" functionality

The CategoryGrid component should now display all categories with proper names, icons, and smooth animations! 