import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MapPin, Link as LinkIcon } from "lucide-react";
import { Link } from 'react-router-dom'

export const BusinessSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-yp-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="bg-white rounded-full w-80 h-80 mx-auto flex items-center justify-center overflow-hidden">
              <div className="w-72 h-72 bg-gradient-to-br from-yp-blue to-yp-green rounded-full flex items-center justify-center">
                <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-yp-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                      <LinkIcon className="w-12 h-12 text-yp-dark" />
                    </div>
                    <p className="font-sf-text text-yp-dark font-medium">Business Owners</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-8 left-8">
              <MapPin className="w-8 h-8 text-yp-blue" />
            </div>
            <div className="absolute bottom-8 right-8">
              <div className="w-6 h-6 bg-yp-green rounded-full"></div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-sf-pro font-bold text-yp-dark mb-6">
              Manage your <span className="italic">free</span> listing.
            </h2>
            
            <div className="space-y-4 mb-8">
              <p className="text-lg font-sf-text text-yp-dark">
                Update your business information in a few steps.
              </p>
              <p className="text-lg font-sf-text text-yp-dark">
                Make it easy for your customers to find you on Bara app.
              </p>
              <p className="text-lg font-sf-text text-yp-dark">
                <span className="font-bold text-yp-green">New!</span> Post a job opening on your free listing.
              </p>
            </div>

            <div className="space-y-4">
              <Link to="/">
                <Button className="bg-yp-blue hover:bg-yp-blue/90 text-white font-sf-text font-semibold text-lg px-8 py-3 h-auto">
                  Claim Your Listing
                </Button>
              </Link>
              
              <p className="text-sm font-sf-text text-yp-gray-dark">
                or call{" "}
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