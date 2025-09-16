interface WikipediaCountryInfo {
  name: string;
  description: string;
  flag_url: string;
  coat_of_arms_url?: string;
  capital: string;
  currency: string;
  population: string;
  code: string;
  language: string;
  area?: string;
  gdp?: string;
  timezone?: string;
  // Enhanced fields from updates.md
  president_name?: string;
  gdp_usd?: number;
  average_age?: number;
  largest_city?: string;
  largest_city_population?: number;
  capital_population?: number;
  ethnic_groups?: Array<{
    name: string;
    percentage: number;
    note?: string;
  }>;
  formation_date?: string;
  hdi_score?: number;
  calling_code?: string;
  latitude?: number;
  longitude?: number;
  area_sq_km?: number;
}

export const fetchWikipediaCountryInfo = async (countryName: string): Promise<WikipediaCountryInfo | null> => {
  try {
    // First, search for the country page
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(countryName)}&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.query?.search?.[0]) {
      console.warn(`No Wikipedia page found for ${countryName}`);
      return null;
    }

    const pageId = searchData.query.search[0].pageid;
    const pageTitle = searchData.query.search[0].title;

    // Get page content and images
    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|pageprops&exintro=true&explaintext=true&piprop=original&pageids=${pageId}&format=json&origin=*`;
    const contentResponse = await fetch(contentUrl);
    const contentData = await contentResponse.json();

    const page = contentData.query?.pages?.[pageId];
    if (!page) {
      console.warn(`No page content found for ${countryName}`);
      return null;
    }

    // Extract basic information
    const description = page.extract || '';
    
    // Get flag and coat of arms images
    const flagUrl = page.original?.source || '';
    
    // Try to get coat of arms from page images
    const imagesUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=images&titles=${encodeURIComponent(pageTitle)}&format=json&origin=*`;
    const imagesResponse = await fetch(imagesUrl);
    const imagesData = await imagesResponse.json();
    
    let coatOfArmsUrl = '';
    const imageTitles = imagesData.query?.pages?.[pageId]?.images || [];
    
    for (const image of imageTitles) {
      if (image.title.toLowerCase().includes('coat of arms') || 
          image.title.toLowerCase().includes('national emblem') ||
          image.title.toLowerCase().includes('state emblem')) {
        const imageInfoUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&titles=${encodeURIComponent(image.title)}&format=json&origin=*`;
        const imageInfoResponse = await fetch(imageInfoUrl);
        const imageInfoData = await imageInfoResponse.json();
        const imageInfo = Object.values(imageInfoData.query?.pages || {})[0] as any;
        if (imageInfo?.imageinfo?.[0]?.url) {
          coatOfArmsUrl = imageInfo.imageinfo[0].url;
          break;
        }
      }
    }

         // Enhanced extraction function for detailed country information
     const extractInfo = (text: string) => {
       // Basic information patterns
       const capitalMatch = text.match(/capital[:\s]+([^,\.\n]+)/i);
       const currencyMatch = text.match(/currency[:\s]+([^,\.\n]+)/i);
       
       // Population patterns
       const populationMatch = text.match(/population[:\s]+([^,\.\n]+(?:million|billion|thousand)?)/i) || 
                              text.match(/(\d+(?:,\d{3})*(?:\s*million|\s*billion|\s*thousand)?)\s*(?:people|inhabitants|residents)/i);
       
       // Language patterns
       const languageMatch = text.match(/language[:\s]+([^,\.\n]+)/i) || 
                           text.match(/official\s+language[:\s]+([^,\.\n]+)/i);
       
       // Area patterns
       const areaMatch = text.match(/area[:\s]+([^,\.\n]+(?:square|sq|km|kilometers?|miles?)?)/i) || 
                        text.match(/(\d+(?:,\d{3})*(?:\s*square\s*kilometers?|\s*sq\s*km|\s*km²))/i);
       
       // GDP patterns
       const gdpMatch = text.match(/gdp[:\s]+([^,\.\n]+)/i);
       const timezoneMatch = text.match(/timezone[:\s]+([^,\.\n]+)/i);

       // President/Head of State patterns
       const presidentMatch = text.match(/(?:president|head of state|leader)[:\s]+([^,\.\n]+)/i) ||
                             text.match(/(?:current|incumbent)\s+(?:president|head of state)[:\s]+([^,\.\n]+)/i) ||
                             text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:is|serves as)\s+(?:president|head of state)/i);

       // Formation/Independence date patterns
       const formationMatch = text.match(/(?:independence|formed|established|founded)[:\s]+([^,\.\n]+(?:19|20)\d{2})/i) ||
                             text.match(/(?:gained independence|became independent)[:\s]+([^,\.\n]+(?:19|20)\d{2})/i);

       // Calling code patterns
       const callingCodeMatch = text.match(/(?:calling code|phone code|dialing code)[:\s]+([+\d]+)/i) ||
                               text.match(/\+(\d{1,4})/);

       // Largest city patterns
       const largestCityMatch = text.match(/(?:largest city|biggest city)[:\s]+([^,\.\n]+)/i) ||
                               text.match(/(?:major cities include|main cities)[:\s]+([^,\.\n]+)/i);

       // HDI patterns
       const hdiMatch = text.match(/hdi[:\s]+([0-9.]+)/i) ||
                       text.match(/human development index[:\s]+([0-9.]+)/i);

       // Ethnic groups patterns (simplified)
       const ethnicGroupsMatch = text.match(/(?:ethnic groups|ethnicity)[:\s]+([^,\.\n]+)/i);

       // Helper function to parse population numbers
       const parsePopulation = (popStr: string): number | null => {
         if (!popStr) return null;
         const cleanStr = popStr.replace(/[^\d]/g, '');
         const num = parseInt(cleanStr);
         if (isNaN(num)) return null;
         
         // Handle millions and billions
         if (popStr.toLowerCase().includes('million')) {
           return num * 1000000;
         } else if (popStr.toLowerCase().includes('billion')) {
           return num * 1000000000;
         } else if (popStr.toLowerCase().includes('thousand')) {
           return num * 1000;
         }
         return num;
       };

       // Helper function to parse area
       const parseArea = (areaStr: string): number | null => {
         if (!areaStr) return null;
         const cleanStr = areaStr.replace(/[^\d]/g, '');
         const num = parseInt(cleanStr);
         if (isNaN(num)) return null;
         
         // Convert to square kilometers if needed
         if (areaStr.toLowerCase().includes('mile')) {
           return Math.round(num * 2.59); // Convert square miles to square km
         }
         return num;
       };

       // Helper function to parse GDP
       const parseGDP = (gdpStr: string): number | null => {
         if (!gdpStr) return null;
         const cleanStr = gdpStr.replace(/[^\d]/g, '');
         const num = parseInt(cleanStr);
         if (isNaN(num)) return null;
         
         // Handle billions and millions
         if (gdpStr.toLowerCase().includes('billion')) {
           return num * 1000000000;
         } else if (gdpStr.toLowerCase().includes('million')) {
           return num * 1000000;
         }
         return num;
       };

       // Helper function to parse HDI score
       const parseHDI = (hdiStr: string): number | null => {
         if (!hdiStr) return null;
         const num = parseFloat(hdiStr);
         return isNaN(num) ? null : num;
       };

       // Helper function to extract ethnic groups
       const extractEthnicGroups = (ethnicStr: string): Array<{name: string; percentage: number; note?: string}> => {
         if (!ethnicStr) return [];
         
         const groups: Array<{name: string; percentage: number; note?: string}> = [];
         
         // Simple pattern to extract ethnic groups with percentages
         const groupMatches = ethnicStr.match(/([A-Za-z\s]+?)\s*(\d+(?:\.\d+)?)%/g);
         if (groupMatches) {
           groupMatches.forEach(match => {
             const parts = match.match(/([A-Za-z\s]+?)\s*(\d+(?:\.\d+)?)%/);
             if (parts) {
               groups.push({
                 name: parts[1].trim(),
                 percentage: parseFloat(parts[2])
               });
             }
           });
         }
         
         return groups;
       };

       return {
         capital: capitalMatch?.[1]?.trim() || '',
         currency: currencyMatch?.[1]?.trim() || '',
         population: populationMatch?.[1]?.trim() || '',
         language: languageMatch?.[1]?.trim() || '',
         area: areaMatch?.[1]?.trim() || '',
         gdp: gdpMatch?.[1]?.trim() || '',
         timezone: timezoneMatch?.[1]?.trim() || '',
         // Enhanced fields
         president_name: presidentMatch?.[1]?.trim() || '',
         formation_date: formationMatch?.[1]?.trim() || '',
         calling_code: callingCodeMatch?.[1]?.trim() || '',
         largest_city: largestCityMatch?.[1]?.trim() || '',
         hdi_score: parseHDI(hdiMatch?.[1] || ''),
         ethnic_groups: extractEthnicGroups(ethnicGroupsMatch?.[1] || ''),
         // Parsed numeric values
         population_numeric: parsePopulation(populationMatch?.[1] || ''),
         area_sq_km: parseArea(areaMatch?.[1] || ''),
         gdp_usd: parseGDP(gdpMatch?.[1] || '')
       };
     };

    const extractedInfo = extractInfo(description);

         // Clean and format description to one paragraph
     const cleanDescription = description
       .replace(/\n+/g, ' ') // Replace newlines with spaces
       .replace(/\s+/g, ' ') // Replace multiple spaces with single space
       .trim();
     
     // Get first paragraph (up to first period or 300 characters)
     const firstParagraph = cleanDescription.split('.')[0] + '.';
     const finalDescription = firstParagraph.length > 300 
       ? firstParagraph.substring(0, 300) + '...' 
       : firstParagraph;

     return {
       name: countryName,
       description: finalDescription + ' 🌍✨',
       flag_url: flagUrl,
       coat_of_arms_url: coatOfArmsUrl,
       capital: extractedInfo.capital,
       currency: extractedInfo.currency,
       population: extractedInfo.population,
       code: '', // Will be filled from database
       language: extractedInfo.language,
       area: extractedInfo.area,
       gdp: extractedInfo.gdp,
       timezone: extractedInfo.timezone,
       // Enhanced fields from updates.md
       president_name: extractedInfo.president_name,
       gdp_usd: extractedInfo.gdp_usd,
       average_age: null, // Not easily extractable from Wikipedia
       largest_city: extractedInfo.largest_city,
       largest_city_population: null, // Not easily extractable from Wikipedia
       capital_population: null, // Not easily extractable from Wikipedia
       ethnic_groups: extractedInfo.ethnic_groups,
       formation_date: extractedInfo.formation_date,
       hdi_score: extractedInfo.hdi_score,
       calling_code: extractedInfo.calling_code,
       latitude: null, // Not easily extractable from Wikipedia
       longitude: null, // Not easily extractable from Wikipedia
       area_sq_km: extractedInfo.area_sq_km
     };

  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
    return null;
  }
};

export const getCountryFlagFromWikipedia = async (countryName: string): Promise<string | null> => {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(countryName + ' flag')}&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.query?.search?.[0]) {
      return null;
    }

    const pageId = searchData.query.search[0].pageid;
    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=original&pageids=${pageId}&format=json&origin=*`;
    const contentResponse = await fetch(contentUrl);
    const contentData = await contentResponse.json();

    const page = contentData.query?.pages?.[pageId];
    return page?.original?.source || null;

  } catch (error) {
    console.error('Error fetching flag from Wikipedia:', error);
    return null;
  }
};
