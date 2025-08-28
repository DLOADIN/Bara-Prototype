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

    // Extract structured data from description
    const extractInfo = (text: string) => {
      const capitalMatch = text.match(/capital[:\s]+([^,\.]+)/i);
      const currencyMatch = text.match(/currency[:\s]+([^,\.]+)/i);
      const populationMatch = text.match(/population[:\s]+([^,\.]+)/i);
      const languageMatch = text.match(/language[:\s]+([^,\.]+)/i);
      const areaMatch = text.match(/area[:\s]+([^,\.]+)/i);
      const gdpMatch = text.match(/gdp[:\s]+([^,\.]+)/i);
      const timezoneMatch = text.match(/timezone[:\s]+([^,\.]+)/i);

      return {
        capital: capitalMatch?.[1]?.trim() || '',
        currency: currencyMatch?.[1]?.trim() || '',
        population: populationMatch?.[1]?.trim() || '',
        language: languageMatch?.[1]?.trim() || '',
        area: areaMatch?.[1]?.trim() || '',
        gdp: gdpMatch?.[1]?.trim() || '',
        timezone: timezoneMatch?.[1]?.trim() || ''
      };
    };

    const extractedInfo = extractInfo(description);

    return {
      name: countryName,
      description: description.substring(0, 500) + (description.length > 500 ? '...' : ''),
      flag_url: flagUrl,
      coat_of_arms_url: coatOfArmsUrl,
      capital: extractedInfo.capital,
      currency: extractedInfo.currency,
      population: extractedInfo.population,
      code: '', // Will be filled from database
      language: extractedInfo.language,
      area: extractedInfo.area,
      gdp: extractedInfo.gdp,
      timezone: extractedInfo.timezone
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
