import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MapPin, Link as LinkIcon } from "lucide-react";
import { Link } from 'react-router-dom'

export const BusinessSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 md:py-16 bg-yp-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative order-2 md:order-1">
            <div className="bg-white rounded-full w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center overflow-hidden">
              <div className="w-56 h-56 md:w-72 md:h-72 bg-gradient-to-br from-yp-blue to-yp-green rounded-full flex items-center justify-center">
                <div className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-yp-yellow rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center">
                      <LinkIcon className="w-8 h-8 md:w-12 md:h-12 text-yp-dark" />
                    </div>
                    <p className="font-roboto text-yp-dark font-medium text-sm md:text-base">{t('business.owners')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 md:top-8 left-4 md:left-8">
              <MapPin className="w-6 h-6 md:w-8 md:h-8 text-yp-blue" />
            </div>
            <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8">
              <div className="w-4 h-4 md:w-6 md:h-6 bg-yp-green rounded-full"></div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 md:order-2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-comfortaa font-bold text-yp-dark mb-4 md:mb-6">
              {t('business.manageListing.title')}
            </h2>
            
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <p className="text-base md:text-lg font-roboto text-yp-dark">
                {t('business.manageListing.step1')}
              </p>
              <p className="text-base md:text-lg font-roboto text-yp-dark">
                {t('business.manageListing.step2')}
              </p>
              <p className="text-base md:text-lg font-roboto text-yp-dark">
                <span className="font-bold text-yp-green">{t('business.manageListing.new')}</span> {t('business.manageListing.jobPosting')}
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <Link to="/">
                <Button className="w-full md:w-auto bg-yp-blue hover:bg-yp-blue/90 text-white font-roboto font-semibold text-base md:text-lg px-6 md:px-8 py-3 h-auto">
                  {t('business.claimListing')}
                </Button>
              </Link>
              
              <p className="text-xs md:text-sm font-roboto text-yp-gray-dark">
                {t('business.orCall')}{" "}
                <a 
                  href="tel:18667940889" 
                  className="text-yp-blue hover:underline font-medium"
                >
                  (+250) 791 291 003
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};