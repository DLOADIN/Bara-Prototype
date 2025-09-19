import React from 'react';

interface StatisticItem {
  title: string;
  value: string;
  description?: string;
  comparison?: string;
}

const StatisticCard: React.FC<StatisticItem> = ({ title, value, description, comparison }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{value}</p>
    {description && <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>}
    {comparison && (
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">{comparison}</p>
    )}
  </div>
);

const DemographicProfile: React.FC = () => {
  const stats: StatisticItem[] = [
    {
      title: 'Population',
      value: '47.2 Million',
      description: '2022 estimate (U.S. Census Bureau)',
      comparison: 'Would rank as 30th most populous country, between Spain and Uganda'
    },
    {
      title: 'Consumer Spending Power',
      value: '$1.8 Trillion+',
      description: '2023 annual estimate (Nielsen/Selig Center)',
      comparison: 'Top 15 GDP globally, surpassing Saudi Arabia and the Netherlands'
    },
    {
      title: 'Median Household Income',
      value: '$52,860',
      description: '2022 (U.S. Census Bureau)',
      comparison: 'National: $74,580 • White: $81,060'
    },
    {
      title: 'Homeownership Rate',
      value: '45.9%',
      description: 'Q4 2023 (U.S. Census Bureau)',
      comparison: 'National: 65.7% • White: 74.6%'
    },
    {
      title: 'College Graduates',
      value: '28.1%',
      description: 'Adults 25+ with Bachelor\'s degree or higher (2022)',
      comparison: 'National average: 34.3%'
    },
    {
      title: 'Business Ownership',
      value: '161,000+',
      description: 'Firms with majority Black ownership (2021)',
      comparison: 'Generating $183B+ in annual revenue'
    },
    {
      title: 'Life Expectancy',
      value: '70.8 years',
      description: '2021 (CDC)',
      comparison: '5.6 years lower than White Americans'
    },
    {
      title: 'Voter Turnout',
      value: '62.6%',
      description: '2020 Presidential Election',
      comparison: 'Key demographic in several swing states'
    }
  ];

  const culturalImpact = [
    {
      category: 'Music',
      description: 'Jazz, Blues, Hip-Hop, R&B, and Gospel music genres'
    },
    {
      category: 'Language',
      description: 'African American Vernacular English (AAVE) and linguistic innovations'
    },
    {
      category: 'Fashion',
      description: 'Trends in clothing, hairstyles, and personal expression'
    },
    {
      category: 'Cuisine',
      description: 'Soul food and culinary traditions with African roots'
    }
  ];

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Demographic & Economic Profile
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Key statistics and insights about the African American community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatisticCard key={index} {...stat} />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cultural Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {culturalImpact.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold text-indigo-600 dark:text-indigo-400">{item.category}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Metropolitan Areas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {['New York City', 'Atlanta', 'Chicago', 'Washington, D.C.', 'Philadelphia'].map((city, index) => (
                <div key={index} className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <p className="font-medium text-indigo-700 dark:text-indigo-300">{city}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
          <p>Data sources: U.S. Census Bureau, Bureau of Labor Statistics, CDC, Bureau of Justice Statistics, Selig Center for Economic Growth</p>
          <p className="mt-1">Figures are the latest available as of early 2024 and are subject to revision</p>
        </div>
      </div>
    </div>
  );
};

export default DemographicProfile;
