import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
          {/* Local Communities Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-yellow-400">
              {t('footer.localCommunities')}
            </h3>
            <div className="grid grid-cols-4 gap-4">
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