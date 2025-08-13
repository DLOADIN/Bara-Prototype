import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 text-gray-700">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* About Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-yellow-400">
              {t('footer.about')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.advertiseWithUs')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.corporateBlog')}
                </Link>
              </li>
              <li>
                <Link to="/advertising-choices" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.advertisingChoices')}
                </Link>
              </li>
              <li>
                <Link to="/become-partner" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.becomeNetworkPartner')}
                </Link>
              </li>
              <li>
                <Link to="/marketing-solutions" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.marketingSolutions')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Site Directory Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-yellow-400">
              {t('footer.siteDirectory')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/articles" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.articles')}
                </Link>
              </li>
              <li>
                <Link to="/find-business" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.findBusiness')}
                </Link>
              </li>
              <li>
                <Link to="/mobile-app" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.ypMobileApp')}
                </Link>
              </li>
              <li>
                <Link to="/gas-guru" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.gasGuruMobileApp')}
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.siteMap')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.categories')}
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('footer.browseRestaurants')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Local Communities Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-yellow-400">
              {t('footer.localCommunities')}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <Link 
                  to="https://afri-nexus-listings-xw16.vercel.app/" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                >
                  <span className="mr-2">🇷🇼</span>
                  {t('footer.rwandafulRwanda')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/beautiful-botswana" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                >
                  <span className="mr-2">🇧🇼</span>
                  {t('footer.beautifulBotswana')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/kenyaful-kenya" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                >
                  <span className="mr-2">🇰🇪</span>
                  {t('footer.kenyafulKenya')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/ugandaful-uganda" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                >
                  <span className="mr-2">🇺🇬</span>
                  {t('footer.ugandafulUganda')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/tanzaniaful-tanzania" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                >
                  <span className="mr-2">🇹🇿</span>
                  {t('footer.tanzaniafulTanzania')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/ethiopiaful-ethiopia" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                >
                  <span className="mr-2">🇪🇹</span>
                  {t('footer.ethiopiafulEthiopia')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/ghanaful-ghana" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                >
                  <span className="mr-2">🇬🇭</span>
                  {t('footer.ghanafulGhana')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/nigeriaful-nigeria" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                >
                  <span className="mr-2">🇳🇬</span>
                  {t('footer.nigeriafulNigeria')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        {/* <div className="border-t border-gray-300 pt-6 pb-4">
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800 transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="text-blue-600 hover:text-blue-800 transition-colors">
              {t('footer.terms')}
            </Link>
            <Link to="/legal" className="text-blue-600 hover:text-blue-800 transition-colors">
              {t('footer.legal')}
            </Link>
          </div>
        </div> */}

        {/* Copyright Information */}
        <div className="border-t border-gray-300 pt-4">
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>{t('footer.copyright')}</p>
            <p>{t('footer.trademark')}</p>
            <p>{t('footer.otherMarks')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 