import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FaSearch, FaBuilding, FaUserTie, FaInfoCircle, FaGlobeAfrica, FaStar, FaMobileAlt, FaLock, FaEdit, FaCheckCircle } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

const FaqPage = () => {
  const { t } = useTranslation();

  const generalFAQs = Array.from({ length: 10 }).map((_, i) => ({
    question: t(`faq.general.items.${i}.q`),
    answer: t(`faq.general.items.${i}.a`),
  }));

  const businessFAQs = Array.from({ length: 10 }).map((_, i) => ({
    question: t(`faq.business.items.${i}.q`),
    answer: t(`faq.business.items.${i}.a`),
  }));

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-yp-gray-light flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-yp-blue hover:bg-yp-blue/10"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('common.back') || 'Back'}
          </Button>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('faq.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('faq.subtitle')}</p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* General Questions Section */}
          <section className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
              <div className="flex items-center space-x-3">
                <FaInfoCircle className="text-white text-2xl" />
                <h2 className="text-2xl font-bold text-white">{t('faq.general.title')}</h2>
              </div>
              <p className="text-blue-100 mt-2">{t('faq.general.subtitle')}</p>
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
                <h2 className="text-2xl font-bold text-white">{t('faq.business.title')}</h2>
              </div>
              <p className="text-yellow-100 mt-2">{t('faq.business.subtitle')}</p>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('faq.cta.title')}</h3>
              <p className="text-gray-600 mb-6">{t('faq.cta.subtitle')}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/contact-us" 
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('faq.cta.contact')}
                </Link>
                <Link 
                  to="/for-business" 
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('faq.cta.business')}
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FaqPage;
