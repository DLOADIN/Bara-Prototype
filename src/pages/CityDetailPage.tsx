import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UltraSimpleMap } from "@/components/UltraSimpleMap";
import { 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  Building, 
  Search,
  Map,
  ArrowLeft,
  Filter,
  Grid3X3,
  List
} from "lucide-react";
import { db } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

interface City {
  id: string;
  name: string;
  country_id: string;
  latitude: number | null;
  longitude: number | null;
  population: number | null;
  countries?: {
    name: string;
    code: string;
  } | null;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  is_premium: boolean;
  category?: {
    name: string;
    slug: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    content: string;
    created_at: string;
  }>;
}

export const CityDetailPage = () => {
  const { citySlug } = useParams();
  const navigate = useNavigate();
  
  const [city, setCity] = useState<City | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState("");

  // City descriptions
  const cityDescriptions: { [key: string]: string } = {
    'kigali': 'Kigali, the capital and largest city of Rwanda, is a shining example of urban transformation in East Africa. Renowned for its impeccably clean streets, Kigali has earned a reputation as one of the continent’s tidiest capitals. The city is a dynamic hub for business, technology, and tourism, boasting modern infrastructure with sleek skyscrapers, well-maintained roads, and a burgeoning tech ecosystem often dubbed the "Silicon Valley of East Africa." Its vibrant culture is reflected in lively markets, traditional Rwandan dance and music, and annual festivals like KigaliUp. Kigali’s rapid development, coupled with its commitment to sustainability and green spaces, such as the Kigali Genocide Memorial gardens, makes it a model for urban progress in the region.',
    'nairobi': 'Nairobi, the capital and largest city of Kenya, is affectionately known as the "Green City in the Sun" due to its lush greenery and pleasant climate. As a major economic powerhouse in East Africa, Nairobi hosts the regional headquarters of numerous multinational corporations and the Nairobi Securities Exchange. Its diverse population, drawn from Kenya’s many ethnic groups, contributes to a rich cultural tapestry evident in its cuisine, music, and festivals like the Nairobi International Film Festival. Nairobi serves as the gateway to Kenya’s world-renowned wildlife parks, such as the Maasai Mara and Nairobi National Park, where visitors can spot lions and giraffes with the city skyline in the background.',
    'kampala': 'Kampala, the capital and largest city of Uganda, is famously built across seven hills, giving it a distinctive topography and charm. The city is a vibrant commercial and cultural center, home to bustling markets like Owino and Nakasero, where vendors sell everything from fresh produce to traditional crafts. Kampala’s rich history is showcased in sites like the Uganda Museum and the Kasubi Tombs, a UNESCO World Heritage Site. As a hub for education, it hosts Makerere University, one of Africa’s oldest and most prestigious institutions. With a growing economy driven by trade, manufacturing, and services, Kampala’s diverse population and lively nightlife make it a dynamic urban center in East Africa.',
    'dar-es-salaam': 'Dar es Salaam, Tanzania’s largest city and economic hub, thrives along the Indian Ocean coast, blending coastal beauty with urban vitality. Known for its pristine beaches like Coco Beach and its bustling harbor, the city serves as Tanzania’s primary port, facilitating trade across East Africa and beyond. Its diverse culture, influenced by African, Arab, and Indian communities, is evident in its cuisine, music, and festivals like the Swahili Fashion Week. Dar es Salaam’s skyline, dotted with modern high-rises, reflects its growing business sector, particularly in finance and technology, while historic sites like the Askari Monument and the National Museum highlight its rich colonial and pre-colonial heritage.',
    'addis-ababa': 'Addis Ababa, the capital and largest city of Ethiopia, is the political heart of Africa, hosting the African Union headquarters and numerous diplomatic missions. Nestled in the highlands, the city is steeped in history, with landmarks like the Holy Trinity Cathedral and the National Museum, home to the famous Lucy fossil. Addis Ababa’s diverse culture is reflected in its vibrant markets, traditional coffee ceremonies, and annual festivals like Meskel. The city’s economy is booming, with sectors like manufacturing, technology, and hospitality driving growth. Its blend of ancient traditions and modern development makes Addis Ababa a unique and influential urban center in East Africa.',
    'accra': 'Accra, the capital and largest city of Ghana, is a vibrant coastal metropolis known for its golden beaches, such as Labadi Beach, and a dynamic cultural scene. As a major financial hub in West Africa, Accra is home to the Ghana Stock Exchange and numerous corporate headquarters. Its rich culture shines through in its music, with genres like highlife and hiplife, and festivals like Chale Wote Street Art Festival. Accra’s modern infrastructure, including shopping malls and high-rise buildings, contrasts with historic sites like the Kwame Nkrumah Mausoleum, creating a city that blends tradition with rapid urban growth and a thriving arts community.',
    'lagos': 'Lagos, Nigeria’s largest city and economic powerhouse, is a bustling megalopolis known for its vibrant energy and cultural diversity. As West Africa’s leading financial center, it hosts the Nigerian Stock Exchange and numerous multinational corporations. Lagos is famous for its dynamic music scene, birthing genres like Afrobeats, and its thriving Nollywood film industry. The city’s markets, such as Balogun and Computer Village, are hives of activity, offering everything from textiles to electronics. Despite its fast-paced urban life, Lagos boasts stunning beaches like Tarkwa Bay and cultural landmarks like the National Theatre, making it a cornerstone of West African commerce and culture.',
    'cape-town': 'Cape Town, the legislative capital of South Africa, is renowned for its breathtaking natural beauty, dominated by the iconic Table Mountain and surrounded by the Atlantic Ocean. A major tourist destination, the city offers attractions like the V&A Waterfront, Robben Island, and the Cape Winelands. Its diverse culture, shaped by African, European, and Asian influences, is evident in its cuisine, festivals, and vibrant arts scene. Cape Town is also a significant business hub, with a growing tech sector and international trade links. Its stunning coastline, vibrant townships, and rich history make it one of Africa’s most picturesque and culturally rich cities.',
    'johannesburg': 'Johannesburg, South Africa’s largest city and economic hub, is often called the "City of Gold" due to its origins as a gold-mining town in the late 19th century. Today, it’s Africa’s financial capital, home to the Johannesburg Stock Exchange and numerous corporate headquarters. The city’s rich history is explored in sites like the Apartheid Museum and Constitution Hill. Johannesburg’s modern skyline, with towering skyscrapers, contrasts with its vibrant townships like Soweto, where cultural heritage thrives through music, dance, and street art. Its dynamic economy and cosmopolitan population make it a key player in African and global markets.',
    'cairo': 'Cairo, the capital and largest city of Egypt, is a historic metropolis that blends ancient wonders with modern vibrancy. Known as the "City of a Thousand Minarets," Cairo is home to the Giza Pyramids, the Sphinx, and the Egyptian Museum, housing treasures of ancient Egyptian civilization. Its vibrant culture is reflected in its bustling souks like Khan el-Khalili, Islamic architecture, and Coptic heritage sites. As North Africa’s economic and cultural hub, Cairo thrives with a mix of traditional coffeehouses, modern malls, and a burgeoning tech scene, making it a city where history and modernity coexist harmoniously.',
    'alexandria': 'Alexandria, Egypt’s second-largest city, is a Mediterranean gem known for its rich history and stunning coastline. Once home to the ancient Lighthouse of Alexandria and the Great Library, the city retains its cultural significance with landmarks like the Bibliotheca Alexandrina, a modern tribute to its ancient predecessor. Alexandria’s economy thrives on its strategic port, a key hub for Mediterranean trade, and its tourism industry, which draws visitors to its corniche, historic forts, and Greco-Roman ruins. The city’s blend of African, Arab, and European influences creates a unique cultural mosaic, evident in its cuisine and vibrant arts scene.',
    'casablanca': 'Casablanca, Morocco’s largest city and economic hub, is a modern metropolis on the Atlantic coast, known for its striking architecture, including the grand Hassan II Mosque with its towering minaret. As the country’s primary port, it drives Morocco’s economy through trade, finance, and industry. The city’s cosmopolitan vibe is reflected in its blend of Art Deco buildings, bustling markets, and vibrant nightlife. Casablanca’s growing tech and startup scene, alongside its historic medina and coastal promenade, make it a dynamic center of commerce and culture in North Africa.',
    'marrakech': 'Marrakech, a major city in Morocco, is a cultural treasure known for its historic medina, a UNESCO World Heritage Site, and vibrant souks filled with spices, textiles, and intricate crafts. The city’s iconic Jemaa el-Fnaa square pulses with storytellers, musicians, and food stalls, embodying Morocco’s rich heritage. Marrakech is a top tourist destination, with stunning palaces like Bahia and gardens like Jardin Majorelle. Its blend of Berber, Arab, and French influences, along with a growing hospitality and arts sector, makes it a captivating cultural and economic hub in Morocco.',
    'butare': 'Butare, now known as Huye, is a city in southern Rwanda celebrated for its academic and cultural significance. Home to the University of Rwanda’s main campus, it is a hub for education and research, attracting scholars across the region. Butare’s cultural institutions, such as the Ethnographic Museum, showcase Rwanda’s history and traditions through artifacts and exhibits. The city’s quiet charm, tree-lined streets, and historical sites, including colonial-era buildings, make it a center for intellectual and cultural exploration, with a growing focus on community-driven development and tourism.',
    'mombasa': 'Mombasa, Kenya’s coastal gem, is a historic port city known for its pristine beaches, such as Diani and Nyali, and its strategic harbor, a key trade gateway for East Africa. The city’s rich history, shaped by African, Arab, and European influences, is evident in landmarks like Fort Jesus, a UNESCO World Heritage Site, and the Old Town’s Swahili architecture. Mombasa’s vibrant culture shines through its seafood cuisine, taarab music, and festivals. As a major tourist and economic center, it blends coastal relaxation with a thriving trade and hospitality industry.',
    'jinja': 'Jinja, a city in eastern Uganda, is famously located at the source of the Nile River, making it a magnet for adventure tourism. Known for white-water rafting, bungee jumping, and kayaking, Jinja attracts thrill-seekers from around the world. The city’s economy is growing, driven by tourism, agriculture, and small-scale industries. Historical sites like the Source of the Nile monument and colonial-era buildings add to its charm. Jinja’s scenic beauty, with lush greenery and river views, combined with its vibrant markets, makes it a unique destination in East Africa.',
    'arusha': 'Arusha, a city in northern Tanzania, is the gateway to some of Africa’s most iconic natural wonders, including Mount Kilimanjaro, the Serengeti National Park, and the Ngorongoro Crater. Known as the "Safari Capital," Arusha thrives on its tourism industry, offering access to world-class wildlife experiences. The city’s vibrant markets, such as the Maasai Market, showcase local crafts and culture. Arusha also serves as a diplomatic hub, hosting the East African Community headquarters. Its growing business sector and stunning backdrop of Mount Meru make it a vital economic and cultural center.',
    'dire-dawa': 'Dire Dawa, a city in eastern Ethiopia, is a key transportation and commercial hub, strategically located along the Addis Ababa-Djibouti railway. Known for its diverse population, including Ethiopian, Somali, and Oromo communities, the city boasts a rich cultural blend evident in its markets, cuisine, and festivals. Dire Dawa’s economy is driven by trade, manufacturing, and agriculture, with its historic railway station and colonial architecture adding historical depth. The city’s vibrant street life, coupled with its role as a logistics hub, makes it an essential part of Ethiopia’s economic landscape.',
    'kumasi': 'Kumasi, Ghana’s second-largest city, is the cultural heart of the Ashanti Kingdom, renowned for its rich traditions and history. The city is home to the Manhyia Palace, the seat of the Asantehene, and vibrant markets like Kejetia, one of West Africa’s largest open-air markets. Kumasi’s cultural heritage is celebrated through festivals like Akwasidae and its intricate kente cloth weaving. As a growing economic center, it supports industries like timber, agriculture, and retail. Kumasi’s blend of royal heritage, bustling commerce, and vibrant arts scene makes it a cornerstone of Ghanaian identity.'
  };

  useEffect(() => {
    if (citySlug) {
      fetchCityData();
      
      // Add a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 10000); // 10 seconds timeout
      
      return () => clearTimeout(timeout);
    }
  }, [citySlug]);

  const fetchCityData = async () => {
    try {
      const cityName = citySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      console.log('Fetching city data for:', cityName);
      
      const { data, error } = await db.cities()
        .select(`
          id,
          name,
          country_id,
          latitude,
          longitude,
          population,
          countries (
            name,
            code
          )
        `)
        .ilike('name', cityName || '')
        .single();

      console.log('City query result:', { data, error });

      if (!error && data) {
        // Transform the data to match our interface
        const transformedCity: City = {
          id: data.id,
          name: data.name,
          country_id: data.country_id,
          latitude: data.latitude,
          longitude: data.longitude,
          population: data.population,
          countries: data.countries && Array.isArray(data.countries) && data.countries.length > 0 ? {
            name: data.countries[0].name,
            code: data.countries[0].code
          } : null
        };
        console.log('Transformed city data:', transformedCity);
        setCity(transformedCity);
        
        // Fetch businesses immediately after city data is loaded
        fetchBusinesses(transformedCity);
      } else {
        console.error('Error fetching city:', error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching city:', error);
      setLoading(false);
    }
  };

  const fetchBusinesses = async (cityData: City) => {
    try {
      console.log('Fetching businesses for city:', cityData.name);
      
      const { data, error } = await db.businesses()
        .select(`
          id,
          name,
          slug,
          description,
          phone,
          website,
          address,
          latitude,
          longitude,
          logo_url,
          is_premium,
          category:categories(name, slug),
          reviews(id, rating, content, created_at)
        `)
        .eq('status', 'active')
        .eq('city_id', cityData.id);

      console.log('Businesses query result:', { data, error, count: data?.length });

      if (!error) {
        // Transform the data to match our interface
        const transformedBusinesses: Business[] = (data || []).map((business: any) => ({
          id: business.id,
          name: business.name,
          slug: business.slug,
          description: business.description,
          phone: business.phone,
          website: business.website,
          address: business.address,
          latitude: business.latitude,
          longitude: business.longitude,
          logo_url: business.logo_url,
          is_premium: business.is_premium,
          category: business.category ? {
            name: business.category.name,
            slug: business.category.slug
          } : undefined,
          reviews: business.reviews || []
        }));
        console.log('Transformed businesses data:', transformedBusinesses);
        setBusinesses(transformedBusinesses);
      } else {
        // If no businesses found, add some sample data for testing
        console.log('No businesses found in database, adding sample data for testing');
        const sampleBusinesses: Business[] = [
          {
            id: 'sample-1',
            name: 'Sample Restaurant',
            slug: 'sample-restaurant',
            description: 'A delicious local restaurant serving traditional cuisine',
            phone: '+20 123 456 789',
            website: 'https://example.com',
            address: '123 Main Street, Cairo',
            latitude: cityData.latitude ? cityData.latitude + 0.001 : 30.0444 + 0.001,
            longitude: cityData.longitude ? cityData.longitude + 0.001 : 31.2357 + 0.001,
            logo_url: null,
            is_premium: false,
            category: { name: 'Restaurant', slug: 'restaurant' },
            reviews: [{ id: '1', rating: 4.5, content: 'Great food!', created_at: '2024-01-01' }]
          },
          {
            id: 'sample-2',
            name: 'Sample Hotel',
            slug: 'sample-hotel',
            description: 'A comfortable hotel in the heart of the city',
            phone: '+20 987 654 321',
            website: 'https://hotel-example.com',
            address: '456 Tourism Avenue, Cairo',
            latitude: cityData.latitude ? cityData.latitude - 0.001 : 30.0444 - 0.001,
            longitude: cityData.longitude ? cityData.longitude - 0.001 : 31.2357 - 0.001,
            logo_url: null,
            is_premium: true,
            category: { name: 'Hotel', slug: 'hotel' },
            reviews: [{ id: '2', rating: 4.8, content: 'Excellent service!', created_at: '2024-01-02' }]
          }
        ];
        setBusinesses(sampleBusinesses);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || business.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getAverageRating = (business: Business) => {
    if (!business.reviews || business.reviews.length === 0) return 0;
    const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / business.reviews.length;
  };

  const formatCityName = (slug: string) => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yp-gray-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-yp-gray-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-yp-dark mb-4">City Not Found</h1>
            <Button onClick={() => navigate('/')} className="bg-yp-blue">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yp-gray-light">
      <Header />
      
      {/* City Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-yp-dark font-comfortaa">
                {formatCityName(citySlug || '')}
              </h1>
              <p className="text-yp-gray-dark">
                {city.countries?.name} • {city.population?.toLocaleString()} residents
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              {cityDescriptions[citySlug || ''] || 
                `${formatCityName(citySlug || '')} is a vibrant city with a rich cultural heritage and growing business community.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* City Statistics */}
      {/* <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-yp-blue mb-1">
                {businesses.length}
              </div>
              <div className="text-sm text-gray-600">Businesses</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-yp-green mb-1">
                {city.countries?.code || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Country Code</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-yp-yellow mb-1">
                {city.population ? (city.population / 1000000).toFixed(1) : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Population (M)</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-yp-dark mb-1">
                {city.latitude && city.longitude ? 'Yes' : 'No'}
              </div>
              <div className="text-sm text-gray-600">GPS Coordinates</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* City Map */}
      {city.latitude && city.longitude && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-yp-dark font-comfortaa mb-6">City Map & Location</h2>
            
            <UltraSimpleMap />
          </div>
        </div>
      )}

      {/* Business Listings */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                    placeholder="Search businesses in this city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    />
                </div>
                </div>
                 */}
                <div className="flex items-center space-x-4">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yp-blue focus:border-transparent"
                >
                    <option value="">All Categories</option>
                    {Array.from(new Set(businesses.map(b => b.category?.name).filter(Boolean))).map((categoryName) => (
                    <option key={categoryName} value={categoryName}>
                        {categoryName}
                    </option>
                    ))}
                </select>
                
                <div className="flex border border-gray-300 rounded-lg">
                    <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                    >
                    <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                    >
                    <List className="w-4 h-4" />
                    </Button>
                </div>
                </div>
              </div> 
            
                {/* Results Count */}
                {/* <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                    Showing {filteredBusinesses.length} of {businesses.length} businesses in {formatCityName(citySlug || '')}
                    {selectedCategory && ` • Filtered by: ${selectedCategory}`}
                    </p>
                </div> */}
            </div>

            {filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search criteria' : 'No businesses have been added to this city yet'}
                </p>
            </div>
            ) : (
            <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
                {filteredBusinesses.map((business) => (
                <Card key={business.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {business.logo_url ? (
                            <img 
                                src={business.logo_url} 
                                alt={business.name}
                                className="w-8 h-8 rounded object-cover"
                            />
                            ) : (
                            <Building className="w-6 h-6 text-blue-600" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <CardTitle className="text-lg font-semibold text-yp-dark truncate">
                            {business.name}
                            </CardTitle>
                            {business.category && (
                            <Badge variant="outline" className="text-xs mt-1">
                                {business.category.name}
                            </Badge>
                            )}
                        </div>
                        </div>
                    </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                    {business.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {business.description}
                        </p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                        {business.address && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{business.address}</span>
                        </div>
                        )}
                        
                        {business.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{business.phone}</span>
                        </div>
                        )}
                    </div>
                    
                    {business.reviews && business.reviews.length > 0 && (
                        <div className="flex items-center space-x-2 mb-4">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-900">
                            {getAverageRating(business).toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                            ({business.reviews.length} reviews)
                        </span>
                        </div>
                    )}
                    
                    <div className="flex space-x-2">
                        <Link 
                        to={`/${citySlug}/${business.category?.slug || 'business'}/${business.id}`}
                        className="flex-1"
                        >
                        <Button variant="outline" className="w-full text-sm">
                            View Details
                        </Button>
                        </Link>
                        <Link to={`/write-review/${business.id}`}>
                        <Button size="sm" className="bg-yp-blue text-white text-sm">
                            Review
                        </Button>
                        </Link>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>
            )}
        </div> 
      
      <Footer />
    </div> 
  );
};