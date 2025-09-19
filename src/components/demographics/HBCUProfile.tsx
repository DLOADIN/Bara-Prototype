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
    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{value}</p>
    {description && <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>}
    {comparison && (
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">{comparison}</p>
    )}
  </div>
);

const HBCUProfile: React.FC = () => {
  const quickFacts = [
    {
      title: 'Total HBCUs',
      value: '107',
      description: 'Institutions in the United States',
      comparison: '3% of all colleges, but produce 17% of Black graduates'
    },
    {
      title: 'Established',
      value: '1837-1964',
      description: 'Cheyney University (1837) was the first',
      comparison: 'Most founded after Civil War, before Civil Rights Act'
    },
    {
      title: 'Enrollment',
      value: '292,000+',
      description: 'Students currently enrolled',
      comparison: 'About 10% of all Black college students'
    },
    {
      title: 'Economic Impact',
      value: '$14.8B',
      description: 'Annual economic impact',
      comparison: 'Supports 134,000+ jobs'
    }
  ];

  const notableAlumni = [
    { name: 'Martin Luther King Jr.', school: 'Morehouse College', achievement: 'Civil Rights Leader' },
    { name: 'Oprah Winfrey', school: 'Tennessee State', achievement: 'Media Mogul' },
    { name: 'Kamala Harris', school: 'Howard University', achievement: 'Vice President' },
    { name: 'Thurgood Marshall', school: 'Howard University', achievement: 'First Black Supreme Court Justice' },
    { name: 'Toni Morrison', school: 'Howard University', achievement: 'Nobel Prize Winner' },
    { name: 'Spike Lee', school: 'Morehouse College', achievement: 'Academy Award Winner' },
    { name: 'Stacey Abrams', school: 'Spelman College', achievement: 'Political Leader' },
    { name: 'Katherine Johnson', school: 'West Virginia State', achievement: 'NASA Mathematician' }
  ];

  const topHBCUs = [
    { name: 'Spelman College', location: 'Atlanta, GA', founded: 1881, students: '2,360', type: 'Private, Women\'s' },
    { name: 'Howard University', location: 'Washington, D.C.', founded: 1867, students: '10,859', type: 'Private' },
    { name: 'Xavier University of Louisiana', location: 'New Orleans, LA', founded: 1925, students: '3,290', type: 'Private, Catholic' },
    { name: 'Hampton University', location: 'Hampton, VA', founded: 1868, students: '3,516', type: 'Private' },
    { name: 'Tuskegee University', location: 'Tuskegee, AL', founded: 1881, students: '2,747', type: 'Private' }
  ];

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Historically Black Colleges & Universities (HBCUs)
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Pillars of African American Education and Excellence
          </p>
        </div>

        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {quickFacts.map((fact, index) => (
              <StatisticCard key={`fact-${index}`} {...fact} />
            ))}
          </div>
        </div>

        <div className="mb-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top HBCUs by Reputation</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Institution</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Founded</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Students</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {topHBCUs.map((school, index) => (
                    <tr key={`school-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{school.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{school.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{school.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{school.founded}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{school.students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notable Alumni</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {notableAlumni.map((alum, index) => (
              <div key={`alum-${index}`} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-purple-600 dark:text-purple-400">{alum.name}</h4>
                <p className="text-gray-600 dark:text-gray-300">{alum.school}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{alum.achievement}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Historical Impact</h3>
            <div className="prose dark:prose-invert max-w-none">
              <p className="mb-4">
                HBCUs were established primarily after the Civil War to provide higher education to African Americans who were systematically excluded from most other institutions of higher education. Despite being underfunded compared to predominantly white institutions, HBCUs have produced a disproportionate number of Black professionals in medicine, law, education, and STEM fields.
              </p>
              <p>
                These institutions have been at the forefront of civil rights movements and continue to be vital centers of Black culture, leadership development, and academic excellence. They foster unique environments that celebrate African American heritage while providing rigorous academic programs.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p className="font-semibold mb-2">Sources:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>National Center for Education Statistics (NCES)</li>
            <li>Thurgood Marshall College Fund</li>
            <li>United Negro College Fund (UNCF)</li>
            <li>U.S. Department of Education</li>
          </ul>
          <p className="mt-4 text-xs">
            Note: Statistics are based on most recent available data and may vary slightly by source.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HBCUProfile;
