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
    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{value}</p>
    {description && <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>}
    {comparison && (
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">{comparison}</p>
    )}
  </div>
);

const BrazilDemographicProfile: React.FC = () => {
  const demographics: StatisticItem[] = [
    {
      title: 'Total Population',
      value: '119 Million',
      description: '55.5% of Brazil\'s population (IBGE 2022)',
      comparison: 'Largest African diaspora population globally'
    },
    {
      title: 'Median Age',
      value: '32.1 years',
      description: 'Slightly younger than national average',
      comparison: 'National median: 33.5 years'
    },
    {
      title: 'Life Expectancy',
      value: '72.2 years',
      description: 'At birth (2020)',
      comparison: '3 years less than white Brazilians (75.5 years)'
    },
    {
      title: 'Fertility Rate',
      value: '1.89',
      description: 'Children per woman',
      comparison: 'Slightly above national average (1.75)'
    }
  ];

  const economy: StatisticItem[] = [
    {
      title: 'Monthly Income',
      value: 'R$ 1,846',
      description: 'Average monthly income',
      comparison: '57.5% of white Brazilians\' income'
    },
    {
      title: 'Unemployment',
      value: '11.3%',
      description: 'Unemployment rate (Q4 2023)',
      comparison: 'Higher than 7.5% for white Brazilians'
    },
    {
      title: 'Informal Work',
      value: '47%+',
      description: 'Workers in informal sector',
      comparison: 'Lack formal contracts and benefits'
    },
    {
      title: 'Spending Power',
      value: 'R$ 2.1T',
      description: 'Annual collective spending power',
      comparison: 'Massive consumer market potential'
    }
  ];

  const educationSociety: StatisticItem[] = [
    {
      title: 'University Graduates',
      value: '12.6%',
      description: 'Ages 25+ with degrees (2022)',
      comparison: 'Less than half the rate of white Brazilians'
    },
    {
      title: 'Illiteracy Rate',
      value: '8.4%',
      description: 'Ages 15+ (2022)',
      comparison: 'More than double the white population rate'
    },
    {
      title: 'Homicide Rate',
      value: '48.5',
      description: 'Per 100,000 inhabitants',
      comparison: 'Young Black men at highest risk'
    },
    {
      title: 'Congress Representation',
      value: '24.4%',
      description: 'Federal deputies (2022)',
      comparison: 'Historic high but still not proportional'
    }
  ];

  const culturalImpact = [
    {
      category: 'Music',
      description: 'Birthplace of Samba, Baile Funk, and Black Brazilian hip-hop'
    },
    {
      category: 'Religion',
      description: 'Mix of Catholicism, Evangelicalism, and Afro-Brazilian traditions like Candomblé and Umbanda'
    },
    {
      category: 'Diaspora',
      description: 'Descendants of 4.86 million enslaved Africans brought to Brazil (16th-19th centuries)'
    },
    {
      category: 'Identity',
      description: 'Growing racial consciousness with 33% increase in Black/Brown identification (2010-2022)'
    }
  ];

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Black Brazil (Povo Preto Brasileiro)
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Demographic, economic, and cultural profile of Brazil's Black population
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {demographics.map((stat, index) => (
              <StatisticCard key={`demo-${index}`} {...stat} />
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Economy & Employment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {economy.map((stat, index) => (
              <StatisticCard key={`econ-${index}`} {...stat} />
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Education & Society</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {educationSociety.map((stat, index) => (
              <StatisticCard key={`edu-${index}`} {...stat} />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cultural Impact & Heritage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {culturalImpact.map((item, index) => (
                <div key={`culture-${index}`} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <h4 className="font-semibold text-lg text-green-600 dark:text-green-400 mb-2">{item.category}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p className="font-semibold mb-2">Historical Context:</p>
          <p className="mb-4">
            The Black Brazilian population descends from an estimated 4.86 million enslaved Africans brought to Brazil between the 16th and 19th centuries—the largest number of any country in the Americas. 
            The "Lei Áurea" (Golden Law) abolishing slavery was signed on May 13, 1888, making Brazil the last country in the Western world to abolish the practice.
          </p>
          <p className="text-xs mt-4">
            Data sources: IBGE (Brazilian Institute of Geography and Statistics), PNAD Continua, Atlas da Violência 2023, Congresso em Foco
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrazilDemographicProfile;
