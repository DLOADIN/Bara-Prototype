import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FaSearch, FaBuilding, FaUserTie, FaInfoCircle, FaGlobeAfrica, FaStar, FaMobileAlt, FaLock, FaEdit, FaCheckCircle } from 'react-icons/fa';

const FaqPage = () => {
  const { t } = useTranslation();

  const generalFAQs = [
    {
      question: "What is BARA LISTINGS?",
      answer: "BARA LISTINGS is a comprehensive business directory that helps you discover and connect with businesses across Africa and its diaspora communities. We provide detailed information about various businesses, including contact details, services, and customer reviews."
    },
    {
      question: "How do I search for businesses?",
      answer: "You can search for businesses using the search bar at the top of any page. You can filter your search by location, category, or specific keywords to find exactly what you're looking for."
    },
    {
      question: "Is BARA LISTINGS free to use?",
      answer: "Yes, BARA LISTINGS is completely free for users searching for businesses. Business owners can claim their listings for free, with optional premium features available."
    },
    {
      question: "How can I contact a business?",
      answer: "Each business listing includes contact information such as phone numbers, email addresses, and website links. You can use these details to get in touch with the business directly."
    },
    {
      question: "How do I leave a review?",
      answer: "To leave a review, navigate to the business's profile page and click on the 'Write a Review' button. You'll need to be logged in to submit a review."
    },
    {
      question: "Can I suggest a business to be added?",
      answer: "Yes! If you can't find a business you're looking for, you can suggest it by clicking on the 'Add a Business' link in the navigation menu."
    },
    {
      question: "How often is the business information updated?",
      answer: "Business information is updated in real-time when business owners update their listings. We also periodically verify information to ensure accuracy."
    },
    {
      question: "How do I report incorrect information?",
      answer: "If you find incorrect information, you can report it by clicking the 'Report' button on the business listing. Our team will review and update the information as needed."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take your privacy seriously. Your personal information is protected according to our privacy policy and is never shared without your consent."
    },
    {
      question: "Do you have a mobile app?",
      answer: "Yes, BARA LISTINGS is available as a mobile app on both iOS and Android platforms. You can download it from the App Store or Google Play Store."
    }
  ];

  const businessFAQs = [
    {
      question: "How do I claim my business listing?",
      answer: "Search for your business on our platform, then click the 'Claim This Business' button. You'll need to verify your identity and complete the verification process."
    },
    {
      question: "What are the benefits of claiming my business?",
      answer: "Claiming your business allows you to update information, respond to reviews, add photos, access analytics, and promote special offers to potential customers."
    },
    {
      question: "How much does it cost to list my business?",
      answer: "Basic listings are free! We also offer premium plans with additional features. Visit our 'For Business' section for detailed pricing information."
    },
    {
      question: "How can I improve my business's visibility?",
      answer: "Ensure your profile is complete with accurate information, high-quality photos, and encourage satisfied customers to leave positive reviews. Our premium plans also offer enhanced visibility options."
    },
    {
      question: "Can I respond to customer reviews?",
      answer: "Yes, as a verified business owner, you can respond to all reviews. We encourage professional and courteous responses to all feedback."
    },
    {
      question: "How do I update my business information?",
      answer: "Log in to your business account, navigate to your dashboard, and select 'Edit Business' to update your information. Changes may be subject to verification."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for premium services. All transactions are secure and encrypted."
    },
    {
      question: "Can I advertise special offers or events?",
      answer: "Yes, with a premium account, you can create and promote special offers, events, and announcements to reach more customers."
    },
    {
      question: "How do I cancel my premium subscription?",
      answer: "You can manage your subscription in the 'Billing' section of your business dashboard. Cancellation can be done at any time."
    },
    {
      question: "Who can I contact for business support?",
      answer: "Our business support team is available via email at business@baralistings.com or through the contact form in your business dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about using BARA LISTINGS as a customer or business owner.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* General Questions Section */}
          <section className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
              <div className="flex items-center space-x-3">
                <FaInfoCircle className="text-white text-2xl" />
                <h2 className="text-2xl font-bold text-white">General Questions</h2>
              </div>
              <p className="text-blue-100 mt-2">Common questions about using BARA LISTINGS</p>
            </div>
            
            <div className="p-6">
              <Accordion type="single" collapsible className="space-y-4">
                {generalFAQs.map((faq, index) => (
                  <AccordionItem 
                    key={`general-${index}`}
                    value={`general-${index}`}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="px-4 py-3 text-left hover:bg-gray-50 font-medium text-gray-800">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 bg-gray-50 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* For Business Owners Section */}
          <section className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6">
              <div className="flex items-center space-x-3">
                <FaUserTie className="text-white text-2xl" />
                <h2 className="text-2xl font-bold text-white">For Business Owners</h2>
              </div>
              <p className="text-yellow-100 mt-2">Information for businesses listed on BARA LISTINGS</p>
            </div>
            
            <div className="p-6">
              <Accordion type="single" collapsible className="space-y-4">
                {businessFAQs.map((faq, index) => (
                  <AccordionItem 
                    key={`business-${index}`}
                    value={`business-${index}`}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="px-4 py-3 text-left hover:bg-gray-50 font-medium text-gray-800">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 bg-gray-50 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* CTA Section */}
          <div className="text-center mt-8 p-8 bg-white rounded-xl shadow-md">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help you with any other questions you might have.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/contact-us" 
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contact Support
                </Link>
                <Link 
                  to="/for-business" 
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Business Inquiries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
